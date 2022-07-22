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
import {useSelector, useDispatch} from 'react-redux';
import {FormControl, Stack} from 'native-base';
import {TextInput} from 'react-native-paper';
import {useForm, Controller} from 'react-hook-form';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import DatePicker from 'react-native-date-picker';
import {format} from 'fecha';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';

import {loadToken} from '../store/actions/authActions';
import RNSearchablePicker from '../components/RNSearchablePicker';
import {API_URL} from '@env';
import LoadingComponent from '../components/LoadingComponent';
import {RootStackParamList} from '../types/types';
import MinorNavBar from '../components/MinorNavBar';
import {IRootState} from '../store/store';
import {fetchUserById} from '../store/thunks/userThunk';
import {FONTS, colors, sizes, images} from '../constants';
import TagInput from 'react-native-tags-input';

enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    NTS = 'Prefer Not To Say',
}

interface FormData {
    first_name: string;
    last_name: string;
    gender: string;
    phone: string;
    birthday: Date;
    country_id: string;
    city_id: string;
    education_id: string;
    website: string;
    industry_id: string;
    headline: string;
    experience: string;
    company_name_id: string;
    hobbies: [];
}

interface CompanyInfo {
    company_name_id: string;
    company_name: string;
    company_avatar: string;
    company_industry: string;
}

type Props = NativeStackScreenProps<RootStackParamList, 'BasicInfoEdit'>;

