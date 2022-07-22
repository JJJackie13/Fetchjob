import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    RefreshControl,
    Text,
    FlatList,
} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/types';

import {Input, Icon} from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {colors, sizes, FONTS} from '../constants';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingComponent from '../components/LoadingComponent';
import RecommendedJobList from '../components/Job/RecommendedJobList';

type Props = NativeStackScreenProps<RootStackParamList, 'MoreJobByExp'>;

const MoreJobByExpScreen: React.FC<Props> = ({navigation}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [jobList, setJobList] = useState([]);
    const [searchJob, setSearchJob] = useState([]);

    async function fetchAllJob() {
        try {
            const res = await fetch(`${API_URL}/job/recommended/all/exp`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            if (res.ok) {
                const allJobData = parseRes.data;
                // console.log(allJobData);
                setJobList(allJobData);
                setSearchJob(allJobData);
            } else {
                console.log(parseRes.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    function renderSearchBar() {
        return (
            <View style={styles.searchBarContainer}>
                <Input
                    onChangeText={filterList}
                    backgroundColor={colors.tertiary}
                    fontSize={sizes.caption + 2}
                    variant="filled"
                    InputLeftElement={
                        <Icon
                            as={<MaterialIcon name="search" />}
                            size={sizes.caption + 10}
                            ml="4"
                            color={colors.icon}
                        />
                    }
                    placeholder="Search saved job"
                    placeholderTextColor={colors.icon}
                    _focus={{
                        borderColor: colors.tertiary,
                    }}
                />
            </View>
        );
    }

    function filterList(query: string) {
        let queryStr = query.toLowerCase();
        // if (query === '') {
        //     setSearchJob(jobList);
        // } else {
            setSearchJob(
                jobList.filter((obj: any) => {
                    return (
                        obj.job_title.toLowerCase().includes(queryStr) ||
                        obj.city_name.toLowerCase().includes(queryStr) ||
                        obj.industry.toLowerCase().includes(queryStr) ||
                        obj.company_name.toLowerCase().includes(queryStr)
                    );
                }),
            );
        //}
    }

    // useEffect(() => {
    //     setSearchJob(jobList);
    // }, [jobList]);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            fetchAllJob();
        }
        () => {
            isMounted = false;
        };
    }, [setIsLoading]);

    return(
        <View style={styles.container}>
            {!isLoading ? (
                <>
                    {renderSearchBar()}
                    <RecommendedJobList
                        title="Recommended for you"
                        isLoading={isLoading}
                        data={jobList}
                    />
                </>
            ) : (
                <LoadingComponent />
            )}
        </View>
    )
}

export default MoreJobByExpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
        height: sizes.height,
    },
    row: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    emptyCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: sizes.height * 0.9,
        backgroundColor: colors.main,
        borderRadius: 15,
        elevation: 5,
    },
    searchBarContainer: {
        width: sizes.width,
        height: sizes.height * 0.08,
        backgroundColor: colors.main,
        // elevation: 5,
        padding: 10,
    },
});