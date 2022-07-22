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
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
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

const ReceivedRequestCard: React.FC<{
    data: RequestCounterpart;
    setReceivedRequests: any;
}> = ({data, setReceivedRequests}) => {
    const navigation = useNavigation<UserProfileNavigationProp>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function removeConnectionWarning(isAccepted: boolean) {
        switch (isAccepted) {
            case true:
                Alert.alert('Confirm', `Accept ${data.first_name}'s request`, [
                    {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                    },
                    {
                        text: 'Confirm',
                        onPress: () => {
                            // console.log('accepted');
                            respondToRequest(true);
                        },
                    },
                ]);
                break;
            case false:
                Alert.alert('Confirm', `Reject ${data.first_name}'s request`, [
                    {
                        text: 'Cancel',
                        onPress: () => {},
                        style: 'cancel',
                    },
                    {
                        text: 'Confirm',
                        onPress: () => {
                            // console.log('rejected');
                            respondToRequest(false);
                        },
                    },
                ]);
                break;
            default:
                return;
        }
    }

    async function respondToRequest(isAccepted: boolean) {
        try {
            if (isAccepted === undefined) {
                return;
            }
            setIsLoading(true);
            let body = JSON.stringify({
                networkId: data.id,
                isAccepted: isAccepted,
            });
            const res = await fetch(`${API_URL}/network/request/respond`, {
                method: 'put',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                    'Content-Type': 'application/json',
                },
                body: body,
            });
            const parseRes = await res.json();

            if (res.ok) {
                setReceivedRequests((prev: []) => {
                    return prev.filter((n: RequestCounterpart) => {
                        return n.counterpartId !== data.counterpartId;
                    });
                });
                Toast.show({
                    type: 'success',
                    text1: `${
                        isAccepted ? 'Accepted' : 'Rejected'
                    } connection request`,
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
                    <View>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}
                            onPress={() => removeConnectionWarning(true)}
                            disabled={isLoading}>
                            <FontAwesome5
                                name="check-circle"
                                color={colors.button}
                                size={sizes.width * 0.1}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.lowerMiddlePart}>
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
                    <View>
                        <TouchableOpacity
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                            }}
                            onPress={() => removeConnectionWarning(false)}
                            disabled={isLoading}>
                            <FontAwesome5
                                name="times-circle"
                                color={colors.warning}
                                size={sizes.width * 0.1}
                            />
                        </TouchableOpacity>
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

export default ReceivedRequestCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        backgroundColor: colors.main,
        // height: sizes.height * 0.33,
        // minHeight: sizes.height * 0.2,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: (sizes.height * 0.08) / 2,
        paddingHorizontal: sizes.width * 0.05,
    },
    lowerMiddlePart: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
