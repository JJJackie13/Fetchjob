import React, {useCallback} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableHighlight } from 'react-native';
import { exp } from 'react-native-reanimated';
import {colors, FONTS, sizes} from '../constants';

import LoadingComponent from '../components/LoadingComponent';
import PostJobReviewJobCard from './PostJobReviewJobCard';
import JobApplicationEmptyCard from './JobApplicationEmptyCard';
import JobApplicationCard from './JobApplicationCard';


const JobApplicationList: React.FC<any> = ({
    title,
    isLoading,
    data,
}) => {
    // const renderList = useCallback(
    //     ({item}: any) => (
    //         <View style={{paddingHorizontal: 10}}>
    //             <PostJobReviewJobCard
    //                 key={item.id}
    //                 data={item}
    //             />
    //         </View>
    //     ),
    //     [],
    // );
    // console.log("data in jobs exp", data)
    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.heading}>{title}</Text>
            </View>
            {isLoading ? (
                <LoadingComponent />
            ) : (
                // <FlatList
                //     showsHorizontalScrollIndicator={false}
                //     removeClippedSubviews={true}
                //     scrollEventThrottle={16}
                //     data={data}
                //     renderItem={renderList}
                //     style={{width: sizes.width}}
                //     snapToInterval={sizes.width}
                // />

                <View>
                    {data.length > 0 ?
                        (data.map((item: any) => {
                            return(
                            <View style={{paddingHorizontal: 10}}>
                                <JobApplicationCard
                                    key={item.id}
                                    data={item}
                                />
                            </View>
                            )
                        }))
                        :(
                            <JobApplicationEmptyCard />
                        )
                    }
                </View>

            )}
        </View>
    )
}

export default JobApplicationList;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: colors.main,
        width: sizes.width,
        minHeight: sizes.height * 0.1,
        marginTop: 5,
        paddingBottom: 10,
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