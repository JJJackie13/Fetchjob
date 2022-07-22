import React, {useState, useRef, useMemo, useCallback} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {Portal, PortalHost} from '@gorhom/portal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import ChatBotJobBottomSheet from './ChatBotJobBottomSheet';

import {colors, FONTS, images, sizes, formats} from '../../constants';
import {RootStackParamList} from '../../types/types';
import {API_URL} from '@env';
import timeSince from '../Job/TimeSince';
import {NavigationProp, RouteProp} from '@react-navigation/core';

interface Job {
    job_id: string;
    job_title: string;
    job_detail: string;
    company_name: string;
    avatar: string;
    city_name: string;
    country_name: string;
    industry: string;
    post_date: Date;
    update_date: any;
    auto_delist: Date;
    bookmark_id: any;
    banner: string;
    annual_leave: string;
    business_size: string;
    education: string;
    employment_type: string[];
}

const ChatBotJobCard: React.FC<{
    data: Job;
    snapChatBotBtmSheet: () => void;
}> = ({data, snapChatBotBtmSheet}) => {
    const savedJobModalRef = useRef<BottomSheet>(null);
    const isJobDetails = data.job_id != null;
    const snapPoints = useMemo(() => ['95%'], []);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isBookmarked, setIsBookmarked] = useState<boolean>(
        !!data.bookmark_id,
    );

    async function bookmarkdJobHandler() {
        try {
            setIsLoading(true);
            const res = await fetch(
                `${API_URL}/job/saved/${parseInt(data.job_id)}`,
                {
                    method: 'put',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const parseRes = await res.json();

            if (res.ok) {
                // Toast.show({
                //     type: 'success',
                //     text1: `Removed saved job`,
                // });
                setIsBookmarked((prev) => !prev);
            } else {
                Toast.show({
                    type: 'error',
                    text1: parseRes.message,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Request failed',
            });
        }
    }

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

    function openJobDetailModal() {
        savedJobModalRef.current?.expand();
    }

    function closeModals() {
        savedJobModalRef.current?.close();
        snapChatBotBtmSheet();
    }

    return (
        <View style={styles.container}>
            <View style={styles.headingPart}>
                <Image
                    style={styles.banner}
                    source={
                        data.banner
                            ? formats.httpFormat.test(data.banner)
                                ? {
                                      uri: `${data.banner}`,
                                  }
                                : {
                                      uri: `${API_URL}/${data.banner}`,
                                  }
                            : images.noBanner
                    }
                    resizeMode="cover"
                />
                <View style={styles.avatar}>
                    <Image
                        style={{width: '100%', height: '100%'}}
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
                <TouchableOpacity
                    style={styles.removeBookmarkBtn}
                    onPress={bookmarkdJobHandler}>
                    <MaterialCommunityIcon
                        name="bookmark"
                        size={20}
                        color={isBookmarked ? colors.highlight : '#fff'}
                    />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <View style={styles.lowerPart}>
                    <Text
                        style={{
                            ...FONTS.minor,
                            fontWeight: 'bold',
                            marginBottom: 5,
                        }}
                        numberOfLines={2}>
                        <MaterialCommunityIcon
                            name="briefcase"
                            size={15}
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
                            textAlign: 'left',
                        }}
                        numberOfLines={2}>
                        <MaterialCommunityIcon
                            name="map-marker"
                            size={15}
                            color={colors.icon}
                            style={{marginRight: 8}}
                        />{' '}
                        {data.city_name} · {data.country_name}
                    </Text>
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.paragraph,
                            marginBottom: 5,
                            textAlign: 'left',
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
                            <IonIcon
                                name="md-business-sharp"
                                size={15}
                                color={colors.icon}
                                style={{marginRight: 8}}
                            />{' '}
                            {data.company_name}
                        </Text>
                    </View>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            width: '100%',
                            flexWrap: 'wrap',
                        }}>
                        <Text
                            style={{
                                ...FONTS.caption,
                                color: colors.paragraph,
                                marginBottom: 5,
                                textAlign: 'center',
                            }}
                            numberOfLines={2}>
                            {timeSince(data.post_date)}
                        </Text>
                    </View>
                    <TouchableHighlight
                        style={styles.viewJobDetailBtn}
                        underlayColor={colors.tertiary}
                        onPress={() => {
                            openJobDetailModal();
                        }}>
                        <Text
                            style={{
                                ...FONTS.caption,
                                color: colors.button,
                                fontWeight: 'bold',
                            }}>
                            Job Details
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
            <Portal>
                <BottomSheet
                    android_keyboardInputMode="adjustPan"
                    style={styles.bottomSheet}
                    ref={savedJobModalRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    enableHandlePanningGesture
                    backdropComponent={renderBackdrop}>
                    <ChatBotJobBottomSheet
                        data={data}
                        closeModals={closeModals}
                        isBookmarked={isBookmarked}
                        bookmarkdJobHandler={bookmarkdJobHandler}
                    />
                </BottomSheet>
                <PortalHost name="job_bottomsheet" />
            </Portal>
        </View>
    );
};

export default ChatBotJobCard;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: colors.main,
        height: sizes.height * 0.4,
        width: sizes.width * 0.5 - 15,
        // marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        elevation: 5,
        overflow: 'hidden',
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
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#cccccc22',
        borderRadius: sizes.height * 0.1,
        left: (sizes.width * 0.5 - 15) / 2,
        transform: [
            {translateX: -(sizes.height * 0.08) / 2},
            {translateY: (sizes.height * 0.08) / 2},
        ],
        overflow: 'hidden',
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
        alignItems: 'center',
        paddingTop: (sizes.height * 0.08) / 2,
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
