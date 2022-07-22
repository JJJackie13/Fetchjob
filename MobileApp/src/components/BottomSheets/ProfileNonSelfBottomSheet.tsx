import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableHighlight, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import {colors} from '../../constants';
import {IRootState} from '../../store/store';
import {Relationship, ReportType} from '../../types/enums';
import {API_URL} from '@env';

const ProfileNonSelfBottomSheet: React.FC<{
    targetUserId: number;
}> = ({targetUserId}) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList, any>>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const relationship = useSelector(
        (state: IRootState) => state.user.relationship,
    );
    const [connectionBtn, setConnectionBtn] = useState(
        relationshipBtn(relationship),
    );

    async function removeConnection() {
        try {
            const res = await fetch(
                `${API_URL}/network/remove/${targetUserId}`,
                {
                    method: 'delete',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const parseRes = await res.json();

            if (res.ok) {
                const newRelationship = parseRes.relationship;
                setConnectionBtn(relationshipBtn(newRelationship));
                Toast.show({
                    type: 'success',
                    text1: 'Removed connection',
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
    async function cancelRequest() {
        try {
            const res = await fetch(
                `${API_URL}/network/remove/${targetUserId}`,
                {
                    method: 'delete',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const parseRes = await res.json();

            if (res.ok) {
                const newRelationship = parseRes.relationship;
                setConnectionBtn(relationshipBtn(newRelationship));
                Toast.show({
                    type: 'success',
                    text1: 'Cancelled connection request',
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
    async function sendRequest() {
        try {
            const res = await fetch(
                `${API_URL}/network/request/${targetUserId}`,
                {
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const parseRes = await res.json();
            if (res.ok) {
                const newRelationship = parseRes.relationship;
                setConnectionBtn(relationshipBtn(newRelationship));
                Toast.show({
                    type: 'success',
                    text1: 'Request sent',
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

    function relationshipBtn(relationship: string | undefined) {
        switch (relationship) {
            case Relationship.FRIEND:
                return {
                    message: 'Remove connection',
                    icon: 'person-add-disabled',
                    fn: () => removeConnection(),
                };
            case Relationship.REQUESTED:
                return {
                    message: 'Cancel connection request',
                    icon: 'person-add-disabled',
                    fn: () => cancelRequest(),
                };
            case Relationship.RECEIVED:
                return {
                    message: 'Send connection request',
                    icon: 'person-add-alt-1',
                    fn: () => sendRequest(),
                };
            case Relationship.NONE:
                return {
                    message: 'Send connection request',
                    icon: 'person-add-alt-1',
                    fn: () => sendRequest(),
                };
            default:
                return {
                    message: '',
                    icon: 'device-unknown',
                    fn: () => {},
                };
        }
    }

    useEffect(() => {
        setConnectionBtn(relationshipBtn(relationship));
    }, [relationship]);

    return (
        <View style={styles.contentContainer}>
            {/* CONNECT BUTTON */}
            {relationship && targetUserId ? (
                <TouchableHighlight
                    disabled={isLoading}
                    style={{width: '100%'}}
                    underlayColor="#ccc"
                    onPress={() => {
                        setIsLoading(true);
                        connectionBtn.fn();
                    }}>
                    <View style={styles.btnContainer}>
                        <MaterialIcon
                            style={styles.btnIcon}
                            name={connectionBtn.icon}
                            size={25}
                            color={colors.icon}
                        />
                        <Text>{connectionBtn.message}</Text>
                    </View>
                </TouchableHighlight>
            ) : null}
            {/* REPORT BUTTON */}
            <TouchableHighlight
                style={{width: '100%'}}
                underlayColor="#ccc"
                onPress={() => {
                    navigation.navigate('Report', {
                        id: targetUserId,
                        type: ReportType.USER,
                    });
                }}>
                <View style={styles.btnContainer}>
                    <MaterialIcon
                        style={styles.btnIcon}
                        name="report"
                        size={25}
                        color={colors.icon}
                    />
                    <Text>Report user</Text>
                </View>
            </TouchableHighlight>
            {/* TODO: FOR DEBUG NEEDA REMOVE */}
            {/* <Text>{targetUserId}</Text> */}
        </View>
    );
};

export default ProfileNonSelfBottomSheet;

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
