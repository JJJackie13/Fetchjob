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

const SearchBarEmptyCard: React.FC = ({}) => {
    return (
        <View
            style={styles.cardContainer}
            >
            <View style={styles.icon}>
                <FontAwesomeIcon
                    name="search"
                    size={25}
                    color={colors.icon}
                />
            </View>
            <Text style={styles.text}>No search result</Text>
        </View>
    )
}

export default SearchBarEmptyCard;

const styles = StyleSheet.create({
    cardContainer: {
        width: sizes.width,
        height: sizes.height * 0.06,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',    
    },
    searchCard: {
        height: 1,
        width: sizes.width,
    },
    avatar: {
        height: sizes.height * 0.08,
        width: sizes.height * 0.08,
        borderWidth: 2,
        borderColor: '#cccccc22',
        borderRadius: sizes.height * 0.08,
        overflow: 'hidden',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    icon: {
        paddingLeft: 10,
        paddingRight: 80,
    },
});