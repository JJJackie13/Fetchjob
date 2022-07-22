import React, {useState, useRef, useMemo, useCallback, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    Pressable,
} from 'react-native';
import {Portal, PortalHost} from '@gorhom/portal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {NavigationProp, RouteProp} from '@react-navigation/core';

import {colors, FONTS, images, sizes, formats} from '../constants';
import {RootStackParamList} from '../types/types';
import {API_URL} from '@env';
import timeSince, {showTimeRemain} from './Job/TimeSince';
import JobDetailsBottomSheet from './BottomSheets/JobBottomSheet';
import {Colors} from 'react-native/Libraries/NewAppScreen';

interface Job {
    job_id: number;
    job_title: string;
    job_detail: string;
    company_name: string;
    avatar: string;
    city_name: string;
    country_name: string;
    industry: string;
    post_date: any;
    update_date: any;
    auto_delist: any;
    bookmark_id: any;
    annual_leave: string;
    business_size: string;
    education: string;
    employment_type: string[];
}

const PostJobReviewJobCard: React.FC<{
    data: Job;
    setPostJob: any;
}> = ({data, setPostJob}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, any>>();
    async function closePostJobHandler() {
        try {
            const res = await fetch(`${API_URL}/job/close-job/${data.job_id}`, {
                method: 'put',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (res.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                });
                setPostJob((prev: any) => {
                    return prev.filter(
                        (obj: any) => obj.job_id !== data.job_id,
                    );
                });
            } else {
                const message = (await res.json()).message;
                Toast.show({
                    type: 'error',
                    text1: message,
                });
            }
        } catch (error) {
            console.log('sendMessage', error);
        }
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                navigation.navigate('ReviewJobApplications', {
                    jobId: data.job_id,
                });
            }}>
            <View style={styles.headingPart}>
                <View style={styles.avatar}>
                    <Image
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: (sizes.height * 0.08) / 2,
                        }}
                        source={
                            data.avatar
                                ? formats.httpFormat.test(data.avatar)
                                    ? {
                                          uri: `${data.avatar}`,
                                      }
                                    : {
                                          uri: `${API_URL}/${data.avatar}`,
                                      }
                                : images.noAvatar
                        }
                        resizeMode="contain"
                    />
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    // justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}>
                <View style={styles.lowerPart}>
                    <Text
                        style={{
                            ...FONTS.minor,
                            fontWeight: 'bold',
                            marginBottom: 5,
                            maxWidth: sizes.width * 0.65,
                        }}
                        numberOfLines={2}>
                        <MaterialCommunityIcon
                            name="briefcase"
                            size={13}
                            color={colors.icon}
                            style={{marginRight: 8}}
                        />{' '}
                        {data.job_title}
                    </Text>
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.paragraph,
                            marginBottom: 5,
                            maxWidth: sizes.width * 0.65,
                        }}
                        numberOfLines={2}>
                        <IonIcon
                            name="md-business-sharp"
                            size={10}
                            color={colors.icon}
                            style={{marginRight: 8}}
                        />{' '}
                        {data.company_name}
                    </Text>
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.paragraph,
                            marginBottom: 5,
                            maxWidth: sizes.width * 0.65,
                        }}
                        numberOfLines={2}>
                        {data.industry}
                    </Text>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginBottom: 5,
                            paddingHorizontal: 5,
                            width: '100%',
                            flexWrap: 'wrap',
                        }}>
                        <Text
                            style={{
                                ...FONTS.caption,
                                textAlign: 'center',
                            }}
                            numberOfLines={2}>
                            <MaterialCommunityIcon
                                name="map-marker"
                                size={13}
                                color={colors.icon}
                                style={{marginRight: 8}}
                            />{' '}
                            {data.city_name} · {data.country_name}
                        </Text>
                    </View>
                    <View
                        style={{
                            // display: 'flex',
                            // flexDirection: 'row',
                            justifyContent: 'flex-start',
                            width: '100%',
                            flexWrap: 'wrap',
                        }}>
                        <Text
                            style={{
                                ...FONTS.caption,
                                // color: colors.paragraph,
                                marginBottom: 5,
                                textAlign: 'center',
                            }}
                            numberOfLines={2}>
                            {showTimeRemain(data.auto_delist)}
                        </Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity
                style={styles.addBookmarkBtn}
                onPress={() => closePostJobHandler()}>
                <MaterialCommunityIcon
                    name="close-thick"
                    size={20}
                    color={colors.border}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default PostJobReviewJobCard;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: colors.main,
        maxHeight: sizes.height * 0.2,
        width: sizes.width,
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        // elevation: 5,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        paddingBottom: 3,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
    },
    headingPart: {
        height: sizes.height * 0.08,
    },
    banner: {
        height: '100%',
    },
    avatar: {
        height: sizes.height * 0.08,
        width: sizes.height * 0.08,
        // position: 'absolute',
        borderWidth: 2,
        borderColor: '#cccccc22',
        borderRadius: (sizes.height * 0.08) / 2,
        // left: (sizes.width * 0.06),
        // transform: [
        //     {translateX: -(sizes.height * 0.08) / 2},
        //     {translateY: (sizes.height * 0.08) / 2},
        // ],
        overflow: 'hidden',
    },
    addBookmarkBtn: {
        position: 'absolute',
        right: 32,
        top: 5,
        padding: 5,
        borderRadius: 10,
    },
    removeBookmarkBtn: {
        position: 'absolute',
        right: 5,
        top: 5,
        padding: 3,
        borderRadius: 10,
        backgroundColor: '#0000003d',
    },
    lowerPart: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: 8,
        // paddingTop: (sizes.height * 0.08) / 2,
    },
    viewJobDetailBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: (sizes.width * 0.5) / 2,
        marginVertical: 10,
        padding: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.button,
    },
    bottomSheet: {
        elevation: 15,
        marginHorizontal: 5,
        // backgroundColor: colors.main,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
        borderRadius: 10,
    },
});
