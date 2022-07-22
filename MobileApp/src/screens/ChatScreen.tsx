import React, {useState, useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import MinorNavBar from '../components/MinorNavBar';
import {colors, formats, images} from '../constants';
import {RootStackParamList, IMessage} from '../types/types';
import {useSelector} from 'react-redux';
import {IRootState} from '../store/store';
import {API_URL} from '@env';
import {useSocket} from '../contexts/SocketContext';
import {useFocusEffect} from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Conversation from '../components/Chat/Conversation';
import {format} from 'fecha';
import LoadingComponent from '../components/LoadingComponent';

type IChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;

const ChatScreen: React.FC<IChatScreenProps> = ({navigation, route}) => {
    const userId = useSelector((state: IRootState) => state.auth.user?.id);
    const counterpartId = route.params.counterpartId;
    const counterpartName = route.params.counterpartName;
    const [messages, setMessages] = useState<any[]>([]);
    const [roomId, setRoomId] = useState(route.params.roomId);
    const [isLoading, setIsLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const {socket, getLastChatHistories, readMessages} = useSocket();
    const timer = useRef<NodeJS.Timeout>();
    // const isOnline = lastMessages.find(
    //     (n: any) => n.room_id === roomId,
    // ).is_online;

    const send = useCallback((message: IMessage, cb) => {
        let dateSection = format(new Date(message.createdAt), 'ddd, DDMMM');
        setMessages((prev: any[]) => {
            if (!prev.some((obj) => obj.date === dateSection)) {
                let newObj = {date: dateSection, data: [message]};
                return [newObj, ...prev];
            } else {
                return prev.map((obj) => {
                    return obj.date === dateSection
                        ? {...obj, data: [message, ...obj.data]}
                        : obj;
                });
            }
        });
        sendMessage(message);
        cb();
    }, []);

    const emitTyping = useCallback(() => {
        socket.emit('typing', userId, roomId);
    }, []);

    const handleTyping = useCallback(() => {
        setIsTyping(true);
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            setIsTyping(false);
        }, 5000);
    }, []);

    async function sendMessage(message: IMessage) {
        try {
            let body = {
                roomId: roomId,
                counterpartId: counterpartId,
                message: message,
            };
            const res = await fetch(`${API_URL}/chat/message`, {
                method: 'post',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            const parseRes = await res.json();
            if (res.ok) {
                const {room_id, conversation_id} = parseRes;
                if (!roomId) {
                    navigation.setParams({roomId: parseInt(room_id)});
                    setRoomId(parseInt(room_id));
                    socket.emit('join-room', parseInt(room_id));
                }
                setMessages((prev) => {
                    return prev.map((obj: any) => {
                        return {
                            ...obj,
                            data: obj.data.map((dataObj: IMessage) => {
                                return dataObj.temp_id === message.temp_id
                                    ? {
                                          ...dataObj,
                                          _id: conversation_id,
                                          pending: false,
                                      }
                                    : dataObj;
                            }),
                        };
                    });
                });
            } else {
                console.log(parseRes.message);
            }
        } catch (error) {
            console.log('sendMessage', error);
        }
    }

    const LeftComponent = () => (
        <TouchableOpacity
            onPress={() => {
                socket.off('message');
                socket.off('message-read');
                navigation.navigate('ChatHome');
            }}>
            <IonIcon name="chevron-back" size={25} />
        </TouchableOpacity>
    );

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        async function initPage() {
            try {
                const res = await fetch(
                    `${API_URL}/chat/history/room/${route.params.roomId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${await AsyncStorage.getItem(
                                'token',
                            )}`,
                        },
                    },
                );
                if (res.ok) {
                    const {data} = await res.json();
                    let formatHistory: IMessage[] = data.map((obj: any) => {
                        return {
                            _id: obj.room_id,
                            text: obj.content,
                            createdAt: new Date(obj.created_at),
                            user: {
                                _id: obj.sender_id,
                                name: obj.sender_name,
                                avatar: obj.sender_avatar,
                            },
                            sent: obj.is_sent,
                            received: obj.is_received,
                            read: obj.is_read,
                        };
                    });
                    let chatHistories = formatHistory
                        .filter((obj: any) => parseInt(obj._id) === roomId)
                        .sort(
                            (a: any, b: any) =>
                                Date.parse(b.createdAt) -
                                Date.parse(a.createdAt),
                        )
                        .reduce((acc: any, cur: any) => {
                            let dateSection = format(
                                new Date(cur.createdAt),
                                'ddd, DDMMM',
                            );
                            if (!acc.some((n: any) => n.date === dateSection)) {
                                let newObj = {date: dateSection, data: [cur]};
                                return [...acc, newObj];
                            } else {
                                let newAcc = [];
                                for (let i = 0; i < acc.length; i++) {
                                    if (acc[i].date === dateSection) {
                                        let newObj = {
                                            ...acc[i],
                                            data: [...acc[i]['data'], cur],
                                        };
                                        newAcc.push(newObj);
                                    } else {
                                        newAcc.push(acc[i]);
                                    }
                                }
                                return newAcc;
                            }
                        }, []);
                    setMessages(chatHistories);
                }
                setIsLoading(false);
                socket?.emit('read-message', route.params.roomId);
            } catch (error) {
                console.log(error);
            }
        }

        if (isMounted) {
            if (route.params.roomId) {
                initPage();
            } else {
                setIsLoading(false);
            }

            socket?.on(
                'message',
                (room_id: any, userName: string, message: any) => {
                    if (
                        room_id == roomId &&
                        message.user._id != userId &&
                        route.name === 'Chat'
                    ) {
                        let dateSection = format(
                            new Date(message.createdAt),
                            'ddd, DDMMM',
                        );
                        setMessages((prev: any[]) => {
                            if (!prev.some((obj) => obj.date === dateSection)) {
                                let newObj = {
                                    date: dateSection,
                                    data: [message],
                                };
                                return [newObj, ...prev];
                            } else {
                                return prev.map((obj) => {
                                    return obj.date === dateSection
                                        ? {...obj, data: [message, ...obj.data]}
                                        : obj;
                                });
                            }
                        });
                        setIsTyping(false);
                        socket?.emit('read-message', route.params.roomId);
                    }
                    if (
                        room_id == roomId &&
                        message.user._id == userId &&
                        route.name === 'Chat'
                    ) {
                        setMessages((prev) => {
                            return prev.map((obj: any) => {
                                return {
                                    ...obj,
                                    data: obj.data.map((dataObj: IMessage) => {
                                        return dataObj.temp_id ===
                                            message.temp_id
                                            ? {
                                                  ...dataObj,
                                                  _id: message.id,
                                                  pending: false,
                                              }
                                            : dataObj;
                                    }),
                                };
                            });
                        });
                    }
                },
            );

            socket?.on('message-read', (user_id: number, room_id: number) => {
                if (roomId === room_id && route.name === 'Chat') {
                    // console.log('READ JOR MESSAGE');
                    setMessages((prev) => {
                        return prev.map((obj: any) => {
                            return {
                                ...obj,
                                data: obj.data.map((dataObj: IMessage) => {
                                    return dataObj.user._id != user_id
                                        ? {
                                              ...dataObj,
                                              read: true,
                                          }
                                        : dataObj;
                                }),
                            };
                        });
                    });
                }
            });

            socket?.on('typing', (user_id: number, room_id: number) => {
                if (
                    roomId === room_id &&
                    user_id !== userId &&
                    route.name === 'Chat'
                ) {
                    handleTyping();
                }
            });
        }
        () => {
            isMounted = false;
        };
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            let isMounted = true;
            if (isMounted && route.params.roomId) {
                AsyncStorage.setItem('chatroomId', `${route.params.roomId}`);
                readMessages(route.params.roomId);
            }
            getLastChatHistories();
            return () => {
                AsyncStorage.setItem('chatroomId', '');
                isMounted = false;
            };
        }, []),
    );

    // useEffect(() => {
    //     if (route.params.roomId) {
    //         AsyncStorage.setItem('screen', `${route.params.roomId}`);
    //     }
    // }, [route.params.roomId]);

    return (
        <View style={styles.container}>
            <MinorNavBar
                middleText={counterpartName}
                LeftComponent={LeftComponent}
                // minorComponent={
                //     <Entypo
                //         name="dot-single"
                //         size={40}
                //         color={isOnline ? colors.online : colors.icon}
                //     />
                // }
            />
            {userId && !isLoading ? (
                <Conversation
                    data={messages}
                    send={(message: IMessage, cb: () => void) =>
                        send(message, cb)
                    }
                    isTyping={isTyping}
                    emitTyping={emitTyping}
                />
            ) : (
                <LoadingComponent />
            )}
        </View>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.main,
    },
});
