import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
    Platform,
} from 'react-native';
import {FormControl, Stack} from 'native-base';
import {TextInput} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import DatePicker from 'react-native-date-picker';
import {format} from 'fecha';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';

import RNSearchablePicker from '../components/RNSearchablePicker';
import {API_URL} from '@env';
import LoadingComponent from '../components/LoadingComponent';
import {RootStackParamList, CompanyProfileProps} from '../types/types';
import MinorNavBar from '../components/MinorNavBar';
import {FONTS, colors, sizes, images} from '../constants';

interface FormData {
    name: string;
    phone: string;
    establish_in: Date;
    country_id: string;
    city_id: string;
    type_id: string;
    website: string;
    email: string;
    address: string;
    industry_id: string;
    business_size: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'CompanyBasicInfoEdit'>;

const CompanyBasicInfoEditScreen: React.FC<Props> = ({navigation,route}) => {
    const [pageNumber, setPageNumber] = useState(1);
    const [cityOptions, setCityOptions] = useState<any[]>([
        {Label: '', value: ''},
    ]);
    const [typeOptions, setTypeOptions] = useState<any[]>([]);
    const [industryOptions, setIndustryOptions] = useState<any[]>([]);
    const [isLoading, setIsloading] = useState<boolean>(true);
    const [optionLoading, setOptionloading] = useState<boolean>(true);
    const [companyProfile, setCompanyProfile] = useState<CompanyProfileProps>();
    const [eYearModelOpen, setEYearModelOpen] = useState(false);
    const [eYearInput, setEYearInput] = useState<string>('');
    const [eYearDisplay, setEYearDisplay] = useState<string>('');

    const {handleSubmit, control} = useForm<FormData>();

    async function onSubmit(data: FormData) {
        try {
            // let formData = {...data, birthday: birthdayInput};
            let formData: any = {};
            for (let [key, value] of Object.entries(data)) {
                formData[key] = value === '' ? null : value;
            }
            formData.establish_in = eYearInput === '' ? null : eYearInput;
            // console.log(formData);
            const res = await fetch(`${API_URL}/company/basicinfo/${route.params.companyId}`, {
                method: 'post',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const parseRes = await res.json();
            if (res.ok) {
                Toast.show({
                    type: 'success',
                    text1: parseRes.message,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: parseRes.message,
                });
            }
        } catch (error) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: 'Failed to make request.',
            });
        }
    }

    const createTwoButtonAlert = () =>
        Alert.alert('Confirm Changes', '', [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {text: 'Confirm', onPress: () => handleSubmit(onSubmit)()},
        ]);

