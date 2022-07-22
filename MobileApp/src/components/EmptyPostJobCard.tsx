import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {colors, FONTS, sizes} from '../constants';

const EmptyPostJobCard: React.FC = ({}) => {
    return (
        <View style={styles.container}>
            <FontAwesome5
                name="briefcase"
                size={sizes.width * 0.1}
                color={colors.icon}
            />
            <Text style={{...FONTS.caption, color: colors.paragraph}}>
                No current job opening
            </Text>
            <Text style={{...FONTS.caption, color: colors.paragraph}}>
                You can post a new job
            </Text>
        </View>
    );
};

export default EmptyPostJobCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: colors.main,
        maxHeight: sizes.height * 0.3,
        width: sizes.width - 20,
        marginHorizontal: 10,
        marginBottom: 5,
        paddingVertical: 10,
        borderRadius: 10,
        elevation: 1,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#cccccc73',
    },
});