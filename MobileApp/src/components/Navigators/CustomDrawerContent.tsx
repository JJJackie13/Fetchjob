import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Keyboard,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Octicon from 'react-native-vector-icons/Octicons';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {Portal, PortalHost} from '@gorhom/portal';

import {RootStackParamList} from '../../types/types';
import {API_URL} from '@env';
import {logout} from '../../store/thunks/authThunk';
import {useSocket} from '../../contexts/SocketContext';
import {colors, sizes, images, FONTS, formats} from '../../constants';
import {IRootState} from '../../store/store';
import ReviewSelectCompanyList from '../../components/BottomSheets/ReviewSelectCompanyList';
import {useChatBot} from '../../contexts/ChatBotContext';

const CustomDrawerContent: React.FC<any> = (props) => {
    const name = useSelector((state: IRootState) => state.auth.user?.name);
    const userId = useSelector((state: IRootState) => state.auth.user?.id);
    const avatar = useSelector((state: IRootState) => state.auth.user?.avatar);
    const dispatch = useDispatch();
    const {socket} = useSocket();
    const {chatBotBtmSheetRef} = useChatBot();
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList, any>>();

    async function logoutHandler() {
        await logout(socket)(dispatch);
    }

    // const renderBackdrop = useCallback(
    //     (props) => (
    //         <BottomSheetBackdrop
    //             {...props}
    //             opacity={0.2}
    //             disappearsOnIndex={-1}
    //             appearsOnIndex={0}
    //         />
    //     ),
    //     [],
    // );

    // function renderHeader() {
    //     return (
    //         <View style={styles.btmSheetHeader}>
    //             <TouchableOpacity
    //                 style={{
    //                     position: 'absolute',
    //                     left: sizes.width * 0.05,
    //                     top: 10,
    //                 }}
    //                 onPress={() => {
    //                     closeModals();
    //                 }}>
    //                 <Text style={{...FONTS.caption}}>Cancel</Text>
    //             </TouchableOpacity>

    //             <View>
    //                 <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
    //                     Select a company
    //                 </Text>
    //             </View>
    //         </View>
    //     );
    // }

    return (
        <DrawerContentScrollView {...props} style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image
                        style={styles.avatarImage}
                        source={
                            avatar
                                ? formats.httpFormat.test(avatar)
                                    ? {
                                          uri: `${avatar}`,
                                      }
                                    : {
                                          uri: `${API_URL}/${avatar}`,
                                      }
                                : images.noAvatar
                        }
                    />
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '65%',
                    }}>
                    <View style={{display: 'flex', flexDirection: 'column'}}>
                        <Text
                            style={{
                                ...FONTS.paragraph,
                            }}>
                            {name}
                        </Text>
                        <TouchableOpacity
                            onPress={() =>
                                props.navigation.navigate('UserProfile', {
                                    userId,
                                })
                            }>
                            <Text
                                style={{
                                    color: colors.highlight,
                                    fontWeight: 'bold',
                                }}>
                                View Profile
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        onPress={() => props.navigation.closeDrawer()}>
                        <FontAwesome5Icon
                            name="times"
                            color={colors.icon}
                            size={15}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <DrawerItem
                label="User Settings"
                icon={({focused, color, size}) => (
                    <Octicon name="settings" size={size} color={color} />
                )}
                onPress={() => {
                    navigation.navigate('UserSetting');
                }}
            />
            <DrawerItem
                label="Manage Company"
                icon={({focused, color, size}) => (
                    <Ionicon name="settings-sharp" size={size} color={color} />
                )}
                onPress={() => {
                    navigation.navigate('SelectOwnedCompany');
                }}
            />
            <DrawerItem
                label="Review Company"
                icon={({focused, color, size}) => (
                    <MaterialIcon
                        name="rate-review"
                        size={size}
                        color={color}
                    />
                )}
                onPress={() => {
                    navigation.navigate('ReviewSelectCompany');
                }}
            />
            <DrawerItem
                label="ChatBot"
                labelStyle={{textAlign: 'left'}}
                icon={({focused, color, size}) => (
                    <FontAwesome5Icon
                        name="robot"
                        size={size - 5}
                        color={color}
                    />
                )}
                onPress={() => {
                    chatBotBtmSheetRef.current?.expand();
                    props.navigation.closeDrawer();
                    // navigation.navigate('ChatBot');
                }}
            />
            <DrawerItem label="Logout" onPress={logoutHandler} />
        </DrawerContentScrollView>
    );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        elevation: 5,
        backgroundColor: colors.main,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: sizes.height * 0.1,
        backgroundColor: colors.main,
        borderBottomWidth: 1,
        borderBottomColor: colors.tertiary,
    },
    avatarContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'grey',
        overflow: 'hidden',
        marginStart: 10,
        marginEnd: 10,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    bottomSheet: {
        elevation: 15,
        marginHorizontal: 5,
        backgroundColor: colors.main,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
        borderRadius: 10,
        // zIndex: 99999,
    },
    btmSheetHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,
    },
});
