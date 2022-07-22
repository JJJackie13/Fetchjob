import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    Modal,
    StyleProp,
    Pressable,
    ImageBackground,
} from 'react-native';
import {Portal, PortalHost} from '@gorhom/portal';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-toast-message';
import ImageViewer from 'react-native-image-zoom-viewer';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/core';
import {useSelector} from 'react-redux';

import HandleSelfPostBottomsheet from '../../components/BottomSheets/HandleSelfPostBottomsheet';
import HandleNonSelfPostBottomsheet from '../../components/BottomSheets/HandleNonSelfPostBottomsheet';
import {PostProps} from '../../types/types';
import {images, FONTS, colors, sizes, formats} from '../../constants';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp, RouteProp} from '@react-navigation/core';
import {RootStackParamList} from '../../types/types';
import {PostBottomsheetType} from '../../types/enums';
import {IRootState} from '../../store/store';

interface PostImage {
    id: string;
    path: string;
}

const Post: React.FC<{
    data: PostProps;
    style?: StyleProp<any>;
}> = ({data, style}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList, any>>();
    const route = useRoute<RouteProp<any>>();
    const currentUserId = useSelector(
        (state: IRootState) => state.auth.user?.id,
    );
    const [numberOfLines, setNumberOfLines] = useState<number>(3);
    const [maxNumberOfLines, setMaxNumberOfLines] = useState<number>(3);
    const [showMoreBtn, setShowMoreBtn] = useState<boolean>(false);
    const [liked, setLiked] = useState<boolean>(data.user_liked);
    const [numberOfLike, setNumberOfLike] = useState<number>(
        parseInt(data.like_number),
    );
    const [showImgSwiper, setShowImgSwiper] = useState<boolean>(false);
    const [imgSwiperIndex, setImgSwiperIndex] = useState<number>(0);
    const isUserPost = data.user_id != null; //EITHER USER OR COMPANY
    const selfPostModalRef = useRef<BottomSheet>(null);
    const nonSelfPostModalRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%'], []);
    const avatarLink = isUserPost
        ? data.user_avatar
            ? formats.httpFormat.test(data.user_avatar)
                ? {
                      uri: `${data.user_avatar}`,
                  }
                : {
                      uri: `${API_URL}/${data.user_avatar}`,
                  }
            : images.noAvatar
        : data.company_avatar
        ? formats.httpFormat.test(data.company_avatar)
            ? {
                  uri: `${data.company_avatar}`,
              }
            : {
                  uri: `${API_URL}/${data.company_avatar}`,
              }
        : images.noCompanyAvatar;

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

    function openModal(type: PostBottomsheetType) {
        switch (type) {
            case PostBottomsheetType.SELF:
                selfPostModalRef.current?.expand();
                break;
            case PostBottomsheetType.NONSELF:
                nonSelfPostModalRef.current?.expand();
                break;
            default:
                return;
        }
    }

    function closeModals() {
        selfPostModalRef.current?.forceClose();
        nonSelfPostModalRef.current?.forceClose();
    }

    function openImageSwiper(i: number = 0) {
        let index = i ? i : 0;
        setImgSwiperIndex(index);
        setShowImgSwiper(true);
    }

    function calcDate(today: Date, past: Date) {
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
            return years + ` yr${years > 1 ? 's' : ''} ago`;
        } else if (months >= 1) {
            return months + ` mth${months > 1 ? 's' : ''} ago`;
        } else if (days >= 1) {
            return days + ` day${days > 1 ? 's' : ''} ago`;
        } else if (hours >= 1) {
            return hours + ` hr${hours > 1 ? 's' : ''} ago`;
        } else if (minutes >= 1) {
            return minutes + ` min${minute > 1 ? 's' : ''} ago`;
        } else {
            return `Moments ago`;
        }
    }

    async function likeHandler() {
        try {
            const res = await fetch(`${API_URL}/thread/like/${data.id}`, {
                method: 'put',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (res.ok) {
                liked
                    ? setNumberOfLike((prev) => prev - 1)
                    : setNumberOfLike((prev) => prev + 1);
                setLiked((prev) => !prev);
            } else {
                const message = (await res.json()).message;
                Toast.show({
                    type: 'error',
                    text1: message,
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={[styles.post, style]}>
            {/* {height: 400 + (numberOfLines - 3) * FONTS.minor.fontSize}, */}
            <View style={styles.postUpperPartContainer}>
                <View style={styles.postHeaderContainer}>
                    <Pressable
                        onPress={() => {
                            if (isUserPost) {
                                navigation.navigate('UserProfile', {
                                    userId: parseInt(data.user_id),
                                });
                            } else {
                                navigation.navigate('CompanyProfile', {
                                    companyId: parseInt(data.company_id),
                                });
                            }
                        }}>
                        <Image
                            style={styles.postAvatar}
                            source={avatarLink}
                            resizeMode="cover"
                        />
                    </Pressable>
                    <View style={styles.postHeaderRightSection}>
                        <View style={styles.posterDetailsContainer}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    ...FONTS.minor,
                                    fontWeight: 'bold',
                                }}>
                                {isUserPost
                                    ? `${data.first_name} ${data.last_name}`
                                    : `${data.company_name}`}
                            </Text>
                            <Text
                                style={{
                                    ...FONTS.caption,
                                    color: colors.paragraph,
                                }}
                                numberOfLines={2}>
                                {isUserPost
                                    ? `${data.headline ? data.headline : ''}`
                                    : `${data.company_followers} followers`}
                            </Text>
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}>
                                <MaterialIcon
                                    style={{marginRight: 5}}
                                    name={
                                        data.is_public ? 'public' : 'public-off'
                                    }
                                    size={15}
                                    color={colors.icon}
                                />
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        ...FONTS.caption,
                                        color: colors.paragraph,
                                    }}>
                                    {`${calcDate(
                                        new Date(),
                                        new Date(data.created_at),
                                    )}`}
                                </Text>
                                {new Date(data.updated_at) >
                                new Date(data.created_at) ? (
                                    <Text
                                        style={{
                                            ...FONTS.caption,
                                            color: colors.paragraph,
                                        }}>
                                        {' '}
                                        • Edited
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                            <TouchableOpacity
                                onPress={() => {
                                    if (openModal && data.id) {
                                        openModal(
                                            parseInt(data.user_id) ===
                                                currentUserId
                                                ? PostBottomsheetType.SELF
                                                : PostBottomsheetType.NONSELF,
                                        );
                                    }
                                }}>
                                <MaterialCommunityIcons
                                    name="dots-horizontal"
                                    size={20}
                                    color={colors.icon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.postContentContainer}>
                    <View style={styles.postContentText}>
                        <Text
                            style={{
                                ...FONTS.minor,
                            }}
                            numberOfLines={numberOfLines}
                            onTextLayout={(e) => {
                                if (
                                    e.nativeEvent.lines.length > numberOfLines
                                ) {
                                    setShowMoreBtn(true);
                                    setMaxNumberOfLines(
                                        e.nativeEvent.lines.length,
                                    );
                                }
                            }}>
                            {data.content}
                        </Text>
                    </View>
                    <View style={styles.showMoreBtnContainer}>
                        {showMoreBtn ? (
                            <TouchableOpacity
                                style={styles.showMoreBtn}
                                onPress={() => {
                                    setNumberOfLines(maxNumberOfLines);
                                    setShowMoreBtn(false);
                                }}>
                                <Text style={{color: colors.highlight}}>
                                    Show more
                                </Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    {data.images && data.images.length > 0 ? (
                        <View
                            style={[
                                styles.postContentImage,
                                {flexWrap: 'wrap'},
                            ]}>
                            {data.images
                                .filter((_, i) => i < 4)
                                .map((img: PostImage, i) => (
                                    <Pressable
                                        onPress={() => openImageSwiper(i)}
                                        key={`${img.id}`}>
                                        <ImageBackground
                                            style={[
                                                data.images.length > 1
                                                    ? styles.imageMultiple
                                                    : styles.imageSingle,
                                                {
                                                    width:
                                                        data.images.length %
                                                            2 ===
                                                            1 &&
                                                        i ===
                                                            data.images.length -
                                                                1
                                                            ? '100%'
                                                            : sizes.width / 2 -
                                                              5,
                                                },
                                            ]}
                                            source={
                                                formats.httpFormat.test(
                                                    img.path,
                                                )
                                                    ? {
                                                          uri: `${img.path}`,
                                                      }
                                                    : {
                                                          uri: `${API_URL}/${img.path}`,
                                                      }
                                            }
                                            resizeMode="cover">
                                            {data.images.length > 4 &&
                                            i === 3 ? (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        openImageSwiper(i)
                                                    }
                                                    style={styles.moreImgBtn}>
                                                    <Text
                                                        style={
                                                            styles.moreImgBtnText
                                                        }>
                                                        +
                                                        {data.images.length - 4}
                                                    </Text>
                                                </TouchableOpacity>
                                            ) : null}
                                        </ImageBackground>
                                    </Pressable>
                                ))}
                        </View>
                    ) : null}
                    <Modal visible={showImgSwiper} transparent={true}>
                        <ImageViewer
                            index={imgSwiperIndex}
                            enableSwipeDown
                            onSwipeDown={() => setShowImgSwiper(false)}
                            renderHeader={() => (
                                <View style={styles.postContentImgSwiper}>
                                    <TouchableOpacity
                                        onPress={() => setShowImgSwiper(false)}>
                                        <AntDesign
                                            name="close"
                                            size={25}
                                            color="#fff"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            imageUrls={data.images.map((img: PostImage) => {
                                return formats.httpFormat.test(img.path)
                                    ? {
                                          key: `${img.id}`,
                                          url: `${img.path}`,
                                          props: {},
                                      }
                                    : {
                                          key: `${img.id}`,
                                          url: `${API_URL}/${img.path}`,
                                          props: {},
                                      };
                            })}
                        />
                    </Modal>
                </View>
            </View>
            <View style={styles.reactionRecordContainer}>
                <Text style={FONTS.caption}>{numberOfLike} likes</Text>
                <Text style={FONTS.caption}>
                    {parseInt(data.comment_number) > 0
                        ? `${data.comment_number} comments`
                        : ''}
                </Text>
            </View>
            <View style={styles.reactionBtnContainer}>
                <TouchableOpacity
                    style={styles.reactionBtn}
                    onPress={likeHandler}>
                    <AntDesign
                        name={liked ? 'like1' : 'like2'}
                        size={20}
                        color={liked ? colors.button : colors.icon}
                    />
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: liked ? colors.button : colors.icon,
                        }}>
                        {liked ? 'Liked' : 'Like'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    disabled={route.name === 'PostComment'}
                    style={styles.reactionBtn}
                    onPress={() => {
                        if (route.name !== 'PostComment') {
                            navigation.navigate('PostComment', {
                                id: parseInt(data.id),
                            });
                        }
                    }}>
                    <MaterialCommunityIcons
                        name="comment-processing-outline"
                        size={20}
                        color={colors.icon}
                    />
                    <Text style={{...FONTS.caption, color: colors.icon}}>
                        Comment
                    </Text>
                </TouchableOpacity>
            </View>
            <Portal>
                {data.user_id && parseInt(data.user_id) === currentUserId ? (
                    <BottomSheet
                        android_keyboardInputMode="adjustPan"
                        style={styles.bottomSheet}
                        ref={selfPostModalRef}
                        index={-1}
                        snapPoints={snapPoints}
                        enablePanDownToClose
                        enableHandlePanningGesture
                        backdropComponent={renderBackdrop}>
                        <HandleSelfPostBottomsheet
                            postId={parseInt(data.id)}
                            navigation={navigation}
                            closeModals={closeModals}
                        />
                    </BottomSheet>
                ) : (
                    <BottomSheet
                        android_keyboardInputMode="adjustPan"
                        style={styles.bottomSheet}
                        ref={nonSelfPostModalRef}
                        index={-1}
                        snapPoints={snapPoints}
                        enablePanDownToClose
                        enableHandlePanningGesture
                        backdropComponent={renderBackdrop}>
                        <HandleNonSelfPostBottomsheet
                            postId={parseInt(data.id)}
                            navigation={navigation}
                            closeModals={closeModals}
                        />
                    </BottomSheet>
                )}

                <PortalHost name="post_bottomsheet" />
            </Portal>
        </View>
    );
};

export default Post;

const styles = StyleSheet.create({
    post: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        // height: 400,
        // minHeight: 400,
        width: sizes.width - 10,
        marginHorizontal: 5,
        marginTop: 5,
        borderRadius: 5,
        backgroundColor: colors.main,
        elevation: 1,
        overflow: 'hidden',
    },
    postUpperPartContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    postHeaderContainer: {
        display: 'flex',
        flexDirection: 'row',
        minHeight: 80,
        padding: 10,
        // backgroundColor: 'red',
    },
    postAvatar: {
        width: 60,
        height: 60,
        aspectRatio: 1,
        borderRadius: sizes.height * 0.08 /2,
        marginRight: 10,
    },
    postHeaderRightSection: {
        display: 'flex',
        width: sizes.width - 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    posterDetailsContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    postContentContainer: {
        display: 'flex',
        flexDirection: 'column',
        // minHeight: 400 - 80 - 50,
    },
    postContentText: {
        position: 'relative',
        // height: 75,
        // backgroundColor: 'blue',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    showMoreBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: sizes.width,
        paddingHorizontal: sizes.width * 0.05,
    },
    showMoreBtn: {
        // position: 'absolute',
        // backgroundColor: colors.main,
        // right: 5,
        // bottom: 5,
    },
    postContentImage: {
        position: 'relative',
        width: '100%',
        minHeight: 195,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        // flexWrap: 'wrap',
    },
    postContentImgSwiper: {
        height: sizes.height * 0.05,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 15,
        paddingTop: 15,
    },
    imageSingle: {
        aspectRatio: 1,
        width: '100%',
        resizeMode: 'cover',
    },
    imageMultiple: {
        width: sizes.width / 2 - 5,
        aspectRatio: 1,
        resizeMode: 'cover',
    },
    moreImgBtn: {
        position: 'absolute',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        right: 0,
        width: sizes.width / 2 - 5,
        height: sizes.width / 2 - 5,
        backgroundColor: '#00000053',
        // opacity: 0.5,
    },
    moreImgBtnText: {
        fontSize: sizes.heading,
        color: '#ccc',
    },
    reactionRecordContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 25,
        paddingHorizontal: 15,
        marginVertical: 5,
    },
    reactionBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        minHeight: 50,
        backgroundColor: colors.main,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    reactionBtn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
