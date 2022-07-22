import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useNavigation} from '@react-navigation/core';
import {NavigationProp} from '@react-navigation/core';

import {RootStackParamList} from '../../types/types';
import {API_URL} from '@env';
import {colors, sizes, formats, images, FONTS} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserProfileProp = NavigationProp<RootStackParamList, 'UserProfile'>;

const Subcomment: React.FC<any> = ({data, setUpReply}) => {
    const [isLiked, setIsLiked] = useState<boolean>(data.user_liked);
    const [likedNumber, setLikedNumber] = useState<number>(
        parseInt(data.like_number),
    );
    const navigation = useNavigation<UserProfileProp>();

    async function likeCommentHandler() {
        try {
            const res = await fetch(
                `${API_URL}/thread/subcomment/like/${data.subcomment_id}`,
                {
                    method: 'put',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            if (res.ok) {
                setLikedNumber((prev) => (isLiked ? prev - 1 : prev + 1));
                setIsLiked((prev) => !prev);
            }
        } catch (error) {
            console.log(error);
        }
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

        if (years >= 1) {
            return years + ` yr${years > 1 ? 's' : ''}`;
        } else if (months >= 1) {
            return months + ` mth${months > 1 ? 's' : ''}`;
        } else if (days >= 1) {
            return days + ` day${days > 1 ? 's' : ''}`;
        } else if (hours >= 1) {
            return hours + ` hr${hours > 1 ? 's' : ''}`;
        } else if (minutes >= 1) {
            return minutes + ` min${minute > 1 ? 's' : ''}`;
        } else {
            return `Just now`;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.subcontainer}>
                <View style={styles.upperPart}>
                    <View style={styles.avatarContainer}>
                        <Pressable
                            onPress={() =>
                                navigation.navigate('UserProfile', {
                                    userId: parseInt(data.user_id),
                                })
                            }>
                            <Image
                                style={styles.avatarImage}
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
                            />
                        </Pressable>
                    </View>
                    <View style={styles.commentContainer}>
                        <View style={styles.posterDetailsContainer}>
                            <View style={{display: 'flex'}}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        ...FONTS.minor,
                                        fontWeight: 'bold',
                                    }}>
                                    {data.first_name} {data.last_name}
                                </Text>
                                <Text
                                    style={{
                                        ...FONTS.caption,
                                        color: colors.paragraph,
                                    }}
                                    numberOfLines={2}>
                                    {data.headline ? data.headline : ''}
                                </Text>
                            </View>
                            <View
                                style={{display: 'flex', flexDirection: 'row'}}>
                                <Text
                                    numberOfLines={1}
                                    style={{
                                        ...FONTS.caption,
                                    }}>
                                    {calcDate(
                                        new Date(),
                                        new Date(data.created_at),
                                    )}
                                </Text>
                                <TouchableOpacity style={{marginLeft: 5}}>
                                    <MaterialCommunityIcons
                                        name="dots-horizontal"
                                        size={20}
                                        color={colors.icon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.commentPart}>
                            <Text
                                style={{
                                    ...FONTS.caption,
                                    color: colors.paragraph,
                                }}>
                                {data.content}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.lowerPart}>
                    <View style={styles.likePart}>
                        <TouchableOpacity onPress={likeCommentHandler}>
                            <Text
                                style={{
                                    ...FONTS.caption,
                                    color: isLiked
                                        ? colors.button
                                        : colors.icon,
                                }}>
                                {isLiked ? 'Liked' : 'Like'} • {likedNumber}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {likedNumber > 0 && (
                        <Image
                            source={images.likeIconGreen}
                            style={{width: 20, height: 20, marginRight: 5}}
                            resizeMode="contain"
                        />
                    )}
                    <Text> | </Text>
                    <View style={styles.replyPart}>
                        <TouchableOpacity
                            onPress={() => setUpReply(data.comment_id)}>
                            <Text style={{...FONTS.caption}}>Reply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Subcomment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: sizes.width - 10,
        marginHorizontal: 5,
        backgroundColor: colors.main,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    subcontainer: {
        // backgroundColor: 'red',
        width: '85%',
    },
    upperPart: {
        display: 'flex',
        flexDirection: 'row',
        minHeight: 50,
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: sizes.width * 0.08 * 0.85,
        height: '100%',
        paddingTop: 10,
        borderRadius: (sizes.width * 0.1) / 2,
        // marginStart: 10,
        marginEnd: 10,
    },
    avatarImage: {
        width: sizes.width * 0.1 * 0.85,
        height: sizes.width * 0.1 * 0.85,
        borderRadius: (sizes.width * 0.1 * 0.85) / 2,
        resizeMode: 'cover',
    },
    commentContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    posterDetailsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 5,
        paddingVertical: 10,
        width: (sizes.width * 0.9 - 10 - 20 - 10) * 0.85,
    },
    postContentContainer: {
        display: 'flex',
        flexDirection: 'column',
        // minHeight: 400 - 80 - 50,
    },
    postContentText: {
        position: 'relative',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    commentPart: {
        width: sizes.width * 0.75 * 0.9,
        backgroundColor: colors.tertiary,
        padding: 10,
        borderRadius: 10,
    },
    lowerPart: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 20,
        paddingLeft: sizes.width * 0.1 + 10,
        marginVertical: 5,
    },
    likePart: {marginRight: 5, display: 'flex', flexDirection: 'row'},
    replyPart: {marginLeft: 5},
});
