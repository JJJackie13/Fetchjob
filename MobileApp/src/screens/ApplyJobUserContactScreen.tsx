import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    RefreshControl,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import {TextArea} from 'native-base';
import {TextInput} from 'react-native-paper';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import RNSearchablePicker from '../components/RNSearchablePicker';
import {useForm, Controller} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'fecha';
import DatePicker from 'react-native-date-picker';
import Toast from 'react-native-toast-message';
import IonIcon from 'react-native-vector-icons/Ionicons';
import SelectBox from 'react-native-multi-selectbox';

import {FormControl, Stack} from 'native-base';
import MinorNavBar from '../components/MinorNavBar';
import {colors, FONTS, sizes} from '../constants';
import {RootStackParamList} from '../types/types';
import {API_URL} from '@env';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import LoadingComponent from '../components/LoadingComponent';
import DocumentPicker from 'react-native-document-picker';
import { borderRadius, height } from 'styled-system';

type Props = NativeStackScreenProps<RootStackParamList, 'ApplyJobUserContact'>;

interface FormData {
    email: string;
    phone: string;
}

interface File {
    name: string;
    uri: string;
    type: string | null;
}

const ApplyJobUserContactScreen: React.FC<Props> = ({navigation, route}) => {
    const scrollRef = useRef<ScrollView>(null);
    const {handleSubmit, control} = useForm<FormData>();
    const [isLoading, setIsLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [emailOptions, setEmailOptions] = useState<any[]>([]);
    const [phoneOptions, setPhoneOptions] = useState<any[]>([]);
    const [file, setFile] = useState<any>();
    const [fileType, setFileType] = useState<any>();

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
            let formData: any = {}
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
            let jobId = route.params.jobId;
            const res = await fetch(
                `${API_URL}/apply/job/${jobId}`,
                {
                    method: 'post',
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
                navigation.navigate("Job");
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

    async function uploadResume(uploadedFile: File) {
        try {
            if (!uploadedFile) {
                return;
            }
            const formData = new FormData();
            formData.append('resume', {
                uri: uploadedFile.uri,
                name: uploadedFile.name,
                type: uploadedFile.type,
            });
            const res = await fetch(`${API_URL}/resume/upload`, {
                method: 'post',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
                body: formData,
            });
            if (res.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Uploaded successfully',
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: (await res.json()).message,
                });
            }
        } catch (error: any) {
            console.log(error);
            Toast.show({
                type: 'error',
                text1: error.toString(),
            });
        }
    }

    async function openDocument() {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            })
            const resData = res[0].name
            const resFileType = res[0].type?.slice(12)
            const resType = res[0].type
            const resUri = res[0].uri
            setFile(resData);
            setFileType(resFileType);
            console.log("File_Name", resUri);

            let uploadedFile = {
                uri: resUri,
                name: resData,
                type: resType,
            };

            Alert.alert('Confirm', 'Upload file', [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Confirm',
                    onPress: () => uploadResume(uploadedFile),
                },
            ]);

        } catch (error) {
            console.log("error", error)
        }
    }

    const fetchOptions = async () => {
        try {
            const resOpts = await fetch(`${API_URL}/user/applyJobInfo`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            if (resOpts.ok) {
                const parseOpts = (await resOpts.json()).result[0];
                console.log("parseOpts", parseOpts)
                setEmailOptions(parseOpts.email);
                setPhoneOptions(parseOpts.phone);
                setIsLoading(false)
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    };

    function renderForm() {
        return(
            <View style={styles.formContainer}>
                {/* Company Name */}
                <Stack mx="4" mb="5">
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
                    <TextInput
                        disabled
                        label="Job Title"
                        value={route.params.job_title}
                        selectionColor={colors.highlight}
                        outlineColor={colors.highlight}
                        underlineColor={colors.highlight}
                        placeholderTextColor={colors.highlight}
                        style={{
                            backgroundColor: colors.main,
                        }}
                    />
                </Stack>
                {/* EMAIL */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    keyboardType="phone-pad"
                                    label="Email address *"
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
                            name="email"
                            defaultValue={
                                emailOptions
                                    ? emailOptions.toString()
                                    : ''
                            }
                        />
                    </FormControl> 
                </Stack>
                {/* PHONE */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    keyboardType="phone-pad"
                                    label="Mobile phone number *"
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
                            name="phone"
                            defaultValue={
                                phoneOptions
                                    ? phoneOptions.toString()
                                    : ''
                            }
                        />
                    </FormControl>
                </Stack>
                <Stack>
                    <View style={styles.uploadFileView}>
                        {fileType ? (
                            <View style={styles.uploadFileType}>
                                <Text
                                    style={{
                                        ...FONTS.paragraph,
                                        fontWeight: 'bold',
                                        marginLeft: 10,
                                        color: colors.main,
                                    }}>
                                    {fileType}
                                </Text>
                            </View>
                        ) : (<></>)}
                        <View>
                            <Text
                                style={{
                                ...FONTS.paragraph,
                                fontWeight: 'bold',
                                marginLeft: 10,
                                color: colors.paragraph,
                                }}>
                                {file}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.uploadFileBtn}
                        onPress={() => openDocument()}
                        >
                        <Text
                            style={{
                                ...FONTS.caption,
                                color: colors.button,
                                fontWeight: 'bold',
                            }}>
                            Upload your resume
                        </Text>
                    </TouchableOpacity>
                </Stack>
            </View>
        )
    }

    const LeftComponent = () => (
        <TouchableOpacity
            onPress={() => {
                    navigation.goBack();
            }}>
            <FontAwesome5 name="times" size={20} color={colors.icon} />
        </TouchableOpacity>
    );

    const RightComponent = () => (
        <TouchableOpacity
            onPress={() => {
                createTwoButtonAlert();
            }}>
            <FontAwesomeIcon
                name="pencil-square-o"
                size={25}
                color={colors.button}
            />
        </TouchableOpacity>
    );

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            fetchOptions();
        }
        return () => {
            isMounted = false;
        };
    }, []);

    return(
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <MinorNavBar
                LeftComponent={LeftComponent}
                //@ts-ignore
                middleText="Apply Job"
                RightComponent={RightComponent}
            />
            {isLoading ? (
                <LoadingComponent />
            ) : (<ScrollView
                scrollEnabled={false}
                ref={scrollRef}
                horizontal
                overScrollMode="never"
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={0}
                snapToInterval={sizes.width}
                >
                {renderForm()}
            </ScrollView>
            )}
        </KeyboardAvoidingView>
    )
};

