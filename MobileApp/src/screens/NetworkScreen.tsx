import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';

import { IRootState } from '../store/store';
import {colors, FONTS} from '../constants';
import {RootStackParamList} from '../types/types';
import RecommendConnectionList from '../components/Network/RecommendConnectionList';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingComponent from '../components/LoadingComponent';

type Props = NativeStackScreenProps<RootStackParamList, 'Network'>;

const NetworkScreen: React.FC<Props> = ({navigation}) => {
    const update = useSelector((state:IRootState)=>state.auth.user?.updated_at)
    const [isLoading, setIsLoading] = useState(true);
    const [industryList, setIndustryList] = useState();
    const [companyList, setCompanyList] = useState();
    const [hobbyList, setHobbyList] = useState();
    const [hobbyName, setHobbyName] = useState('');
    const [skillList, setSkillList] = useState();
    const [skillName, setSkillName] = useState('');

    async function fetchRecommendation() {
        try {
            const industryRes = await fetch(
                `${API_URL}/network/recommend/industry`,
                {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const companyRes = await fetch(
                `${API_URL}/network/recommend/company`,
                {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const hobbyRes = await fetch(`${API_URL}/network/recommend/hobby`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const skillRes = await fetch(`${API_URL}/network/recommend/skill`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (industryRes.ok && companyRes.ok && hobbyRes.ok && skillRes.ok) {
                const industryData = (await industryRes.json());
                const companyData = (await companyRes.json());
                const parseHobbyRes = await hobbyRes.json();
                const parseSkillRes = await skillRes.json();
                const hobbyData = parseHobbyRes.data;
                const hobbyName = parseHobbyRes.hobbyName;
                const skillData = parseSkillRes.data;
                const skillName = parseSkillRes.skillName;
                if(industryData.isValid){
                    setIndustryList(industryData.data);
                }
                if(companyData.isValid){
                    setCompanyList(companyData.data);
                }
                if(parseHobbyRes.isValid){
                    setHobbyList(hobbyData);
                    setHobbyName(hobbyName);
                }
                if(parseSkillRes.isValid){
                    setSkillList(skillData);
                    setSkillName(skillName);
                }
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function renderConnectionNavigationBtn() {
        return (
            <TouchableOpacity
                style={styles.connectionReqBtn}
                onPress={() => navigation.navigate('ConnectionList')}>
                <MaterialIcon
                    name="supervised-user-circle"
                    size={25}
                    color={colors.minorText}
                />
                <Text
                    style={{
                        ...FONTS.minor,
                        fontWeight: 'bold',
                        marginLeft: 10,
                        color: colors.icon,
                    }}>
                    Manage connections
                </Text>
            </TouchableOpacity>
        );
    }
    function renderInvitationNavigationBtn() {
        return (
            <TouchableOpacity
                style={{...styles.connectionReqBtn}}
                onPress={() => navigation.navigate('ConnectionRequestList')}>
                <FontAwesome5
                    style={{marginLeft: 4, marginRight: 2}}
                    name="user-clock"
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
                    Connection Requests
                </Text>
            </TouchableOpacity>
        );
    }

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            setIndustryList(undefined);
            setCompanyList(undefined);
            setHobbyList(undefined);
            setSkillList(undefined);
            fetchRecommendation();
        }
        () => (isMounted = false);
    }, [update]);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <ScrollView
                overScrollMode="never"
                    scrollEventThrottle={10}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={isLoading}
                            onRefresh={fetchRecommendation}
                        />
                    }>
                    {renderConnectionNavigationBtn()}
                    {renderInvitationNavigationBtn()}
                    {industryList &&
                    <RecommendConnectionList
                        title="People in similar industry"
                        isLoading={isLoading}
                        data={industryList}
                    />
                    }
                    {companyList &&
                    <RecommendConnectionList
                        title="People in same company"
                        isLoading={isLoading}
                        data={companyList}
                    />
                    }
                    {hobbyList &&
                    <RecommendConnectionList
                        title={`People who also like ${hobbyName}`}
                        isLoading={isLoading}
                        data={hobbyList}
                    />
                    }
                    {skillList &&
                    <RecommendConnectionList
                        title={`People who're also good at ${skillName}`}
                        isLoading={isLoading}
                        data={skillList}
                    />
                    }
                </ScrollView>
            )}
        </View>
    );
};

export default NetworkScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    connectionReqBtn: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 50,
        backgroundColor: colors.main,
        // elevation: 8,
    },
});
