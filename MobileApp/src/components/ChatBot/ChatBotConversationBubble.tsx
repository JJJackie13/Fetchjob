import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {format} from 'fecha';
import {colors, FONTS, images, sizes, formats} from '../../constants';
import {Avatar} from 'react-native-paper';

import ChatBotJobCard from './ChatBotJobCard';
import ChatBotStaffCard from './ChatBotStaffCard';

const ChatBotConversationBubble: React.FC<any> = ({
    data,
    snapChatBotBtmSheet,
}) => {
    let isfromBot = !data.userId;
    let fontColor = isfromBot ? colors.paragraph : '#fff';
    let avatar = isfromBot ? images.chatbot : images.noAvatar;

    function renderJobRecommendationList() {
        return (
            <>
                {data.data.jobData.map((obj: any, i: number) => (
                    <ChatBotJobCard
                        key={i}
                        data={obj}
                        snapChatBotBtmSheet={snapChatBotBtmSheet}
                    />
                ))}
            </>
        );
    }

    function renderStaffRecommendationList() {
        return (
            <>
                {data.data.staffData.map((obj: any, i: number) => (
                    <ChatBotStaffCard
                        key={i}
                        data={obj}
                        snapChatBotBtmSheet={snapChatBotBtmSheet}
                    />
                ))}
            </>
        );
    }

    return (
        <View
            style={{
                ...styles.container,
                flexDirection: isfromBot ? 'row' : 'row-reverse',
            }}>
            {isfromBot && (
                <View style={styles.avatarContainer}>
                    <Avatar.Image source={avatar} size={sizes.width * 0.1} />
                </View>
            )}
            <View
                style={{
                    ...styles.bubble,
                    backgroundColor: isfromBot ? '#f1efef' : colors.highlight,
                }}>
                <Text
                    style={{
                        ...FONTS.minor,
                        color: fontColor,
                    }}>
                    {data.message}
                </Text>
                <View>
                    {data.data.jobData && renderJobRecommendationList()}
                    {data.data.staffData && renderStaffRecommendationList()}
                </View>
                <View
                    style={{
                        ...styles.bubbleBottom,
                        flexDirection: isfromBot ? 'row' : 'row-reverse',
                    }}>
                    <Text
                        style={{
                            ...FONTS.caption,
                            marginHorizontal: 5,
                            color: fontColor,
                        }}>
                        {format(data.createdAt, 'hh:mmA')}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default ChatBotConversationBubble;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        width: '100%',
        // width: sizes.width,
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
        width: '15%',
        // width: sizes.width * 0.15,
    },
    bubble: {
        display: 'flex',
        flexDirection: 'column',
        padding: 10,
        borderRadius: 15,
        minWidth: '25%',
        // minWidth: sizes.width * 0.25,
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
    dataCard: {
        display: 'flex',
        backgroundColor: 'red',
    },
});