    const LeftComponent = () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <IonIcon name="chevron-back" size={25} />
        </TouchableOpacity>
    );

    const RightComponent = () => (
        <TouchableOpacity
            onPress={() => {
                if (isLoading && optionLoading) {
                    return;
                } else {
                    createTwoButtonAlert();
                }
            }}>
            <Text style={{...FONTS.minor, color: colors.button}}>Save</Text>
        </TouchableOpacity>
    );

    function renderForm() {
        return (
            <View style={styles.formContainer}>
                {/* FIRST NAME */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    label="First Name"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    selectionColor={colors.highlight}
                                    outlineColor={colors.highlight}
                                    underlineColor={colors.highlight}
                                    placeholderTextColor={colors.highlight}
                                    style={{
                                        backgroundColor: colors.main,
                                    }}
                                />
                            )}
                            name="name"
                            defaultValue={
                                companyProfile && companyProfile.company_name ? companyProfile.company_name : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* PHONE */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    keyboardType="phone-pad"
                                    label="Phone"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    selectionColor={colors.highlight}
                                    outlineColor={colors.highlight}
                                    underlineColor={colors.highlight}
                                    placeholderTextColor={colors.highlight}
                                    style={{
                                        backgroundColor: colors.main,
                                    }}
                                />
                            )}
                            name="phone"
                            defaultValue={
                                companyProfile && companyProfile.phone ? companyProfile.phone.toString() : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* WEBSITE */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    label="Website"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    selectionColor={colors.highlight}
                                    outlineColor={colors.highlight}
                                    underlineColor={colors.highlight}
                                    placeholderTextColor={colors.highlight}
                                    style={{
                                        backgroundColor: colors.main,
                                    }}
                                />
                            )}
                            name="website"
                            defaultValue={
                                companyProfile && companyProfile.website ? companyProfile.website : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* EMAIL */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    label="Email"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    selectionColor={colors.highlight}
                                    outlineColor={colors.highlight}
                                    underlineColor={colors.highlight}
                                    placeholderTextColor={colors.highlight}
                                    style={{
                                        backgroundColor: colors.main,
                                    }}
                                />
                            )}
                            name="email"
                            defaultValue={
                                companyProfile && companyProfile.email ? companyProfile.email : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* ADDRESS */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    label="Address"
                                    value={value}
                                    onChangeText={onChange}
                                    onBlur={onBlur}
                                    selectionColor={colors.highlight}
                                    outlineColor={colors.highlight}
                                    underlineColor={colors.highlight}
                                    placeholderTextColor={colors.highlight}
                                    style={{
                                        backgroundColor: colors.main,
                                    }}
                                />
                            )}
                            name="address"
                            defaultValue={
                                companyProfile && companyProfile.address ? companyProfile.address : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* ESTABLISHMENT */}
                <Stack mx="4" mb="5" style={styles.inputContainer}>
                    <FormControl isRequired>
                        <TextInput
                            showSoftInputOnFocus={false}
                            label="Established in"
                            onFocus={() => setEYearModelOpen(true)}
                            value={eYearDisplay}
                            selectionColor={colors.highlight}
                            outlineColor={colors.highlight}
                            underlineColor={colors.highlight}
                            placeholderTextColor={colors.highlight}
                            style={{
                                backgroundColor: colors.main,
                            }}
                        />
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <>
                                    <DatePicker
                                        modal
                                        maximumDate={new Date()}
                                        open={eYearModelOpen}
                                        date={value}
                                        onDateChange={(date:any) => {}}
                                        mode="date"
                                        onConfirm={(date:any) => {
                                            setEYearModelOpen(false);
                                            if (new Date(date) >= new Date()) {
                                                Toast.show({
                                                    type: 'error',
                                                    text1: 'Selected date is invalid',
                                                });
                                                return;
                                            }
                                            onChange(date);
                                            setEYearInput(
                                                format(
                                                    new Date(date),
                                                    'YYYY',
                                                ),
                                            );
                                            setEYearDisplay(
                                                format(
                                                    new Date(date),
                                                    'YYYY',
                                                ),
                                            );
                                        }}
                                        onCancel={() => {
                                            setEYearModelOpen(false);
                                        }}
                                    />
                                    <TouchableOpacity
                                        style={styles.inputExtraButton}
                                        onPress={() => {
                                            onChange(new Date());
                                            setEYearDisplay('');
                                            setEYearInput('');
                                        }}>
                                        <IonIcon
                                            name="ios-trash-sharp"
                                            size={20}
                                            color={colors.icon}
                                        />
                                    </TouchableOpacity>
                                </>
                            )}
                            name="establish_in"
                            defaultValue={
                                companyProfile && companyProfile.establish_in
                                    ? new Date(companyProfile.establish_in)
                                    : new Date()
                            }
                        />
                    </FormControl>
                </Stack>
            </View>
        );
    }
    function renderFormPage2() {
        return (
            <View style={styles.formContainer}>
                {/* COMPANY TYPE */}
                <Stack mx="4" mb="5">
                    <Text style={styles.formLabel}>Company Type</Text>
                    <FormControl
                        style={{
                            borderBottomColor: colors.highlight,
                            borderBottomWidth: 1,
                        }}
                        isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <RNPickerSelect
                                    onValueChange={onChange}
                                    value={value}
                                    textInputProps={{
                                        selectionColor: colors.headline,
                                    }}
                                    items={typeOptions.map((obj) => {
                                        return {
                                            label: obj.name,
                                            value: obj.id.toString(),
                                            color: colors.headline,
                                        };
                                    })}
                                />
                            )}
                            name="type_id"
                            defaultValue={
                                companyProfile && companyProfile.type_id
                                    ? companyProfile.type_id.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* CITY */}
                <Stack mx="4" mb="5">
                    <Text style={styles.formLabel}>City</Text>
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            render={({field: {onChange, onBlur, value}}) => (
                                <RNSearchablePicker
                                    inputContainerStyle={{
                                        borderBottomColor: 'transparent',
                                    }}
                                    emptyMessage="Fetch failed"
                                    onSelect={onChange}
                                    data={cityOptions}
                                    placeholder="Choose a city"
                                    defaultSearchBoxValue={
                                        companyProfile && companyProfile.city
                                            ? companyProfile.city.toString()
                                            : ' '
                                    }
                                    inputStyles={{
                                        borderBottomColor: colors.highlight,
                                        borderBottomWidth: 1,
                                    }}
                                    containerStyles={{marginHorizontal: 10}}
                                    listStyles={{
                                        maxHeight: 100,
                                        minHeight: 200,
                                    }}
                                    listEmptyValue="None"
                                />
                            )}
                            name="city_id"
                            defaultValue={
                                companyProfile && companyProfile.city_id
                                    ? companyProfile.city_id.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                                {/* INDUSTRY */}
                                <Stack mx="4" mb="5">
                    <Text style={styles.formLabel}>Industry</Text>
                    <FormControl
                        style={{
                            borderBottomColor: colors.highlight,
                            borderBottomWidth: 1,
                        }}
                        isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <RNPickerSelect
                                    onValueChange={onChange}
                                    value={value}
                                    textInputProps={{
                                        selectionColor: colors.headline,
                                        placeholderTextColor: colors.paragraph,
                                    }}
                                    items={industryOptions.map((obj) => {
                                        return {
                                            label: obj.name,
                                            value: obj.id.toString(),
                                            color: colors.headline,
                                        };
                                    })}
                                />
                            )}
                            name="industry_id"
                            defaultValue={
                                companyProfile && companyProfile.industry_id ? companyProfile.industry_id.toString() : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* EXPERIENCE */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    keyboardType="numeric"
                                    label="Business size (employees)"
                                    value={value}
                                    onChangeText={(text) =>
                                        onChange(text.replace(/[^0-9]/g, ''))
                                    }
                                    onBlur={onBlur}
                                    selectionColor={colors.highlight}
                                    outlineColor={colors.highlight}
                                    underlineColor={colors.highlight}
                                    placeholderTextColor={colors.highlight}
                                    style={{
                                        backgroundColor: colors.main,
                                    }}
                                />
                            )}
                            name="business_size"
                            defaultValue={
                                companyProfile && companyProfile.business_size
                                    ? companyProfile.business_size.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
            </View>
        );
    }
    
    useEffect(() => {
        setIsloading(true);
        async function fetchData() {
            try {
                const resOpts = await fetch(`${API_URL}/option/company-edit`, {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                });
                const res = await fetch(
                    `${API_URL}/company/info/${route.params.companyId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${await AsyncStorage.getItem(
                                'token',
                            )}`,
                        },
                    },
                );
                const parseOptions = await resOpts.json()
                if(resOpts.ok) {
                    const options = parseOptions.cities.map((obj: any) => {
                        return {
                            label: obj.name,
                            value: obj.id.toString(),
                        };
                    });
                    setCityOptions((prev: any[]) => {
                        let newArr = JSON.parse(JSON.stringify(prev));
                        return [...newArr, ...options];
                    });
                    setIndustryOptions(parseOptions.industries);
                    setTypeOptions(parseOptions.companyTypes)
                }else {
                    return console.log(parseOptions.message);
                }
                setOptionloading(false)
                const parseRes = await res.json();
                if (res.ok) {
                    setCompanyProfile(parseRes.data);
                    if(parseRes.data.establish_in){
                        setEYearInput(parseRes.data.establish_in.toString())
                        setEYearDisplay(parseRes.data.establish_in.toString())
                    }
                } else {
                    return console.log(parseRes.message);
                }

                setIsloading(false);
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [route.params.companyId]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <MinorNavBar
                middleText={`Edit Basic Info`}
                minorText={` ${pageNumber}/2`}
                LeftComponent={LeftComponent}
                RightComponent={RightComponent}
            />
            {isLoading || optionLoading ? (
                <LoadingComponent />
            ) : (
                <View style={styles.scrollview}>
                    <ScrollView
                        horizontal
                        overScrollMode="never"
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={0}
                        snapToInterval={sizes.width}
                        onScroll={(e) => {
                            setPageNumber(
                                Math.round(
                                    e.nativeEvent.contentOffset.x / sizes.width,
                                ) + 1,
                            );
                        }}>
                        {renderForm()}
                        {renderFormPage2()}
                    </ScrollView>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

export default CompanyBasicInfoEditScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
        position: 'relative',
    },
    scrollview: {
        flex: 1,
    },
    formContainer: {
        marginTop: 5,
        width: sizes.width - 20,
        marginHorizontal: 10,
        backgroundColor: colors.main,
        borderRadius: 15,
        padding: 15,
        paddingBottom: 30,
    },
    formLabel: {
        ...FONTS.caption,
        marginLeft: 10,
        fontFamily: 'Roboto-Regular',
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
