import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {colors, FONTS} from '../../constants';

import CompanyReviewOverviewCard from './CompanyReviewOverviewCard';
import CompanyReviewCard from './CompanyReviewCard';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoadingComponent from '../LoadingComponent';

const CompanyReviewSection: React.FC<any> = ({companyId}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);
    const [avgRating, setAvgRating] = useState<number>(0);

    const renderCard = useCallback(
        (item) => <CompanyReviewCard key={item.id} data={item} />,
        [],
    );

    const renderReviewList = () => (
        <View>
            <View style={styles.sectionHeader}>
                <Text style={styles.heading}>Employee Reviews</Text>
            </View>
            {data && data.map((item: any) => renderCard(item))}
        </View>
    );

    async function fetchData() {
        try {
            const res = await fetch(`${API_URL}/company/review/${companyId}`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            if (res.ok) {
                const {data, avgRating} = parseRes;
                setAvgRating(parseFloat(avgRating));
                setData(data);
                setIsLoading(false);
            } else {
                console.log(parseRes.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            fetchData();
        }
        () => (isMounted = false);
    }, []);

    return (
        <View style={styles.container}>
            {!isLoading ? (
                <>
                    <CompanyReviewOverviewCard rating={avgRating} />
                    {renderReviewList()}
                </>
            ) : (
                <LoadingComponent />
            )}
        </View>
    );
};

export default CompanyReviewSection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    sectionHeader: {
        padding: 15,
        backgroundColor: colors.main,
    },
    heading: {
        ...FONTS.paragraph,
        fontWeight: 'bold',
    },
});
