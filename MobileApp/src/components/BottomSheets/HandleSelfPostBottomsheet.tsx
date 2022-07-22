import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {colors, FONTS, sizes} from '../../constants';
import {API_URL} from '@env';

const HandleSelfPostBottomsheet: React.FC<{
    postId: number;
    navigation: any;
    closeModals?: () => any;
}> = ({postId, navigation, closeModals = () => {}}) => {
    async function deletePostHandler() {
        try {
            if (isNaN(postId)) {
                return;
            }
            console.log(postId);
            const res = await fetch(`${API_URL}/thread/post/${postId}`, {
                method: 'delete',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (res.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Post removed',
                });
                closeModals();
                //@ts-ignore
                navigation.navigate('Home');
            } else {
                Toast.show({
                    type: 'error',
                    text1: (await res.json()).message,
                });
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Failed to remove post',
            });
        }
    }

    return (
        <View style={styles.handlePostBtmSheet}>
            <TouchableHighlight
                onPress={() => {
                    closeModals();
                    navigation.navigate('Post', {
                        postId: postId,
                    });
                }}
                style={styles.handleSelfPostOption}
                underlayColor="#cccccc6f">
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <MaterialCommunityIcon
                        name="file-document-edit-outline"
                        size={30}
                        color={colors.icon}
                    />
                    <Text
                        style={{
                            ...FONTS.minor,
                            color: colors.icon,
                            fontWeight: 'bold',
                            marginLeft: 5,
                        }}>
                        Edit Post
                    </Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                onPress={() => {
                    Alert.alert('Confirm', 'Remove post', [
                        {
                            text: 'Cancel',
                            onPress: () => {},
                            style: 'cancel',
                        },
                        {
                            text: 'Confirm',
                            onPress: () => deletePostHandler(),
                        },
                    ]);
                }}
                style={styles.handleSelfPostOption}
                underlayColor="#cccccc6f">
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                    <MaterialCommunityIcon
                        name="delete-alert"
                        size={30}
                        color={colors.icon}
                    />
                    <Text
                        style={{
                            ...FONTS.minor,
                            color: colors.icon,
                            fontWeight: 'bold',
                            marginLeft: 5,
                        }}>
                        Delete Post
                    </Text>
                </View>
            </TouchableHighlight>
        </View>
    );
};

export default HandleSelfPostBottomsheet;

const styles = StyleSheet.create({
    handlePostBtmSheet: {
        display: 'flex',
        flexDirection: 'column',
    },
    handleSelfPostOption: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: sizes.width * 0.1,
        paddingVertical: 10,
    },
});
