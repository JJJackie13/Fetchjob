import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    TextInput,
    Image,
    FlatList,
    Keyboard,
    Text,
    ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {RootStackParamList} from '../types/types';
import MinorNavBar from '../components/MinorNavBar';
import LoadingComponent from '../components/LoadingComponent';
import Post from '../components/Posts/Post';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

import {API_URL} from '@env';
import type {PostProps} from '../types/types';
import {colors, FONTS, formats, images, sizes} from '../constants';
import {IRootState} from '../store/store';
import Comment from '../components/Posts/Comment';
import Subcomment from '../components/Posts/Subcomment';

type Props = NativeStackScreenProps<RootStackParamList, 'PostComment'>;

const PostCommentScreen: React.FC<Props> = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [postData, setPostData] = useState<PostProps | null>(null);
    const [commentsData, setCommentsData] = useState([]);
    const [renderedComments, setRenderedComments] = useState([]);
    const [renderCount, setRenderCount] = useState<number>(1);
    const [commentInput, setCommentInput] = useState<string>('');
    const [replyCommentId, setReplyCommentId] = useState<number | null>(null);
    const [inputLoading, setInputLoading] = useState(false);
    const avatar = useSelector((state: IRootState) => state.auth.user?.avatar);
    const inputRef = useRef<TextInput>(null);

    async function fetchPostData() {
        try {
            const res = await fetch(
                `${API_URL}/thread/by-post/${route.params.id}`,
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
                setRenderCount(1);
                setPostData(parseRes.data.post);
                setCommentsData(parseRes.data.comments);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function submitReplyHandler() {
        try {
            let commentId = replyCommentId;
            if (commentInput == '') {
                console.log('failed');
                return;
            }
            if (!commentId) {
                console.log('failed');
                return;
            }
            if (commentInput.length > 400) {
                console.log('failed');
                Toast.show({
                    type: 'error',
                    text1: 'Exceeded word limit (400 words)',
                });
                return;
            }
            const data = JSON.stringify({
                comment_id: commentId,
                content: commentInput,
            });
            const res = await fetch(`${API_URL}/thread/subcomment`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
                body: data,
            });
            if (res.ok) {
                setReplyCommentId(null);
                setCommentInput('');
                Keyboard.dismiss();
                fetchPostData();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setInputLoading(false);
        }
    }

    async function submitCommentHandler() {
        try {
            let postId = postData?.id;
            if (commentInput == '') {
                return;
            }
            if (!postId || isNaN(parseInt(postId))) {
                return;
            }
            if (commentInput.length > 400) {
                Toast.show({
                    type: 'error',
                    text1: 'Exceeded word limit (400 words)',
                });
                return;
            }
            const data = JSON.stringify({
                post_id: postId,
                content: commentInput,
            });
            const res = await fetch(`${API_URL}/thread/comment`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
                body: data,
            });
            if (res.ok) {
                setCommentInput('');
                Keyboard.dismiss();
                fetchPostData();
            }
        } catch (error) {
            console.log(error);
        } finally {
            setInputLoading(false);
        }
    }

    function setUpReply(commendId: any) {
        setCommentInput('');
        setReplyCommentId(commendId);
        inputRef.current?.focus();
    }

    function renderComments() {
        if (commentsData.length > renderedComments.length) {
            let limit = 5;
            setRenderedComments(
                commentsData.filter((_, i) => i < limit * renderCount),
            );
            setRenderCount((prev) => prev + 1);
        }
        setIsLoading(false);
    }

    const renderListComment = useCallback(({item, index}) => {
        return item.subcomment_id ? (
            <Subcomment
                key={item.id + index}
                data={item}
                setUpReply={setUpReply}
            />
        ) : (
            <Comment
                key={item.id + index}
                data={item}
                setUpReply={setUpReply}
            />
        );
    }, []);

    const renderEmptyComment = useCallback(() => {
        return (
            <View style={styles.emptyCommentCard}>
                <Text style={{...FONTS.minor, color: colors.icon}}>
                    No comment yet... Be the first one{' '}
                    <AntDesign
                        name="smileo"
                        color={colors.icon}
                        size={sizes.secondary}
                    />
                </Text>
            </View>
        );
    }, []);

    const LeftComponent = () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <IonIcon name="chevron-back" size={25} />
        </TouchableOpacity>
    );

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            fetchPostData();
            Keyboard.addListener('keyboardDidHide', () => {
                if (replyCommentId) {
                    setCommentInput('');
                }
                setReplyCommentId(null);
            });
        }
        () => {
            Keyboard.removeAllListeners('keyboardDidHide');
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        renderComments();
    }, [commentsData]);

    return (
        <View style={styles.container}>
            <MinorNavBar LeftComponent={LeftComponent} />
            {!isLoading && postData ? (
                <View style={styles.mainContentContainer}>
                    <FlatList
                        overScrollMode="never"
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={10}
                        ListHeaderComponent={
                            <Post
                                data={postData}
                                style={{
                                    elevation: 0,
                                    borderRadius: 0,
                                    marginBottom: 5,
                                }}
                            />
                        }
                        data={renderedComments}
                        renderItem={renderListComment}
                        ListEmptyComponent={renderEmptyComment}
                        refreshing={isLoading}
                        onRefresh={() => {
                            setRenderedComments([]);
                            fetchPostData();
                        }}
                        onEndReachedThreshold={0.1}
                        onEndReached={() => {
                            renderComments();
                        }}
                        extraData={renderCount}
                    />
                    <View style={styles.inputContainer}>
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
                                        : images.noAvatar
                                }
                            />
                        </View>
                        <View>
                            {replyCommentId && (
                                <Text
                                    style={{
                                        ...FONTS.caption,
                                        marginBottom: 2,
                                        fontWeight: 'bold',
                                        color: colors.highlight,
                                    }}>
                                    Reply:
                                </Text>
                            )}
                            <TextInput
                                ref={inputRef}
                                style={styles.inputBox}
                                multiline
                                placeholder="Leave your comment"
                                autoFocus
                                value={commentInput}
                                onChangeText={setCommentInput}
                            />
                        </View>
                        <View style={styles.sendBtnContainer}>
                            <TouchableOpacity
                                onPress={() => {
                                    setInputLoading(true);
                                    if (
                                        !replyCommentId ||
                                        replyCommentId === null
                                    ) {
                                        submitCommentHandler();
                                    } else {
                                        submitReplyHandler();
                                    }
                                }}
                                disabled={
                                    inputLoading || commentInput.trim() === ''
                                }>
                                {inputLoading ? (
                                    <View
                                        style={styles.sendBtnLoadingIndicator}>
                                        <ActivityIndicator
                                            size="small"
                                            color={colors.main}
                                        />
                                    </View>
                                ) : (
                                    <MaterialCommunityIcons
                                        name="send-circle"
                                        size={35}
                                        color={
                                            commentInput.trim() === ''
                                                ? colors.icon
                                                : colors.button
                                        }
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ) : (
                <LoadingComponent />
            )}
        </View>
    );
};

export default PostCommentScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    mainContentContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: colors.main,
        elevation: 10,
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: sizes.width * 0.1,
        height: '100%',
        borderRadius: (sizes.width * 0.1) / 2,
        marginStart: 10,
        marginEnd: 10,
    },
    avatarImage: {
        width: sizes.width * 0.1,
        height: sizes.width * 0.1,
        borderRadius: (sizes.width * 0.1) / 2,
        resizeMode: 'cover',
    },
    inputBox: {
        backgroundColor: colors.tertiary,
        borderRadius: 5,
        paddingHorizontal: 10,
        ...FONTS.minor,
        width: sizes.width * 0.7,
    },
    sendBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: sizes.width * 0.1,
        height: '100%',
    },
    sendBtnLoadingIndicator: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        height: 35,
        borderRadius: 18,
        backgroundColor: colors.highlight,
    },
    emptyCommentCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: sizes.height * 0.1,
        backgroundColor: colors.main,
        marginHorizontal: 5,
        borderRadius: 5,
    },
});
