import React, {useState, useCallback, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    ScrollView,
} from 'react-native';
import {colors, FONTS, images, sizes, formats} from '../../constants';
import LoadingComponent from '../LoadingComponent';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import timeSince, { timeRemain } from './TimeSince';
import RecommendedJobList from './RecommendedJobList';
import {useNavigation, useRoute} from '@react-navigation/core';
import {NavigationProp, RouteProp} from '@react-navigation/core';
import {RootStackParamList} from '../../types/types';

interface JobCard {
    job_id: string;
    job_title: string;
    job_detail: string;
    company_name: string;
    avatar: string;
    city_name: string;
    country_name: string;
    industry: string;
    post_date: Date;
    update_date: any;
    auto_delist: Date;
    bookmark_id: any;
    banner: string;
    annual_leave: string;
    business_size: string;
    education: string;
    employment_type: string;
}

const JobDetails: React.FC<{
    data:JobCard;
    bookmarkdJobHandler: ()=> any;
}> = ({data, bookmarkdJobHandler = () => {}}) => {
    // const navigation = useNavigation<NavigationProp<RootStackParamList, any>>();
    const [bookmark, setBookmark] = useState<boolean>(data.bookmark_id);
    const [jobList, setJobList] = useState([])
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // async function bookmarkdJobHandler(){
    //     try {
    //         const res = await fetch(`${API_URL}/job/saved/${parseInt(data.job_id)}`, {
    //                 method: 'put',
    //                 headers: {
    //                     Authorization: `Bearer ${await AsyncStorage.getItem(
    //                         'token',
    //                     )}`,
    //                 },
    //             });
    //         if(res.ok) {
    //             setBookmark((prev) => !prev);
    //         } else {
    //             const message = (await res.json()).message;
    //             Toast.show({
    //                 type: 'error',
    //                 text1: message,
    //             });
    //         }
    //     } catch (error) {
    //         console.log('sendMessage', error);
    //     }
    // }

    // async function fetchRecommendedJob() {
    //     try {
    //         const res = await fetch(`${API_URL}/job/recommended/random/industry/${parseInt(data.job_id)}`, {
    //                 headers: {
    //                     Authorization: `Bearer ${await AsyncStorage.getItem(
    //                         'token',
    //                     )}`,
    //                 },
    //         })
    //         if(res.ok){
    //             const parseData = (await res.json()).data;
    //             setJobList(parseData)
    //             setIsLoading(false)
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }



    function jobLevel() {

    }

    function applyJobBtn() {
        
    }

    useEffect(() => {
        setBookmark((prev) => (!prev))
    }, [data.bookmark_id]);

    return (
        <View>

                
  
        </View>
    )
}

export default JobDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.main,
        width: sizes.width,
        minHeight: sizes.height * 0.3,
        marginTop: 5,
        paddingLeft: 10,
        paddingBottom: 40,
    },
    header: {
        fontSize: 24,
        fontWeight: "bold",
        padding: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        paddingTop: 10,
        paddingBottom: 8,
        paddingLeft: 5,
    },
    paragraph: {
        paddingBottom: 8,
        paddingLeft: 5,
        paddingRight: 10,
    },
    heading: {
        ...FONTS.minor,
        fontWeight: 'bold',
        color: colors.minorText,
    },
    avatar: {
        height: sizes.height * 0.08,
        width: sizes.height * 0.08,
        borderWidth: 2,
        borderColor: '#cccccc22',
        overflow: 'hidden',
        paddingLeft: 10,
    },
    detailContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 10,
        paddingRight: 200,
    },
    viewJobDetailBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: (sizes.width * 0.5) / 1.2,
        marginVertical: 10,
        marginLeft: 15,
        marginRight: 10,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.button,
        backgroundColor: colors.button,
    },
    saveJobBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: (sizes.width * 0.5) / 1.2,
        marginVertical: 10,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.button,
        backgroundColor: colors.main,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
});