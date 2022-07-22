import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Spinner} from 'native-base';

import {colors, sizes} from '../constants';

const LoadingComponent: React.FC = () => {
    return (
        <View style={styles.loadingContainer}>
            <Spinner color={colors.highlight} size="lg" />
        </View>
    );
};

export default LoadingComponent;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: sizes.height,
        width: sizes.width,
        position: 'absolute',
        zIndex: 100,
        backgroundColor: colors.tertiary,
    },
});
