import React, {useState, useRef, useMemo, useCallback, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    Platform
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
import { applyJobTime } from './Job/TimeSince';
import JobDetailsBottomSheet from './BottomSheets/JobBottomSheet';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import FileViewer from "react-native-file-viewer";
import DocumentPicker from "react-native-document-picker";
import RNFS from 'react-native-fs';

interface User {
    job_id: number;
    user_id: number;
    avatar: string;
    first_name: string;
    last_name: string;
    resume: string;
    phone: string;
    email: string;
    apply_date: any;
}

const JobApplicationCard: React.FC<{
    data: User;
}> = ({data}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, any>>();
    const url = `${API_URL}/${data.resume}`;
    console.log('url', url)
    async function openFile() {
        
        console.log("resume", data.resume)
        // Feel free to change main path according to your requirements.
        // IMPORTANT: A file extension is always required on iOS.
        // You might encounter issues if the file extension isn't included
        // or if the extension doesn't match the mime type of the file.
        const localFile = `${RNFS.DocumentDirectoryPath}/cv.pdf`;

        const options = {
          fromUrl: url,
          toFile: localFile
        };
        RNFS.downloadFile(options).promise
        .then(() => FileViewer.open(localFile))
        .then(() => {
            console.log("success")// success
        })
        .catch(error => {
            console.log("error", error)// error
        });
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => {
                navigation.navigate("UserProfile",{userId:data.user_id})
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
                            name="account"
                            size={13}
                            color={colors.icon}
                            style={{marginRight: 8}}
                        />{' '}
                        {data.first_name} {data.last_name}
                    </Text>
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.paragraph,
                            marginBottom: 5,
                            maxWidth: sizes.width * 0.65,
                        }}
                        numberOfLines={2}>
                        <MaterialCommunityIcon
                            name="email"
                            size={10}
                            color={colors.icon}
                            style={{marginRight: 8}}
                        />{' '}
                        {data.email}
                    </Text>
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.paragraph,
                            marginBottom: 5,
                            maxWidth: sizes.width * 0.65,
                        }}
                        numberOfLines={2}>
                        <MaterialCommunityIcon
                            name="cellphone"
                            size={10}
                            color={colors.icon}
                            style={{marginRight: 8}}
                        />{' '}
                        {data.phone}
                    </Text>

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
                            {applyJobTime(data.apply_date)}
                        </Text>
                    </View>
                </View>

                    <TouchableOpacity
                        style={styles.uploadFileBtn}
                        onPress={() => {openFile()}}
                        >
                        <Text
                            style={{
                                ...FONTS.caption,
                                color: colors.button,
                                fontWeight: 'bold',
                            }}>
                            Review resume
                        </Text>
                    </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

export default JobApplicationCard;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: colors.main,
        maxHeight: sizes.height * 0.5,
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
    uploadFileBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: sizes.width * 0.7,
        height: sizes.height * 0.05,
        alignItems: 'center',
        // alignSelf: 'center',
        marginVertical: 10,
        padding: 5,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.button,
    },
});
