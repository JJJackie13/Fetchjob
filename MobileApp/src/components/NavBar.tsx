import React, {useState, useEffect, createRef} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableWithoutFeedback,
    Image,
    Keyboard,
    TouchableHighlight,
} from 'react-native';
import {Input, Icon} from 'native-base';
import {useSelector} from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {API_URL} from '@env';
import {images, sizes, colors, formats, FONTS} from '../constants';
import {IRootState} from '../store/store';
import {FlatList} from 'react-native-gesture-handler';
import SearchResult from './Search/SearchPage';
import {size} from 'styled-system';

const DrawerToggler: React.FC<{onPress: () => void}> = ({onPress}) => {
    const avatar = useSelector((state: IRootState) => state.auth.user?.avatar);

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Image
                style={styles.avatarImage}
                source={
                    avatar
                        ? formats.httpFormat.test(avatar)
                            ? {
                                  uri: `${avatar}`,
                              }
                            : {
                                  uri: `${API_URL}/${avatar}`,
                              }
                        : images.noAvatar
                }
            />
        </TouchableWithoutFeedback>
    );
};

const NavBar: React.FC<any> = ({navigation}) => {
    const [input, setInput] = useState<string>('');
    const regex = new RegExp(/^[A-Za-z\s+%]+$/);

    function toggleDrawer() {
        navigation.openDrawer();
    }

    function opPress() {
        navigation.navigate('SearchAll', {
            input: input,
        });
        setInput('');
    }

    function seeAllResultsBtn() {
        return (
            <TouchableHighlight
                style={styles.viewAllResultsBtn}
                underlayColor={colors.tertiary}
                onPress={() => opPress()}>
                <Text style={styles.viewAllResultsText}>See all results</Text>
            </TouchableHighlight>
        );
    }

    function noResultsBtn() {
        return <></>;
    }

    return (
        <View style={styles.navBarContainer}>
            <View style={styles.navBar}>
                <View style={styles.avatarContainer}>
                    <DrawerToggler onPress={toggleDrawer} />
                </View>
                <Input
                    value={input}
                    onChangeText={setInput}
                    color={colors.icon}
                    fontSize={sizes.input}
                    variant="filled"
                    InputLeftElement={
                        <Icon
                            as={<FontAwesome5 name="search" />}
                            size={5}
                            ml="4"
                            color={colors.icon}
                        />
                    }
                    placeholder="Search"
                    placeholderTextColor={colors.icon}
                    width={sizes.width * 0.8}
                    _focus={{
                        borderColor: colors.tertiary,
                    }}
                    onSubmitEditing={Keyboard.dismiss}
                />
            </View>
            {input === '' ? null : (
                <View style={styles.searchResult}>
                    <SearchResult input={input} />
                    {regex.test(input) ? seeAllResultsBtn() : noResultsBtn()}
                </View>
            )}
        </View>
    );
};

export default NavBar;

const styles = StyleSheet.create({
    navBarContainer: {},
    navBar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        backgroundColor: 'white',
        elevation: 5,
        zIndex: 5000,
    },
    avatarContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'grey',
        overflow: 'hidden',
        marginStart: 10,
        marginEnd: 10,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        resizeMode: 'cover',
    },
    searchResult: {
        position: 'absolute',
        left: 0,
        top: sizes.navBar,
        bottom: sizes.height * 0.05,
        height: sizes.height - sizes.navBar - sizes.height * 0.05,
        backgroundColor: colors.tertiary,
        zIndex: 2,
    },
    viewAllResultsBtn: {
        position: 'absolute',
        bottom: sizes.height * 0.05,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: sizes.width * 0.9,
        height: sizes.height * 0.05,
        alignItems: 'center',
        alignSelf: 'center',
        marginVertical: 10,
        padding: 5,
        // borderRadius: 10,
        // borderWidth: 2,
        // borderColor: colors.border,
    },
    viewAllResultsText: {
        fontSize: 18,
        color: '#5219FF',
        fontFamily: 'OpenSans-Regular',
        fontWeight: 'bold',
    },
});
