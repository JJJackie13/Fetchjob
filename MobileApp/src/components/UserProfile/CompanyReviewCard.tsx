import React from 'react';
import {StyleSheet, Text, View, TouchableWithoutFeedback} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {format} from 'fecha';
import {colors, FONTS, sizes} from '../../constants';

const CompanyReviewCard: React.FC<any> = ({data}) => {
    return (
        <TouchableWithoutFeedback>
            <View style={styles.container}>
                <Text style={styles.date}>
                    {format(new Date(data.created_at), 'DDMMMYYYY')}
                </Text>
                <Text style={styles.reviewTitle}>"{data.review_title}"</Text>
                <View>
                    <AirbnbRating
                        count={5}
                        defaultRating={data.rating}
                        size={sizes.secondary}
                        selectedColor={colors.highlight}
                        showRating={false}
                        starContainerStyle={{marginBottom: 10}}
                    />
                </View>
                <View style={styles.commenterInfoContainer}>
                    <FontAwesome5
                        name="user"
                        size={sizes.secondary}
                        color={colors.paragraph}
                        style={styles.userIcon}
                    />
                    <Text>
                        {data.commenter_type} ({data.employment_type}) -{' '}
                        {data.job_title}
                    </Text>
                </View>
                <View style={styles.reviewContentContainer}>
                    <Text style={styles.reviewContentHeading}>Pros</Text>
                    <Text>{data.pos_comment}</Text>
                </View>
                <View style={styles.reviewContentContainer}>
                    <Text style={styles.reviewContentHeading}>Cons</Text>
                    <Text>{data.neg_comment}</Text>
                </View>
                {data.extra_comment ? (
                    <View style={styles.reviewContentContainer}>
                        <Text style={styles.reviewContentHeading}>
                            Extra comment
                        </Text>
                        <Text>{data.extra_comment}</Text>
                    </View>
                ) : null}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default CompanyReviewCard;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: colors.main,
        marginBottom: 3,
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    date: {
        ...FONTS.caption,
        color: colors.paragraph,
        marginBottom: 10,
    },
    reviewTitle: {
        ...FONTS.minor,
        color: colors.highlight,
        marginBottom: 10,
    },
    commenterInfoContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 10,
    },
    userIcon: {
        marginRight: 10,
    },
    reviewContentContainer: {
        display: 'flex',
        flexDirection: 'column',
        marginBottom: 10,
    },
    reviewContentHeading: {
        ...FONTS.paragraph,
        fontWeight: 'bold',
    },
});
