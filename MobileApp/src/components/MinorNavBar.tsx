import React, {ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {sizes, colors, FONTS} from '../constants';

interface Props {
    LeftComponent?: React.FC;
    middleText?: string;
    minorText?: string;
    minorComponent?: ReactElement;
    RightComponent?: React.FC;
}

const EmptyComponent = () => <View style={styles.emptyComponent}></View>;

const MinorNavBar: React.FC<Props> = ({
    LeftComponent = EmptyComponent,
    middleText = '',
    RightComponent = EmptyComponent,
    minorText = '',
    minorComponent,
}) => {
    return (
        <View style={styles.header}>
            <LeftComponent />
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                <Text style={styles.heading}>
                    {middleText}
                    <Text style={{...FONTS.minor}}>{minorText}</Text>
                </Text>
                {minorComponent}
            </View>
            <RightComponent />
        </View>
    );
};

export default MinorNavBar;

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 50,
        width: sizes.width,
        backgroundColor: colors.main,
        elevation: 5,
    },
    heading: {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        ...FONTS.title,
    },
    emptyComponent: {
        width: sizes.width * 0.05,
    },
});
