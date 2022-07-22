import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Post from '../Posts/Post';
import {PostProps} from '../../types/types';
import {API_URL} from '@env';
import {colors, FONTS, sizes} from '../../constants';

const ProfilePostSection: React.FC<any> = ({
    scrollRefresh,
    setScrollRefresh,
    userId,
    companyId,
}) => {
    function renderPostList() {
        const limit = 5;
        const [posts, setPosts] = useState<PostProps[]>([]);
        const [offset, setOffset] = useState<number>(0);
        const [isAllFetched, setIsAllFetched] = useState<boolean>(false);

        async function fetchThread(init: boolean = true) {
            try {
                if (init) {
                    setPosts([]);
                    setOffset(0);
                    setIsAllFetched(false);
                }
                if (isAllFetched || (!userId && !companyId)) {
                    return;
                }
                const res = await fetch(
                    `${API_URL}/thread/by-poster/${
                        userId ? userId : companyId
                    }?type=${userId ? 'user' : 'company'}`,
                    {
                        headers: {
                            Authorization: `Bearer ${await AsyncStorage.getItem(
                                'token',
                            )}`,
                        },
                    },
                );
                if (res.ok) {
                    const threads = await res.json();
                    // console.log(threads);
                    if (init) {
                        setPosts(threads);
                        // setOffset((prev) => prev + 1);
                    } else if (threads.length === 0) {
                        setIsAllFetched(true);
                    } else {
                        setPosts((prev) => {
                            return [...prev, ...threads];
                        });
                        // setOffset((prev) => prev + 1);
                    }
                } else {
                    console.log((await res.json()).message);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setScrollRefresh(false);
            }
        }

        function renderMorePost() {
            setOffset((prev) => (prev += 1));
        }

        function renderPostList() {
            return (
                <View>
                    {posts
                        .filter((_, i) => i < limit + limit * offset)
                        .map((post) => (
                            <Post key={`${post.id}-p`} data={post} />
                        ))}
                    {posts.length > 1 &&
                    limit + limit * offset < posts.length ? (
                        <TouchableOpacity
                            style={styles.showMoreBtn}
                            onPress={renderMorePost}>
                            <Text style={{color: colors.button}}>
                                Show More
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            );
        }

        function renderNoPostCard() {
            return (
                <View style={styles.noPostCard}>
                    <MaterialCommunityIcon
                        name="post-outline"
                        size={sizes.width * 0.2}
                        color={colors.icon}
                        style={{
                            padding: 15,
                            borderWidth: 1,
                            borderColor: '#ccc',
                            borderRadius: 25,
                            marginBottom: 10,
                        }}
                    />
                    <Text
                        style={{
                            ...FONTS.paragraph,
                            color: colors.icon,
                            fontWeight: 'bold',
                        }}>
                        No Post Yet
                    </Text>
                </View>
            );
        }

        useEffect(() => {
            let isMount = true;
            if (isMount) {
                fetchThread(true);
            }
            return () => {
                isMount = false;
            };
        }, []);

        useEffect(() => {
            if (scrollRefresh) {
                fetchThread(true);
            }
        }, [scrollRefresh]);

        return (
            <View>
                {posts && posts.length > 0
                    ? renderPostList()
                    : renderNoPostCard()}
            </View>
        );
    }

    return <View style={styles.container}>{renderPostList()}</View>;
};

export default ProfilePostSection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    showMoreBtn: {
        elevation: 5,
        marginVertical: 10,
        marginHorizontal: 5,
        marginTop: 5,
        height: sizes.height * 0.05,
        backgroundColor: colors.main,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    noPostCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // height: 400,
        minHeight: 300,
        width: sizes.width - 10,
        marginHorizontal: 5,
        marginTop: 5,
        borderRadius: 5,
        backgroundColor: colors.main,
        elevation: 1,
        overflow: 'hidden',
    },
});
