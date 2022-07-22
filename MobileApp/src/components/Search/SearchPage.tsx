import React, {useState, useEffect, useCallback} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Image,
    Keyboard,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import {Input, Icon} from 'native-base';
import {useSelector} from 'react-redux';
import LoadingComponent from '../LoadingComponent';

import {API_URL} from '@env';
import {colors, FONTS, images, sizes, formats} from '../../constants';
import {useNavigation} from '@react-navigation/core';
import {
    NativeStackNavigationProp,
    NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SearchBarUserList from './searchBarUserList';
import SearchBarJobList from './searchBarJobList';
import SearchBarCompanyList from './searchBarCompanyList';
import SearchBarEmptyCard from './SearchBarEmptyCard';

const SearchResult: React.FC<{
    input: string;
}> = (input) => {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList, any>>();
    const [isLoading, setIsLoading] = useState(true);
    const [jobResult, setJobResult] = useState<any[]>([]);
    const [userResult, setUserResult] = useState<any[]>([]);
    const [companyResult, setCompanyResult] = useState<any[]>([]);
    console.log('what is input', input);

    async function fetchSearch(inputCheck: any = '') {
        try {
            console.log('inputCheck', inputCheck);
            const userRes = await fetch(
                `${API_URL}/search-result-user?keywords=${inputCheck.input}`,
                {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const companyRes = await fetch(
                `${API_URL}/search-result-company?keywords=${inputCheck.input}`,
                {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const jobRes = await fetch(
                `${API_URL}/search-result-job?keywords=${inputCheck.input}`,
                {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            if (userRes.ok && companyRes.ok && jobRes.ok) {
                const userData = (await userRes.json()).data;
                const companyData = (await companyRes.json()).data;
                const jobData = (await jobRes.json()).data;
                console.log('userRes', userRes);
                console.log('userData', userData[0]);
                setJobResult(jobData);
                setUserResult(userData);
                setCompanyResult(companyData);
                setIsLoading(false);
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    function showAllResultBtn() {}

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            fetchSearch(input);
        }
        () => (isMounted = false);
    }, [input]);

    return (
        <View>
            {isLoading ? (
                <LoadingComponent />
            ) : userResult.length > 0 ||
              jobResult.length > 0 ||
              companyResult.length > 0 ? (
                <View>
                    <SearchBarUserList
                        isLoading={isLoading}
                        data={userResult}
                    />
                    <SearchBarJobList isLoading={isLoading} data={jobResult} />
                    <SearchBarCompanyList
                        isLoading={isLoading}
                        data={companyResult}
                    />
                </View>
            ) : (
                <SearchBarEmptyCard />
            )}
        </View>
    );
};

export default SearchResult;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
});
