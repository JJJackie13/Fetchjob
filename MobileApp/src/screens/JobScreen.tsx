import React, {useState, useEffect, useMemo} from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, ScrollView, RefreshControl } from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {colors, FONTS, sizes} from '../constants';
import {RootStackParamList} from '../types/types';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import LoadingComponent from '../components/LoadingComponent';
import JobEmptyCard from '../components/Job/JobEmptyCard';
import RecommendedJobList from '../components/Job/RecommendedJobList';
import SearchAllJobList from '../components/Search/SearchAllJobList';


type Props = NativeStackScreenProps<RootStackParamList, 'Job'>;

const JobScreen: React.FC<Props> = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [jobByExpList, setJobByExpList] = useState([])
    const [jobByIndustryList, setJobByIndustryList] = useState([])
    


    async function fetchRecommendedJob() {
        try {
            const jobByIndustryRes = await fetch(`${API_URL}/job/recommended/industry`,
                {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            )
            const jobByExpRes = await fetch(`${API_URL}/job/recommended/exp`,
                {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            )
            console.log('jobByIndustryRes', jobByIndustryRes)
            console.log('jobByExpRes', jobByExpRes)
            if (jobByIndustryRes.ok && jobByExpRes.ok) {
                const jobByIndustryData = (await jobByIndustryRes.json()).data;
                const jobByExpData = (await jobByExpRes.json()).data;
                console.log('jobByIndustryData', jobByIndustryData)
                console.log('jobByExpData', jobByExpData)
                setJobByIndustryList(jobByIndustryData);
                setJobByExpList(jobByExpData);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function renderSavedJobBtn(){
        return (
            <TouchableOpacity
                style={styles.savedJobBtn}
                onPress={() => navigation.navigate('SavedJob')}
            >
                <FontAwesome5
                    style={{marginLeft: 4, marginRight: 2}}
                    name="save"
                    size={15}
                    color={colors.minorText}
                />
                <Text
                    style={{
                        ...FONTS.minor,
                        fontWeight: 'bold',
                        marginLeft: 10,
                        color: colors.icon,
                    }}>
                    My Job
                </Text>
            </TouchableOpacity>
        )
    }

    function renderAppliedJobBtn(){
        return (
            <TouchableOpacity
                style={styles.savedJobBtn}
                onPress={() => navigation.navigate('UserCheckAppliedJob')}
            >
                <FontAwesome5
                    style={{marginLeft: 4, marginRight: 2}}
                    name="save"
                    size={15}
                    color={colors.minorText}
                />
                <Text
                    style={{
                        ...FONTS.minor,
                        fontWeight: 'bold',
                        marginLeft: 10,
                        color: colors.icon,
                    }}>
                    Applied job
                </Text>
            </TouchableOpacity>
        )
    }


    function showMoreExpResultBtn() {
        return (
            jobByExpList.length > 0 ? (
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

    function showMoreIndustryResultBtn() {
        return (
            jobByIndustryList.length > 0 ? (
                <TouchableHighlight
                    style={styles.viewAllResultsBtn}
                    underlayColor={colors.tertiary}
                    onPress={() => 
                        navigation.navigate('MoreJobByIndustry')
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

    useEffect(() => {
        let isMounted = true;
        if(isMounted){
            fetchRecommendedJob();
        }
        () => (isMounted = false)
    }, []);

    return (
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
                            onRefresh={fetchRecommendedJob}
                        />
                    }>
                    {renderSavedJobBtn()}
                    {renderAppliedJobBtn()}
                    <View style={styles.btnController}>
                        <SearchAllJobList
                            title="Recommended for you"
                            isLoading={isLoading}
                            data={jobByExpList}
                        />
                        {showMoreExpResultBtn()}
                    </View>
                    <View style={styles.btnController}>
                        <SearchAllJobList
                            title="More jobs for you"
                            isLoading={isLoading}
                            data={jobByIndustryList}
                        />
                        {showMoreIndustryResultBtn()}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default JobScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    savedJobBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 50,
        backgroundColor: colors.main,
    },
    button: {
        alignItems: "center",
        backgroundColor: colors.main,
        padding: 10
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
    btnController: {
        // backgroundColor: '#fff'
    }
});
