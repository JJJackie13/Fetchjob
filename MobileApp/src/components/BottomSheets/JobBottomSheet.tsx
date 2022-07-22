import React, {useEffect, useState} from 'react';
import {
    Image,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Alert,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {colors, FONTS, images, sizes, formats} from '../../constants';
import {API_URL} from '@env';
import LoadingComponent from '../LoadingComponent';
import JobDetails from '../Job/JobDetails';
import {useNavigation, useRoute} from '@react-navigation/core';
import {NavigationProp, RouteProp} from '@react-navigation/core';
import {RootStackParamList} from '../../types/types';
import timeSince, {timeRemain} from '../Job/TimeSince';

interface JobCard {
    job_id: string;
    job_title: string;
    job_detail: string;
    company_name: string;
    avatar: string;
    city_name: string;
    country_name: string;
    industry: string;
    post_date: Date;
    update_date: any;
    auto_delist: Date;
    bookmark_id: any;
    annual_leave: string;
    business_size: string;
    education: string;
    employment_type: string[];
}

const JobDetailsBottomSheet: React.FC<{
    data: JobCard;
    navigation: any;
    closeModals: () => any;
    bookmarkdJobHandler: () => any;
    bookmark: any;
}> = ({data, navigation, closeModals, bookmarkdJobHandler, bookmark}) => {
    const [job, setJob] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // const [bookmark, setBookmark] = useState<boolean>(data.bookmark_id);

    function businessSize(size: string) {
        let bSize = parseInt(size);
        if (bSize < 50) {
            return '1 - 50 employees';
        } else if (bSize > 50 && bSize <= 100) {
            return '51 - 100 employees';
        } else if (bSize > 100 && bSize <= 200) {
            return '101 - 200 employees';
        } else if (bSize > 200 && bSize <= 500) {
            return '201 - 500 employees';
        } else if (bSize > 500 && bSize <= 1000) {
            return '501 - 1000 employees';
        } else if (bSize > 1000 && bSize <= 5000) {
            return '1001 - 5000 employees';
        } else if (bSize > 5000 && bSize <= 10000) {
            return '5001 - 10000 employees';
        } else if (bSize > 10000 && bSize <= 50000) {
            return '10001 - 50000 employees';
        } else {
            return '50000+ employees';
        }
    }

    function opPress() {
        closeModals();
        navigation.navigate('ApplyJobUserContact', {
            jobId: data.job_id,
            companyName: data.company_name,
            job_title: data.job_title,
        });
    }

    // useEffect(() => {
    //     setBookmark((prev) => !prev);
    // }, [data.bookmark_id]);

    return (
        <View style={styles.jobBtmSheet}>
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <ScrollView>
                    <View style={styles.container}>
                        <Text style={styles.header}>{data.job_title}</Text>
                        <View style={styles.detailContainer}>
                            <View style={styles.avatar}>
                                <Image
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        aspectRatio: 1,
                                        right: 10,
                                    }}
                                    source={
                                        data.avatar
                                            ? formats.httpFormat.test(
                                                  data.avatar,
                                              )
                                                ? {
                                                      uri: `${data.avatar}`,
                                                  }
                                                : {
                                                      uri: `${API_URL}/${data.avatar}`,
                                                  }
                                            : images.noAvatar
                                    }
                                    resizeMode="contain"
                                />
                            </View>
                            <View style={styles.rowContainer}>
                                <Text>{data.company_name}</Text>
                                <Text
                                    style={{
                                        ...FONTS.caption,
                                        color: colors.paragraph,
                                        marginBottom: 5,
                                    }}
                                    numberOfLines={2}>
                                    <MaterialCommunityIcon
                                        name="map-marker"
                                        size={15}
                                        color={colors.icon}
                                        style={{marginRight: 8}}
                                    />{' '}
                                    {data.city_name} · {data.country_name}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text
                                style={{
                                    ...FONTS.caption,
                                    color: colors.paragraph,
                                    marginBottom: 15,
                                    marginTop: 7,
                                    paddingLeft: 10,
                                }}
                                numberOfLines={2}>
                                {timeSince(data.post_date)}
                            </Text>
                        </View>
                        <Text
                            style={{
                                ...FONTS.minor,
                                fontWeight: 'bold',
                                marginBottom: 5,
                                padding: 10,
                            }}
                            numberOfLines={2}>
                            <MaterialCommunityIcon
                                name="briefcase"
                                size={18}
                                color={colors.icon}
                                style={{marginRight: 8}}
                            />{' '}
                            {data.employment_type.length > 0
                                ? data.employment_type.join(', ')
                                : 'Employment type not stated'}
                        </Text>
                        <Text
                            style={{
                                ...FONTS.minor,
                                fontWeight: 'bold',
                                marginBottom: 2,
                                padding: 10,
                            }}
                            numberOfLines={2}>
                            <MaterialCommunityIcon
                                name="office-building"
                                size={18}
                                color={colors.icon}
                                style={{marginRight: 8}}
                            />{' '}
                            {businessSize(data.business_size)}
                        </Text>
                        <Text
                            style={{
                                ...FONTS.minor,
                                fontWeight: 'bold',
                                marginBottom: 5,
                                padding: 10,
                            }}
                            numberOfLines={2}>
                            {timeRemain(data.auto_delist) && (
                                <MaterialCommunityIcon
                                    name={'timer-outline'}
                                    size={18}
                                    color={colors.button}
                                    style={{marginRight: 8}}
                                />
                            )}{' '}
                            {timeRemain(data.auto_delist)
                                ? 'Actively recruiting'
                                : ''}
                        </Text>
                        <View style={styles.buttonContainer}>
                            <TouchableHighlight
                                style={styles.viewJobDetailBtn}
                                underlayColor="#83bfbf"
                                onPress={opPress}>
                                <Text
                                    style={{
                                        ...FONTS.caption,
                                        color: colors.main,
                                        fontWeight: 'bold',
                                    }}>
                                    Apply job
                                </Text>
                            </TouchableHighlight>
                            <TouchableHighlight
                                style={styles.saveJobBtn}
                                underlayColor={colors.tertiary}
                                onPress={bookmarkdJobHandler}>
                                <Text
                                    style={{
                                        ...FONTS.caption,
                                        color: colors.button,
                                        fontWeight: 'bold',
                                    }}>
                                    {bookmark ? 'Saved' : 'Save'}
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </View>

                    <View style={styles.container}>
                        <Text style={styles.title}>Job description</Text>
                        <Text style={styles.paragraph}>{data.job_detail}</Text>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default JobDetailsBottomSheet;

const styles = StyleSheet.create({
    jobBtmSheet: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colors.tertiary,
        height: sizes.height * 0.86,
    },
    JobOption: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: sizes.width * 0.1,
        paddingVertical: 10,
    },
    container: {
        flex: 1,
        backgroundColor: colors.main,
        width: sizes.width,
        minHeight: sizes.height * 0.3,
        marginTop: 5,
        paddingLeft: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 10,
        paddingBottom: 8,
        paddingLeft: 5,
    },
    paragraph: {
        paddingBottom: 8,
        paddingLeft: 5,
        paddingRight: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 10,
    },
    heading: {
        ...FONTS.minor,
        fontWeight: 'bold',
        color: colors.minorText,
    },
    avatar: {
        height: sizes.height * 0.08,
        width: sizes.height * 0.08,
        borderWidth: 2,
        borderColor: '#cccccc22',
        overflow: 'hidden',
        paddingLeft: 10,
    },
    detailContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    rowContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: 10,
        paddingRight: 200,
    },
    viewJobDetailBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: (sizes.width * 0.5) / 1.2,
        marginVertical: 10,
        marginLeft: 15,
        marginRight: 10,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.button,
        backgroundColor: colors.button,
    },
    saveJobBtn: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: (sizes.width * 0.5) / 1.2,
        marginVertical: 10,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.button,
        backgroundColor: colors.main,
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
    },
});
