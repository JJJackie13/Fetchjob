import React, {
    createContext,
    useEffect,
    useContext,
    useMemo,
    useState,
} from 'react';
import {AppState} from 'react-native';
import {API_URL} from '@env';
import {useSelector} from 'react-redux';
import {io, Socket} from 'socket.io-client';
import {IRootState} from '../store/store';
import PushNotification from 'react-native-push-notification';
import {fetchLastChatHistories} from '../store/thunks/chatThunk';
import {IContactProps, IMessage, NotificationCardProps} from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RootNavigation from '../hooks/RootNavigation';

export const SocketContext = createContext<any>(undefined!);

export const useSocket = () => useContext(SocketContext);

const socket: Socket = io(`${API_URL}`, {
    autoConnect: false,
    transports: ['websocket'],
    upgrade: false,
    // auth: {
    //     userId: userId,
    // },
});

const SocketProvider: React.FC<any> = (props) => {
    const userId = useSelector((state: IRootState) => state.auth.user?.id);
    const [lastMessages, setLastMessages] = useState<IContactProps[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [allChats, setAllChats] = useState<IMessage[]>([]);
    const [notifications, setNotifications] = useState<NotificationCardProps[]>(
        [],
    );
    // const [currentScreen, setCurrentScreen] = useState<string>('');

    // const socket: Socket = useMemo(
    //     () =>
    //         io(`${API_URL}`, {
    //             autoConnect: false,
    //             transports: ['websocket'],
    //             upgrade: false,
    //             auth: {
    //                 userId: userId,
    //             },
    //         }),
    //     [userId],
    // );

    async function getLastChatHistories() {
        try {
            const lastChatResult = await fetchLastChatHistories()();
            let sortedResult = lastChatResult.sort(
                (a: any, b: any) =>
                    Date.parse(b.created_at) - Date.parse(a.created_at),
            );
            setLastMessages(sortedResult);
            setUnreadCount(
                lastChatResult.reduce(
                    (acc: number, cur: any) =>
                        acc + parseInt(cur.unread_number),
                    0,
                ),
            );
            if (lastChatResult) return true;
        } catch (error) {
            console.log('getLastChatHistories', error);
        }
    }

    function readMessages(roomId: number) {
        setLastMessages((prev) => {
            return prev.map((obj: any) => {
                return obj.room_id === roomId
                    ? {...obj, unread_number: 0}
                    : obj;
            });
        });
    }

    async function fetchNotifications() {
        try {
            const res = await fetch(`${API_URL}/notification/all`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            if (res.ok) {
                setNotifications(parseRes.data);
                // console.log(parseRes.data);
            } else {
                console.log(parseRes.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function removeHandler(id: number) {
        // console.log('id', id);
        setNotifications((prev: any) => {
            return prev.filter((obj: any) => {
                return obj.id !== id;
            });
        });
    }

    useEffect(() => {
        let isMounted = true;
        async function getLastChatHistories() {
            try {
                const lastChatResult = await fetchLastChatHistories()();
                let sortedResult = lastChatResult.sort(
                    (a: any, b: any) =>
                        Date.parse(b.created_at) - Date.parse(a.created_at),
                );
                setLastMessages(sortedResult);
                setUnreadCount(
                    lastChatResult.reduce(
                        (acc: number, cur: any) =>
                            acc + parseInt(cur.unread_number),
                        0,
                    ),
                );
                if (lastChatResult) return true;
            } catch (error) {
                console.log('getLastChatHistories', error);
            }
        }
        if (userId) {
            socket.auth = {userId: userId};
            socket.connect();

            socket?.on('user-online', (user_id) => {
                if (lastMessages.length > 0) {
                    setLastMessages((prev: any) => {
                        return prev.map((obj: any) => {
                            return obj.counterpart_id == user_id
                                ? {...obj, is_online: true}
                                : obj;
                        });
                    });
                }
            });

            socket?.on('user-offline', (user_id) => {
                console.log(user_id, 'is offline');
                if (lastMessages.length > 0) {
                    setLastMessages((prev: any) => {
                        return prev.map((obj: any) => {
                            if (obj.counterpart_id == user_id) {
                                return {...obj, is_online: false};
                            } else {
                                return obj;
                            }
                        });
                    });
                }
            });

            socket?.on('update-lastchat', () => {
                getLastChatHistories();
            });

            socket?.on(
                'new-message',
                async (room_id: any, userName: string, message: any) => {
                    try {
                        socket.emit('join-room', room_id);
                        console.log(message);
                        if (!lastMessages.some((n) => n.room_id == room_id)) {
                            fetchLastChatHistories();
                        }
                        const screen = await AsyncStorage.getItem('screen');
                        if (AppState.currentState == 'background') {
                            PushNotification.localNotification({
                                channelId: 'message-channel',
                                title: userName, // (optional)
                                message: message.text, // (required)
                                bigText: message.text,
                                largeIcon: 'ic_notification',
                                bigLargeIcon: 'ic_notification',
                                ongoing: true,
                                priority: 'max',
                                group: message.user._id,
                                id: message._id,
                                number: room_id,
                            });
                        } else if (
                            screen !== 'home' &&
                            screen != room_id &&
                            userId != message.user._id
                        ) {
                            PushNotification.localNotification({
                                channelId: 'message-channel',
                                title: userName, // (optional)
                                message: message.text, // (required)
                                bigText: message.text,
                                largeIcon: 'ic_notification',
                                bigLargeIcon: 'ic_notification',
                                ongoing: true,
                                priority: 'max',
                                group: message.user._id,
                                id: message._id,
                                number: room_id,
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
            );

            socket?.on(
                'message',
                async (room_id: any, userName: string, message: any) => {
                    try {
                        let currentScreen = await AsyncStorage.getItem(
                            'screen',
                        );
                        // console.log(currentScreen);
                        let chatroomId = await AsyncStorage.getItem(
                            'chatroomId',
                        );
                        console.log(message);
                        // console.log(
                        //     room_id != chatroomId && userId != message.user._id,
                        // );
                        if (AppState.currentState == 'background') {
                            PushNotification.localNotification({
                                channelId: 'message-channel',
                                title: userName, // (optional)
                                message: message.text, // (required)
                                bigText: message.text,
                                largeIcon: 'ic_notification',
                                bigLargeIcon: 'ic_notification',
                                ongoing: true,
                                priority: 'max',
                                group: message.user._id,
                                id: message._id,
                                number: room_id,
                            });
                        } else if (
                            // currentScreen?.toLowerCase() !== 'chat' &&
                            currentScreen?.toLowerCase() !== 'chat' &&
                            room_id != chatroomId &&
                            userId != message.user._id
                        ) {
                            PushNotification.localNotification({
                                channelId: 'message-channel',
                                title: userName, // (optional)
                                message: message.text, // (required)
                                bigText: message.text,
                                largeIcon: 'ic_notification',
                                bigLargeIcon: 'ic_notification',
                                ongoing: true,
                                priority: 'max',
                                group: message.user._id,
                                id: message._id,
                                number: room_id,
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                },
            );

            socket?.on('notification', (message: NotificationCardProps) => {
                if (
                    notifications &&
                    !notifications.some((obj: any) => obj.id === message.id)
                ) {
                    console.log('message', message);
                    setNotifications((prev: any) => {
                        return [message, ...prev];
                    });
                    PushNotification.localNotification({
                        channelId: 'userpost-notification-channel',
                        title: message.content, // (optional)
                        message: message.content, // (required)
                        bigText: message.content,
                        largeIcon: 'ic_notification',
                        bigLargeIcon: 'ic_notification',
                        ongoing: true,
                        priority: 'max',
                        id: message.primary_id,
                        // ignoreInForeground: true,
                    });
                }
            });
        } else {
            // console.log('RUN NO ID');
            socket.auth = {userId: null};
            socket?.off('user-online');
            socket?.off('user-offline');
            socket?.off('update-lastchat');
            socket?.off('new-message');
            socket?.off('message');
            socket?.off('notification');
            socket.disconnect();
        }
        () => {
            // console.log('RUN DISMOUNT');
            socket.auth = {userId: null};
            socket?.off('user-online');
            socket?.off('user-offline');
            socket?.off('update-lastchat');
            socket?.off('new-message');
            socket?.off('message');
            socket?.off('notification');
            socket.disconnect();
            isMounted = false;
        };
    }, [socket, userId]);

    useEffect(() => {
        let isMounted = true;
        async function getLastChatHistories() {
            try {
                const lastChatResult = await fetchLastChatHistories()();
                let sortedResult = lastChatResult.sort(
                    (a: any, b: any) =>
                        Date.parse(b.created_at) - Date.parse(a.created_at),
                );
                setLastMessages(sortedResult);
                setUnreadCount(
                    lastChatResult.reduce(
                        (acc: number, cur: any) =>
                            acc + parseInt(cur.unread_number),
                        0,
                    ),
                );
                if (lastChatResult) return true;
            } catch (error) {
                console.log('getLastChatHistories', error);
            }
        }

        async function fetchNotifications() {
            try {
                const res = await fetch(`${API_URL}/notification/all`, {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                });
                const parseRes = await res.json();
                if (res.ok) {
                    setNotifications(parseRes.data);
                    // console.log(parseRes.data);
                } else {
                    console.log(parseRes.message);
                }
            } catch (error) {
                console.log(error);
            }
        }

        if (userId) {
            if (socket) {
                socket.connect();
            }
            getLastChatHistories();
            fetchNotifications();
        } else if (!userId) {
            if (socket) {
                socket.disconnect();
            }
        }

        () => (isMounted = false);
    }, [userId]);

    useEffect(() => {
        RootNavigation['navigationRef'].addListener('state', () => {
            let screen =
                RootNavigation['navigationRef'] &&
                RootNavigation['navigationRef'].getCurrentRoute() &&
                //@ts-ignore
                RootNavigation['navigationRef'].getCurrentRoute()['name'] &&
                //@ts-ignore
                typeof RootNavigation['navigationRef'].getCurrentRoute()[
                    'name'
                ] === 'string'
                    ? //@ts-ignore
                      RootNavigation['navigationRef'].getCurrentRoute()['name']
                    : '';
            // setCurrentScreen(screen);
            AsyncStorage.setItem('screen', screen);
        });
        () => {
            RootNavigation['navigationRef'].removeListener('state', () => {});
            AsyncStorage.removeItem('screen');
        };
    }, [RootNavigation]);

    const values = {
        socket,
        lastMessages,
        unreadCount,
        allChats,
        notifications,
        setNotifications,
        getLastChatHistories,
        fetchNotifications,
        setAllChats,
        removeHandler,
        readMessages,
    };

    return (
        <SocketContext.Provider value={values}>
            {props.children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
