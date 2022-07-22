import React from 'react';
import {StyleSheet, Text, View, Pressable, ImageBackground} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {format} from 'fecha';
import {Avatar} from 'react-native-paper';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {colors, FONTS, formats, images, sizes} from '../../constants';
import {API_URL} from '@env';

const UserSearchCard: React.FC<any> = ({data}) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const avatar = data.avatar
        ? formats.httpFormat.test(data.avatar)
            ? {
                  uri: `${data.avatar}`,
              }
            : {
                  uri: `${API_URL}/${data.avatar}`,
              }
        : images.noAvatar;
    const roomId = data.chatroom_id ? data.chatroom_id : undefined;
    const counterpartName = `${data.first_name} ${data.last_name}`;
    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                navigation.navigate('Chat', {
                    roomId: roomId,
                    counterpartName: counterpartName,
                    counterpartId: parseInt(data.userid),
                });
            }}>
            <View style={styles.leftPart}>
                <Avatar.Image size={sizes.height * 0.05} source={avatar} />
            </View>
            <View style={styles.rightPart}>
                <View style={styles.rightUpperPart}>
                    <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                        {data.first_name} {data.last_name}
                    </Text>
                    <Text style={{...FONTS.caption}}>
                        {/* {format(new Date(data.created_at), 'DD MMM')} */}
                    </Text>
                </View>
                <View style={styles.rightLowerPart}>
                    <Text
                        numberOfLines={1}
                        style={{...FONTS.caption, color: colors.paragraph}}>
                        {data.headline}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default UserSearchCard;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: sizes.height * 0.06,
        backgroundColor: colors.main,
        paddingHorizontal: 10,
    },
    leftPart: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '15%',
        // backgroundColor: 'red',
    },
    rightPart: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '85%',
        borderBottomColor: '#cccccc71',
        borderBottomWidth: 1,
    },
    rightUpperPart: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // height: '35%',
        width: '100%',
        // backgroundColor: 'yellow',
    },
    rightLowerPart: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        // height: '65%',
        width: '90%',
        // backgroundColor: 'green',
    },
});
