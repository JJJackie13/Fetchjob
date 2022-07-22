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
import JobCard from '../components/Job/JobCard';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {colors, sizes, FONTS} from '../constants';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingComponent from '../components/LoadingComponent';

type Props = NativeStackScreenProps<RootStackParamList, 'SavedJob'>;

const SavedJobScreen: React.FC<Props> = ({navigation}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [savedJobList, setSavedJobList] = useState([]);
    const [searchSavedJob, setSearchSavedJob] = useState([]);

    async function fetchSavedJob() {
        try {
            const res = await fetch(`${API_URL}/job/saved`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            // console.log(parseRes)
            if(res.ok) {
                const savedJobData = parseRes.data
                setSavedJobList(savedJobData)
                setSearchSavedJob(savedJobData)
            } else {
                console.log(parseRes.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    function renderSavedJobCards() {
        return(
            <>
                {searchSavedJob && (
                    <FlatList
                        style={{
                            width: sizes.width
                        }}
                        columnWrapperStyle={{
                            justifyContent: 'space-evenly',
                        }}
                        data={searchSavedJob}
                        renderItem={({item}) => (
                            <JobCard
                                data={item}
                                setSavedJobList={setSavedJobList}
                            />
                        )}
                        keyExtractor={({_, i}) => `${i}`}
                        numColumns={2}
                        removeClippedSubviews={true}
                        onRefresh={() => {
                            fetchSavedJob();
                        }}
                        refreshing={isLoading}
                    />
                )}
            </>
        )
    }

    function renderEmptyCard() {
        return (
            <View style={styles.emptyCard}>
                <MaterialIcon
                    name="hourglass-empty"
                    size={sizes.width * 0.3}
                    color={colors.icon}
                />
                <Text style={{...FONTS.title, color: colors.icon}}>
                    No saved job yet
                </Text>
            </View>
        );
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
        if (query === '') {
            setSearchSavedJob(savedJobList);
        } else {
            setSearchSavedJob((prev) =>
                prev.filter((obj: any) => {
                    return (
                        obj.job_title.toLowerCase().includes(queryStr) ||
                        obj.city_name.toLowerCase().includes(queryStr) ||
                        obj.industry.toLowerCase().includes(queryStr) ||
                        obj.company_name.toLowerCase().includes(queryStr)
                    );
                }),
            );
        }
    }

    useEffect(() => {
        setSearchSavedJob(savedJobList);
    }, [savedJobList]);

    // useEffect(() => {
    //     setSavedJobList(savedJobList);
    // }, [savedJobList]);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            fetchSavedJob();
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
                    {savedJobList && savedJobList.length > 0
                        ? renderSavedJobCards()
                        : renderEmptyCard()}
                </>
            ) : (
                <LoadingComponent />
            )}
        </View>
    )

}

export default SavedJobScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
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