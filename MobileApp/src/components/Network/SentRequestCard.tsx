import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import {colors, FONTS, images, sizes, formats} from '../../constants';
import {RootStackParamList} from '../../types/types';
import {API_URL} from '@env';

interface RequestCounterpart {
    id: string;
    counterpartId: string;
    first_name: string;
    last_name: string;
    headline: string;
    avatar: string;
    banner: string;
    company_name: string;
}

type UserProfileNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'UserProfile'
>;

const SentRequestCard: React.FC<{
    data: RequestCounterpart;
    setSentRequests: any;
}> = ({data, setSentRequests}) => {
    const navigation = useNavigation<UserProfileNavigationProp>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function cancelRequestWarning() {
        Alert.alert(
            'Confirm',
            `Cancel connection request for ${data.first_name}`,
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => {
                        cancelRequest();
                    },
                },
            ],
        );
    }

    async function cancelRequest() {
        try {
            if (!data.counterpartId) {
                return;
            }
            setIsLoading(true);
            const res = await fetch(
                `${API_URL}/network/remove/${data.counterpartId}`,
                {
                    method: 'delete',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const parseRes = await res.json();

            if (res.ok) {
                setSentRequests((prev: []) => {
                    return prev.filter((n: RequestCounterpart) => {
                        return n.counterpartId !== data.counterpartId;
                    });
                });
                Toast.show({
                    type: 'success',
                    text1: 'Connection request removed',
                });
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
        } finally {
            setIsLoading(false);
        }
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
                    disabled={isLoading}
                    style={styles.moreFnBtn}
                    onPress={cancelRequestWarning}>
                    <FontAwesome name="remove" size={20} color="#fff" />
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
                        {data.first_name} {data.last_name}
                    </Text>
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.paragraph,
                            marginBottom: 5,
                            textAlign: 'center',
                        }}
                        numberOfLines={2}>
                        {data.headline}
                    </Text>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
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
                </View>
                <TouchableHighlight
                    style={styles.viewProfileBtn}
                    underlayColor={colors.tertiary}
                    onPress={() =>
                        navigation.navigate('UserProfile', {
                            userId: parseInt(data.counterpartId),
                        })
                    }>
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.button,
                            fontWeight: 'bold',
                        }}>
                        View Profile
                    </Text>
                </TouchableHighlight>
            </View>
        </View>
    );
};

export default SentRequestCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: colors.main,
        // maxHeight: sizes.height * 0.3,
        // width: sizes.width * 0.5 - 15,
        // marginHorizontal: 10,
        marginBottom: 5,
        borderRadius: 10,
        elevation: 5,
        overflow: 'hidden',
    },
    headingPart: {
        height: sizes.height * 0.08,
    },
    moreFnBtn: {
        position: 'absolute',
        right: 5,
        top: 5,
        padding: 3,
        borderRadius: 5,
        backgroundColor: '#0000003d',
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
    lowerPart: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: (sizes.height * 0.08) / 2,
        paddingHorizontal: sizes.width * 0.05,
    },
    viewProfileBtn: {
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
        flex: 1,
        elevation: 15,
        marginHorizontal: 5,
        backgroundColor: colors.main,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        zIndex: 1000,
    },
    bottomSheetHandle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingRight: 10,
    },
});
