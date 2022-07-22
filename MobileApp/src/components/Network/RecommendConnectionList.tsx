import React, {useCallback} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"

import RecommendConnectionCard from './RecommendConnectionCard';
import RecommendEmptyCard from './RecommendEmptyCard';
import LoadingComponent from '../LoadingComponent';
import {colors, FONTS, sizes} from '../../constants';

const RecommendConnectionList: React.FC<any> = ({
    title,
    isLoading,
    data,
}) => {
    const renderList = useCallback(
        ({item}: any) => (
            <View style={{paddingHorizontal: 10}}>
                <RecommendConnectionCard
                    key={item.id}
                    data={item}
                />
            </View>
        ),
        [],
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>{title}</Text>
                <FontAwesome5 name="long-arrow-alt-right" color={colors.icon} size={20}/>
            </View>
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    removeClippedSubviews={true}
                    scrollEventThrottle={16}
                    horizontal
                    data={data}
                    ListEmptyComponent={<RecommendEmptyCard />}
                    renderItem={renderList}
                    style={{width: sizes.width}}
                    snapToInterval={sizes.width}
                />
            )}
        </View>
    );
};

export default RecommendConnectionList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.main,
        width: sizes.width,
        minHeight: sizes.height * 0.3,
        marginTop: 5,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent:"space-between",
        padding: 10,
    },
    heading: {
        ...FONTS.minor,
        fontWeight: 'bold',
        color: colors.minorText,
    },
});
