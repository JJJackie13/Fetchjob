import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Rating} from 'react-native-ratings';
import {colors, FONTS, sizes} from '../../constants';

const CompanyReviewOverviewCard: React.FC<{rating: number}> = ({rating}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Reviews</Text>
            <View style={styles.avgRatingContainer}>
                <Text
                    style={{
                        marginRight: 10,
                        ...FONTS.paragraph,
                        color: colors.highlight,
                    }}>
                    {rating.toFixed(1)}
                </Text>
                <Rating
                    type="custom"
                    ratingCount={5}
                    ratingColor={colors.highlight}
                    ratingBackgroundColor="#ccc"
                    tintColor="#fff"
                    startingValue={rating}
                    // imageSize={sizes.title}
                    style={{marginBottom: 10}}
                    // jumpValue={0.1}
                    readonly
                />
            </View>
        </View>
    );
};

export default CompanyReviewOverviewCard;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.main,
        marginBottom: 3,
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    heading: {
        ...FONTS.paragraph,
        fontWeight: 'bold',
    },
    avgRatingContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
