import React, {useState, useEffect} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Alert,
    TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Ionicon from 'react-native-vector-icons/Ionicons';
import {Button} from 'react-native-paper';
import {images, sizes, colors, formats} from '../../constants';
import {useSelector, useDispatch} from 'react-redux';
import {IRootState} from '../../store/store';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import {loadToken} from '../../store/actions/authActions';
import {fetchUserById} from '../../store/thunks/userThunk';

interface Photo {
    uri: string;
    fileName: string;
    type: string;
}

const EditUserAvatar: React.FC<{
    closeAllModels: () => void;
}> = ({closeAllModels}) => {
    const avatar = useSelector((state: IRootState) => state.auth.user?.avatar);
    const userId = useSelector((state: IRootState) => state.auth.user?.id);
    const dispatch = useDispatch();

    async function uploadPhoto(uploadedPhoto: Photo) {
        try {
            if (!uploadedPhoto) {
                return;
            }
            const formData = new FormData();
            formData.append('avatar', {
                uri: uploadedPhoto.uri,
                name: uploadedPhoto.fileName,
                type: uploadedPhoto.type,
            });
            const res = await fetch(`${API_URL}/auth/avatar`, {
                method: 'post',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
                body: formData,
            });
            if (res.ok) {
                const token = (await res.json()).token;
                dispatch(loadToken(token));
                await fetchUserById(userId)(dispatch);
                Toast.show({
                    type: 'success',
                    text1: 'Uploaded successfully',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: (await res.json()).message,
                });
            }
        } catch (error: any) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.toString(),
            });
        }
    }

    async function takePhoto() {
        try {
            const img = await ImagePicker.openCamera({
                width: 500,
                height: 500,
                cropping: true,
            });
            // console.log(img);
            let uploadedPhoto = {
                uri: img.path,
                fileName: img.path.slice(img.path.lastIndexOf('/') + 1),
                type: img.mime,
            };
            Alert.alert('Confirm', 'Upload avatar', [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => uploadPhoto(uploadedPhoto),
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    }

    async function selectPhoto() {
        try {
            const img = await ImagePicker.openPicker({
                width: 500,
                height: 500,
                mediaType: 'photo',
                cropping: true,
            });
            // console.log(img);
            let uploadedPhoto = {
                uri: img.path,
                fileName: img.path.slice(img.path.lastIndexOf('/') + 1),
                type: img.mime,
            };
            Alert.alert('Confirm', 'Upload avatar', [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => uploadPhoto(uploadedPhoto),
                },
            ]);
        } catch (error) {
            console.log(error);
        }
    }

    async function removePhoto() {
        try {
            if (!avatar) {
                return;
            }
            const res = await fetch(`${API_URL}/auth/avatar`, {
                method: 'delete',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (res.ok) {
                const token = (await res.json()).token;
                dispatch(loadToken(token));
                Toast.show({
                    type: 'success',
                    text1: 'Removed successfully',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: (await res.json()).message,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    paddingTop: 10,
                    paddingRight: 10,
                }}>
                <TouchableOpacity onPress={closeAllModels}>
                    <Ionicon name="close" size={25} color={colors.icon} />
                </TouchableOpacity>
            </View>
            <View style={styles.previewContainer}>
                <Image
                    style={styles.preview}
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
                    resizeMode="cover"
                />
            </View>
            <Button
                style={styles.button}
                icon="camera"
                mode="contained"
                onPress={takePhoto}>
                Take with camera
            </Button>
            <Button
                style={styles.button}
                icon="image-frame"
                mode="contained"
                onPress={selectPhoto}>
                Upload from library
            </Button>
            {avatar ? (
                <Button
                    style={styles.button}
                    mode="contained"
                    onPress={() => {
                        Alert.alert('Confirm', 'Remove avatar', [
                            {
                                text: 'Cancel',
                                onPress: () => {},
                                style: 'cancel',
                            },
                            {
                                text: 'Confirm',
                                onPress: () => removePhoto(),
                            },
                        ]);
                    }}
                    color={colors.warning}>
                    Remove avatar
                </Button>
            ) : null}
        </View>
    );
};

export default EditUserAvatar;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    previewContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: sizes.width * 0.6,
        marginHorizontal: (sizes.width * 0.4) / 2,
        marginVertical: 50,
        height: sizes.width * 0.6,
    },
    preview: {
        margin: (sizes.width * 0.4) / 2,
        width: sizes.width * 0.6,
        height: '100%',
        aspectRatio: 1,
        borderRadius: (sizes.width * 0.6) / 2,
        borderWidth: 3,
        borderColor: '#cccccc1a',
    },
    button: {
        marginTop: 10,
        marginHorizontal: sizes.width * 0.1,
        borderRadius: 5,
    },
});
