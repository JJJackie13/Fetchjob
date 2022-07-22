import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {colors, sizes} from '../../constants';

const LoadingPost: React.FC<any> = () => {
    return (
        <View style={styles.post}>
            <SkeletonPlaceholder
                backgroundColor={colors.main}
                highlightColor="#ccc"
                speed={1000}>
                <SkeletonPlaceholder.Item
                    flexDirection="row"
                    justifyContent="center">
                    <SkeletonPlaceholder.Item
                        width={sizes.width - 10}
                        flexDirection="column"
                        justifyContent="space-between">
                        <View style={styles.postUpperPartContainer}>
                            <View style={styles.postHeaderContainer}>
                                <View style={styles.postAvatar} />
                                <View style={styles.postHeaderRightSection}>
                                    <View style={styles.posterDetailsContainer}>
                                        <SkeletonPlaceholder.Item
                                            width={sizes.width * 0.3}
                                            height={10}
                                            borderRadius={50}
                                            marginBottom={5}
                                        />
                                        <SkeletonPlaceholder.Item
                                            width={sizes.width * 0.5}
                                            height={10}
                                            borderRadius={50}
                                            marginBottom={5}
                                        />
                                        <SkeletonPlaceholder.Item
                                            width={sizes.width * 0.2}
                                            height={10}
                                            borderRadius={50}
                                            marginBottom={5}
                                        />
                                    </View>
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <View
                                            style={{
                                                width: 5,
                                                height: 5,
                                                borderRadius: 50,
                                            }}
                                        />
                                        <View
                                            style={{
                                                width: 5,
                                                height: 5,
                                                borderRadius: 50,
                                            }}
                                        />
                                        <View
                                            style={{
                                                width: 5,
                                                height: 5,
                                                borderRadius: 50,
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.postContentContainer}>
                                <View style={styles.postContentText}>
                                    <View
                                        style={{
                                            width: sizes.width * 0.8,
                                            height: 10,
                                            borderRadius: 50,
                                            marginBottom: 5,
                                        }}
                                    />
                                    <View
                                        style={{
                                            width: sizes.width * 0.8,
                                            height: 10,
                                            borderRadius: 50,
                                            marginBottom: 5,
                                        }}
                                    />
                                    <View
                                        style={{
                                            width: sizes.width * 0.8,
                                            height: 10,
                                            borderRadius: 50,
                                            marginBottom: 5,
                                        }}
                                    />
                                </View>
                                <View style={styles.postContentImage}>
                                    <View
                                        style={{
                                            width: sizes.width * 0.9,
                                            height: 195,
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.reactionRecordContainer}>
                            <View
                                style={{
                                    width: 40,
                                    height: 10,
                                    borderRadius: 50,
                                }}
                            />
                            <View
                                style={{
                                    width: 40,
                                    height: 10,
                                    borderRadius: 50,
                                }}
                            />
                        </View>
                        <SkeletonPlaceholder.Item
                            width={sizes.width * 0.9}
                            height={2}
                            marginBottom={5}
                        />
                        <SkeletonPlaceholder.Item
                            flexDirection="row"
                            justifyContent="space-around">
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 5,
                                    marginBottom: 10,
                                }}
                            />
                            <View
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 5,
                                    marginBottom: 10,
                                }}
                            />
                        </SkeletonPlaceholder.Item>
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        </View>
    );
};

export default LoadingPost;

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
        borderRadius: 60 / 2,
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
        justifyContent: 'space-around',
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
});
