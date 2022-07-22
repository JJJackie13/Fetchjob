import React, {useCallback, useState} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {useFocusEffect} from '@react-navigation/core';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useSocket} from '../contexts/SocketContext';
import NotificationCard from '../components/Notification/NotificationCard';
import {colors, FONTS, sizes} from '../constants';
import {NotificationType} from '../types/enums';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationScreen: React.FC = () => {
    const {notifications, fetchNotifications, removeHandler} = useSocket();
    const [isLoading, setIsLoading] = useState(false);

    async function onRefresh() {
        setIsLoading(true);
        await fetchNotifications();
        setIsLoading(false);
    }

    const renderNotificationCard = useCallback(
        ({item}) => (
            <NotificationCard data={item} removeHandler={removeHandler} />
        ),
        [],
    );

    const renderEmptyNotificationCard = () => (
        <View style={styles.emptyNotificationCard}>
            <Fontisto
                name="bell"
                color={colors.icon}
                size={sizes.width * 0.1}
            />
            <Text style={{...FONTS.minor, color: colors.icon}}>
                Notification will be shown here
            </Text>
        </View>
    );

    useFocusEffect(
        useCallback(() => {
            const readNotification = async () => {
                try {
                    await fetch(`${API_URL}/notification/all`, {
                        method: 'put',
                        headers: {
                            Authorization: `Bearer ${await AsyncStorage.getItem(
                                'token',
                            )}`,
                        },
                    });
                    await fetchNotifications();
                } catch (error) {
                    console.log(error);
                }
            };
            return () => readNotification();
        }, []),
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notifications}
                renderItem={renderNotificationCard}
                ListEmptyComponent={renderEmptyNotificationCard}
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                onRefresh={onRefresh}
                refreshing={isLoading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    emptyNotificationCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: colors.main,
        width: '100%',
        height: '100%',
        paddingVertical: sizes.height * 0.4,
    },
});

export default NotificationScreen;
