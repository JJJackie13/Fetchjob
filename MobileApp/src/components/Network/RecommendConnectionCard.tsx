import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight,Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IonIcon from "react-native-vector-icons/Ionicons"
import {colors, FONTS, images, sizes, formats} from '../../constants';
import {RootStackParamList} from '../../types/types';
import {API_URL} from '@env';

type UserProfileNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'UserProfile'
>;

const RecommendConnectionCard: React.FC<{
    data?: any;
}> = ({data}) => {
    const navigation = useNavigation<UserProfileNavigationProp>();

    return (
        <View style={styles.container}>
            <View style={styles.headingPart}>
                <Image
                    style={styles.banner}
                    source={
                        data.banner
                            ? formats.httpFormat.test(data.banner)
                                ? {
                                    uri: `${data.banner}`,
                                }
                                : {
                                    uri: `${API_URL}/${data.banner}`,
                                }
                            : images.noBanner
                    }
                    resizeMode="cover"
                    />
                <Pressable style={styles.avatar} onPress={()=>navigation.navigate("UserProfile",{userId:data.counterpart_id})}>
                    <Image
                        style={{width: '100%', height: '100%', borderRadius: sizes.height * 0.08 /2,}}
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
                </Pressable>
            </View>
            <View
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: sizes.width * 0.05,
                }}>
                <View style={styles.lowerLeftPart}>
                    <Text
                        style={{
                            ...FONTS.minor,
                            fontWeight: 'bold',
                            marginBottom: 5,
                        }}
                        numberOfLines={2}>
                        {data.first_name} {data.last_name}
                    </Text>
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.paragraph,
                            marginBottom: 5,
                        }}
                        numberOfLines={2}>
                        {data.headline}
                    </Text>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginBottom: 5,
                            width: '100%',
                            flexWrap: 'wrap',
                        }}>
                        <Text
                            style={{
                                ...FONTS.caption,
                            }}
                            numberOfLines={2}>
                            {data.name && data.name}
                        </Text>
                    </View>
                </View>
                <View style={styles.lowerRightPart}>
                    <TouchableHighlight
                        style={styles.viewProfileBtn}
                        underlayColor={colors.tertiary}
                        onPress={() =>
                            navigation.navigate('UserProfile', {
                                userId: parseInt(data.counterpart_id),
                            })
                        }>
                        <Text
                            style={{
                                ...FONTS.caption,
                                color: colors.button,
                                fontWeight: 'bold',
                            }}>
                            View Profile
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    );
};

export default RecommendConnectionCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        position: 'relative',
        backgroundColor: colors.main,
        maxHeight: sizes.height * 0.3,
        width: sizes.width - 20,
        marginBottom: 5,
        borderRadius: 10,
        elevation: 1,
        overflow: 'hidden',
    },
    headingPart: {
        height: sizes.height * 0.08,
        marginBottom: 20,
    },
    banner: {
        height: '100%',
    },
    avatar: {
        height: sizes.height * 0.08,
        width: sizes.height * 0.08,
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#cccccc22',
        borderRadius: sizes.height * 0.1,
        left: (sizes.width * 0.5 - 15) / 3,
        transform: [
            {translateX: -(sizes.height * 0.08) / 2},
            {translateY: (sizes.height * 0.08) / 2},
        ],
        overflow: 'hidden',
    },
    lowerPart: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    lowerLeftPart: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    lowerRightPart: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '0%',
    },
    viewProfileBtn: {
        position: 'absolute',
        top: -60,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: (sizes.width * 0.5) / 2,
        marginVertical: 10,
        padding: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.button,
    },
    bottomSheet: {
        flex: 1,
        elevation: 15,
        marginHorizontal: 5,
        backgroundColor: colors.main,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        zIndex: 1000,
    },
    bottomSheetHandle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingRight: 10,
    },
});
