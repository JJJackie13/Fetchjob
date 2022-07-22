import React, {useRef, useState, useMemo, useEffect, useCallback} from 'react';
import {API_URL} from '@env';
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {Portal, PortalHost} from '@gorhom/portal';
import RNPickerSelect from 'react-native-picker-select';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {colors, FONTS, formats, images, sizes} from '../constants';
import {CompanyControlLevel} from '../types/enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {IRootState} from '../store/store';
import {RootStackParamList} from '../types/types';

interface Controller {
    id: number;
    first_name: string;
    last_name: string;
    avatar: string;
    level: number;
}

const ManageControllerCard: React.FC<{
    data: Controller;
    options: any;
    companyId: number;
    refresh: () => void;
}> = ({data, options, companyId, refresh}) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const level = data.level;
    const userId = useSelector((state: IRootState) => state.auth.user?.id);
    const [pickerLevel, setPickerLevel] = useState(data.level);
    const btmSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['99.9%'], []);
    const avatar = data.avatar
        ? formats.httpFormat.test(data.avatar)
            ? {
                  uri: `${data.avatar}`,
              }
            : {
                  uri: `${API_URL}/${data.avatar}`,
              }
        : images.noAvatar;

    async function changeLevelHandler() {
        try {
            const res = await fetch(
                `${API_URL}/company/controller/${companyId}`,
                {
                    method: 'put',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        targetUserId: data.id,
                        levelId: options.find(
                            (obj: any) => obj.level == pickerLevel,
                        ).id,
                    }),
                },
            );
            const parseRes = await res.json();
            if (res.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                });
                refresh();
                if (
                    data.id === userId &&
                    pickerLevel === CompanyControlLevel.ADMIN
                ) {
                    navigation.navigate('CompanyProfile', {
                        companyId: companyId,
                    });
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: parseRes.message,
                });
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Failed',
            });
        }
    }

    async function removeControllerHandler() {
        try {
            const res = await fetch(
                `${API_URL}/company/controller/${companyId}`,
                {
                    method: 'delete',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({targetUserId: data.id}),
                },
            );
            const parseRes = await res.json();
            if (res.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                });
                btmSheetRef.current?.close();
                refresh();
                if (data.id === userId) {
                    navigation.navigate('CompanyProfile', {
                        companyId: companyId,
                    });
                }
            } else {
                Toast.show({
                    type: 'error',
                    text1: parseRes.message,
                });
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Failed',
            });
        }
    }

    const changeLevelAlert = () =>
        Alert.alert(
            'Confirm change?',
            `Change control level of ${data.first_name} ${data.last_name} to ${CompanyControlLevel[pickerLevel]}`,
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => changeLevelHandler()},
            ],
        );

    const deleteControllerAlert = () =>
        Alert.alert(
            'Confirm?',
            `Remove ${data.first_name} ${data.last_name} from controller list`,
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {text: 'OK', onPress: () => removeControllerHandler()},
            ],
        );

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

    const renderBtmSheetContent = () => (
        <View>
            <View style={styles.btmSheetheader}>
                <TouchableOpacity
                    onPress={() => {
                        btmSheetRef.current?.close();
                    }}>
                    <Entypo name="cross" size={25} color={colors.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.previewContainer}>
                <Image
                    style={styles.preview}
                    source={avatar}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.nameContainer}>
                <Text style={{...FONTS.paragraph, fontWeight: 'bold'}}>
                    {data.first_name}
                </Text>
                <Text style={{...FONTS.paragraph, fontWeight: 'bold'}}>
                    {data.last_name}
                </Text>
                <Text style={{marginTop: 5}}>
                    Role: {CompanyControlLevel[level]}
                </Text>
            </View>
            <View
                style={{
                    ...styles.btmSheetOptionContainer,
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                <RNPickerSelect
                    style={{viewContainer: styles.pickerContainer}}
                    onValueChange={(value) => setPickerLevel(value)}
                    items={options.map((obj: any) => {
                        return {
                            label: CompanyControlLevel[obj.level],
                            value: obj.level,
                        };
                    })}
                    placeholder={{}}
                    value={pickerLevel}
                />
                <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={() => {
                        if (pickerLevel !== data.level) {
                            changeLevelAlert();
                        }
                    }}>
                    {pickerLevel !== level && (
                        <Ionicon
                            name="checkmark-circle-sharp"
                            size={20}
                            color="#fff"
                        />
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.btmSheetOptionContainer}>
                <TouchableOpacity
                    style={{
                        backgroundColor: colors.warning,
                        padding: 15,
                        borderRadius: 10,
                    }}
                    onPress={deleteControllerAlert}>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                        }}>
                        <Text
                            style={{
                                ...FONTS.paragraph,
                                fontWeight: 'bold',
                                color: '#fff',
                            }}>
                            Remove
                        </Text>
                        <Ionicon
                            name="person-remove-sharp"
                            size={20}
                            color="#fff"
                        />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );

    useEffect(() => {
        () => btmSheetRef.current?.close();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.leftPart}>
                <ImageBackground
                    source={avatar}
                    style={styles.avatar}
                    imageStyle={styles.avatar}
                    resizeMode="cover"></ImageBackground>
            </View>
            <View style={styles.rightPart}>
                <View>
                    <View style={styles.UpperPart}>
                        <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                            {data.first_name} {data.last_name}
                        </Text>
                    </View>
                    <View style={styles.LowerPart}>
                        <View style={styles.rightLowerLeft}>
                            <Text
                                numberOfLines={2}
                                style={{
                                    ...FONTS.caption,
                                    color: colors.paragraph,
                                }}>
                                Role: {CompanyControlLevel[level]}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.btmSheetBtnContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            btmSheetRef.current?.expand();
                        }}>
                        <Entypo
                            name="dots-three-horizontal"
                            size={15}
                            color={colors.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Portal name={`manage_controller_sheet${data.id}`}>
                <BottomSheet
                    ref={btmSheetRef}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    style={styles.btmSheet}
                    backdropComponent={renderBackdrop}
                    handleComponent={() => null}
                    enableContentPanningGesture={false}
                    enableHandlePanningGesture={false}>
                    {renderBtmSheetContent()}
                </BottomSheet>
                <PortalHost name={`manage_controller_sheet${data.id}`} />
            </Portal>
        </View>
    );
};

