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

type IProps = NativeStackScreenProps<RootStackParamList, 'MangeCompanyController'>;

const MangeCompanyControllerScreen: React.FC<IProps> = ({navigation, route}) => {
    const [listOpen, setListOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [controlLevelOptions, setControlLevelOptions] = useState<any[]>([]);
    const [controllerData, setControllerData] = useState<any>([]);

    const fetchOptions = async () => {
        try {
            const resOpts = await fetch(`${API_URL}/option/control-level`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (resOpts.ok) {
                const parseOpts = await resOpts.json();
                const controlLevelData = parseOpts
                setControlLevelOptions(controlLevelData);
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    async function fetchPrevData() {
        console.log("fetching")
        if (!route.params.companyId) return true;
        try {
            const res = await fetch(`${API_URL}/company/info/${route.params.companyId}`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            if (res.ok) {
                setControllerData(parseRes.owners)
                return true;
            } else {
                console.log(parseRes.message);
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    function renderForm() {
        return (
            <FlatList style={styles.formContainer}
            overScrollMode="never"
            data={controllerData}
            keyExtractor={(item)=>`${item.id}`}
            renderItem={({item})=><ManageControllerCard data={item} options={controlLevelOptions} companyId={route.params.companyId} refresh={fetchPrevData}/>}
            />                
        );
    }
    function renderUserList() {
        return (
            <ManageControllerUserListPage companyId={route.params.companyId} refresh={fetchPrevData} setListOpen={setListOpen}/>
        );
    }


    const LeftComponent = () => (
        <TouchableOpacity
            onPress={() =>navigation.goBack()}>
            <FontAwesome5 name="arrow-left" size={20} color={colors.icon} />
        </TouchableOpacity>
    );
    const RightComponent = () => (
        <TouchableOpacity
            onPress={() =>setListOpen(prev => !prev)}>
            <FontAwesome5 name={listOpen ? "times" : "plus"} size={20} color={colors.icon} />
        </TouchableOpacity>
    );

    useEffect(() => {
        let isMounted = true;
        async function fetchData() {
            const success1 = await fetchOptions();
            const success2 = await fetchPrevData();
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
    useEffect(() => {
        console.log(controllerData)
    }, [controllerData]);

    return (
        <View
            style={styles.container}>
            <MinorNavBar
                LeftComponent={LeftComponent}
                RightComponent={RightComponent}
                middleText={"Manage controllers"}
            />
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <View>
                    {listOpen ? renderUserList() : renderForm()}
                </View>
            )}
        </View>
    );
};

export default MangeCompanyControllerScreen;

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
