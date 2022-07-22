import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, Pressable} from 'react-native';
import {
    FormControl,
    Input,
    Stack,
    WarningOutlineIcon,
    Icon,
    Button,
} from 'native-base';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useForm, Controller} from 'react-hook-form';
import {useDispatch} from 'react-redux';
import {NavigationProp} from '@react-navigation/core';
import Toast from 'react-native-toast-message';
import {useSelector} from 'react-redux';
import {IRootState} from '../store/store';

import {register} from '../store/thunks/authThunk';

import {colors, sizes, images, FONTS} from '../constants';
import {TextInput} from 'react-native-paper';

interface FormData {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}

function validateEmail(input: string) {
    const emailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailformat.test(input);
}

const RegisterScreen: React.FC<{navigation: NavigationProp<any, any>}> = ({
    navigation,
}) => {
    const error = useSelector((state: IRootState) => state.auth.error);
    const [emailInvalid, setEmailInvalid] = useState<boolean>(false);
    const [emailErrMsg, setEmailErrMsg] = useState<string>('');
    const [passwordInvalid, setPasswordInvalid] = useState<boolean>(false);
    const [passwordErrMsg, setPasswordErrMsg] = useState<string>('');
    const [isLoading, setIsloading] = useState<boolean>(false);
    const {handleSubmit, control} = useForm<FormData>();
    const dispatch = useDispatch();

    function resetAllFormMessage() {
        setEmailInvalid(false);
        setEmailErrMsg('');
        setPasswordInvalid(false);
        setPasswordErrMsg('');
    }

    async function onSubmit(data: FormData) {
        resetAllFormMessage();
        if (!validateEmail(data.email)) {
            setEmailInvalid(true);
            setEmailErrMsg('Please enter valid email.');
            console.log('Email Invalid');
            return;
        }
        setIsloading(true);
        await register(data)(dispatch);
        setIsloading(false);
        // console.log(data);
    }

    useEffect(() => {
        if (error) {
            Toast.show({
                type: 'error',
                text1: error,
            });
        }
    }, [error]);

    return (
        <View style={styles.container}>
            <View style={styles.logoSection}>
                <Image style={styles.logo} source={images.logoHorizon} />
                <Pressable
                    style={styles.closeBtn}
                    onPress={() => navigation.navigate('Welcome')}>
                    <FontAwesome5Icon
                        name="times"
                        size={sizes.heading}
                        color={colors.icon}
                    />
                </Pressable>
            </View>
            <View style={styles.mainContentContainer}>
                {/* EMAIL INPUT */}
                <Stack mx="4" my="8">
                    <Text style={styles.heading}>Register</Text>
                </Stack>
                <Stack mx="4">
                    <FormControl isRequired isInvalid={emailInvalid}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    left={
                                        <TextInput.Icon
                                            name={() => (
                                                <FontAwesome5Icon
                                                    name="user-alt"
                                                    size={20}
                                                    color={colors.icon}
                                                />
                                            )}
                                        />
                                    }
                                    keyboardType="email-address"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    label="Email"
                                    placeholderTextColor={colors.highlight}
                                    style={{
                                        backgroundColor: colors.main,
                                    }}
                                    selectionColor={colors.highlight}
                                    outlineColor={colors.highlight}
                                    underlineColor={colors.highlight}
                                />
                            )}
                            name={'email'}
                            defaultValue=""
                        />
                        <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}>
                            {emailErrMsg}
                        </FormControl.ErrorMessage>
                    </FormControl>
                </Stack>
                {/* PASSWORD INPUT  */}
                <Stack mx="4" mt="3">
                    <FormControl isRequired isInvalid={passwordInvalid}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    left={
                                        <TextInput.Icon
                                            name={() => (
                                                <FontAwesome5Icon
                                                    name="key"
                                                    size={20}
                                                    color={colors.icon}
                                                />
                                            )}
                                        />
                                    }
                                    secureTextEntry={true}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    label="Password"
                                    placeholderTextColor={colors.highlight}
                                    style={{
                                        backgroundColor: colors.main,
                                    }}
                                    selectionColor={colors.highlight}
                                    outlineColor={colors.highlight}
                                    underlineColor={colors.highlight}
                                />
                            )}
                            name="password"
                            defaultValue=""
                        />
                        <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}>
                            {passwordErrMsg}
                        </FormControl.ErrorMessage>
                    </FormControl>
                </Stack>
                {/* FIRSTNAME INPUT  */}
                <Stack mx="4" mt="3">
                    <FormControl isRequired isInvalid={passwordInvalid}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    label="First Name"
                                    placeholderTextColor={colors.highlight}
                                    style={{
                                        backgroundColor: colors.main,
                                    }}
                                    selectionColor={colors.highlight}
                                    outlineColor={colors.highlight}
                                    underlineColor={colors.highlight}
                                />
                            )}
                            name="first_name"
                            defaultValue=""
                        />
                        <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}>
                            {passwordErrMsg}
                        </FormControl.ErrorMessage>
                    </FormControl>
                </Stack>
                {/* LASTNAME INPUT  */}
                <Stack mx="4" mt="3">
                    <FormControl isRequired isInvalid={passwordInvalid}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({field: {onChange, onBlur, value}}) => (
                                <TextInput
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    label="Last Name"
                                    placeholderTextColor={colors.highlight}
                                    style={{
                                        backgroundColor: colors.main,
                                    }}
                                    selectionColor={colors.highlight}
                                    outlineColor={colors.highlight}
                                    underlineColor={colors.highlight}
                                />
                            )}
                            name="last_name"
                            defaultValue=""
                        />
                        <FormControl.ErrorMessage
                            leftIcon={<WarningOutlineIcon size="xs" />}>
                            {passwordErrMsg}
                        </FormControl.ErrorMessage>
                    </FormControl>
                </Stack>
                <Button
                    isLoading={isLoading}
                    backgroundColor={colors.button}
                    mt="10"
                    onPress={handleSubmit(onSubmit)}>
                    Register
                </Button>
            </View>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: colors.main,
    },
    logoSection: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: sizes.width * 0.05,
        // paddingTop: sizes.height* 0.05,
        height: sizes.height * 0.1,
        width: sizes.width,
    },
    logo: {
        width: sizes.width * 0.3,
        height: '100%',
        resizeMode: 'contain',
    },
    closeBtn: {},
    mainContentContainer: {
        marginHorizontal: sizes.width * 0.05,
    },
    heading: {
        fontSize: sizes.heading * 1.5,
        fontFamily: 'Roboto-Bold',
    },
});
