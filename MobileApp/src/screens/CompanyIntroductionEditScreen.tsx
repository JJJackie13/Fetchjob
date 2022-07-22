import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
    TextInput,
} from 'react-native';
import {FormControl, Stack} from 'native-base';
import {useForm, Controller} from 'react-hook-form';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import LoadingComponent from '../components/LoadingComponent';
import {API_URL} from '@env';

import {RootStackParamList} from '../types/types';
import MinorNavBar from '../components/MinorNavBar';
import {fetchUserById} from '../store/thunks/userThunk';
import {FONTS, colors, sizes} from '../constants';

interface FormData {
    introduction: string;
}

type Props = NativeStackScreenProps<
    RootStackParamList,
    'CompanyIntroductionEdit'
>;

const CompanyIntroductionEditScreen: React.FC<Props> = ({
    navigation,
    route,
}) => {
    const [focused, setFocused] = useState<boolean>(false);
    const [wordCount, setWordCount] = useState<number>(0);
    const [introduction, setIntroduction] = useState<string>('');
    const [isLoading, setIsloading] = useState<boolean>(true);
    const {handleSubmit, control} = useForm<FormData>();
    const wordLimit = 2000;

    async function onSubmit(data: FormData) {
        try {
            if (wordCount > wordLimit) {
                Toast.show({
                    type: 'error',
                    text1: `Exceeded word limit (${wordLimit}).`,
                });
                return;
            }
            const res = await fetch(
                `${API_URL}/company/basicinfo/${route.params.companyId}`,
                {
                    method: 'post',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                },
            );
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

    useEffect(() => {
        setIsloading(true);
        async function fetchData() {
            try {
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
                const parseRes = await res.json();
                if (res.ok) {
                    setIntroduction(parseRes.data.introduction);
                    setWordCount(parseRes.data.introduction.length);
                    setIsloading(false);
                } else {
                    console.log(parseRes.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchData();
    }, [route.params.companyId]);

    const LeftComponent = () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <IonIcon name="chevron-back" size={25} />
        </TouchableOpacity>
    );

    const RightComponent = () => (
        <TouchableOpacity
            onPress={() => {
                if (isLoading) {
                    return;
                } else {
                    createTwoButtonAlert();
                }
            }}>
            <Text style={{...FONTS.minor, color: colors.button}}>Save</Text>
        </TouchableOpacity>
    );

    function renderFormPage1() {
        return (
            <View style={styles.formContainer}>
                {/* INTRODUCTION */}
                <Stack mx="4" mb="5">
                    <FormControl isRequired style={styles.inputContainer}>
                        <Controller
                            control={control}
                            // rules={{
                            //     required: true,
                            // }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    onBlur={() => {
                                        onBlur();
                                        setFocused(false);
                                    }}
                                    onFocus={() => setFocused(true)}
                                    onChangeText={(text) => {
                                        if (text.length > wordLimit) {
                                            return;
                                        }
                                        onChange(text);
                                        setWordCount(text.length);
                                    }}
                                    value={value}
                                    defaultValue={value}
                                    placeholder="Introduce yourself..."
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        maxHeight: sizes.height * 0.5,
                                        borderWidth: 2,
                                        borderColor: focused
                                            ? colors.highlight
                                            : colors.icon,
                                        borderRadius: 10,
                                        ...FONTS.minor,
                                    }}
                                    multiline
                                />
                            )}
                            name="introduction"
                            defaultValue={introduction}
                        />
                        <Text style={[styles.inputExtraButton, FONTS.caption]}>
                            {wordCount}/{wordLimit}
                        </Text>
                    </FormControl>
                </Stack>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MinorNavBar
                middleText={`Edit Company Introduction`}
                LeftComponent={LeftComponent}
                RightComponent={RightComponent}
            />
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <KeyboardAvoidingView style={styles.scrollview}>
                    <ScrollView
                        scrollEventThrottle={16}
                        snapToInterval={sizes.width}>
                        {renderFormPage1()}
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </View>
    );
};

export default CompanyIntroductionEditScreen;

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
        flex: 1,
        marginTop: 5,
        width: sizes.width - 20,
        marginHorizontal: 10,
        backgroundColor: colors.main,
        borderRadius: 15,
        padding: 15,
        paddingBottom: 30,
        minHeight: sizes.height * 0.5,
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
        right: 10,
        bottom: -20,
    },
});
