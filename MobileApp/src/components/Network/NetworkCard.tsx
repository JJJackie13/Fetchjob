import React, {useState, useRef, useMemo} from 'react';
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
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import ConnectionListBottomSheet from '../BottomSheets/ConnectionListBottomSheet';

import {colors, FONTS, images, sizes, formats} from '../../constants';
import {RootStackParamList} from '../../types/types';
import {API_URL} from '@env';

interface NetworkCard {
    avatar: string;
    banner: string;
    company_name: string;
    first_name: string;
    friend_id: string;
    headline: string;
    last_name: string;
    network_id: string;
}

type UserProfileNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'UserProfile'
>;

const NetworkCard: React.FC<{
    data: NetworkCard;
    setConnections: React.Dispatch<React.SetStateAction<any>>;
}> = ({data, setConnections}) => {
    const navigation = useNavigation<UserProfileNavigationProp>();
    const connectionModalRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['99.9%'], []);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function removeConnectionWarning() {
        Alert.alert('Confirm', `Remove ${data.first_name} from connection`, [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {
                text: 'Confirm',
                onPress: () => removedConnectionCard(),
            },
        ]);
    }

    async function removedConnectionCard() {
        if (!data.friend_id) {
            return;
        }
        try {
            setIsLoading(true);
            const res = await fetch(
                `${API_URL}/network/remove/${parseInt(data.friend_id)}`,
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
                setConnections((prev: []) => {
                    return prev.filter((n: any) => {
                        return n.friend_id !== parseInt(data.friend_id);
                    });
                });
                Toast.show({
                    type: 'success',
                    text1: 'Removed connection',
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
            connectionModalRef.current?.close();
        }
    }

    function renderBottomSheetHandler() {
        return (
            <View style={styles.bottomSheetHandle}>
                <TouchableOpacity
                    onPress={() => connectionModalRef.current?.close()}>
                    <MaterialCommunityIcon
                        name="close-box-multiple-outline"
                        size={20}
                        color={colors.button}
                    />
                </TouchableOpacity>
            </View>
        );
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
                    style={styles.moreFnBtn}
                    onPress={() => connectionModalRef.current?.expand()}>
                    <MaterialCommunityIcon
                        name="dots-horizontal"
                        size={20}
                        color="#fff"
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
                            userId: parseInt(data.friend_id),
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
            <BottomSheet
                detached={true}
                bottomInset={5}
                enableHandlePanningGesture={false}
                enableContentPanningGesture={false}
                enablePanDownToClose={false}
                animateOnMount={false}
                style={styles.bottomSheet}
                ref={connectionModalRef}
                index={-1}
                snapPoints={snapPoints}
                handleComponent={() => renderBottomSheetHandler()}>
                <ConnectionListBottomSheet
                    removeConnectionWarning={removeConnectionWarning}
                    isLoading={isLoading}
                />
            </BottomSheet>
        </View>
    );
};

export default NetworkCard;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: colors.main,
        height: sizes.height * 0.33,
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
    moreFnBtn: {
        position: 'absolute',
        right: 5,
        top: 5,
        padding: 3,
        borderRadius: 10,
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
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: (sizes.height * 0.08) / 2,
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
        borderRadius: 10,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
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