export default ManageControllerCard;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: sizes.height * 0.08,
        // borderTopColor:"#ccc",
        // borderTopWidth:1,
        borderBottomColor: '#cccccc71',
        borderBottomWidth: 1,
        paddingVertical: 5,
    },
    leftPart: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '20%',
        // backgroundColor: 'red',
    },
    avatarContainer: {
        position: 'relative',
        width: '90%',
        height: '90%',
        aspectRatio: 1,
        overflow: 'hidden',
        borderRadius: sizes.width * 0.2,
    },
    avatar: {
        width: '90%',
        height: '90%',
        borderRadius: sizes.width * 0.2,
        aspectRatio: 1,
    },
    rightPart: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '100%',
        width: '80%',
        // borderBottomColor: '#cccccc71',
        // borderBottomWidth: 1,
    },
    UpperPart: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '35%',
        width: '100%',
        // backgroundColor: 'yellow',
    },
    LowerPart: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: '65%',
        width: '95%',
        // backgroundColor: 'green',
    },
    rightLowerLeft: {
        width: '85%',
    },
    btmSheetBtnContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '20%',
    },
    btmSheet: {
        elevation: 15,
        backgroundColor: colors.main,
        zIndex: 50000,
    },
    btmSheetheader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15,
    },
    previewContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: sizes.width * 0.4,
        marginHorizontal: (sizes.width * 0.6) / 2,
        marginVertical: 50,
        height: sizes.width * 0.4,
    },
    preview: {
        margin: (sizes.width * 0.4) / 2,
        width: sizes.width * 0.4,
        height: '100%',
        aspectRatio: 1,
        borderRadius: (sizes.width * 0.4) / 2,
        borderWidth: 3,
        borderColor: '#cccccc1a',
    },
    nameContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    btmSheetOptionContainer: {
        paddingHorizontal: sizes.width * 0.2,
        marginTop: 20,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: colors.highlight,
        borderRadius: 10,
        width: '80%',
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
    confirmBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.button,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        width: '20%',
    },
});
