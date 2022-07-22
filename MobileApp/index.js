/**
 * @format
 */

import {AppRegistry, Platform, LogBox} from 'react-native';
import Index from './src/Index';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import * as RootNavigation from './src/hooks/RootNavigation';

LogBox.ignoreAllLogs(true);

PushNotification.configure({
    onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        if (
            notification.channelId === 'message-channel' &&
            !isNaN(parseInt(notification.number))
        ) {
            RootNavigation.navigate('Chat', {
                roomId: parseInt(notification.number),
                counterpartId: notification.group,
                counterpartName: notification.title,
            });
        } else if (
            notification.channelId === 'userpost-notification-channel' &&
            !isNaN(parseInt(notification.id))
        ) {
            RootNavigation.navigate('PostComment', {
                id: parseInt(notification.id),
            });
        }
        notification.finish(PushNotificationIOS.FetchResult.NoData);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },

    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios',
});

AppRegistry.registerComponent(appName, () => Index);
