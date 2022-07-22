import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    KeyboardAvoidingView,
} from 'react-native';
import {Input, Icon} from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoadingComponent from '../components/LoadingComponent';
import UserSearchCard from '../components/Chat/UserSearchCard';
import {RootStackParamList} from '../types/types';
import {colors, sizes} from '../constants';
import {API_URL} from '@env';

type IProps = NativeStackScreenProps<RootStackParamList, 'ChatUserSearch'>;

const ChatUserSearchScreen: React.FC<IProps> = () => {
    const [searchInput, setSearchInput] = useState<string>('');
    const [userList, setUserList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    async function fetchUsers() {
        try {
            const res = await fetch(
                `${API_URL}/chat/users?keyword=${searchInput}`,
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
                setUserList(parseRes.data);
                setFilteredUserList(parseRes.data);
                setIsLoading(false);
            } else {
                console.log(parseRes.message);
                Toast.show({
                    type: 'error',
                    text1: parseRes.message,
                });
            }
        } catch (error) {
            console.log('ChatUserSearchScreen', error);
        }
    }

    function renderSearchBox() {
        return (
            <View style={styles.searchBarContainer}>
                <View style={{width: '100%'}}>
                    <Input
                        value={searchInput}
                        onChangeText={setSearchInput}
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
                        placeholder="Search user"
                        placeholderTextColor={colors.icon}
                        _focus={{
                            borderColor: colors.tertiary,
                        }}
                    />
                </View>
            </View>
        );
    }

    useEffect(() => {
        setFilteredUserList(
            userList.filter((obj: any) => {
                return (
                    obj.first_name
                        .toLowerCase()
                        .includes(searchInput.toLowerCase()) ||
                    obj.last_name
                        .toLowerCase()
                        .includes(searchInput.toLowerCase())
                );
            }),
        );
    }, [searchInput]);

    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            setIsLoading(true);
            fetchUsers();
        }
        () => {
            isMounted = false;
        };
    }, []);

    return (
        <View style={styles.container}>
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <KeyboardAvoidingView>
                    {renderSearchBox()}
                    <FlatList<any>
                        // ListHeaderComponent={}
                        data={filteredUserList}
                        removeClippedSubviews={true}
                        renderItem={({item}: any) => (
                            <UserSearchCard key={item.userid} data={item} />
                        )}
                    />
                </KeyboardAvoidingView>
            )}
        </View>
    );
};

export default ChatUserSearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    searchBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: sizes.width,
        height: sizes.height * 0.08,
        backgroundColor: colors.main,
        padding: 10,
    },
});
