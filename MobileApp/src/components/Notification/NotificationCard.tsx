import React, {useCallback, useMemo, useRef} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {colors, FONTS, sizes} from '../../constants';
import {NotificationCardProps, RootStackParamList} from '../../types/types';
import {NotificationType} from '../../types/enums';
import BottomSheet, {
    BottomSheetBackdrop,
    TouchableHighlight,
} from '@gorhom/bottom-sheet';
import {Portal, PortalHost} from '@gorhom/portal';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationCard: React.FC<{
    data: NotificationCardProps;
    removeHandler: (id: number) => void;
}> = ({data, removeHandler}) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList, any>>();
    const viewBtn = () => {
        if (data.name === NotificationType.NEWPOST) {
            return navigation.navigate('PostComment', {id: data.primary_id});
        } else if (data.name === NotificationType.APPLYJOB) {
            return () => {};
        }
    };
    const typeIcon = () => {
        switch (data.name) {
            case NotificationType.NEWPOST:
                return (
                    <MaterialCommunityIcon
                        name="post-outline"
                        size={50}
                        color={colors.icon}
                    />
                );
            case NotificationType.APPLYJOB:
                return (
                    <MaterialIcon
                        name="work-outline"
                        size={50}
                        color={colors.icon}
                    />
                );
            default:
                return null;
        }
    };
    const btmSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%'], []);
    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                opacity={0.2}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        [],
    );

    async function removeNotification() {
        try {
            if (!data.id) {
                return;
            }
            const res = await fetch(`${API_URL}/notification/${data.id}`, {
                method: 'delete',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (res.ok) {
                console.log('ok');
                removeHandler(data.id);
                btmSheetRef.current?.close();
            }
        } catch (error) {
            console.log(error);
        }
    }

    function calcDate(today: Date = new Date(), past: Date) {
        let diff = Math.floor(today.getTime() - past.getTime());
        let minute = 1000 * 60;
        let hour = 1000 * 60 * 60;
        let day = 1000 * 60 * 60 * 24;

        let minutes = Math.floor(diff / minute);
        let hours = Math.floor(diff / hour);
        let days = Math.floor(diff / day);
        let months = Math.floor(days / 31);
        let years = Math.floor(months / 12);
        // console.log('today', today);
        // console.log('past', past);
        // console.log(diff);
        if (years >= 1) {
            return years + `yr`;
        } else if (months >= 1) {
            return months + `mth`;
        } else if (days >= 1) {
            return days + `d`;
        } else if (hours >= 1) {
            return hours + `h`;
        } else if (minutes >= 1) {
            return minutes + `m`;
        } else {
            return `now`;
        }
    }

    function renderBottomSheet() {
        return (
            <View style={styles.btmSheet}>
                <TouchableHighlight
                    onPress={removeNotification}
                    style={styles.handleOption}
                    underlayColor="#cccccc6f">
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <MaterialCommunityIcon
                            name="delete-alert"
                            size={30}
                            color={colors.icon}
                        />
                        <Text
                            style={{
                                ...FONTS.minor,
                                color: colors.icon,
                                fontWeight: 'bold',
                                marginLeft: 5,
                            }}>
                            Delete notification
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }

    return (
        <View>
            <TouchableWithoutFeedback onPress={viewBtn}>
                <View style={styles.container}>
                    <View style={styles.leftContentContainer}>
                        <View style={styles.readStatusContainer}>
                            {!data.is_read && (
                                <Entypo
                                    name="dot-single"
                                    size={30}
                                    color={colors.highlight}
                                />
                            )}
                        </View>
                        <View style={styles.middleContentContainer}>
                            <View style={styles.notificationTypeIconContainer}>
                                {typeIcon()}
                            </View>
                            <View style={styles.mainContentContainer}>
                                <View style={{width: '100%'}}>
                                    <Text
                                        numberOfLines={3}
                                        style={{
                                            ...FONTS.caption,
                                            color: colors.paragraph,
                                        }}>
                                        {data.content}
                                    </Text>
                                </View>
                                {/* <View style={styles.navigationBtnContainer}>
                                    <TouchableOpacity
                                        style={styles.navigationBtn}
                                        onPress={viewBtn}>
                                        <Text
                                            style={{
                                                ...FONTS.caption,
                                                color: colors.highlight,
                                                fontWeight: 'bold',
                                            }}>
                                            View
                                        </Text>
                                    </TouchableOpacity>
                                </View> */}
                            </View>
                        </View>
                    </View>
                    <View style={styles.optionsContainer}>
                        <Text style={{...FONTS.caption}} numberOfLines={1}>
                            {calcDate(new Date(), new Date(data.created_at))}
                        </Text>
                        <TouchableOpacity
                            onPress={() => btmSheetRef.current?.expand()}>
                            <MaterialCommunityIcon
                                name="dots-horizontal"
                                size={20}
                                color={colors.icon}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <Portal>
                <BottomSheet
                    android_keyboardInputMode="adjustPan"
                    style={styles.bottomSheet}
                    ref={btmSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    enableHandlePanningGesture
                    backdropComponent={renderBackdrop}>
                    {renderBottomSheet()}
                </BottomSheet>
                <PortalHost name="post_bottomsheet" />
            </Portal>
        </View>
    );
};

export default NotificationCard;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.main,
        width: sizes.width,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        paddingVertical: 5,
    },
    leftContentContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
    },
    readStatusContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '10%',
    },
    middleContentContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
    },
    notificationTypeIconContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '15%',
    },
    mainContentContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
        width: '85%',
    },
    navigationBtnContainer: {
        // backgroundColor: 'green',
    },
    navigationBtn: {
        marginTop: 5,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        height: 30,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 10,
        borderColor: colors.button,
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '10%',
        paddingHorizontal: 5,
    },
    bottomSheet: {
        elevation: 15,
        marginHorizontal: 5,
        // backgroundColor: colors.main,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
        borderRadius: 10,
    },
    btmSheet: {
        display: 'flex',
        flexDirection: 'column',
    },
    handleOption: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: sizes.width * 0.1,
        paddingVertical: 10,
    },
});
