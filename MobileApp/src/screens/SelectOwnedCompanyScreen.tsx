import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {colors, FONTS, sizes} from '../constants';
import LoadingComponent from '../components/LoadingComponent';
import {RootStackParamList} from '../types/types';
import {CompanyControlLevel} from '../types/enums';

interface OwnedCompaniesProp {
    company_id: number;
    company_name: string;
    avatar: string;
    owner_control_level: number;
}

type IProps = NativeStackScreenProps<RootStackParamList, 'SelectOwnedCompany'>;

const SelectOwnedCompanyScreen: React.FC<IProps> = ({navigation}) => {
    // const userId = useSelector((state: IRootState) => state.auth.user?.id);
    const [companyList, setCompanyList] = useState<OwnedCompaniesProp[]>([]);
    const [selectedOption, setSelectedOption] = useState<number>();
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    async function init() {
        try {
            const res = await fetch(`${API_URL}/company/owned-company`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            // console.log(parseRes);
            if (res.ok) {
                setCompanyList(parseRes.data);
                setIsLoading(false);
            } else {
                console.log(parseRes.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function selectCompany() {
        setErrorMsg('');
        if (!selectedOption) {
            setErrorMsg('Please select your company');
        } else {
            if (companyList && companyList.length) {
                navigation.navigate('CompanySetting', {
                    companyId: selectedOption,
                    companyName: companyList.find(
                        (obj: any) => obj.company_id === selectedOption,
                    )!['company_name'],
                    companyAvatar: companyList.find(
                        (obj: any) => obj.company_id === selectedOption,
                    )!['avatar'],
                    controlLevel: companyList.find(
                        (obj: any) => obj.company_id === selectedOption,
                    )!['owner_control_level'],
                });
            }
        }
    }

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            init();
        }
        () => (isMounted = false);
    }, []);

    return (
        <View style={styles.container}>
            {!isLoading ? (
                <View style={styles.formContainer}>
                    <Text
                        style={{
                            ...FONTS.minor,
                            marginBottom: 30,
                        }}>
                        Choose a company
                    </Text>
                    <RNPickerSelect
                        onValueChange={setSelectedOption}
                        value={selectedOption}
                        textInputProps={{
                            selectionColor: colors.headline,
                            placeholderTextColor: colors.paragraph,
                        }}
                        items={companyList.map((obj: any) => {
                            return {
                                label: obj.company_name,
                                value: obj.company_id,
                                color: colors.headline,
                            };
                        })}
                    />
                    <View>
                        {errorMsg !== '' && (
                            <Text
                                style={{
                                    ...FONTS.caption,
                                    color: colors.warning,
                                }}>
                                {errorMsg}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.selectBtn}
                        onPress={selectCompany}>
                        <Text
                            style={{
                                ...FONTS.minor,
                                color: colors.main,
                            }}>
                            Select
                        </Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <LoadingComponent />
            )}
        </View>
    );
};

export default SelectOwnedCompanyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.tertiary,
        paddingVertical: sizes.height * 0.05,
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: sizes.width * 0.9,
        height: sizes.height * 0.4,
        backgroundColor: colors.main,
        borderRadius: 15,
        elevation: 5,
    },
    selectBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.button,
        height: 45,
        width: '80%',
        borderRadius: 15,
        marginTop: 30,
    },
});
