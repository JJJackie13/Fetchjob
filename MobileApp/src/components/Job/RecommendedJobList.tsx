import React, {useCallback} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableHighlight } from 'react-native';
import { exp } from 'react-native-reanimated';
import {colors, FONTS, sizes} from '../../constants';

import LoadingComponent from '../LoadingComponent';
import JobCardHorizontal from './JobCardHorizontal';
import JobEmptyCard from './JobEmptyCard';

const RecommendedJobList: React.FC<any> = ({
    title,
    isLoading,
    data,
}) => {
    const renderList = useCallback(
        ({item}: any) => (
            <View style={{paddingHorizontal: 10}}>
                <JobCardHorizontal
                    key={item.id}
                    data={item}
                    lastData={ item == data[data.length - 1] ? true : false}
                />
            </View>
        ),
        [],
    );
    console.log("data in jobs exp", data)
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>{title}</Text>
            </View>
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    removeClippedSubviews={true}
                    scrollEventThrottle={16}
                    data={data}
                    ListEmptyComponent={<JobEmptyCard />}
                    renderItem={renderList}
                    style={{width: sizes.width}}
                    snapToInterval={sizes.width}
                />

            )}
        </View>
    )
}

export default RecommendedJobList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.main,
        width: sizes.width,
        minHeight: sizes.height * 0.1,
        marginTop: 5,
        paddingBottom: 60,
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
    },
    heading: {
        ...FONTS.minor,
        fontWeight: 'bold',
        color: colors.minorText,
    },

});