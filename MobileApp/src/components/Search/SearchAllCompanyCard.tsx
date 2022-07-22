import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight,Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/core';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import IonIcon from "react-native-vector-icons/Ionicons"
import {colors, FONTS, images, sizes, formats} from '../../constants';
import {RootStackParamList} from '../../types/types';
import {API_URL} from '@env';

type UserProfileNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'CompanyProfile'
>;

const SearchAllCompanyCard: React.FC<{
    data?: any;
}> = ({data}) => {
    const navigation = useNavigation<UserProfileNavigationProp>();

    function businessSize(size: string){
        let bSize = parseInt(size);
        if(bSize < 50) {
            return '1 - 50 employees'
        } else if (bSize > 50 && bSize <= 100) {
            return '51 - 100 employees'
        } else if (bSize > 100 && bSize <= 200) {
            return '101 - 200 employees'
        } else if (bSize > 200 && bSize <= 500) {
            return '201 - 500 employees'
        } else if (bSize > 500 && bSize <= 1000) {
            return '501 - 1000 employees'
        } else if (bSize > 1000 && bSize <= 5000) {
            return '1001 - 5000 employees'
        } else if (bSize > 5000 && bSize <= 10000) {
            return '5001 - 10000 employees'
        } else if (bSize > 10000 && bSize <= 50000) {
            return '10001 - 50000 employees'
        } else {
            return '50000+ employees'
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.headingPart}>
                <Image
                    style={styles.banner}
                    source={
                        data.banner
                            ? formats.httpFormat.test(data.banner)
                                ? {
                                    uri: `${data.banner}`,
                                }
                                : {
                                    uri: `${API_URL}/${data.banner}`,
                                }
                            : images.noBanner
                    }
                    resizeMode="cover"
                />
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
            </View>
            <View
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingHorizontal: sizes.width * 0.05,
                    paddingTop: 20,
                    position:'relative'
                }}>
                {data.is_verified &&
                    <View style={styles.verifiedBtn}>
                        <IonIcon
                            name="checkmark-circle-outline"
                            size={20}
                            color={colors.button}
                        />
                    </View>
                }
                <View style={styles.lowerLeftPart}>
                    <Text
                        style={{
                            ...FONTS.minor,
                            fontWeight: 'bold',
                            marginBottom: 5,
                        }}
                        numberOfLines={2}>
                        {data.company_name}
                    </Text>
                    <Text
                        style={{
                            ...FONTS.caption,
                            color: colors.paragraph,
                            marginBottom: 5,
                        }}
                        numberOfLines={2}>
                        {data.industry}
                    </Text>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginBottom: 5,
                            width: '100%',
                            flexWrap: 'wrap',
                        }}>
                        <Text
                            style={{
                                ...FONTS.caption,
                            }}
                            numberOfLines={2}>
                            {businessSize(data.business_size)}
                        </Text>
                    </View>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginBottom: 5,
                            width: '100%',
                            flexWrap: 'wrap',
                        }}>
                        <Text
                            style={{
                                ...FONTS.caption,
                            }}
                            numberOfLines={2}>
                            {data.city} · {data.country}
                        </Text>
                    </View>
                </View>
                <View style={styles.lowerRightPart}>
                    <TouchableHighlight
                        style={styles.viewProfileBtn}
                        underlayColor={colors.tertiary}
                        onPress={() =>
                            navigation.navigate('CompanyProfile', {
                                companyId: parseInt(data.id),
                            })
                        }>
                        <Text
                            style={{
                                ...FONTS.caption,
                                color: colors.button,
                                fontWeight: 'bold',
                            }}>
                            View Profile
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    );
};

export default SearchAllCompanyCard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        position: 'relative',
        backgroundColor: colors.main,
        // maxHeight: sizes.height * 0.3,
        width: sizes.width - 20,
        marginBottom: 5,
        borderRadius: 10,
        elevation: 1,
        overflow: 'hidden',
    },
    headingPart: {
        height: sizes.height * 0.08,
        marginBottom: 20,
    },
    banner: {
        height: '100%',
    },
    avatar: {
        height: sizes.height * 0.08,
        width: sizes.height * 0.08,
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#cccccc22',
        borderRadius: sizes.height * 0.1,
        left: (sizes.width * 0.5 - 15) / 3,
        transform: [
            {translateX: -(sizes.height * 0.08) / 2},
            {translateY: (sizes.height * 0.08) / 2},
        ],
        overflow: 'hidden',
    },
    lowerPart: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    lowerLeftPart: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative'
    },
    lowerRightPart: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '0%',
    },
    viewProfileBtn: {
        position: 'absolute',
        top: -60,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        width: (sizes.width * 0.5) / 2,
        marginVertical: 10,
        padding: 5,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: colors.button,
    },
    bottomSheet: {
        flex: 1,
        elevation: 15,
        marginHorizontal: 5,
        backgroundColor: colors.main,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        zIndex: 1000,
    },
    bottomSheetHandle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingRight: 10,
    },
    verifiedBtn: {
        position: 'absolute',
        top: -5,
        left: (sizes.width * 0.5) / 2,
    },
});
