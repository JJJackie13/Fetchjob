import { Button } from 'native-base';
import React, { useState, useEffect } from 'react';
import { FlatList, Platform, ScrollView, StatusBar, StyleSheet, Switch, Text, View, TouchableOpacity, TouchableHighlight, RefreshControl } from 'react-native';
import { colors, sizes, FONTS } from '../constants';

import {API_URL} from '@env';
import { useNavigation } from '@react-navigation/core';
import {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingComponent from '../components/LoadingComponent';
import RecommendedJobList from '../components/Job/RecommendedJobList';
import SearchAllUserList from '../components/Search/SearchAllUserList';
import SearchAllCompanyList from '../components/Search/SearchAllCompanyList';
import SearchAllJobList from '../components/Search/SearchAllJobList';


type SearchAllProps = NativeStackScreenProps<RootStackParamList, 'SearchAll'>;

const SearchAllScreen: React.FC<SearchAllProps> = ({navigation, route}) => {
    const input = route.params.input;
    const [isLoading, setIsLoading] = useState(true);
    const [jobResult, setJobResult] = useState<any[]>([])
    const [userResult, setUserResult] = useState<any[]>([])
    const [companyResult, setCompanyResult] = useState<any[]>([])
    console.log('what is input', input)

    async function fetchSearch(inputCheck: any) {
        try {
            console.log('inputCheck', inputCheck)
            const userRes = await fetch(`${API_URL}/search-result-user?keywords=${inputCheck}`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const companyRes = await fetch(`${API_URL}/search-result-company?keywords=${inputCheck}`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const jobRes = await fetch(`${API_URL}/search-result-job?keywords=${inputCheck}`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if(userRes.ok && companyRes.ok && jobRes.ok){
                const userData = (await userRes.json()).data;
                const companyData = (await companyRes.json()).data;
                const jobData = (await jobRes.json()).data;
                // console.log('userRes', userRes)
                // console.log('userData', userData[0])
                // console.log('jobData', jobData[0])
                setJobResult(jobData);
                setUserResult(userData);
                setCompanyResult(companyData);
                setIsLoading(false)
            }
            console.log('jobResult', jobResult)
        } catch (error) {
            console.log("error", error)
        }
    }

    function showMoreJobResultBtn() {
        return (
            jobResult.length > 0 ? (
                <TouchableHighlight
                    style={styles.viewAllResultsBtn}
                    underlayColor={colors.tertiary}
                    onPress={() => 
                        navigation.navigate('MoreJobByExp')
                    }>
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.minorText,
                            fontWeight: 'bold',
                        }}>
                        Show more results
                    </Text>
                </TouchableHighlight>
            ) : (<></>)
        )
    }

    function topButton(){
        return(
            <View>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.btnContainer}>
                    <TouchableOpacity
                        style={styles.topButton}>
                        <Text style={styles.btnText}>Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.topButton}>
                        <Text style={styles.btnText}>Jobs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.topButton}>
                        <Text style={styles.btnText}>Companies</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }

    useEffect(() => {
        let isMounted = true;
        if(isMounted){
            fetchSearch(input);
        }
        () => (isMounted = false)
    }, [input]);

    return (
        <View style={{flex:1}}>
            {topButton()}
            <View style={styles.container}>

                {isLoading ? (
                    <LoadingComponent />
                ) : ( 
                    <ScrollView
                        scrollEventThrottle={10}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isLoading}
                            />
                        }>
                        <View>
                            <SearchAllUserList
                                title="Search users results"
                                isLoading={isLoading}
                                data={userResult}
                            />
                        </View>

                        <View>
                            <SearchAllJobList
                                title="Search jobs results"
                                isLoading={isLoading}
                                data={jobResult}
                            />   
                            {}
                        </View>

                        <View>
                            <SearchAllCompanyList
                                title="Search companies results"
                                isLoading={isLoading}
                                data={companyResult}
                            />
                        </View>
                    </ScrollView>
                )}
            </View>
                    
        </View>

    );
};

export default SearchAllScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    btnContainer: {
        backgroundColor: colors.main,
        paddingBottom: 5,
    },
    topButton: {
        height: 40,
        minWidth: 90,
        backgroundColor: colors.main,
        paddingHorizontal: 5,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.button,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.button,
    },
    viewAllResultsBtn: {
        position: 'absolute',
        bottom: 3,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: sizes.width * 0.9,
        height: sizes.height * 0.05,
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        padding: 5,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border,
    },
})