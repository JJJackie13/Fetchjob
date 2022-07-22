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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
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


interface Job {
    job_title: string;
}

interface User {
    avatar: string;
    first_name: string;
    last_name: string;
    headline: string;
}

interface Company {
    avatar: string;
    company_name: string;
    industry: string;
}

const SearchBarJobCard: React.FC<{
    data: Job;
}> = ({data}) => {
    const navigation =useNavigation<NativeStackNavigationProp<RootStackParamList, any>>();

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            >
            <View style={styles.textBox}>
            <FontAwesomeIcon
                style={styles.icon}
                name="search"
                size={25}
                color={colors.icon}
            />
            
                <Text>{data.job_title}</Text>
            </View>
            <MaterialCommunityIcon
                name="arrow-top-left"
                size={25}
                color={colors.icon}
            />
        </TouchableOpacity>
    )
}

export default SearchBarJobCard;

const styles = StyleSheet.create({
    cardContainer: {
        width: sizes.width * 0.95,
        height: sizes.height * 0.06,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 1,  
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
    },
    textBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        paddingRight: 10,
        paddingLeft: 5,
    },
});