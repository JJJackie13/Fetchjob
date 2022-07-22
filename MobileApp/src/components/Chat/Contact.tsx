import React from 'react';
import {StyleSheet, Text, View, ImageBackground, Pressable} from 'react-native';
import {useNavigation, NavigationProp} from '@react-navigation/core';
import {colors, FONTS, images, sizes, formats} from '../../constants';
import {IContactProps, RootStackParamList} from '../../types/types';
import {format} from 'fecha';
import {API_URL} from '@env';

const Contact: React.FC<{data: IContactProps}> = ({data}) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const roomId = parseInt(data.room_id);
    const avatar = data.counterpart_avatar
        ? formats.httpFormat.test(data.counterpart_avatar)
            ? {
                  uri: `${data.counterpart_avatar}`,
              }
            : {
                  uri: `${API_URL}/${data.counterpart_avatar}`,
              }
        : images.noAvatar;
    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                // console.log('navigate to ', roomId);
                navigation.navigate('Chat', {
                    roomId: roomId,
                    counterpartName: data.counterpart_name,
                    counterpartId: parseInt(data.counterpart_id),
                });
            }}>
            <View style={styles.leftPart}>
                <ImageBackground
                    source={avatar}
                    style={styles.avatar}
                    imageStyle={styles.avatar}
                    resizeMode="cover">
                    <View
                        style={{
                            ...styles.onlineStatus,
                            backgroundColor: data.is_online
                                ? colors.online
                                : colors.icon,
                        }}
                    />
                </ImageBackground>
            </View>
            <View style={styles.rightPart}>
                <View style={styles.rightUpperPart}>
                    <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                        {data.counterpart_name}
                    </Text>
                    <Text style={{...FONTS.caption}}>
                        {format(new Date(data.created_at), 'DD MMM')}
                    </Text>
                </View>
                <View style={styles.rightLowerPart}>
                    <View style={styles.rightLowerLeft}>
                        <Text
                            numberOfLines={2}
                            style={{...FONTS.caption, color: colors.paragraph}}>
                            {data.content}
                        </Text>
                    </View>
                    {parseInt(data.unread_number) > 0 && (
                        <View style={styles.unreadIndicatorContainer}>
                            <View style={styles.unreadIndicator}>
                                <Text
                                    style={{
                                        ...FONTS.caption,
                                        color: '#fff',
                                    }}>
                                    {data.unread_number}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
};

export default Contact;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: sizes.height * 0.1,
        backgroundColor: colors.main,
        paddingHorizontal: 10,
    },
    leftPart: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '20%',
        // backgroundColor: 'red',
    },
    avatarContainer: {
        position: 'relative',
        width: '90%',
        height: '90%',
        aspectRatio: 1,
        overflow: 'hidden',
        borderRadius: sizes.width * 0.2,
    },
    avatar: {
        width: '90%',
        height: '90%',
        borderRadius: sizes.width * 0.2,
        aspectRatio: 1,
    },
    onlineStatus: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 12,
        width: 12,
        borderRadius: 10,
        // backgroundColor: '#39FF14',
        elevation: 5,
        shadowColor: '#fff',
        shadowRadius: 2,
    },
    rightPart: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '80%',
        borderBottomColor: '#cccccc71',
        borderBottomWidth: 1,
    },
    rightUpperPart: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '35%',
        width: '100%',
        // backgroundColor: 'yellow',
    },
    rightLowerPart: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        height: '65%',
        width: '95%',
        // backgroundColor: 'green',
    },
    rightLowerLeft: {
        width: '85%',
    },
    unreadIndicatorContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100%',
        width: '15%',
        // backgroundColor: 'yellow',
    },
    unreadIndicator: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.highlight,
    },
});
