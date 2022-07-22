import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {Switch, TextArea} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {usePost} from '../contexts/PostContext';
import {RootStackParamList} from '../types/types';
import {colors, sizes, images, FONTS, formats} from '../constants';
import {IRootState} from '../store/store';
import MinorNavBar from '../components/MinorNavBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Post'>;

const CreatePostScreen: React.FC<Props> = ({navigation, route}) => {
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [photos, setPhotos] = useState<any[]>([]);
    const [postContent, setPostContent] = useState<string>('');
    const [isContentEmpty, setIsContentEmpty] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const {fetchThread} = usePost();
    const hasCompanyId = route && route.params && route.params.companyId;

    async function editSelectedPhoto(i: number) {
        try {
            let croppedImg = await ImagePicker.openCropper({
                mediaType: 'photo',
                path: photos[i].uri,
            });
            setPhotos((prev) => {
                return prev.map((photo, j) => {
                    return j === i
                        ? {
                              uri: croppedImg.path,
                              fileName: croppedImg.path.slice(
                                  croppedImg.path.lastIndexOf('/') + 1,
                              ),
                              type: croppedImg.mime,
                          }
                        : photo;
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function postThread() {
        try {
            setIsSubmitting(true);
            // RETURN IF NO CONTENT
            if (isContentEmpty) {
                console.log('ContentEmpty');
                Toast.show({
                    type: 'error',
                    text1: 'Content cannot be empty.',
                });
                return;
            }
            // CREATE FORMDATA
            const formData = new FormData();
            if (
                photos.length > 0 &&
                !photos.some((n: any) => !n.fileName && !n.type && !n.uri)
            ) {
                photos.forEach((photo) => {
                    formData.append('thread_image', {
                        uri: photo.uri,
                        name: photo.fileName,
                        type: photo.type,
                    });
                });
            }
            formData.append('content', postContent);
            formData.append('is_public', isPublic);
            // POST TO SERVER
            const token = await AsyncStorage.getItem('token');
            let fetchQuery = hasCompanyId
                ? `${API_URL}/thread/company/${route!.params.companyId}`
                : `${API_URL}/thread/user`;
            const res = await fetch(fetchQuery, {
                method: 'post',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (res.ok) {
                await fetchThread();
                Toast.show({
                    type: 'success',
                    text1: 'Post created',
                });
                navigation.goBack();
            } else {
                const parseRes = await res.json();
                Toast.show({
                    type: 'error',
                    text1: parseRes.message,
                });
            }
            // console.log(postContent);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function editPost() {
        try {
            // RETURN IF NO CONTENT
            if (isContentEmpty) {
                console.log('failed');
                Toast.show({
                    type: 'error',
                    text1: 'Content cannot be empty.',
                });
                return;
            }
            setIsSubmitting(true);
            // CREATE FORMDATA
            const formData = new FormData();
            if (
                photos.length > 0 &&
                !photos.some((n: any) => !n.fileName && !n.type && !n.uri)
            ) {
                photos.forEach((photo) => {
                    formData.append('thread_image', {
                        uri: photo.uri,
                        name: photo.fileName,
                        type: photo.type,
                    });
                });
            }
            formData.append('content', postContent);
            formData.append('is_public', isPublic);
            // POST TO SERVER
            const token = await AsyncStorage.getItem('token');
            let fetchQuery = `${API_URL}/thread/${route!.params.postId}`;
            const res = await fetch(fetchQuery, {
                method: 'put',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });
            if (res.ok) {
                await fetchThread();
                Toast.show({
                    type: 'success',
                    text1: 'Post updated',
                });
                navigation.goBack();
            } else {
                const parseRes = await res.json();
                Toast.show({
                    type: 'error',
                    text1: parseRes.message,
                });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitting(false);
        }
    }

    function updateContent(content: string) {
        setIsContentEmpty(!content.trim() ? true : false);
        setPostContent(content);
    }

    async function takePhoto() {
        try {
            // const is_allowed = await requestCameraPermission();
            const image = [
                await ImagePicker.openCamera({
                    // width: 500,
                    // height: 500,
                    cropping: true,
                }),
            ];
            setPhotos(
                image.map((img) => {
                    return {
                        uri: img.path,
                        fileName: img.path.slice(img.path.lastIndexOf('/') + 1),
                        type: img.mime,
                    };
                }),
            );
        } catch (error) {
            console.log(error);
        }
    }

    async function selectPhoto() {
        try {
            const images = await ImagePicker.openPicker({
                multiple: true,
                cropping: true,
                mediaType: 'photo',
            });
            const croppedImages = [];

            for (let i = 0; i < images.length; i++) {
                let image = images[i];

                let croppedImg = await ImagePicker.openCropper({
                    mediaType: 'photo',
                    path: image.path,
                });

                croppedImages.push(croppedImg);
            }
            setPhotos(
                croppedImages.map((img) => {
                    return {
                        uri: img.path,
                        fileName: img.path.slice(img.path.lastIndexOf('/') + 1),
                        type: img.mime,
                    };
                }),
            );
        } catch (error) {
            console.log(error);
        }
    }

    // function takeVideo() {
    //     ImagePicker.openCamera({
    //         mediaType: 'video',
    //     }).then((image) => {
    //         console.log(image);
    //     });
    // }

    function renderNameDisplay() {
        const name = useSelector((state: IRootState) => state.auth.user?.name);
        const avatar = hasCompanyId
            ? route.params.companyAvatar
            : useSelector((state: IRootState) => state.auth.user?.avatar);

        return (
            <View style={styles.nameDisplayContainer}>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
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
                                    : hasCompanyId
                                    ? images.noCompanyAvatar
                                    : images.noAvatar
                            }
                        />
                    </View>
                    <Text style={{...FONTS.paragraph}}>
                        {hasCompanyId ? route.params.companyName : name}
                    </Text>
                </View>
                <View style={{display: 'flex', justifyContent: 'center'}}>
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: isPublic
                                ? colors.paragraph
                                : colors.highlight,
                            textAlign: 'center',
                        }}>
                        {isPublic ? 'Public' : 'Private'}
                    </Text>
                    <Switch
                        isChecked={!isPublic}
                        onChange={() => setIsPublic((prev) => !prev)}
                        size="lg"
                        offTrackColor={colors.tertiary}
                        offThumbColor="orange.100"
                        onTrackColor="emerald.100"
                        onThumbColor={colors.highlight}
                    />
                </View>
            </View>
        );
    }

    const LeftComponent = () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="cross" size={30} color={colors.icon} />
        </TouchableOpacity>
    );

    const RightComponent = () => {
        return (
            <>
                {isSubmitting ? (
                    <ActivityIndicator size="small" color={colors.icon} />
                ) : (
                    <TouchableOpacity
                        disabled={isSubmitting}
                        onPress={() => {
                            //@ts-ignore
                            if (route?.params?.postId) {
                                editPost();
                            } else {
                                postThread();
                            }
                        }}>
                        <FontAwesomeIcon
                            name="pencil-square-o"
                            size={30}
                            color={isContentEmpty ? colors.icon : colors.button}
                        />
                    </TouchableOpacity>
                )}
            </>
        );
    };

    useEffect(() => {
        async function fetchExistedPost() {
            try {
                const res = await fetch(
                    `${API_URL}/thread/by-post/${route!.params!['postId']}`,
                    {
                        headers: {
                            Authorization: `Bearer ${await AsyncStorage.getItem(
                                'token',
                            )}`,
                        },
                    },
                );
                if (res.ok) {
                    const parseRes = await res.json();
                    setPostContent(parseRes.data.post.content);
                    setIsPublic(parseRes.data.post.is_public);
                    // console.log(parseRes.data.post);
                    // console.log(parseRes.data.post.images);
                    if (parseRes.data.post.images) {
                        for (
                            let i = 0;
                            i < parseRes.data.post.images.length;
                            i++
                        ) {
                            let img = parseRes.data.post.images[i].path;

                            const path = formats.httpFormat.test(img)
                                ? {
                                      uri: `${img}`,
                                  }
                                : {
                                      uri: `${API_URL}/${img}`,
                                  };
                            const name = img.slice(0, img.lastIndexOf('.'));
                            const uri = Image.resolveAssetSource(path).uri;
                            const type = `image/${img.slice(
                                img.lastIndexOf('.') + 1,
                            )}`;
                            setPhotos((prev) => [...prev, {uri, name, type}]);
                            // console.log(name);
                            // console.log(uri);
                            // console.log(type);
                        }
                    }
                } else {
                    navigation.goBack();
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        // console.log(route.params);
        if (!route || !route.params || route.params.postId === undefined) {
            setIsLoading(false);
        } else {
            fetchExistedPost();
        }
    }, []);

    return (
        <View style={styles.container}>
            {!isLoading && (
                <>
                    <MinorNavBar
                        LeftComponent={LeftComponent}
                        //@ts-ignore
                        middleText={
                            route && route.params && route.params.postId
                                ? 'Edit Post'
                                : 'Create Post'
                        }
                        RightComponent={RightComponent}
                    />
                    <ScrollView style={styles.scrollView} horizontal={false}>
                        {renderNameDisplay()}
                        <TextArea
                            value={postContent}
                            onChangeText={(content) => updateContent(content)}
                            style={styles.textarea}
                            placeholder="What do you say?"
                            isFullWidth
                            _focus={{borderColor: 'transparent'}}
                        />
                        {/* Delete Btn Container */}
                        <View
                            style={[
                                styles.deleteBtnContainer,
                                {display: photos.length > 0 ? 'flex' : 'none'},
                            ]}>
                            <TouchableOpacity onPress={() => setPhotos([])}>
                                <MaterialIcon
                                    name="delete-forever"
                                    size={35}
                                    color={colors.button}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.selectedImgsContainer}>
                            {photos.map((link, i) => {
                                return (
                                    <View style={styles.selectedImgContainer}>
                                        <Image
                                            key={`${i}-img`}
                                            source={{uri: link.uri}}
                                            style={styles.selectedImg}
                                        />
                                        <TouchableOpacity
                                            onPress={() => editSelectedPhoto(i)}
                                            style={{
                                                ...styles.imageEditBtn,
                                                bottom: '50%',
                                                right: sizes.width * 0.5,
                                            }}>
                                            <MaterialIcon
                                                name="edit"
                                                size={35}
                                                color={colors.main}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setPhotos((prev) =>
                                                    prev.filter(
                                                        (_, j) => j !== i,
                                                    ),
                                                );
                                            }}
                                            style={{
                                                ...styles.imageEditBtn,
                                                left: sizes.width * 0.5,
                                                bottom: '50%',
                                            }}>
                                            <MaterialIcon
                                                name="delete"
                                                size={35}
                                                color={colors.main}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </ScrollView>
                    <View style={styles.functionsContainer}>
                        <TouchableOpacity
                            onPress={takePhoto}
                            disabled={photos.length > 0}
                            style={styles.functionBtn}>
                            <FontAwesomeIcon
                                name="camera"
                                size={25}
                                color={
                                    photos.length > 0
                                        ? colors.icon
                                        : colors.button
                                }
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={selectPhoto}
                            disabled={photos.length > 0}
                            style={styles.functionBtn}>
                            <FontAwesomeIcon
                                name="photo"
                                size={25}
                                color={
                                    photos.length > 0
                                        ? colors.icon
                                        : colors.button
                                }
                            />
                        </TouchableOpacity>
                        {/* <TouchableOpacity
                    onPress={takeVideo}
                    disabled={photos.length > 0}
                    style={styles.functionBtn}>
                    <FontAwesomeIcon
                        name="video-camera"
                        size={25}
                        color={photos.length > 0 ? colors.icon : colors.button}
                    />
                </TouchableOpacity> */}
                    </View>
                </>
            )}
        </View>
    );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: colors.main,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 50,
        backgroundColor: colors.main,
        elevation: 5,
    },
    heading: {
        fontSize: sizes.heading,
        color: colors.headline,
        fontFamily: 'Roboto-Bold',
    },
    scrollView: {
        height: sizes.height - 100,
        width: sizes.width,
    },
    nameDisplayContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 80,
        paddingHorizontal: 15,
        backgroundColor: colors.main,
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
    textarea: {
        marginHorizontal: 10,
        fontSize: sizes.paragraph,
        minHeight: sizes.height * 0.1,
        borderColor: 'transparent',
    },
    deleteBtnContainer: {
        // display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    selectedImgsContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    selectedImgContainer: {
        position: 'relative',
        width: sizes.width * 0.8,
    },
    selectedImg: {
        width: sizes.width * 0.8,
        aspectRatio: 1,
        resizeMode: 'contain',
        marginTop: 10,
    },
    functionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: 50,
        paddingHorizontal: 20,
    },
    functionBtn: {
        marginLeft: 15,
    },
    imageEditBtn: {
        position: 'absolute',
        backgroundColor: '#00000040',
        borderRadius: 5,
        opacity: 0.5,
    },
});
