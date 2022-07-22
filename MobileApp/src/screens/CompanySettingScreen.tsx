import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {colors, FONTS, sizes} from '../constants';
import {RootStackParamList} from '../types/types';
import {CompanyControlLevel} from '../types/enums';
import IonIcon from 'react-native-vector-icons/Ionicons';

import MinorNavbar from '../components/MinorNavBar';

type Props = NativeStackScreenProps<RootStackParamList, 'CompanySetting'>;

const CompanySettingScreen: React.FC<Props> = ({navigation, route}) => {
    const controlLevel = route.params.controlLevel;
    // const companyId = route.params.companyId;

    const LeftComponent = () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <IonIcon name="chevron-back" size={25} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <MinorNavbar
                middleText={route.params.companyName}
                LeftComponent={LeftComponent}
            />
            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.navigate('CompanyProfile', {
                        companyId: route.params.companyId,
                    })
                }>
                <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                    Company Profile
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.navigate('CompanyBasicInfoEdit', {
                        companyId: route.params.companyId,
                    })
                }>
                <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                    Edit Basic Info
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.navigate('CompanyIntroductionEdit', {
                        companyId: route.params.companyId,
                    })
                }>
                <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                    Edit Company Introduction
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.navigate('Post', {
                        companyId: route.params.companyId,
                        companyName: route.params.companyName,
                        companyAvatar: route.params.companyAvatar,
                    })
                }>
                <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                    Create Post
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.navigate('PostJob', {
                        companyId: route.params.companyId,
                        companyName: route.params.companyName,
                    })
                }>
                <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                    Post Job
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() =>
                    navigation.navigate('PostJobReview', {
                        companyId: route.params.companyId,
                    })
                }>
                <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                    Review posted Job
                </Text>
            </TouchableOpacity>
            {controlLevel == CompanyControlLevel.MASTER && (
                <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                        navigation.navigate('MangeCompanyController', {
                            companyId: route.params.companyId,
                            companyName: route.params.companyName,
                        })
                    }>
                    <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                        Manager company profile controllers
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default CompanySettingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: 80,
        backgroundColor: colors.main,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        marginBottom: 0.5,
        paddingHorizontal: sizes.width * 0.1,
        // elevation: 5,
    },
    buttonText: {},
});
