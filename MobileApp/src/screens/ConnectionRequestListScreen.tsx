import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    TouchableOpacity,
    Text,
    FlatList,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import ReceivedRequestCard from '../components/Network/ReceivedRequestCard';
import SentRequestCard from '../components/Network/SentRequestCard';
import {colors, FONTS, sizes} from '../constants';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingComponent from '../components/LoadingComponent';

interface RequestCounterpart {
    id: string;
    counterpartId: string;
    first_name: string;
    last_name: string;
    headline: string;
    avatar: string;
    banner: string;
    company_name: string;
}

const ConnectionRequestListScreen: React.FC<any> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [receivedRequests, setReceivedRequests] = useState([]);
    const [sentRequests, setSentRequests] = useState([]);
    const [page, setPage] = useState<number>(1);

    async function fetchRequests() {
        try {
            const res = await fetch(`${API_URL}/network/request`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            if (res.ok) {
                console.log(parseRes.data);
                setReceivedRequests(parseRes.data.receivedRequests);
                setSentRequests(parseRes.data.sentRequests);
                setIsLoading(false);
            } else {
                console.log(parseRes.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    function renderPageMenu() {
        return (
            <View style={styles.pageMenuContainer}>
                <TouchableOpacity
                    onPress={() => setPage(1)}
                    style={
                        page === 1
                            ? styles.pageMenuBtnPressed
                            : styles.pageMenuBtn
                    }>
                    <Text
                        style={{
                            ...FONTS.minor,
                            fontWeight: 'bold',
                            color: page === 1 ? '#fff' : colors.icon,
                        }}>
                        <MaterialCommunityIcon
                            name="account-arrow-left-outline"
                            size={20}
                            color={page === 1 ? '#fff' : colors.icon}
                        />{' '}
                        Received
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setPage(2)}
                    style={
                        page === 2
                            ? styles.pageMenuBtnPressed
                            : styles.pageMenuBtn
                    }>
                    <Text
                        style={{
                            ...FONTS.minor,
                            fontWeight: 'bold',
                            color: page === 2 ? '#fff' : colors.icon,
                        }}>
                        <MaterialCommunityIcon
                            name="account-arrow-right-outline"
                            size={20}
                            color={page === 2 ? '#fff' : colors.icon}
                        />{' '}
                        Sent
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    function renderReceivedRequestCards() {
        return (
            receivedRequests && (
                <FlatList<RequestCounterpart>
                    refreshing={isLoading}
                    onRefresh={fetchRequests}
                    contentContainerStyle={{paddingBottom: sizes.height * 0.05}}
                    data={receivedRequests}
                    renderItem={({item}) => (
                        <ReceivedRequestCard
                            key={item.id}
                            data={item}
                            setReceivedRequests={setReceivedRequests}
                        />
                    )}
                    ListEmptyComponent={renderEmptyCard}
                    overScrollMode="never"
                />
            )
        );
    }
    function renderSentRequestCards() {
        return (
            sentRequests && (
                <FlatList<RequestCounterpart>
                    removeClippedSubviews={true}
                    refreshing={isLoading}
                    onRefresh={fetchRequests}
                    contentContainerStyle={{paddingBottom: sizes.height * 0.05}}
                    data={sentRequests}
                    renderItem={({item}) => (
                        <SentRequestCard
                            key={item.id}
                            data={item}
                            setSentRequests={setSentRequests}
                        />
                    )}
                    ListEmptyComponent={renderEmptyCard}
                    overScrollMode="never"
                />
            )
        );
    }

    function renderEmptyCard() {
        return (
            <View style={styles.emptyCard}>
                <MaterialIcon
                    name="hourglass-empty"
                    size={sizes.width * 0.3}
                    color={colors.icon}
                />
                <Text style={{...FONTS.title, color: colors.icon}}>
                    No request yet
                </Text>
            </View>
        );
    }

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            fetchRequests();
        }
        () => {
            isMounted = false;
        };
    }, []);

    return (
        <View style={styles.container}>
            {!isLoading && receivedRequests && sentRequests ? (
                <View>
                    {renderPageMenu()}
                    {page === 1
                        ? renderReceivedRequestCards()
                        : renderSentRequestCards()}
                </View>
            ) : (
                <LoadingComponent />
            )}
        </View>
    );
};

export default ConnectionRequestListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    row: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    pageMenuContainer: {
        display: 'flex',
        flexDirection: 'row',
        height: sizes.height * 0.05,
        backgroundColor: '#ccc',
        elevation: 5,
        borderColor: '#fff',
        borderWidth: 1,
    },
    pageMenuBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderWidth: 1,
        borderColor: colors.main,
        backgroundColor: colors.main,
    },
    pageMenuBtnPressed: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        borderColor: '#ccc',
        borderWidth: 2,
        backgroundColor: colors.highlight,
    },
    emptyCard: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: sizes.height * 0.9,
        backgroundColor: colors.main,
        borderRadius: 15,
        elevation: 5,
    },
});
