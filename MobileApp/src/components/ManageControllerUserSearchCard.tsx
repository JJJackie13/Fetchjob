import React from 'react';
import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import {Avatar} from 'react-native-paper';
import {colors, FONTS, formats, images, sizes} from '../constants';
import {API_URL} from '@env';
import { CompanyControlLevel } from '../types/enums';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const ManageControllerUserSearchCard: React.FC<any> = ({data, companyId, refresh, setListOpen}) => {
    const avatar = data.avatar
        ? formats.httpFormat.test(data.avatar)
            ? {
                  uri: `${data.avatar}`,
              }
            : {
                  uri: `${API_URL}/${data.avatar}`,
              }
        : images.noAvatar;

    async function addControllerHandler(){
        try {
            const res = await fetch(`${API_URL}/company/controller/${companyId}`,{
                method:"post",
                headers:{
                    Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({targetUserId: data.userid})
            })
            const parseRes = await res.json()
            if(res.ok){
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                });
                refresh()
                setListOpen(false)
            } else {
                Toast.show({
                    type: 'error',
                    text1: parseRes.message,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: "Failed",
            });
        }
    }

    const changeLevelAlert = () =>
    Alert.alert(
        "Confirm",
        `Add ${data.first_name} ${data.last_name} as ${CompanyControlLevel[1]}?`,
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel"
          },
          { text: "OK", onPress: () => addControllerHandler() }
        ]
      );
    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                changeLevelAlert()
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

export default ManageControllerUserSearchCard;

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
