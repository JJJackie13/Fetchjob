import React, {useEffect, useCallback} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableHighlight,
    ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {usePost} from '../contexts/PostContext';
import {RootStackParamList} from '../types/types';
import Post from '../components/Posts/Post';
import LoadingPost from '../components/Posts/LoadingPost';
import {colors, FONTS, sizes} from '../constants';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({navigation}) => {
    const {
        posts,
        isAllFetched,
        isLoading,
        loadingExtraPost,
        setLoadingExtraPost,
        fetchThread,
    } = usePost();

    function renderPostButtonContainer() {
        return (
            <TouchableHighlight
                style={styles.createPostContainer}
                onPress={() => navigation.navigate('Post', {})}
                underlayColor="#dbd7d7">
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <MaterialIcons
                        name="post-add"
                        size={25}
                        color={colors.minorText}
                    />
                    <Text
                        style={{
                            ...FONTS.minor,
                            fontWeight: 'bold',
                            marginLeft: 10,
                            color: colors.icon,
                        }}>
                        Post something...
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    const renderPost = useCallback(({item}) => <Post data={item} />, []);

    function renderPostList() {
        return (
            <>
                {isLoading ? (
                    <>
                        <LoadingPost />
                        <LoadingPost />
                    </>
                ) : (
                    <FlatList
                        overScrollMode="never"
                        removeClippedSubviews={true}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={10}
                        data={posts}
                        // ListHeaderComponent={renderPostButtonContainer}
                        ListFooterComponent={renderExtraLoadingIndicator}
                        // stickyHeaderIndices={[0]}
                        // extraData={extraPosts}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={renderPost}
                        refreshing={isLoading}
                        onRefresh={() => {
                            // setIsLoading(true);
                            fetchThread();
                        }}
                        onEndReachedThreshold={0.2}
                        onEndReached={() => {
                            if (
                                !isLoading &&
                                !isAllFetched &&
                                !loadingExtraPost
                            ) {
                                setLoadingExtraPost(true);
                                fetchThread(false);
                            }
                        }}
                    />
                )}
            </>
        );
    }

    function renderNoPostCard() {
        return (
            <View style={styles.noPostCard} pointerEvents="none">
                <MaterialCommunityIcon
                    name="arrow-down-drop-circle-outline"
                    size={50}
                    color={colors.icon}
                />
                <Text style={{...FONTS.paragraph, color: colors.icon}}>
                    No post yet...Pull to refresh
                </Text>
            </View>
        );
    }

    const renderExtraLoadingIndicator = useCallback(() => {
        return (
            <>
                {loadingExtraPost ? (
                    <View
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: 5,
                        }}>
                        <ActivityIndicator size="small" color={colors.icon} />
                    </View>
                ) : null}
            </>
        );
    }, [loadingExtraPost]);

    useEffect(() => {
        let isMount = true;
        if (isMount) {
            fetchThread();
        }
        return () => {
            isMount = false;
        };
    }, []);

    return (
        <View style={styles.container}>
            {renderPostButtonContainer()}
            {posts.length === 0 && renderNoPostCard()}
            {renderPostList()}
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    createPostContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 50,
        backgroundColor: colors.main,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        // elevation: 8,
    },
    postListContainer: {
        width: sizes.width,
        // paddingVertical: 10,
        backgroundColor: colors.tertiary,
    },
    noPostCard: {
        position: 'absolute',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: sizes.height * 0.2,
        minHeight: 150,
        width: sizes.width - 10,
        marginHorizontal: 5,
        marginTop: 5,
        borderRadius: 5,
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },
});
