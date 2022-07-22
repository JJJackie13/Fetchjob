import React, {useEffect, useState, useRef} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView,
    TextInput,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/types';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoadingComponent from '../components/LoadingComponent';
import MinorNavBar from '../components/MinorNavBar';
import {colors, FONTS, sizes} from '../constants';
import {API_URL} from '@env';
import {ReportType} from '../types/enums';
import Toast from 'react-native-toast-message';

type IProps = NativeStackScreenProps<RootStackParamList, 'Report'>;

const ReportScreen: React.FC<IProps> = ({navigation, route}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [optionList, setOptionList] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOptionText, setSelectedOptionText] = useState('');
    const [remark, setRemark] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [page, setPage] = useState(1);
    const scrollRef = useRef<ScrollView>(null);
    const id: number | string = route?.params['id'];
    const type = route.params.type;

    async function reportPost() {
        try {
            const body = {
                typeId: selectedOption,
                remark: remark,
            };
            let link: string = '';
            switch (type) {
                case ReportType.POST:
                    link = `${API_URL}/report/post/${id}`;
                    break;
                case ReportType.USER:
                    link = `${API_URL}/report/user/${id}`;
                    break;
                case ReportType.COMPANY:
                    link = `${API_URL}/report/company/${id}`;
                    break;
                default:
                    break;
            }
            if (!link) {
                console.log('FAILED');
                return;
            }
            const res = await fetch(link, {
                method: 'post',
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                });
                navigation.goBack();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to submit',
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function init() {
        try {
            let link: string = '';
            switch (type) {
                case ReportType.POST:
                    link = `${API_URL}/option/post-report-types`;
                    break;
                case ReportType.COMPANY:
                    link = `${API_URL}/option/report-types`;
                    break;
                case ReportType.USER:
                    link = `${API_URL}/option/report-types`;
                    break;
                default:
                    break;
            }
            if (!link) {
                console.log('FAILED');
                return;
            }
            const res = await fetch(link, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            let parseRes = await res.json();
            if (res.ok) {
                console.log(parseRes.data);
                setOptionList(parseRes.data);
                setIsLoading(false);
            } else {
                console.log(parseRes.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const LeftComponent = () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="cross" size={30} color={colors.icon} />
        </TouchableOpacity>
    );

    function renderOptionsButtonPage() {
        return (
            <View style={styles.page}>
                {optionList &&
                    optionList.map((obj: any) => (
                        <TouchableOpacity
                            key={obj.id}
                            style={styles.optionButton}
                            onPress={() => {
                                setSelectedOption(obj.id);
                                setSelectedOptionText(obj.name);
                                scrollRef.current?.scrollTo({
                                    x: sizes.width,
                                    y: 0,
                                    animated: true,
                                });
                            }}>
                            <View style={{width: '80%'}}>
                                <Text
                                    style={{
                                        ...FONTS.minor,
                                        color: colors.paragraph,
                                    }}>
                                    {obj.name}
                                </Text>
                            </View>
                            <Ionicon
                                name="ios-arrow-forward"
                                size={25}
                                color={colors.paragraph}
                            />
                        </TouchableOpacity>
                    ))}
            </View>
        );
    }
    function renderReportSubmitPage() {
        return (
            <View style={styles.page}>
                <View style={styles.reportForm}>
                    <View style={styles.submitBtnContainer}>
                        <TouchableOpacity
                            onPress={() => {
                                setRemark('');
                                setSelectedOption(null);
                                setSelectedOptionText('');
                                scrollRef.current?.scrollTo({
                                    x: 0,
                                    y: 0,
                                    animated: true,
                                });
                            }}>
                            <Ionicon
                                name="arrow-back-outline"
                                size={20}
                                color={colors.paragraph}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            disabled={!selectedOption}
                            onPress={reportPost}>
                            <FontAwesome
                                name="send"
                                size={20}
                                color={
                                    selectedOption ? colors.button : colors.icon
                                }
                            />
                        </TouchableOpacity>
                    </View>
                    <Text>
                        <Text style={{fontWeight: 'bold'}}>Report issue:</Text>{' '}
                        {selectedOptionText}
                    </Text>
                    <TextInput
                        value={remark}
                        onChangeText={setRemark}
                        onChange={(e) =>
                            setWordCount(e.nativeEvent.text.length)
                        }
                        multiline
                        maxLength={150}
                        placeholder="Please provide details so that we know how to handle"
                        style={{
                            width: '100%',
                            maxHeight: '80%',
                            marginTop: 10,
                            backgroundColor: colors.tertiary,
                            borderRadius: 5,
                        }}
                    />
                    <Text
                        style={{
                            ...FONTS.caption,
                            ...styles.wordCount,
                            color:
                                wordCount < 300
                                    ? colors.minorText
                                    : colors.warning,
                        }}>
                        {wordCount}/150
                    </Text>
                </View>
            </View>
        );
    }
    function renderFooter() {
        return (
            <View style={styles.footer}>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: sizes.width * 0.2,
                        height: '80%',
                        borderRadius: 20,
                        backgroundColor: '#44444494',
                    }}>
                    <View
                        style={{
                            ...styles.dot,
                            backgroundColor:
                                page === 1 ? colors.main : 'transparent',
                        }}
                    />
                    <View
                        style={{
                            ...styles.dot,
                            backgroundColor:
                                page === 1 ? 'transparent' : colors.main,
                        }}
                    />
                </View>
            </View>
        );
    }

    useEffect(() => {
        let isMounted = true;
        if (isMounted && route.params['id']) {
            init();
        }
        () => (isMounted = false);
    }, [route.params]);

    return (
        <View style={styles.container}>
            <MinorNavBar
                LeftComponent={LeftComponent}
                middleText={`Report Issue`}
            />
            {!isLoading ? (
                <>
                    <ScrollView
                        ref={scrollRef}
                        onScroll={(e) => {
                            setPage(
                                Math.ceil(
                                    e.nativeEvent.contentOffset.x / sizes.width,
                                ) + 1,
                            );
                        }}
                        style={styles.scrollView}
                        horizontal
                        snapToInterval={sizes.width}
                        scrollEventThrottle={0}
                        scrollEnabled={false}
                        showsHorizontalScrollIndicator={false}>
                        {renderOptionsButtonPage()}
                        {renderReportSubmitPage()}
                    </ScrollView>
                    {renderFooter()}
                </>
            ) : (
                <LoadingComponent />
            )}
        </View>
    );
};

export default ReportScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    scrollView: {
        flex: 1,
    },
    page: {
        width: sizes.width,
        backgroundColor: colors.main,
    },
    optionButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 45,
        width: sizes.width,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 5,
    },
    reportForm: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        backgroundColor: colors.main,
        maxHeight: sizes.height - sizes.navBar - sizes.height * 0.1,
        borderRadius: 10,
        elevation: 2,
        margin: 10,
        padding: 15,
        paddingBottom: 20,
    },
    submitBtnContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 10,
        marginBottom: 10,
    },
    wordCount: {
        position: 'absolute',
        bottom: 2,
        right: 15,
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    footer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: sizes.height * 0.05,
        backgroundColor: colors.main,
    },
});
