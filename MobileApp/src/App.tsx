/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

// import 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar, StyleSheet, LogBox, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {navigationRef} from './hooks/RootNavigation';
import {NativeBaseProvider} from 'native-base';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {useSelector, useDispatch} from 'react-redux';
import {IRootState} from './store/store';
import Toast from 'react-native-toast-message';
import {PortalProvider} from '@gorhom/portal';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
import {colors} from './constants';

// Screens
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DrawerNavigator from './components/Navigators/DrawerNavigator';
import CreatePostScreen from './screens/CreatePostScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import CompanyProfileScreen from './screens/CompanyProfileScreen';
import SelectOwnedCompanyScreen from './screens/SelectOwnedCompanyScreen';
import UserSettingScreen from './screens/UserSettingScreen';
import CompanySettingScreen from './screens/CompanySettingScreen';
import PostJob from './screens/PostJob';
import MangeCompanyControllerScreen from './screens/MangeCompanyControllerScreen';
import UserBasicInfoEditScreen from './screens/UserBasicInfoEditScreen';
import UserIntroductionEditScreen from './screens/UserIntroductionEditScreen';
import CompanyIntroductionEditScreen from './screens/CompanyIntroductionEditScreen';
import CompanyBasicInfoEditScreen from './screens/CompanyBasicInfoEditScreen';
import PostCommentScreen from './screens/PostCommentScreen';
import ManageConnectionScreen from './screens/ManageConnectionScreen';
import ConnectionListScreen from './screens/ConnectionListScreen';
import ConnectionRequestListScreen from './screens/ConnectionRequestListScreen';
import ChatScreen from './screens/ChatScreen';
import ChatUserSearchScreen from './screens/ChatUserSearchScreen';
import ReportScreen from './screens/ReportScreen';
import SavedJobScreen from './screens/SavedJobScreen';

// Type
import type {RootStackParamList} from './types/types';
import {loadToken} from './store/actions/authActions';
import SocketProvider from './contexts/SocketContext';
import PostProvider from './contexts/PostContext';
import ChatBotProvider from './contexts/ChatBotContext';
import ApplyJobUserContactScreen from './screens/ApplyJobUserContactScreen';
import MoreJobByExpScreen from './screens/MoreJobByExpScreen';
import MoreJobByIndustryScreen from './screens/MoreJobByIndustryScreen';
import ChatBotScreen from './screens/ChatBotScreen';
import PostJobReviewScreen from './screens/PostJobReviewScreen';
import ReviewJobApplicationsScreen from './screens/ReviewJobApplicationsScreen';
import ReviewSelectCompanyScreen from './screens/ReviewSelectCompanyScreen';
import UserCheckAppliedJobScreen from './screens/CheckAppliedJobScreen';

LogBox.ignoreLogs([
    'NativeBase',
    'componentWillReceiveProps',
    'Encountered',
    // 'Each child',
]);

const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
        ...DefaultTheme.colors,
        primary: colors.highlight,
        accent: colors.tertiary,
    },
};

