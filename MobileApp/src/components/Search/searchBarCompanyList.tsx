import React, {useCallback} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableHighlight } from 'react-native';
import { exp } from 'react-native-reanimated';
import {colors, FONTS, sizes} from '../../constants';

import LoadingComponent from '../LoadingComponent';
import SearchBarCompnayCard from './searchBarCompanyCard';
import SearchBarEmptyCard from './SearchBarEmptyCard';




const SearchBarCompanyList: React.FC<any> = ({
    isLoading,
    data,
}) => {
    const renderList = useCallback(
        ({item}: any) => (
            <View style={{paddingHorizontal: 10}}>
                <SearchBarCompnayCard
                    key={item.id}
                    data={item}
                />
            </View>
        ),
        [],
    );
    
    return(
        <View style={data.length == 0 ? styles.noDataContainer : styles.container}>
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    removeClippedSubviews={true}
                    scrollEventThrottle={16}
                    data={data}
                    // ListEmptyComponent={<SearchEmptyCard/>}
                    renderItem={renderList}
                    style={{width: sizes.width}}
                    snapToInterval={sizes.width}
                />

            )}
        </View>
    )
}

export default SearchBarCompanyList;

const styles = StyleSheet.create({
    noDataContainer: {
        minHeight: sizes.height * 0,
    },
    container: {
        flex: 1,
        backgroundColor: colors.main,
        width: sizes.width,
        minHeight: sizes.height * 0.2,
        // marginTop: 5,
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