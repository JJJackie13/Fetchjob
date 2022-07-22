import React, {useState, useEffect, useRef} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    ScrollView,
    FlatList,
    Text
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {RootStackParamList} from '../types/types';
import MinorNavBar from '../components/MinorNavBar';
import {colors, sizes, FONTS} from '../constants';
import {API_URL} from '@env';
import LoadingComponent from '../components/LoadingComponent';
import ManageControllerCard from "../components/ManageControllerCard"
import ManageControllerUserListPage from "../components/ManageControllerUserListPage"
import PostJobReviewJobList from '../components/PostJobReviewJobList';
import PostJobReviewHistoryJobList from '../components/PostJobReviewHistoryJobList';

type IProps = NativeStackScreenProps<RootStackParamList, 'PostJobReview'>;

const PostJobReviewScreen: React.FC<IProps> = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [postJob, setPostJob] = useState<any>([]);
    const [historyJob, setHistoryJob] = useState<any>([]);

    const fetchPostJob = async () => {
        try {
            const res = await fetch(`${API_URL}/job/post-job/${route.params.companyId}`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (res.ok) {
                const parseRes = await res.json();
                const pasreData = parseRes.data
                setPostJob(pasreData);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    const fetchHistoryJob = async () => {
        try {
            const res = await fetch(`${API_URL}/job/history-job/${route.params.companyId}`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (res.ok) {
                const parseRes = await res.json();
                const pasreData = parseRes.data
                setHistoryJob(pasreData);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };


    // function renderForm() {
    //     return (
    //         <FlatList style={styles.formContainer}
    //         overScrollMode="never"
    //         data={postJob}
    //         keyExtractor={(item)=>`${item.id}`}
    //         renderItem={({item})=><ManageControllerCard data={item} options={controlLevelOptions} companyId={route.params.companyId} refresh={fetchPrevData}/>}
    //         />                
    //     );
    // }

    function renderHistoryJobList() {
        return (
            <View>
                <PostJobReviewHistoryJobList
                    title="Posted jobs history"
                    isLoading={isLoading}
                    data={historyJob}
                    setPostJob={setHistoryJob}
                />
            </View>
        );
    }

    function renderJobList() {
        return (
            <View>
                <PostJobReviewJobList
                    title="Current jobs opening"
                    isLoading={isLoading}
                    data={postJob}
                    setPostJob={setPostJob}
                />
            </View>
        );
    }


    const LeftComponent = () => (
        <TouchableOpacity
            onPress={() =>navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color={colors.icon} />
        </TouchableOpacity>
    );
    // const RightComponent = () => (
    //     <TouchableOpacity
    //         onPress={() =>setListOpen(prev => !prev)}>
    //         <FontAwesome5 name={listOpen ? "times" : "plus"} size={20} color={colors.icon} />
    //     </TouchableOpacity>
    // );

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            const success1 = await fetchPostJob();
            const success2 = await fetchHistoryJob();
            if (success1 && success2) {
                setIsLoading(false);
            }
        }
        if (isMounted) {
            fetchData();
        }
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <View
            style={styles.container}>
            <MinorNavBar
                LeftComponent={LeftComponent}
                middleText={"Review posted job"}
            />
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <ScrollView>
                    {renderJobList()}
                    {renderHistoryJobList()}
                </ScrollView>
            )}
        </View>
    );
};

export default PostJobReviewScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        marginTop: 5,
        width: sizes.width,
        // marginHorizontal: 10,
        // marginBottom: 5,
        backgroundColor: colors.main,
        // borderRadius: 15,
        // paddingVertical: 15,
        // paddingBottom: 30,
    },
    formLabel: {
        ...FONTS.caption,
        marginLeft: 10,
        fontFamily: 'Roboto-Regular',
    },
    textarea: {
        marginHorizontal: 10,
        fontSize: sizes.paragraph,
        minHeight: sizes.height * 0.1,
        borderColor: 'transparent',
    },
    inputContainer: {
        position: 'relative',
    },
    inputExtraButton: {
        position: 'absolute',
        right: 0,
        bottom: 20,
    },
});