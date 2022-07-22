import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// Screens
import HomeScreen from '../../screens/HomeScreen';
import NetworkScreen from '../../screens/NetworkScreen';
import JobScreen from '../../screens/JobScreen';
import ChatHomeScreen from '../../screens/ChatHomeScreen';
import NotificationScreen from '../../screens/NotificationScreen';

import {useSocket} from '../../contexts/SocketContext';

// Constants
import {colors} from '../../constants';
import ConnectionListScreen from '../../screens/ConnectionListScreen';
import SearchAllScreen from '../../screens/SearchAllScreen';

const BottomTabNavigator = () => {
    const tabColor = colors.icon;
    const tabActiveColor = colors.button;
    const Tab = createBottomTabNavigator();
    const {unreadCount, notifications} = useSocket();
    return (
        <Tab.Navigator
            safeAreaInsets={{top: 0, bottom: 0}}
            screenOptions={({route}) => ({
                tabBarStyle: {zIndex: 10},
                tabBarHideOnKeyboard: true,
                tabBarButton: ['SearchAll'].includes(route.name)
                    ? () => {
                          return null;
                      }
                    : undefined,
            })}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarActiveTintColor: tabActiveColor,
                    tabBarInactiveTintColor: tabColor,
                    tabBarIcon: ({focused}) => (
                        <FontAwesome
                            name="home"
                            size={focused ? 28 : 24}
                            color={focused ? tabActiveColor : tabColor}
                        />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Network"
                component={NetworkScreen}
                options={{
                    tabBarActiveTintColor: tabActiveColor,
                    tabBarInactiveTintColor: tabColor,
                    tabBarIcon: ({focused}) => (
                        <FontAwesome5
                            name="user-friends"
                            size={focused ? 28 : 24}
                            color={focused ? tabActiveColor : tabColor}
                        />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="Job"
                component={JobScreen}
                options={{
                    tabBarActiveTintColor: tabActiveColor,
                    tabBarInactiveTintColor: tabColor,
                    tabBarIcon: ({focused}) => (
                        <FontAwesome
                            name="briefcase"
                            size={focused ? 28 : 24}
                            color={focused ? tabActiveColor : tabColor}
                        />
                    ),
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="ChatHome"
                component={ChatHomeScreen}
                options={{
                    tabBarActiveTintColor: tabActiveColor,
                    tabBarInactiveTintColor: tabColor,
                    tabBarIcon: ({focused}) => (
                        <FontAwesome
                            name="comments"
                            size={focused ? 28 : 24}
                            color={focused ? tabActiveColor : tabColor}
                        />
                    ),
                    tabBarBadge: !!unreadCount ? unreadCount : undefined,
                    headerShown: false,
                    tabBarLabel: 'Conversation',
                }}
            />
            <Tab.Screen
                name="Notification"
                component={NotificationScreen}
                options={{
                    tabBarActiveTintColor: tabActiveColor,
                    tabBarInactiveTintColor: tabColor,
                    tabBarIcon: ({focused}) => (
                        <FontAwesome
                            name="bell"
                            size={focused ? 28 : 24}
                            color={focused ? tabActiveColor : tabColor}
                        />
                    ),
                    tabBarBadge:
                        notifications.filter((obj: any) => !obj.is_read)
                            .length > 0
                            ? ''
                            : undefined,
                    headerShown: false,
                }}
            />
            <Tab.Screen
                name="SearchAll"
                component={SearchAllScreen}
                options={{
                    title: 'SearchAll',
                    headerTitleAlign: 'center',
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
