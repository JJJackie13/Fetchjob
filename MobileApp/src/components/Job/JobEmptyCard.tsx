import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {colors, FONTS, sizes} from '../../constants';

const JobEmptyCard: React.FC = ({}) => {
    return (
        <View style={styles.container}>
            <FontAwesome5
                name="business-time"
                size={sizes.width * 0.1}
                color={colors.icon}
            />
            <Text style={{...FONTS.caption, color: colors.paragraph}}>
                No recommendation yet
            </Text>
            <Text style={{...FONTS.caption, color: colors.paragraph}}>
                Please come back later
            </Text>
        </View>
    );
};

export default JobEmptyCard;

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
