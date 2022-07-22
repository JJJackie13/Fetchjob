import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    BottomSheetScrollView as ScrollView,
} from '@gorhom/bottom-sheet';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {sizes, colors, FONTS} from '../../constants';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNPickerSelect from 'react-native-picker-select';
import {Controller, useForm} from 'react-hook-form';

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

const ReviewCompanyForm: React.FC<any> = ({control}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [employmentTypesOptions, setEmploymentTypesOptions] = useState([]);
    const [commenterTypesOptions, setCommenterTypesOptions] = useState([]);

    useEffect(() => {
        let isMounted = true;
        async function fetchOptions() {
            try {
                const res = await fetch(`${API_URL}/option/review-company`, {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                });
                const parseRes = await res.json();
                if (res.ok) {
                    setEmploymentTypesOptions(parseRes.employmentTypes);
                    setCommenterTypesOptions(parseRes.commenterTypes);
                    setIsLoading(false);
                } else {
                    console.log(parseRes.message);
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (isMounted) {
            fetchOptions();
        }
        () => (isMounted = false);
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                {!isLoading && (
                    <>
                        <View style={styles.ratingContainer}>
                            <View>
                                <Text style={{...FONTS.caption}}>
                                    Your review will be anonymous
                                </Text>
                            </View>
                            <View>
                                <Controller
                                    control={control}
                                    // rules={{
                                    //     required: true,
                                    // }}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <View>
                                            <View
                                                style={{
                                                    width: sizes.width,
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                }}>
                                                {!value ? (
                                                    <Text
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            top: 5,
                                                            ...FONTS.minor,
                                                            fontWeight: 'bold',
                                                        }}>
                                                        Please choose a rating *
                                                    </Text>
                                                ) : null}
                                            </View>
                                            <AirbnbRating
                                                count={5}
                                                defaultRating={value}
                                                size={sizes.width * 0.05}
                                                selectedColor={colors.highlight}
                                                reviews={[
                                                    'Very Dissatisfied',
                                                    'Dissatisfied',
                                                    'Neutral',
                                                    'Satisfied',
                                                    'Very Satisfied',
                                                ]}
                                                reviewSize={sizes.paragraph}
                                                reviewColor={colors.paragraph}
                                                onFinishRating={onChange}
                                            />
                                        </View>
                                    )}
                                    name="rating"
                                    defaultValue={0}
                                />
                            </View>
                        </View>
                        <View style={styles.formContainer}>
                            <Controller
                                control={control}
                                // rules={{
                                //     required: true,
                                // }}
                                render={({
                                    field: {onChange, onBlur, value},
                                }) => (
                                    <View
                                        style={{
                                            ...styles.formItem,
                                        }}>
                                        <View style={styles.selectionFormItem}>
                                            <View>
                                                <Text
                                                    style={
                                                        styles.formItemTitle
                                                    }>
                                                    {' '}
                                                    Job Title *
                                                </Text>
                                                <TextInput
                                                    placeholder="Enter a job title."
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                />
                                            </View>
                                            {value.length >= 3 ? (
                                                <MaterialIcon
                                                    name={'check-circle'}
                                                    size={30}
                                                    color={colors.highlight}
                                                />
                                            ) : null}
                                        </View>
                                    </View>
                                )}
                                name="job_title"
                                defaultValue=""
                            />
                            {employmentTypesOptions && (
                                <Controller
                                    control={control}
                                    // rules={{
                                    //     required: true,
                                    // }}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <RNPickerSelect
                                            placeholder={{
                                                label: 'Select employment type *',
                                                value: null,
                                                color: colors.paragraph,
                                            }}
                                            onValueChange={onChange}
                                            items={employmentTypesOptions.map(
                                                (obj: any) => {
                                                    return {
                                                        key: obj.id,
                                                        label: obj.name,
                                                        value: obj.id,
                                                    };
                                                },
                                            )}
                                            Icon={() => {
                                                return (
                                                    <MaterialIcon
                                                        name={
                                                            value
                                                                ? 'check-circle'
                                                                : 'keyboard-arrow-down'
                                                        }
                                                        size={30}
                                                        color={colors.highlight}
                                                    />
                                                );
                                            }}
                                            style={{
                                                iconContainer: {
                                                    right: 15,
                                                    top: 15,
                                                },
                                                inputAndroidContainer: {
                                                    ...styles.formItem,
                                                    ...styles.selectionFormItem,
                                                },
                                                placeholder: {
                                                    color: colors.paragraph,
                                                },
                                            }}
                                            useNativeAndroidPickerStyle={false}
                                            onDonePress={onBlur}
                                        />
                                    )}
                                    name="employment_type_id"
                                />
                            )}
                            {commenterTypesOptions && (
                                <Controller
                                    control={control}
                                    // rules={{
                                    //     required: true,
                                    // }}
                                    render={({
                                        field: {onChange, onBlur, value},
                                    }) => (
                                        <RNPickerSelect
                                            placeholder={{
                                                label: 'Time of employment *',
                                                value: null,
                                                color: colors.paragraph,
                                            }}
                                            onValueChange={onChange}
                                            items={commenterTypesOptions.map(
                                                (obj: any) => {
                                                    return {
                                                        key: obj.id,
                                                        label: obj.name,
                                                        value: obj.id,
                                                    };
                                                },
                                            )}
                                            Icon={() => {
                                                return (
                                                    <MaterialIcon
                                                        name={
                                                            value
                                                                ? 'check-circle'
                                                                : 'keyboard-arrow-down'
                                                        }
                                                        size={30}
                                                        color={colors.highlight}
                                                    />
                                                );
                                            }}
                                            style={{
                                                iconContainer: {
                                                    right: 15,
                                                    top: 15,
                                                },
                                                inputAndroidContainer: {
                                                    ...styles.formItem,
                                                    ...styles.selectionFormItem,
                                                },
                                                placeholder: {
                                                    color: colors.paragraph,
                                                },
                                            }}
                                            useNativeAndroidPickerStyle={false}
                                            onDonePress={onBlur}
                                        />
                                    )}
                                    name="commenter_type_id"
                                />
                            )}
                            <Controller
                                control={control}
                                // rules={{
                                //     required: true,
                                // }}
                                render={({
                                    field: {onChange, onBlur, value},
                                }) => (
                                    <View
                                        style={{
                                            ...styles.formItem,
                                        }}>
                                        <View style={styles.selectionFormItem}>
                                            <View>
                                                <Text
                                                    style={
                                                        styles.formItemTitle
                                                    }>
                                                    {' '}
                                                    Review Title *
                                                </Text>
                                                <TextInput
                                                    placeholder="Decribe your review in one sentence."
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                />
                                            </View>
                                            {value.length > 3 ? (
                                                <MaterialIcon
                                                    name={'check-circle'}
                                                    size={30}
                                                    color={colors.highlight}
                                                />
                                            ) : null}
                                        </View>
                                    </View>
                                )}
                                name="review_title"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                // rules={{
                                //     required: true,
                                // }}
                                render={({
                                    field: {onChange, onBlur, value},
                                }) => (
                                    <View
                                        style={{
                                            ...styles.formItem,
                                        }}>
                                        <View style={styles.selectionFormItem}>
                                            <View>
                                                <Text
                                                    style={
                                                        styles.formItemTitle
                                                    }>
                                                    {' '}
                                                    Pros (5 words minimum) *
                                                </Text>
                                                <TextInput
                                                    placeholder="Decribe things you like about the company."
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    multiline
                                                />
                                            </View>
                                            {value.trim().split(' ').length >=
                                            5 ? (
                                                <MaterialIcon
                                                    name={'check-circle'}
                                                    size={30}
                                                    color={colors.highlight}
                                                />
                                            ) : null}
                                        </View>
                                    </View>
                                )}
                                name="pos_comment"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                // rules={{
                                //     required: true,
                                // }}
                                render={({
                                    field: {onChange, onBlur, value},
                                }) => (
                                    <View
                                        style={{
                                            ...styles.formItem,
                                        }}>
                                        <View style={styles.selectionFormItem}>
                                            <View>
                                                <Text
                                                    style={
                                                        styles.formItemTitle
                                                    }>
                                                    {' '}
                                                    Cons (5 words minimum) *
                                                </Text>
                                                <TextInput
                                                    placeholder="Share about the challenges of working here."
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    multiline
                                                />
                                            </View>
                                            {value.trim().split(' ').length >=
                                            5 ? (
                                                <MaterialIcon
                                                    name={'check-circle'}
                                                    size={30}
                                                    color={colors.highlight}
                                                />
                                            ) : null}
                                        </View>
                                    </View>
                                )}
                                name="neg_comment"
                                defaultValue=""
                            />
                            <Controller
                                control={control}
                                // rules={{
                                //     required: true,
                                // }}
                                render={({
                                    field: {onChange, onBlur, value},
                                }) => (
                                    <View
                                        style={{
                                            ...styles.formItem,
                                        }}>
                                        <View style={styles.selectionFormItem}>
                                            <View>
                                                <Text
                                                    style={
                                                        styles.formItemTitle
                                                    }>
                                                    {' '}
                                                    Extra
                                                </Text>
                                                <TextInput
                                                    placeholder="(optional) Anything extra you would like to share."
                                                    value={value}
                                                    onChangeText={onChange}
                                                    onBlur={onBlur}
                                                    multiline
                                                />
                                            </View>
                                            {value.length > 3 ? (
                                                <MaterialIcon
                                                    name={'check-circle'}
                                                    size={30}
                                                    color={colors.highlight}
                                                />
                                            ) : null}
                                        </View>
                                    </View>
                                )}
                                name="extra_comment"
                                defaultValue=""
                            />
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

export default ReviewCompanyForm;

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: colors.tertiary,
    },
    ratingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 5,
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    formItem: {
        // width: '100%',
        backgroundColor: colors.main,
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 5,
        marginBottom: 1,
    },
    selectionFormItem: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formItemTitle: {
        ...FONTS.minor,
    },
});
