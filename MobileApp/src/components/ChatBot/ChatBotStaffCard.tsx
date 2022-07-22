import React, {useState, useRef, useMemo} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IonIcon from 'react-native-vector-icons/Ionicons';
import * as RootNavigation from '../../hooks/RootNavigation';

import {colors, FONTS, images, sizes, formats} from '../../constants';
import {RootStackParamList} from '../../types/types';
import {API_URL} from '@env';

interface ChatBotStaffCardProps {
    id: number;
    avatar: string;
    banner: string;
    company_name: string;
    first_name: string;
    headline: string;
    last_name: string;
}

type UserProfileNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'UserProfile'
>;

const ChatBotStaffCard: React.FC<{
    data: ChatBotStaffCardProps;
    snapChatBotBtmSheet: () => void;
}> = ({data, snapChatBotBtmSheet}) => {
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
                <View style={styles.avatar}>
                    <Image
                        style={{width: '100%', height: '100%'}}
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
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <View style={styles.lowerPart}>
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
                            textAlign: 'center',
                        }}
                        numberOfLines={2}>
                        {data.headline}
                    </Text>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginBottom: 5,
                            paddingHorizontal: 5,
                            width: '100%',
                            flexWrap: 'wrap',
                        }}>
                        <Text
                            style={{
                                ...FONTS.caption,
                                textAlign: 'center',
                            }}
                            numberOfLines={2}>
                            <IonIcon
                                name="md-business-sharp"
                                size={15}
                                color={colors.icon}
                                style={{marginRight: 8}}
                            />{' '}
                            {data.company_name}
                        </Text>
                    </View>
                </View>
                <TouchableHighlight
                    style={styles.viewProfileBtn}
                    underlayColor={colors.tertiary}
                    onPress={() => {
                        snapChatBotBtmSheet();
                        RootNavigation.navigate('UserProfile', {
                            userId: data.id,
                        });
                    }}>
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
    );
};

export default ChatBotStaffCard;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: colors.main,
        height: sizes.height * 0.33,
        width: sizes.width * 0.5 - 15,
        // marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 10,
        elevation: 5,
        overflow: 'hidden',
    },
    headingPart: {
        height: sizes.height * 0.08,
    },
    moreFnBtn: {
        position: 'absolute',
        right: 5,
        top: 5,
        padding: 3,
        borderRadius: 10,
        backgroundColor: '#0000003d',
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
        left: (sizes.width * 0.5 - 15) / 2,
        transform: [
            {translateX: -(sizes.height * 0.08) / 2},
            {translateY: (sizes.height * 0.08) / 2},
        ],
        overflow: 'hidden',
    },
    lowerPart: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: (sizes.height * 0.08) / 2,
    },
    viewProfileBtn: {
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
        flex: 1,
        elevation: 15,
        marginHorizontal: 5,
        backgroundColor: colors.main,
        borderRadius: 10,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
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
