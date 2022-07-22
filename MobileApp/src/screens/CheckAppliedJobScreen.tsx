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
import UserAppliedJobList from '../components/UserAppliedJobList';
import UserAppliedJobCard from '../components/UserAppliedJobCard';

type Props = NativeStackScreenProps<RootStackParamList, 'UserCheckAppliedJob'>;

const UserCheckAppliedJobScreen: React.FC<Props> = ({navigation}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [jobAppliedByUserList, setJobAppliedByUserList] = useState([]);
    const [searchJob, setSearchJob] = useState([]);

    async function fetchAppliedJob() {
        try {
            const res = await fetch(`${API_URL}/job/applied-by-user`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            console.log(parseRes)
            if(res.ok) {
                const parseData = parseRes.data
                setJobAppliedByUserList(parseData)
                setSearchJob(parseData)
            } else {
                console.log(parseRes.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    function renderAppliedJobCard(){
        return(
            <>
                {searchJob && (
                    <FlatList
                        removeClippedSubviews={true}
                        scrollEventThrottle={16}
                        data={searchJob}
                        renderItem={({item}: any) => (
                            <View style={{paddingHorizontal: 10}}>
                                <UserAppliedJobCard
                                    key={item.id}
                                    data={item}
                                />
                            </View>
                        )}
                        onRefresh={() => {
                            fetchAppliedJob();
                        }}
                        style={{width: sizes.width}}
                        snapToInterval={sizes.width}
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
                    No job had been applied yet
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
                    placeholder="Search applied job"
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
        //     setSearchJob(jobAppliedByUserList);
        // } else {
            setSearchJob(
            jobAppliedByUserList.filter((obj: any) => {
                    return (
                        obj.job_title.toLowerCase().includes(queryStr) ||
                        obj.city_name.toLowerCase().includes(queryStr) ||
                        obj.industry.toLowerCase().includes(queryStr) ||
                        obj.company_name.toLowerCase().includes(queryStr)
                    );
                    })
            );
        
    }

    // useEffect(() => {
    //     setSearchJob(jobAppliedByUserList);
    // }, [jobAppliedByUserList]);


    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            fetchAppliedJob();
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
                    {jobAppliedByUserList && jobAppliedByUserList.length > 0
                        ? renderAppliedJobCard()
                        : renderEmptyCard()}
                </>
            ) : (
                <LoadingComponent />
            )}
        </View>
    )

}

export default UserCheckAppliedJobScreen

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