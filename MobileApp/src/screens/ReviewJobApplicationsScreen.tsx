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
import JobApplicationList from '../components/JobApplicationList';
import FileViewer from "react-native-file-viewer";
import DocumentPicker from "react-native-document-picker";

type IProps = NativeStackScreenProps<RootStackParamList, 'ReviewJobApplications'>;

const ReviewJobApplicationsScreen: React.FC<IProps> = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userList, setUserList] = useState<any[]>([]);

    const fetchJobApplications = async () => {
        try {
            const res = await fetch(`${API_URL}/job/applied-users/${route.params.jobId}`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (res.ok) {
                const parseRes = await res.json();
                const parseData = parseRes.data
                setUserList(parseData);
                setIsLoading(false);
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
    //         data={controllerData}
    //         keyExtractor={(item)=>`${item.id}`}
    //         renderItem={({item})=><ManageControllerCard data={item} options={controlLevelOptions} companyId={route.params.companyId} refresh={fetchPrevData}/>}
    //         />                
    //     );
    // }
    function renderUserList() {
        return (
            <View>
                <JobApplicationList
                    title="User who applied this job"
                    isLoading={isLoading}
                    data={userList}
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
        if (isMounted) {
            fetchJobApplications();
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
                middleText={"Users applied"}
            />
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <ScrollView>
                    {renderUserList()}
                </ScrollView>
            )}
        </View>
    );
};

export default ReviewJobApplicationsScreen;

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
