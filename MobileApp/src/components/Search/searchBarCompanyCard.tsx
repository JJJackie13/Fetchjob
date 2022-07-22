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
import { size, textAlign } from 'styled-system';


interface Job {
    job_title: string;
}

interface User {
    avatar: string;
    first_name: string;
    last_name: string;
    headline: string;
    id:string;
}

interface Company {
    avatar: string;
    company_name: string;
    industry: string;
    id:string;
}

const SearchBarCompnayCard: React.FC<{
    data: Company;
}> = ({data}) => {
    const navigation =useNavigation<NativeStackNavigationProp<RootStackParamList, any>>();

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() =>
                navigation.navigate('CompanyProfile', {
                    companyId: parseInt(data.id),
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
                <Text>{data.company_name} · Company</Text>
            </View>
            <View style={styles.industryName}>
                <Text> · {data.industry}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default SearchBarCompnayCard;

const styles = StyleSheet.create({
    cardContainer: {
        width: sizes.width* 0.9,
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
    industryName: {
        width: sizes.width,
        textAlign: 'center',
    },
});