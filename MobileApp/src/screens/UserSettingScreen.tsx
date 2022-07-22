import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {colors, FONTS, sizes} from '../constants';
import {RootStackParamList} from '../types/types';

type Props = NativeStackScreenProps<RootStackParamList, 'UserSetting'>;

const UserSettingScreen: React.FC<Props> = ({navigation}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('BasicInfoEdit')}>
                <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                    Edit Basic Info
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('UserIntroductionEdit')}>
                <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                    Edit User Introduction
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default UserSettingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: 80,
        backgroundColor: colors.main,
        marginBottom: 0.5,
        paddingHorizontal: sizes.width * 0.1,
        elevation: 5,
    },
    buttonText: {},
});
