import React, {useCallback} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"

import RecommendEmptyCard from '../Network/RecommendEmptyCard';
import LoadingComponent from '../LoadingComponent';
import {colors, FONTS, sizes} from '../../constants';
import SearchAllUserCard from './SearchAllUserCard';
import { flexDirection } from 'styled-system';
import SearchEmptyCard from './SearchEmptyCard';

const SearchAllUserList: React.FC<any> = ({
    title,
    isLoading,
    data,
}) => {
    // const renderList = useCallback(
    //     ({item}: any) => (
    //         <View style={{paddingHorizontal: 10}}>
    //             <SearchAllUserCard
    //                 key={item.id}
    //                 data={item}
    //             />
    //         </View>
    //     ),
    //     [],
    // );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>{title}</Text>
                {/* <FontAwesome5 name="long-arrow-alt-right" color={colors.icon} size={20}/> */}
            </View>
            {isLoading ? (
                <LoadingComponent />
            ) : (
                // <FlatList
                //     showsHorizontalScrollIndicator={false}
                //     removeClippedSubviews={true}
                //     scrollEventThrottle={16}
                //     horizontal
                //     data={data}
                //     ListEmptyComponent={<RecommendEmptyCard />}
                //     renderItem={renderList}
                //     style={{width: sizes.width}}
                //     snapToInterval={sizes.width}
                // />

                <View>
                    {data.length > 0 ?
                        (data.map((item: any) => {
                            return(
                            <View style={{paddingHorizontal: 10}}>
                                <SearchAllUserCard
                                    key={item.id}
                                    data={item}
                                />
                            </View>
                            )
                        }))
                        :(
                            <SearchEmptyCard />
                        )
                    }
                </View>
            )}
        </View>
    );
};

export default SearchAllUserList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.main,
        width: sizes.width,
        minHeight: sizes.height * 0.1,
        marginTop: 10,
        paddingBottom: 60,
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