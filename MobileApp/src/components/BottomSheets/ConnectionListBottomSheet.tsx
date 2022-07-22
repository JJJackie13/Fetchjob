import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight, Alert} from 'react-native';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import {colors, FONTS} from '../../constants';

const ConnectionListBottomSheet: React.FC<{
    removeConnectionWarning: () => void;
    isLoading: boolean;
}> = ({removeConnectionWarning, isLoading}) => {
    return (
        <View style={styles.contentContainer}>
            <TouchableHighlight
                disabled={isLoading}
                style={{width: '100%'}}
                underlayColor="#ccc"
                onPress={removeConnectionWarning}>
                <View style={styles.btnContainer}>
                    <MaterialIcon
                        style={styles.btnIcon}
                        name="person-add-disabled"
                        size={25}
                        color={colors.icon}
                    />
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.paragraph,
                            fontWeight: 'bold',
                        }}>
                        Remove connection
                    </Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight
                style={{width: '100%'}}
                underlayColor="#ccc"
                onPress={() => {}}>
                <View style={styles.btnContainer}>
                    <MaterialIcon
                        style={styles.btnIcon}
                        name="report"
                        size={25}
                        color={colors.icon}
                    />
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.paragraph,
                            fontWeight: 'bold',
                        }}>
                        Report user
                    </Text>
                </View>
            </TouchableHighlight>
            {/* TODO: FOR DEBUG NEEDA REMOVE */}
            {/* <Text>{targetUserId}</Text> */}
        </View>
    );
};

export default ConnectionListBottomSheet;

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
        marginRight: 2,
    },
});
