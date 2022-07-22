import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Icon, Input} from 'native-base';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {RootStackParamList} from '../types/types';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors, FONTS, sizes} from '../constants';
import ReviewCompanyListCard from '../components/ReviewCompanyListCard';
import LoadingComponent from '../components/LoadingComponent';

type IProps = NativeStackScreenProps<RootStackParamList, 'ReviewSelectCompany'>;

const ReviewSelectCompanyScreen: React.FC<IProps> = ({navigation}) => {
    const [offset, setOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingExtraPost, setLoadingExtraPost] = useState(false);
    const [searchInput, setSearchInput] = useState<string>('');
    const [companyList, setCompanyList] = useState<any[]>([]);
    const [allFetched, setAllFetched] = useState(false);
    const [modalOpened, setModalOpened] = useState(false);
    const timer = useRef<NodeJS.Timeout>();

    async function fetchMoreData() {
        try {
            setLoadingExtraPost(true);
            const res = await fetch(
                `${API_URL}/company/review-list?keywords=${searchInput}&offset=${offset}`,
                {
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem(
                            'token',
                        )}`,
                    },
                },
            );
            const parseRes = await res.json();
            console.log(parseRes);
            if (res.ok) {
                const {data} = parseRes;
                setOffset((prev) => prev + 1);
                if (data.length === 0) {
                    setAllFetched(true);
                } else {
                    setCompanyList((prev: any) => [...prev, ...data]);
                }
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingExtraPost(false);
        }
    }

    function renderSearchBox() {
        return (
            <View style={styles.searchBarContainer}>
                <View style={{width: '100%'}}>
                    <Input
                        value={searchInput}
                        onChangeText={(text) => setSearchInput(text)}
                        backgroundColor={colors.tertiary}
                        fontSize={sizes.caption + 2}
                        variant="filled"
                        InputLeftElement={
                            <Icon
                                as={<MaterialIcon name="person-search" />}
                                size={sizes.caption + 10}
                                ml="4"
                                color={colors.icon}
                            />
                        }
                        placeholder="Search company"
                        placeholderTextColor={colors.icon}
                        _focus={{
                            borderColor: colors.tertiary,
                        }}
                    />
                </View>
            </View>
        );
    }

    const renderCard = useCallback(
        ({item}) => (
            <ReviewCompanyListCard
                data={item}
                timer={timer}
                modalOpened={modalOpened}
                setModalOpened={setModalOpened}
            />
        ),
        [],
    );
    const renderEmptyCard = useCallback(
        () => (
            <>
                <View style={styles.emptyCard}>
                    {isLoading ? (
                        <ActivityIndicator
                            size="small"
                            color={colors.highlight}
                        />
                    ) : (
                        <Text>No result...</Text>
                    )}
                </View>
            </>
        ),
        [isLoading],
    );

    const renderExtraLoadingIndicator = useCallback(() => {
        return (
            <>
                {loadingExtraPost ? (
                    <View
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: 5,
                        }}>
                        <ActivityIndicator size="small" color={colors.icon} />
                    </View>
                ) : null}
            </>
        );
    }, [loadingExtraPost]);

    function renderCompanyList() {
        return (
            <>
                <FlatList
                    initialNumToRender={5}
                    removeClippedSubviews={true}
                    data={companyList}
                    renderItem={renderCard}
                    ListEmptyComponent={renderEmptyCard}
                    keyExtractor={(item, index) => `${index}`}
                    refreshing={loadingExtraPost}
                    onEndReached={() => {
                        if (!allFetched) {
                            fetchMoreData();
                        }
                    }}
                    onEndReachedThreshold={0.1}
                    ListFooterComponent={renderExtraLoadingIndicator}
                />
            </>
        );
    }

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const res = await fetch(
                    `${API_URL}/company/review-list?keywords=${searchInput}&offset=${0}`,
                    {
                        headers: {
                            Authorization: `Bearer ${await AsyncStorage.getItem(
                                'token',
                            )}`,
                        },
                    },
                );
                const parseRes = await res.json();
                console.log(parseRes);
                if (res.ok) {
                    const {data} = parseRes;
                    // console.log(data);
                    setOffset((prev) => prev + 1);
                    setCompanyList(data);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        }
        setAllFetched(false);
        if (timer.current) {
            clearTimeout(timer.current);
        }
        timer.current = setTimeout(() => {
            setOffset(0);
            if (searchInput.trim() !== '' && searchInput.trim().length > 1) {
                console.log('HI');
                fetchData();
            } else {
                setCompanyList([]);
            }
        }, 1000);
    }, [searchInput]);

    return (
        <View style={styles.container}>
            {renderSearchBox()}
            {renderCompanyList()}
        </View>
    );
};

export default ReviewSelectCompanyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: sizes.width,
        height: sizes.height * 0.08,
        backgroundColor: colors.main,
        // padding: 10,
    },
    emptyCard: {
        display: 'flex',
        paddingHorizontal: 15,
    },
});
