import React from 'react';
import {StyleSheet, Text, View, TouchableHighlight} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {colors, FONTS, sizes} from '../../constants';

import {ReportType} from '../../types/enums';

const HandleNonSelfPostBottomsheet: React.FC<{
    postId: number;
    navigation: any;
    closeModals?: () => any;
}> = ({postId, navigation, closeModals = () => {}}) => {
    return (
        <View style={styles.handlePostBtmSheet}>
            <TouchableHighlight
                onPress={() => {
                    closeModals();
                    navigation.navigate('Report', {
                        type: ReportType.POST,
                        id: postId,
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
                    <MaterialIcon name="report" size={30} color={colors.icon} />
                    <Text
                        style={{
                            marginLeft: 5,
                            ...FONTS.minor,
                            color: colors.icon,
                            fontWeight: 'bold',
                        }}>
                        Report Post
                    </Text>
                </View>
            </TouchableHighlight>
        </View>
    );
};

export default HandleNonSelfPostBottomsheet;

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
        paddingVertical: 5,
    },
});
