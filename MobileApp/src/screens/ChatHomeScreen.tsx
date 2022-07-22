import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import {Input, Icon} from 'native-base';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {colors, FONTS, sizes} from '../constants';
import Contact from '../components/Chat/Contact';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {IContactProps, RootStackParamList} from '../types/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {useSocket} from '../contexts/SocketContext';
import LoadingComponent from '../components/LoadingComponent';
// import LoadingComponent from '../components/';

type IChatHomeScreenProps = NativeStackScreenProps<
    RootStackParamList,
    'ChatHome'
>;

const ChatHomeScreen: React.FC<IChatHomeScreenProps> = ({
    navigation,
    route,
}) => {
    const [searchInput, setSearchInput] = useState<string>('');
    const {lastMessages, getLastChatHistories} = useSocket();
    const [isLoading, setIsloading] = useState<boolean>(true);

    function renderSearchBox() {
        return (
            <View style={styles.searchBarContainer}>
                <View style={{width: '90%'}}>
                    <Input
                        isDisabled
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
                        placeholder="Search message"
                        placeholderTextColor={colors.icon}
                        _focus={{
                            borderColor: colors.tertiary,
                        }}
                    />
                </View>
                <View
                    style={{
                        width: '10%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('ChatUserSearch')}>
                        <MaterialIcon
                            name="contact-mail"
                            size={25}
                            color={colors.icon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const renderEmptyCard = () => (
        <View style={styles.emptyCard}>
            <Text style={{...FONTS.caption}}>No conversation yet</Text>
        </View>
    );

    useFocusEffect(
        React.useCallback(() => {
            let isMounted = true;

            async function init() {
                try {
                    const success = await getLastChatHistories();
                    if (success) setIsloading(false);
                } catch (error) {
                    console.log(error);
                }
            }

            if (isMounted) {
                init();
            }
            return () => {
                isMounted = false;
            };
        }, []),
    );

    return (
        <View style={styles.container}>
            {renderSearchBox()}
            {!isLoading ? (
                searchInput.length === 0 ? (
                    <>
                        <FlatList<IContactProps>
                            data={lastMessages}
                            keyExtractor={(item) => item.room_id}
                            renderItem={({item}) => <Contact data={item} />}
                            ListEmptyComponent={renderEmptyCard}
                        />
                    </>
                ) : null
            ) : (
                <LoadingComponent />
            )}
        </View>
    );
};

export default ChatHomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
        display: 'flex',
        flexDirection: 'column',
    },
    searchBarContainer: {
        display: 'flex',
        flexDirection: 'row',
        width: sizes.width,
        height: sizes.height * 0.08,
        backgroundColor: colors.main,
        padding: 10,
    },
    emptyCard: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // width:"100%",
        marginHorizontal: 5,
        height: sizes.height * 0.1,
        backgroundColor: colors.main,
        borderRadius: 5,
    },
});
