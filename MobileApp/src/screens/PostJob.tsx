import React, {useState, useEffect, useRef} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import {TextArea} from 'native-base';
import {TextInput} from 'react-native-paper';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import RNSearchablePicker from '../components/RNSearchablePicker';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'fecha';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SelectBox from 'react-native-multi-selectbox';

import {RootStackParamList} from '../types/types';
import MinorNavBar from '../components/MinorNavBar';
import {colors, sizes, FONTS} from '../constants';
import {FormControl, Stack} from 'native-base';
import {API_URL} from '@env';
import LoadingComponent from '../components/LoadingComponent';

type IProps = NativeStackScreenProps<RootStackParamList, 'PostJob'>;

interface FormData {
    job_title: string;
    job_detail: string;
    city_id: number;
    education_requirement_id: number;
    experience_requirement: number;
    annual_leave: number;
    contact_person: string;
    contact_email: string;
    contact_phone: string;
    auto_delist: Date;
    job_employment_type: [];
}

const PostJob: React.FC<IProps> = ({navigation, route}) => {
    const scrollRef = useRef<ScrollView>(null);
    const {handleSubmit, control} = useForm<FormData>();
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [educationOptions, setEducationOptions] = useState<any[]>([]);
    const [employmentTypeOptions, setEmploymentTypeOptions] = useState<any[]>(
        [],
    );
    const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<
        any[]
    >([]);
    const [cityOptions, setCityOptions] = useState<any[]>([
        {Label: '', value: ''},
    ]);
    const [jobData, setJobData] = useState<any>([]);
    const [wordCount, setWordCount] = useState<number>(0);
    const [delistDateInput, setDelistDateInput] = useState<string>();
    const [delistDateDisplay, setDelistDateDisplay] = useState<string>();
    const [delistDateModelOpen, setDelistDateModelOpen] = useState(false);

    const createTwoButtonAlert = () =>
        Alert.alert('Confirm', '', [
            {
                text: 'Cancel',
                onPress: () => {},
                style: 'cancel',
            },
            {text: 'Confirm', onPress: () => handleSubmit(onSubmit)()},
        ]);

    async function onSubmit(data: FormData) {
        try {
            if (selectedEmploymentTypes.length === 0) {
                Toast.show({
                    type: 'error',
                    text1: 'All inputs are required',
                });
                return;
            }
            let formData: any = {};
            for (let [key, value] of Object.entries(data)) {
                if (formData[key] === '') {
                    Toast.show({
                        type: 'error',
                        text1: 'All inputs are required',
                    });
                    return;
                }
                formData[key] = value;
            }
            formData.auto_delist =
                delistDateInput === '' ? null : delistDateInput;
            formData.job_employment_type = selectedEmploymentTypes;
            // console.log(formData);
            let jobId = route.params.jobId;
            let companyId = route.params.companyId;
            const res = await fetch(
                `${API_URL}/job/${jobId ? jobId : companyId}`,
                {
                    method: jobId ? 'put' : 'post',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                },
            );
            const parseRes = await res.json();
            if (res.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                });
                navigation.goBack();
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

    const fetchOptions = async () => {
        try {
            const resOpts = await fetch(`${API_URL}/option/job-edit`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (resOpts.ok) {
                const parseOpts = await resOpts.json();
                const cityOptionData = parseOpts.cities.map((obj: any) => {
                    return {
                        label: obj.name,
                        value: obj.id.toString(),
                    };
                });
                setEducationOptions(parseOpts.education);
                setEmploymentTypeOptions(parseOpts.employmentTypes);
                // console.log(parseOpts.employmentTypes);
                setCityOptions((prev: any[]) => {
                    let newArr = JSON.parse(JSON.stringify(prev));
                    return [...newArr, ...cityOptionData];
                });
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
        if (!route.params.jobId) return true;
        try {
            const res = await fetch(`${API_URL}/job/${route.params.jobId}`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            if (res.ok) {
                setJobData(parseRes.data);
                let delistDate = parseRes.data.auto_delist;
                if (delistDate) {
                    setDelistDateInput(
                        format(new Date(delistDate), 'YYYY-MM-DD'),
                    );
                    setDelistDateDisplay(
                        format(new Date(delistDate), 'DDMMMYYYY'),
                    );
                }
                let employmentTypesData = parseRes.employmentTypes.map(
                    (obj: any) => {
                        return {id: obj.job_id, item: obj.name};
                    },
                );
                setSelectedEmploymentTypes(employmentTypesData);
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
            <View style={styles.formContainer}>
                {/* Company Name */}
                <Stack mx="4">
                    <TextInput
                        disabled
                        label="Company Name"
                        value={route.params.companyName}
                        selectionColor={colors.highlight}
                        outlineColor={colors.highlight}
                        underlineColor={colors.highlight}
                        placeholderTextColor={colors.highlight}
                        style={{
                            backgroundColor: colors.main,
                        }}
                    />
                </Stack>
                {/* Job Title */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    label="Job Title *"
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
                            name="job_title"
                            defaultValue={
                                jobData && jobData.job_title
                                    ? jobData.job_title
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* CITY */}
                <Stack mx="4" mb="5">
                    <Text style={styles.formLabel}>City *</Text>
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <RNSearchablePicker
                                    inputContainerStyle={{
                                        borderBottomColor: 'transparent',
                                    }}
                                    emptyMessage="Fetch failed"
                                    onSelect={onChange}
                                    data={cityOptions}
                                    placeholder="Choose a city *"
                                    defaultSearchBoxValue={
                                        jobData && jobData.city
                                            ? jobData.city.toString()
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
                                jobData && jobData.city_id
                                    ? jobData.city_id.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* EDUCATION REQUIREMENT */}
                <Stack mx="4" mb="5">
                    <Text style={styles.formLabel}>Education requirement*</Text>
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
                            name="education_requirement_id"
                            defaultValue={
                                jobData && jobData.education_requirement_id
                                    ? jobData.education_requirement_id.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* EXPERIENCE REQUIREMENT */}
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
                                    label="Experience Requirement (year) *"
                                    value={value.toString()}
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
                            name="experience_requirement"
                            defaultValue={
                                jobData && jobData.experience_requirement
                                    ? jobData.experience_requirement.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* ANNUAL LEAVE */}
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
                                    label="Annual Leave (day) *"
                                    value={value.toString()}
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
                            name="annual_leave"
                            defaultValue={
                                jobData && jobData.annual_leave
                                    ? jobData.annual_leave.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
            </View>
        );
    }
    function renderFormPage2() {
        return (
            <View style={{...styles.formContainer, position: 'relative'}}>
                {/* Job Detail */}
                <Text style={styles.formLabel}>Job Details *</Text>
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextArea
                                    value={value}
                                    onChangeText={(text) => {
                                        if (text.length <= 1000) {
                                            onChange(text);
                                            setWordCount(text.length);
                                        }
                                    }}
                                    style={styles.textarea}
                                    placeholder="Enter job details..."
                                    isFullWidth
                                    _focus={{borderColor: 'transparent'}}
                                />
                            )}
                            name="job_detail"
                            defaultValue={
                                jobData && jobData.job_detail
                                    ? jobData.job_detail
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                <Text
                    style={{
                        position: 'absolute',
                        right: 10,
                        top: 5,
                        ...FONTS.caption,
                        color: wordCount <= 1000 ? colors.icon : colors.warning,
                    }}>
                    {wordCount} / 1000
                </Text>
            </View>
        );
    }
    function renderFormPage3() {
        return (
            <View style={styles.formContainer}>
                {/* JOB EMPLOYMENT TYPE */}
                <Stack mx="4" mb="5" style={styles.inputContainer}>
                    <SelectBox
                        label="Employment Type(s) *"
                        options={employmentTypeOptions.map((obj: any) => {
                            return {id: obj.id, item: obj.name};
                        })}
                        selectedValues={selectedEmploymentTypes}
                        onMultiSelect={(item: any) => {
                            setSelectedEmploymentTypes((prev: any) => {
                                return prev.some(
                                    (obj: any) => obj.id === item.id,
                                )
                                    ? prev.filter(
                                          (obj: any) => obj.id != item.id,
                                      )
                                    : [...prev, item];
                            });
                        }}
                        onTapClose={(item: any) =>
                            setSelectedEmploymentTypes((prev: any) => {
                                return prev.filter(
                                    (obj: any) => obj.id != item.id,
                                );
                            })
                        }
                        isMulti
                        containerStyle={{
                            borderBottomWidth: 1,
                            borderBottomColor: colors.highlight,
                        }}
                        toggleIconColor={colors.highlight}
                        searchIconColor={colors.highlight}
                        arrowIconColor={colors.highlight}
                        multiOptionContainerStyle={{
                            backgroundColor: colors.highlight,
                        }}
                    />
                </Stack>
                {/* Contact Person */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    label="Contact Person *"
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
                            name="contact_person"
                            defaultValue={
                                jobData && jobData.contact_person
                                    ? jobData.contact_person
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* Contact Email */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    keyboardType="email-address"
                                    label="Contact Email *"
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
                            name="contact_email"
                            defaultValue={
                                jobData && jobData.contact_email
                                    ? jobData.contact_email
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* Contact Phone */}
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
                                    label="Contact Phone *"
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
                            name="contact_phone"
                            defaultValue={
                                jobData && jobData.contact_phone
                                    ? jobData.contact_phone.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                {/* AUTO DELIST DATE */}
                <Stack mx="4" mb="5" style={styles.inputContainer}>
                    <FormControl isRequired>
                        <TextInput
                            showSoftInputOnFocus={false}
                            label="Job delist date *"
                            onFocus={() => setDelistDateModelOpen(true)}
                            value={delistDateDisplay}
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
                                        minimumDate={
                                            new Date(new Date().getDate() + 1)
                                        }
                                        open={delistDateModelOpen}
                                        date={value}
                                        onDateChange={(date) => {}}
                                        mode="date"
                                        onConfirm={(date) => {
                                            setDelistDateModelOpen(false);
                                            if (new Date(date) < new Date()) {
                                                Toast.show({
                                                    type: 'error',
                                                    text1: 'Selected date is invalid',
                                                });
                                                return;
                                            }
                                            onChange(date);
                                            setDelistDateInput(
                                                format(
                                                    new Date(date),
                                                    'YYYY-MM-DD',
                                                ),
                                            );
                                            setDelistDateDisplay(
                                                format(
                                                    new Date(date),
                                                    'DDMMMYYYY',
                                                ),
                                            );
                                        }}
                                        onCancel={() => {
                                            setDelistDateModelOpen(false);
                                        }}
                                    />
                                    <TouchableOpacity
                                        style={styles.inputExtraButton}
                                        onPress={() => {
                                            onChange(new Date());
                                            setDelistDateDisplay('');
                                            setDelistDateInput('');
                                        }}>
                                        <IonIcon
                                            name="ios-trash-sharp"
                                            size={20}
                                            color={colors.icon}
                                        />
                                    </TouchableOpacity>
                                </>
                            )}
                            name="auto_delist"
                            defaultValue={
                                jobData && jobData.auto_delist
                                    ? new Date(jobData.auto_delist)
                                    : new Date()
                            }
                        />
                    </FormControl>
                </Stack>
            </View>
        );
    }

    const LeftComponent = () => (
        <TouchableOpacity
            onPress={() => {
                if (pageNumber === 1) {
                    navigation.goBack();
                } else {
                    scrollRef.current?.scrollTo({
                        y: 0,
                        x: sizes.width * (pageNumber - 2),
                    });
                }
            }}>
            {pageNumber === 1 ? (
                <FontAwesome5 name="times" size={20} color={colors.icon} />
            ) : (
                <FontAwesome5 name="arrow-left" size={20} color={colors.icon} />
            )}
        </TouchableOpacity>
    );

    const RightComponent = () => (
        <TouchableOpacity
            onPress={() => {
                if (!isLoading) {
                    if (pageNumber === 3) {
                        createTwoButtonAlert();
                    } else {
                        scrollRef.current?.scrollTo({
                            y: 0,
                            x: sizes.width * pageNumber,
                        });
                    }
                }
            }}>
            {pageNumber === 3 ? (
                <FontAwesomeIcon
                    name="pencil-square-o"
                    size={25}
                    color={colors.button}
                />
            ) : (
                <FontAwesome5
                    name="arrow-right"
                    size={20}
                    color={colors.icon}
                />
            )}
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

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <MinorNavBar
                LeftComponent={LeftComponent}
                //@ts-ignore
                middleText={route?.params?.jobId ? 'Edit Job' : 'Post Job'}
                minorText={` ${pageNumber} / 3`}
                RightComponent={RightComponent}
            />
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled={true}
                    scrollEnabled={false}
                    ref={scrollRef}
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
                </ScrollView>
            )}
        </KeyboardAvoidingView>
    );
};

export default PostJob;

const styles = StyleSheet.create({
    container: {
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
