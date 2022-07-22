import React, {useState, useRef, useMemo, useCallback, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
} from 'react-native';
import {Portal, PortalHost} from '@gorhom/portal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {NavigationProp, RouteProp} from '@react-navigation/core';

import {colors, FONTS, images, sizes, formats} from '../../constants';
import {RootStackParamList} from '../../types/types';
import {API_URL} from '@env';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { size } from 'styled-system';


interface Job {
    job_title: string;
}

interface User {
    avatar: string;
    first_name: string;
    last_name: string;
    headline: string;
    counterpart_id:string;
}

interface Company {
    avatar: string;
    company_name: string;
    industry: string;
    id: string;
}

const SearchBarUserCard: React.FC<{
    data: User;
}> = ({data}) => {
    const navigation =useNavigation<NativeStackNavigationProp<RootStackParamList, any>>();

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() =>
                navigation.navigate('UserProfile', {
                    userId: parseInt(data.counterpart_id),
                })
            }>
            <View style={styles.avatar}>
                    <Image
                        style={{width: '100%', height: '100%', borderRadius: sizes.height * 0.08 /2,}}
                        source={
                            data.avatar
                                ? formats.httpFormat.test(data.avatar)
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
            <View>
                <Text>{data.first_name}{' '}{data.last_name}</Text>
            </View>
            <View>
                <Text>· {data.headline}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default SearchBarUserCard;

const styles = StyleSheet.create({
    cardContainer: {
        width: sizes.width,
        height: sizes.height * 0.06,
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 3,  
        alignItems: 'center',
    },
    searchCard: {
        height: 1,
        width: sizes.width,
    },
    avatar: {
        height: sizes.height * 0.04,
        width: sizes.height * 0.04,
        // position: 'absolute',
        borderWidth: 2,
        borderColor: '#cccccc22',
        borderRadius: sizes.height * 0.5,
        overflow: 'hidden',
        marginRight: 5,
    },
});