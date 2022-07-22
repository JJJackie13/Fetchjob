import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {format} from 'fecha';
import {colors, FONTS, images, sizes, formats} from '../../constants';
import {Avatar} from 'react-native-paper';
import {API_URL} from '@env';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const ConversationBubble: React.FC<any> = ({userId, data, index}) => {
    let senderId = data.user._id;
    let fontColor = senderId === userId ? '#fff' : colors.paragraph;
    let avatar = data.user.avatar
        ? formats.httpFormat.test(data.user.avatar)
            ? {
                  uri: `${data.user.avatar}`,
              }
            : {
                  uri: `${API_URL}/${data.user.avatar}`,
              }
        : images.noAvatar;
    return (
        <View
            style={{
                ...styles.container,
                flexDirection: senderId === userId ? 'row-reverse' : 'row',
            }}>
            {senderId !== userId && (
                <View style={styles.avatarContainer}>
                    {index === 0 ? (
                        <Avatar.Image
                            source={avatar}
                            size={sizes.width * 0.1}
                        />
                    ) : null}
                </View>
            )}
            <View
                style={{
                    ...styles.bubble,
                    backgroundColor:
                        senderId === userId ? colors.highlight : '#f1efef',
                }}>
                <Text
                    style={{
                        ...FONTS.minor,
                        color: fontColor,
                    }}>
                    {data.text}
                </Text>
                <View
                    style={{
                        ...styles.bubbleBottom,
                        flexDirection:
                            senderId === userId ? 'row-reverse' : 'row',
                    }}>
                    <View style={styles.tickContainer}>
                        {senderId === userId ? (
                            !data.pending ? (
                                <>
                                    <Text
                                        style={{
                                            ...FONTS.caption,
                                            color: data.read
                                                ? 'blue'
                                                : fontColor,
                                        }}>
                                        ✓
                                    </Text>
                                    <Text
                                        style={{
                                            ...FONTS.caption,
                                            color: data.read
                                                ? 'blue'
                                                : fontColor,
                                        }}>
                                        ✓
                                    </Text>
                                </>
                            ) : (
                                <MaterialCommunityIcon
                                    name="clock-time-ten-outline"
                                    size={sizes.caption}
                                    color={fontColor}
                                />
                            )
                        ) : null}
                    </View>
                    <Text
                        style={{
                            ...FONTS.caption,
                            marginHorizontal: 5,
                            color: fontColor,
                        }}>
                        {format(new Date(data.createdAt), 'hh:mmA')}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default ConversationBubble;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        width: sizes.width,
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: 70,
        padding: 5,
    },
    avatarContainer: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
        width: sizes.width * 0.15,
    },
    bubble: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        borderRadius: 15,
        minWidth: sizes.width * 0.25,
        height: '100%',
        maxWidth: sizes.width * (1 - 0.15 - 0.15) - 10,
    },
    bubbleBottom: {
        display: 'flex',
        marginTop: 10,
    },
    tickContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
});
