import React, {useState, useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {colors, formats, images} from '../../constants';
import {useSelector} from 'react-redux';
import {IRootState} from '../../store/store';
import {API_URL} from '@env';

import AsyncStorage from '@react-native-async-storage/async-storage';

import ChatBotConversation from './ChatBotConversation';
import {format} from 'fecha';
import LoadingComponent from '../LoadingComponent';

interface ChatBotMessage {
    message: string;
    data: {};
    createdAt: Date;
    userId?: number;
}

const ChatBotPage: React.FC<any> = ({snapChatBotBtmSheet}) => {
    const userId = useSelector((state: IRootState) => state.auth.user?.id);
    const [messages, setMessages] = useState<ChatBotMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    async function sendMessageToChatbot(message: string) {
        try {
            setIsTyping(true);
            const res = await fetch(`${API_URL}/message-to-bot`, {
                method: 'post',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({content: message}),
            });
            const parseRes = await res.json();
            if (res.ok) {
                console.log(parseRes.message);
                setMessages((prev) => [
                    {...parseRes.message, createdAt: new Date()},
                    ...prev,
                ]);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsTyping(false);
        }
    }

    const send = useCallback((message: ChatBotMessage, cb) => {
        setMessages((prev) => [message, ...prev]);
        sendMessageToChatbot(message.message);
        cb();
    }, []);

    // const emitTyping = useCallback(() => {
    //     socket.emit('typing', userId, roomId);
    // }, []);

    // const handleTyping = useCallback(() => {
    //     setIsTyping(true);
    //     if (timer.current) {
    //         clearTimeout(timer.current);
    //     }
    //     timer.current = setTimeout(() => {
    //         setIsTyping(false);
    //     }, 5000);
    // }, []);
    // const renderConversation = useCallback(() => {
    //     setIsTyping(true);
    //     if (timer.current) {
    //         clearTimeout(timer.current);
    //     }
    //     timer.current = setTimeout(() => {
    //         setIsTyping(false);
    //     }, 5000);
    // }, []);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            async function init() {
                try {
                    const res = await fetch(`${API_URL}/message-to-bot`, {
                        method: 'post',
                        headers: {
                            Authorization: `Bearer ${await AsyncStorage.getItem(
                                'token',
                            )}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({content: 'hi'}),
                    });
                    const parseRes = await res.json();
                    if (res.ok) {
                        console.log(parseRes.message);
                        setMessages([
                            {...parseRes.message, createdAt: new Date()},
                        ]);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            init();
        }
        () => (isMounted = false);
    }, []);

    useEffect(() => {
        setMessages([]);
    }, [userId]);

    return (
        <View style={styles.container}>
            <ChatBotConversation
                data={messages}
                send={(message: ChatBotMessage, cb: () => void) =>
                    send(message, cb)
                }
                isTyping={isTyping}
                snapChatBotBtmSheet={snapChatBotBtmSheet}
            />
        </View>
    );
};

export default ChatBotPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.main,
    },
});