export default ApplyJobUserContactScreen;

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
    uploadFileView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: sizes.width * 0.8,
        height: sizes.height * 0.1,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
        padding: 5,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.border,
    },
    uploadFileType: {
        display: 'flex',
        width: sizes.height * 0.1,
        height: sizes.height * 0.1,
        position: 'absolute',
        left: 0,
        backgroundColor: colors.button,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadFileBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: sizes.width * 0.8,
        height: sizes.height * 0.05,
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        padding: 5,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.button,
    },
});



{/* <FormControl isRequired>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    keyboardType="phone-pad"
                                    label="Email address *"
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
                            name="email"
                            defaultValue={
                                emailOptions
                                    ? emailOptions.toString()
                                    : ''
                            }
                        />
                    </FormControl> */}

{/* <Text style={styles.formLabel}>Email address *</Text>
                    <FormControl
                        style={{
                            borderBottomColor: colors.highlight,
                            borderBottomWidth: 1,
                        }}
                        isRequired>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <RNPickerSelect
                                    onValueChange={onChange}
                                    value={value}
                                    textInputProps={{
                                        selectionColor: colors.headline,
                                    }}
                                    items={emailOptions.map((obj) => {
                                        return {
                                            label: obj,
                                            value: obj,
                                            color: colors.headline,
                                        };
                                    })}
                                />
                            )}
                            name="email"
                            defaultValue={
                                emailOptions
                                    ? emailOptions.toString()
                                    : ''
                            }
                        />
                    </FormControl> */}