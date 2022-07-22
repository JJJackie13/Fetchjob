import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableHighlight, Alert} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {colors} from '../../constants';
import {IRootState} from '../../store/store';
import {ReportType} from '../../types/enums';
import {API_URL} from '@env';

const CompanyProfileNonOwnerBottomSheet: React.FC<{
    companyId: number;
    isFollower: boolean;
    followStateHandler: (isFollowed: boolean) => void;
}> = ({companyId, isFollower, followStateHandler}) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList, any>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function followRequestHandler() {
        try {
            const res = await fetch(`${API_URL}/company/follow/${companyId}`, {
                method: 'put',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            if (res.ok) {
                const isFollowed = parseRes.isFollower;
                followStateHandler(isFollowed);
                Toast.show({
                    type: 'success',
                    text1: isFollowed ? 'Followed' : 'Unfollowed',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: parseRes.message,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Request failed',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <View style={styles.contentContainer}>
            {/* CONNECT BUTTON */}
            {companyId ? (
                <TouchableHighlight
                    disabled={isLoading}
                    style={{width: '100%'}}
                    underlayColor="#ccc"
                    onPress={() => {
                        setIsLoading(true);
                        followRequestHandler();
                    }}>
                    <View style={styles.btnContainer}>
                        <MaterialCommunityIcon
                            style={styles.btnIcon}
                            name={
                                isFollower ? 'text-box-minus' : 'text-box-plus'
                            }
                            size={25}
                            color={colors.icon}
                        />
                        <Text>{isFollower ? 'Unfollow' : 'Follow'}</Text>
                    </View>
                </TouchableHighlight>
            ) : null}
            {/* REPORT BUTTON */}
            <TouchableHighlight
                style={{width: '100%'}}
                underlayColor="#ccc"
                onPress={() => {
                    navigation.navigate('Report', {
                        id: companyId,
                        type: ReportType.COMPANY,
                    });
                }}>
                <View style={styles.btnContainer}>
                    <MaterialIcon
                        style={styles.btnIcon}
                        name="report"
                        size={25}
                        color={colors.icon}
                    />
                    <Text>Report company</Text>
                </View>
            </TouchableHighlight>
            {/* TODO: FOR DEBUG NEEDA REMOVE */}
            {/* <Text>{targetUserId}</Text> */}
        </View>
    );
};

export default CompanyProfileNonOwnerBottomSheet;

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        alignItems: 'center',
    },
    btnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 15,
        height: 45,
    },
    btnIcon: {
        marginRight: 10,
    },
});
