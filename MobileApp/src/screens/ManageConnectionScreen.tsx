import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {colors, FONTS, sizes} from '../constants';
import {RootStackParamList} from '../types/types';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

type Props = NativeStackScreenProps<RootStackParamList, 'ManageConnection'>;

const ManageConnectionScreen: React.FC<Props> = ({navigation}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ConnectionList')}>
                <>
                    <FontAwesome
                        name="users"
                        size={20}
                        color={colors.icon}
                        style={{marginRight: 15}}
                    />
                    <Text style={styles.buttonText}>Connections</Text>
                </>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ConnectionRequestList')}>
                <>
                    <FontAwesome5
                        name="user-clock"
                        size={20}
                        color={colors.icon}
                        style={{marginRight: 15}}
                    />
                    <Text style={styles.buttonText}>Connection requests</Text>
                </>
            </TouchableOpacity>
        </View>
    );
};

export default ManageConnectionScreen;

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
    buttonText: {
        ...FONTS.minor,
        fontWeight: 'bold',
        color: colors.icon,
    },
});
