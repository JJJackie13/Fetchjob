import React, {useState, useEffect, useCallback} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    RefreshControl,
    Text,
    FlatList,
} from 'react-native';
import {Input, Icon} from 'native-base';
import NetworkCard from '../components/Network/NetworkCard';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {colors, sizes, FONTS} from '../constants';
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingComponent from '../components/LoadingComponent';

const ConnectionListScreen: React.FC<any> = () => {
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [connections, setConnections] = useState([]);
    const [filteredConnections, setFilteredConnections] = useState([]);

    async function fetchConnections() {
        try {
            const res = await fetch(`${API_URL}/network/all`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            if (res.ok) {
                const connectionData = parseRes.data;
                console.log(connectionData);
                setConnections(connectionData);
                setFilteredConnections(connectionData);
            } else {
                console.log(parseRes.message);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const renderNetworkCard = useCallback(
        ({item}) => <NetworkCard data={item} setConnections={setConnections} />,
        [],
    );

    function renderConnectionCards() {
        return (
            <>
                {filteredConnections && (
                    <FlatList
                        style={{
                            width: sizes.width,
                        }}
                        columnWrapperStyle={{
                            justifyContent: 'space-evenly',
                        }}
                        data={filteredConnections}
                        // keyExtractor={({item}: any) => `${item.friend_id}`}
                        renderItem={({item}) => (
                            <NetworkCard
                                data={item}
                                setConnections={setConnections}
                            />
                        )}
                        ListEmptyComponent={renderEmptyCard}
                        numColumns={2}
                        removeClippedSubviews={true}
                        onRefresh={() => {
                            fetchConnections();
                        }}
                        refreshing={isLoading}
                        overScrollMode="never"
                    />
                )}
            </>
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
                    No connection yet
                </Text>
            </View>
        );
    }

    function renderSearchBar() {
        return (
            <View style={styles.searchBarContainer}>
                <Input
                    onChangeText={filterList}
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
                    placeholder="Search connection"
                    placeholderTextColor={colors.icon}
                    _focus={{
                        borderColor: colors.tertiary,
                    }}
                />
            </View>
        );
    }

    function filterList(query: string) {
        let queryStr = query.toLowerCase();
        // if (query === '') {
        //     setFilteredConnections(connections);
        // } else {
        setFilteredConnections(
            connections.filter((obj: any) => {
                return (
                    obj.first_name.toLowerCase().includes(queryStr) ||
                    obj.last_name.toLowerCase().includes(queryStr) ||
                    obj.headline.toLowerCase().includes(queryStr) ||
                    obj.company_name.toLowerCase().includes(queryStr)
                );
            }),
        );
        // }
    }

    // useEffect(() => {
    //     filterList(input);
    // }, [input]);
    useEffect(() => {
        console.log(filteredConnections);
    }, [filteredConnections]);

    // useEffect(() => {
    //     // console.log(
    //     //     connections.reduce((acc: any, cur: any, i: number) => {
    //     //         let arrIndex = Math.floor(i / 2);
    //     //         let subArrIndex = i % 2 === 0 ? 0 : 1;
    //     //         if (subArrIndex === 0) {
    //     //             acc.push([]);
    //     //         }
    //     //         acc[arrIndex][subArrIndex] = cur;
    //     //         return acc;
    //     //     }, []),
    //     // );
    //     setFilteredConnections(connections);
    // }, [connections]);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            fetchConnections();
        }
        () => {
            isMounted = false;
        };
    }, []);

    return (
        <View style={styles.container}>
            {!isLoading ? (
                <>
                    {renderSearchBar()}
                    {connections && renderConnectionCards()}
                </>
            ) : (
                <LoadingComponent />
            )}
        </View>
    );
};

export default ConnectionListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    row: {
        marginHorizontal: 10,
        marginVertical: 5,
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
    searchBarContainer: {
        width: sizes.width,
        height: sizes.height * 0.08,
        backgroundColor: colors.main,
        // elevation: 5,
        padding: 10,
    },
});
