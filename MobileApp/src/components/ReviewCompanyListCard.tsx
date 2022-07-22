import React, {useCallback, useMemo, useRef, useState, useEffect} from 'react';
import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import {Avatar} from 'react-native-paper';
import BottomSheet, {
    BottomSheetBackdrop,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {colors, FONTS, formats, images, sizes} from '../constants';
import {API_URL} from '@env';
import {Portal, PortalHost} from '@gorhom/portal';
import ReviewCompanyForm from './BottomSheets/ReviewCompanyForm';
import {useForm} from 'react-hook-form';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

interface FormData {
    job_title: string;
    commenter_type_id: number;
    employment_type_id: number;
    rating: number;
    review_title: string;
    pos_comment: string;
    neg_comment: string;
    extra_comment: string;
}

const ReviewCompanyListCard: React.FC<any> = ({
    data,
    modalOpened,
    setModalOpened,
}) => {
    const avatar = data.avatar
        ? formats.httpFormat.test(data.avatar)
            ? {
                  uri: `${data.avatar}`,
              }
            : {
                  uri: `${API_URL}/${data.avatar}`,
              }
        : images.noCompanyAvatar;
    const btmSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['95%'], []);

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<FormData>();

    const onSubmit = async (formData: FormData) => {
        try {
            for (let [key, value] of Object.entries(formData)) {
                if (key !== 'extra_comment' && !value) {
                    createAlert(`Please fill in all required items`);
                    return;
                }
                if (
                    (key === 'pos_comment' || key === 'neg_comment') &&
                    value.trim().split(' ').length < 5
                ) {
                    createAlert(
                        `Please enter at least 5 words for the ${
                            key === 'pos_comment' ? 'Pros' : 'Cons'
                        }`,
                    );
                    return;
                }
            }
            const res = await fetch(`${API_URL}/company/review/${data.id}`, {
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
                btmSheetRef.current?.close();
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
                text1: 'Failed',
            });
        }
    };

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                opacity={0.2}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        [],
    );

    function logFormData(formData: FormData) {
        let hasInput = Object.entries(formData).some(([key, value]) => !!value);
        if (hasInput) {
            Alert.alert('Discard Submission?', 'All inputs will be lost.', [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Discard',
                    onPress: () => {
                        btmSheetRef.current?.close();
                    },
                },
            ]);
        } else {
            btmSheetRef.current?.close();
        }
    }

    const renderBtmSheetHeader = () => (
        <View style={styles.btmSheetHeader}>
            <TouchableOpacity
                onPress={() => {
                    handleSubmit(logFormData)();
                }}>
                <Text style={{...FONTS.caption}}>Cancel</Text>
            </TouchableOpacity>
            <View
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        ...FONTS.minor,
                        textAlign: 'center',
                        fontWeight: 'bold',
                    }}>
                    Add Review
                </Text>
                <Text
                    style={{
                        ...FONTS.caption,
                        textAlign: 'center',
                        color: colors.paragraph,
                    }}>
                    {data.company_name}
                </Text>
            </View>
            <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                <FontAwesomeIcon
                    name="pencil-square-o"
                    size={30}
                    color={colors.button}
                />
            </TouchableOpacity>
        </View>
    );

    function resetForm(formData: FormData) {
        for (let [key, value] of Object.entries(formData)) {
            if (value) {
                reset({
                    job_title: '',
                    commenter_type_id: undefined,
                    employment_type_id: undefined,
                    rating: 0,
                    review_title: '',
                    pos_comment: '',
                    neg_comment: '',
                    extra_comment: '',
                });
                return;
            }
        }
    }

    const createAlert = (message: string) =>
        Alert.alert('', message, [{text: 'OK', onPress: () => {}}]);

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={() => {
                    if (!modalOpened) {
                        btmSheetRef.current?.expand();
                        setModalOpened(true);
                    }
                }}>
                <View style={styles.leftPart}>
                    <Avatar.Image size={sizes.height * 0.05} source={avatar} />
                </View>
                <View style={styles.rightPart}>
                    <View style={styles.rightUpperPart}>
                        <Text
                            numberOfLines={1}
                            style={{...FONTS.minor, fontWeight: 'bold'}}>
                            {data.company_name}
                        </Text>
                        <Text style={{...FONTS.caption}} numberOfLines={1}>
                            {data.industry}
                        </Text>
                    </View>
                    <View style={styles.rightLowerPart}>
                        <Text
                            numberOfLines={1}
                            style={{...FONTS.caption, color: colors.icon}}>
                            {data.website}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
            <>
                <Portal>
                    <BottomSheet
                        android_keyboardInputMode="adjustPan"
                        style={styles.bottomSheet}
                        ref={btmSheetRef}
                        index={-1}
                        snapPoints={snapPoints}
                        enablePanDownToClose
                        enableHandlePanningGesture
                        backdropComponent={renderBackdrop}
                        handleComponent={renderBtmSheetHeader}
                        onClose={() => setModalOpened(false)}>
                        <View>
                            <ReviewCompanyForm control={control} />
                        </View>
                    </BottomSheet>
                    <PortalHost name="review_bottomsheet" />
                </Portal>
            </>
        </>
    );
};

export default ReviewCompanyListCard;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        height: sizes.height * 0.1,
        backgroundColor: colors.main,
        paddingHorizontal: 10,
    },
    leftPart: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '15%',
        // backgroundColor: 'red',
    },
    rightPart: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '85%',
        borderBottomColor: '#cccccc71',
        borderBottomWidth: 1,
    },
    rightUpperPart: {
        display: 'flex',
        flexDirection: 'column',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        // height: '35%',
        width: '100%',
        // backgroundColor: 'yellow',
    },
    rightLowerPart: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        // height: '65%',
        width: '90%',
        // backgroundColor: 'green',
    },
    bottomSheet: {
        elevation: 15,
        // marginHorizontal: 5,
        // backgroundColor: colors.main,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
        borderRadius: 5,
    },
    btmSheetHeader: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
    },
});