const UserBasicInfoEditScreen: React.FC<Props> = ({navigation}) => {
    const dispatch = useDispatch();
    const userId = useSelector((state: IRootState) => state.auth.user?.id);
    const info = useSelector((state: IRootState) => state.user.info);
    const hobbies = useSelector((state: IRootState) => state.user.hobbies);
    const skills = useSelector((state: IRootState) => state.user.skills);
    const {handleSubmit, control} = useForm<FormData>();
    const [pageNumber, setPageNumber] = useState(1);
    const [cityOptions, setCityOptions] = useState<any[]>([
        {Label: '', value: ''},
    ]);
    const [companyOptions, setCompanyOptions] = useState<any[]>([
        {Label: '', value: '', caption: ''},
    ]);
    const [educationOptions, setEducationOptions] = useState<any[]>([]);
    const [industryOptions, setIndustryOptions] = useState<any[]>([]);
    const [isLoading, setIsloading] = useState<boolean>(true);
    const [optionLoading, setOptionloading] = useState<boolean>(true);
    const [birthdayInput, setBirthdayInput] = useState<string>(
        info && info.birthday
            ? format(new Date(info.birthday), 'YYYY-MM-DD')
            : '',
    );
    const [bdayDisplay, setBdayDisplay] = useState<string>(
        info && info.birthday
            ? format(new Date(info.birthday), 'DDMMMYYYY')
            : '',
    );
    const [bdayModelOpen, setBdayModelOpen] = useState(false);
    const [selectedHobbies, setSelectedHobbies] = useState<any>({
        tag: '',
        tagsArray: [],
    });
    const [selectedSkills, setSelectedSkills] = useState<any>({
        tag: '',
        tagsArray: [],
    });

    async function onSubmit(data: FormData) {
        try {
            // let formData = {...data, birthday: birthdayInput};
            let formData: any = {};
            for (let [key, value] of Object.entries(data)) {
                formData[key] = value === '' ? null : value;
            }
            formData.birthday = birthdayInput === '' ? null : birthdayInput;
            formData.hobbies = selectedHobbies.tagsArray;
            formData.skills = selectedSkills.tagsArray;
            // console.log(formData);
            const res = await fetch(`${API_URL}/auth/basicinfo`, {
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
                const token = parseRes.token;
                dispatch(loadToken(token));
                await fetchUserById(userId)(dispatch);
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

    useEffect(() => {
        const fetchData = async () => {
            const success = await fetchUserById(userId)(dispatch);
            if (success) {
                console.log(hobbies);
                console.log(skills);
                if (hobbies) {
                    setSelectedHobbies((prev: any) => {
                        return {
                            ...prev,
                            tagsArray: hobbies!.map((obj) => obj['content']),
                        };
                    });
                }
                if (skills) {
                    setSelectedSkills((prev: any) => {
                        return {
                            ...prev,
                            tagsArray: skills!.map((obj) => obj['content']),
                        };
                    });
                }
            }
            setIsloading(false);
        };
        fetchData();
    }, [dispatch]);

    useEffect(() => {
        let isMounted = true;
        const fetchOptions = async () => {
            try {
                const resOpts = await fetch(`${API_URL}/option/user-edit`, {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                });
                const res = await fetch(`${API_URL}/company/company-names`, {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                });
                if (resOpts.ok && res.ok) {
                    const parseOpts = await resOpts.json();
                    const parseRes = await res.json();
                    const options = parseOpts.cities.map((obj: any) => {
                        return {
                            label: obj.name,
                            value: obj.id.toString(),
                        };
                    });
                    const companyInfo: CompanyInfo[] = parseRes.data;
                    const companyOptions = companyInfo.map((obj) => {
                        return {
                            label: obj.company_name,
                            value: obj.company_name_id.toString(),
                            image: obj.company_avatar
                                ? {uri: obj.company_avatar}
                                : images.noCompanyAvatar,
                            caption: obj.company_industry,
                        };
                    });
                    if (isMounted) {
                        setEducationOptions(parseOpts.education);
                        setIndustryOptions(parseOpts.industries);
                        setCityOptions((prev: any[]) => {
                            let newArr = JSON.parse(JSON.stringify(prev));
                            return [...newArr, ...options];
                        });
                        setCompanyOptions((prev: any[]) => {
                            let newArr = JSON.parse(JSON.stringify(prev));
                            return [...newArr, ...companyOptions];
                        });
                    }
                }
            } catch (error) {
                console.log(error);
                Toast.show({
                    type: 'error',
                    text1: 'Failed to retrieve data.',
                });
            }
        };
        const fetchOption = async () => {
            await fetchOptions();
            setOptionloading(false);
        };
        setOptionloading(true);
        fetchOption();
        return () => {
            isMounted = false;
        };
    }, []);

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
                            name="first_name"
                            defaultValue={
                                info && info.first_name ? info.first_name : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* LAST NAME */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    label="Last Name"
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
                            name="last_name"
                            defaultValue={
                                info && info.last_name ? info.last_name : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* GENDER */}
                <Stack mx="4" mb="5">
                    <Text style={styles.formLabel}>Gender</Text>
                    <FormControl
                        isRequired
                        style={{
                            borderBottomColor: colors.highlight,
                            borderBottomWidth: 1,
                        }}>
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
                                    items={[
                                        {label: Gender.NTS, value: Gender.NTS},
                                        {
                                            label: Gender.MALE,
                                            value: Gender.MALE,
                                            color: colors.headline,
                                        },
                                        {
                                            label: Gender.FEMALE,
                                            value: Gender.FEMALE,
                                            color: colors.headline,
                                        },
                                    ]}
                                />
                            )}
                            name="gender"
                            defaultValue={
                                info && info.gender ? info.gender : Gender.NTS
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
                                info && info.phone ? info.phone.toString() : ''
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
                                info && info.website ? info.website : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* BIRTHDAY */}
                <Stack mx="4" mb="5" style={styles.inputContainer}>
                    <FormControl isRequired>
                        <TextInput
                            showSoftInputOnFocus={false}
                            label="Birthday"
                            onFocus={() => setBdayModelOpen(true)}
                            value={bdayDisplay}
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
                                        open={bdayModelOpen}
                                        date={value}
                                        onDateChange={(date) => {}}
                                        mode="date"
                                        onConfirm={(date) => {
                                            setBdayModelOpen(false);
                                            if (new Date(date) >= new Date()) {
                                                Toast.show({
                                                    type: 'error',
                                                    text1: 'Selected date is invalid',
                                                });
                                                return;
                                            }
                                            onChange(date);
                                            setBirthdayInput(
                                                format(
                                                    new Date(date),
                                                    'YYYY-MM-DD',
                                                ),
                                            );
                                            setBdayDisplay(
                                                format(
                                                    new Date(date),
                                                    'DDMMMYYYY',
                                                ),
                                            );
                                        }}
                                        onCancel={() => {
                                            setBdayModelOpen(false);
                                        }}
                                    />
                                    <TouchableOpacity
                                        style={styles.inputExtraButton}
                                        onPress={() => {
                                            onChange(new Date());
                                            setBdayDisplay('');
                                            setBirthdayInput('');
                                        }}>
                                        <IonIcon
                                            name="ios-trash-sharp"
                                            size={20}
                                            color={colors.icon}
                                        />
                                    </TouchableOpacity>
                                </>
                            )}
                            name="birthday"
                            defaultValue={
                                info && info.birthday
                                    ? new Date(info.birthday)
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
                                        info && info.city
                                            ? info.city.toString()
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
                                info && info.city_id
                                    ? info.city_id.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* HEADLINE */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    label="Headline"
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
                            name="headline"
                            defaultValue={
                                info && info.headline ? info.headline : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* COMPANY */}
                <Stack mx="4" mb="5">
                    <Text style={styles.formLabel}>Company</Text>
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
                                    data={companyOptions}
                                    placeholder="Choose a company"
                                    defaultSearchBoxValue={
                                        info && info.company_name
                                            ? info.company_name.toString()
                                            : ' '
                                    }
                                    inputStyles={{
                                        borderBottomColor: colors.highlight,
                                        borderBottomWidth: 1,
                                    }}
                                    listStyles={{
                                        maxHeight: 100,
                                        minHeight: 200,
                                    }}
                                    listEmptyValue="None"
                                />
                            )}
                            name="company_name_id"
                            defaultValue={
                                info && info.company_name_id
                                    ? info.company_name_id.toString()
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
                                info && info.industry_id
                                    ? info.industry_id.toString()
                                    : ''
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
                                    label="Experience (year)"
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
                            name="experience"
                            defaultValue={
                                info && info.experience
                                    ? info.experience.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* EDUCATION */}
                <Stack mx="4" mb="5">
                    <Text style={styles.formLabel}>Education</Text>
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
                                    items={educationOptions.map((obj) => {
                                        return {
                                            label: obj.name,
                                            value: obj.id.toString(),
                                            color: colors.headline,
                                        };
                                    })}
                                />
                            )}
                            name="education_id"
                            defaultValue={
                                info && info.education_id
                                    ? info.education_id.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
            </View>
        );
    }
    function renderFormPage3() {
        return (
            <View style={styles.formContainer}>
                {/* HOBBIES */}
                <Stack mx="4" mb="5">
                    <Text style={styles.formLabel}>Hobbies</Text>
                    <TagInput
                        updateState={setSelectedHobbies}
                        tags={selectedHobbies}
                        keysForTag={', '}
                        inputContainerStyle={{
                            borderBottomWidth: 1,
                            borderBottomColor: colors.highlight,
                            paddingVertical: 5,
                        }}
                        tagStyle={{backgroundColor: colors.highlight}}
                        label="Input comma & space to add a tag"
                        deleteElement={
                            <Entypo
                                name="circle-with-cross"
                                size={15}
                                color="#fff"
                            />
                        }
                    />
                </Stack>
            </View>
        );
    }
    function renderFormPage4() {
        return (
            <View style={styles.formContainer}>
                {/* Skills */}
                <Stack mx="4" mb="5">
                    <Text style={styles.formLabel}>Skills</Text>
                    <TagInput
                        updateState={setSelectedSkills}
                        tags={selectedSkills}
                        keysForTag={', '}
                        inputContainerStyle={{
                            borderBottomWidth: 1,
                            borderBottomColor: colors.highlight,
                            paddingVertical: 5,
                        }}
                        tagStyle={{backgroundColor: colors.highlight}}
                        label="Input comma & space to add a tag"
                        deleteElement={
                            <Entypo
                                name="circle-with-cross"
                                size={15}
                                color="#fff"
                            />
                        }
                    />
                </Stack>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <MinorNavBar
                middleText={`Edit Basic Info`}
                minorText={` ${pageNumber}/3`}
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
                        {renderFormPage3()}
                        {renderFormPage4()}
                    </ScrollView>
                </View>
            )}
        </KeyboardAvoidingView>
    );
};

export default UserBasicInfoEditScreen;

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
        marginBottom: 5,
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