const App: React.FC = () => {
    const dispatch = useDispatch();
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const isAuth = useSelector((state: IRootState) => state.auth.isAuth);

    async function checkIfAlrdyAuth() {
        const token = await AsyncStorage.getItem('token');
        if (token != null || token != null) {
            dispatch(loadToken(token));
        }
    }

    useEffect(() => {
        checkIfAlrdyAuth();
        AsyncStorage.setItem('screen', '');
        PushNotification.createChannel({
            channelId: 'message-channel', // (required)
            channelName: 'Message Channel', // (required)
        });
        PushNotification.createChannel({
            channelId: 'userpost-notification-channel', // (required)
            channelName: 'UserPost Notification Channel', // (required)
        });
    }, []);

    return (
        <GestureHandlerRootView style={styles.container}>
            <NativeBaseProvider>
                <PaperProvider theme={theme}>
                    <SafeAreaView style={styles.container}>
                        <PortalProvider>
                            <NavigationContainer ref={navigationRef}>
                                <SocketProvider>
                                    <StatusBar
                                        animated={true}
                                        backgroundColor={colors.main}
                                        barStyle="dark-content"
                                    />
                                    {isAuth ? (
                                        <PostProvider>
                                            <ChatBotProvider>
                                                <Stack.Navigator>
                                                    <Stack.Screen
                                                        name="Drawer"
                                                        component={
                                                            DrawerNavigator
                                                        }
                                                        options={{
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="Post"
                                                        component={
                                                            CreatePostScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="UserProfile"
                                                        component={
                                                            UserProfileScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="SelectOwnedCompany"
                                                        component={
                                                            SelectOwnedCompanyScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            // headerShown: false,
                                                            title: 'Select Company',
                                                            headerTitleAlign:
                                                                'center',
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="UserSetting"
                                                        component={
                                                            UserSettingScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            title: 'Settings',
                                                            headerTitleAlign:
                                                                'center',
                                                            // headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="BasicInfoEdit"
                                                        component={
                                                            UserBasicInfoEditScreen
                                                        }
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="UserIntroductionEdit"
                                                        component={
                                                            UserIntroductionEditScreen
                                                        }
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="CompanyProfile"
                                                        component={
                                                            CompanyProfileScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="CompanySetting"
                                                        component={
                                                            CompanySettingScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            title: 'Settings',
                                                            headerTitleAlign:
                                                                'center',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="PostJob"
                                                        component={PostJob}
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="MangeCompanyController"
                                                        component={
                                                            MangeCompanyControllerScreen
                                                        }
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="CompanyBasicInfoEdit"
                                                        component={
                                                            CompanyBasicInfoEditScreen
                                                        }
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="CompanyIntroductionEdit"
                                                        component={
                                                            CompanyIntroductionEditScreen
                                                        }
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="PostComment"
                                                        component={
                                                            PostCommentScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="ManageConnection"
                                                        component={
                                                            ManageConnectionScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            title: 'Manage Connection',
                                                            headerTitleAlign:
                                                                'center',
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="ConnectionList"
                                                        component={
                                                            ConnectionListScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            title: 'Connections',
                                                            headerTitleAlign:
                                                                'center',
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="ConnectionRequestList"
                                                        component={
                                                            ConnectionRequestListScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            title: 'Connection Requests',
                                                            headerTitleAlign:
                                                                'center',
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="Chat"
                                                        component={ChatScreen}
                                                        options={{
                                                            animation: 'fade',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="ChatUserSearch"
                                                        component={
                                                            ChatUserSearchScreen
                                                        }
                                                        options={{
                                                            animation:
                                                                'slide_from_right',
                                                            title: 'New Conversation',
                                                            headerTitleAlign:
                                                                'center',
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="ChatBot"
                                                        component={
                                                            ChatBotScreen
                                                        }
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="Report"
                                                        component={ReportScreen}
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="SavedJob"
                                                        component={
                                                            SavedJobScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            title: 'Saved Job',
                                                            headerTitleAlign:
                                                                'center',
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="UserCheckAppliedJob"
                                                        component={
                                                            UserCheckAppliedJobScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            title: 'User job applied history',
                                                            headerTitleAlign:
                                                                'center',
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="MoreJobByExp"
                                                        component={
                                                            MoreJobByExpScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            title: 'More jobs result',
                                                            headerTitleAlign:
                                                                'center',
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="MoreJobByIndustry"
                                                        component={
                                                            MoreJobByIndustryScreen
                                                        }
                                                        options={{
                                                            animation: 'fade',
                                                            title: 'More jobs result',
                                                            headerTitleAlign:
                                                                'center',
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="ApplyJobUserContact"
                                                        component={
                                                            ApplyJobUserContactScreen
                                                        }
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="ReviewJobApplications"
                                                        component={
                                                            ReviewJobApplicationsScreen
                                                        }
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="PostJobReview"
                                                        component={
                                                            PostJobReviewScreen
                                                        }
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            headerShown: false,
                                                        }}
                                                    />
                                                    <Stack.Screen
                                                        name="ReviewSelectCompany"
                                                        component={
                                                            ReviewSelectCompanyScreen
                                                        }
                                                        options={{
                                                            animation:
                                                                'slide_from_bottom',
                                                            // headerShown: false,
                                                            title: 'Select Company for Review',
                                                            headerTitleAlign:
                                                                'center',
                                                        }}
                                                    />
                                                </Stack.Navigator>
                                            </ChatBotProvider>
                                        </PostProvider>
                                    ) : (
                                        <Stack.Navigator
                                            screenOptions={{
                                                headerShown: false,
                                            }}>
                                            <Stack.Screen name="Welcome">
                                                {(props) => (
                                                    <WelcomeScreen {...props} />
                                                )}
                                            </Stack.Screen>
                                            <Stack.Screen name="Login">
                                                {(props) => (
                                                    <LoginScreen {...props} />
                                                )}
                                            </Stack.Screen>
                                            <Stack.Screen name="Register">
                                                {(props) => (
                                                    <RegisterScreen
                                                        {...props}
                                                    />
                                                )}
                                            </Stack.Screen>
                                        </Stack.Navigator>
                                    )}
                                </SocketProvider>
                            </NavigationContainer>
                        </PortalProvider>
                    </SafeAreaView>
                    <Toast ref={(ref) => Toast.setRef(ref)} />
                </PaperProvider>
            </NativeBaseProvider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;
