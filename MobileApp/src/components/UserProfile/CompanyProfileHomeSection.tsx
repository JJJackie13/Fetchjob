import React, {useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Linking,
    TouchableHighlight,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import {CompanyProfileProps} from '../../types/types';
import {format} from 'fecha';

import {colors, images, sizes, FONTS} from '../../constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

interface CompanyProfileHomeSectionProps {
    companyProfile: CompanyProfileProps;
}

const CompanyProfileHomeSection: React.FC<CompanyProfileHomeSectionProps> = ({
    companyProfile,
}) => {
    const [numOfLine, setNumOfLine] = useState<number>(4);
    const [showMoreBtn, setShowMoreBtn] = useState<boolean>(false);

    function renderIntroductionSection() {
        return (
            <View style={styles.introductionSectionContainer}>
                <Text style={{...FONTS.paragraph, marginBottom: 5}}>
                    Introduction
                </Text>
                <View style={{position: 'relative'}}>
                    <Text
                        numberOfLines={numOfLine}
                        onTextLayout={(e) => {
                            if (e.nativeEvent.lines.length > numOfLine) {
                                setShowMoreBtn(true);
                            }
                        }}
                        style={{
                            ...FONTS.minor,
                            lineHeight: sizes.secondary + 5,
                        }}>
                        {companyProfile.introduction}
                    </Text>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        width: '100%',
                    }}>
                    {showMoreBtn && (
                        <TouchableHighlight
                            underlayColor={colors.tertiary}
                            style={{
                                backgroundColor: colors.main,
                                paddingRight: 1,
                            }}
                            onPress={() => {
                                setNumOfLine(1000);
                                setShowMoreBtn(false);
                            }}>
                            <Text
                                style={{
                                    ...FONTS.minor,
                                    color: colors.highlight,
                                }}>
                                Show more
                            </Text>
                        </TouchableHighlight>
                    )}
                </View>
            </View>
        );
    }

    const renderAdditionalInfo = () => {
        return (
            <View style={styles.additionInfoSectionContainer}>
                <Text style={{...FONTS.paragraph, marginBottom: 5}}>
                    More about {companyProfile.company_name}
                </Text>
                <View style={styles.infoItemContainer}>
                    <MaterialCommunityIcons
                        name="web"
                        color={colors.icon}
                        size={20}
                        style={{marginRight: 5}}
                    />
                    <Text
                        style={{
                            ...FONTS.minor,
                            color: companyProfile.website
                                ? 'blue'
                                : colors.icon,
                        }}
                        onPress={() => {
                            if (companyProfile.website) {
                                Linking.openURL(companyProfile.website);
                            }
                        }}>
                        {companyProfile.website
                            ? companyProfile.website
                            : 'Not provided'}
                    </Text>
                </View>
                <View style={styles.infoItemContainer}>
                    <Entypo
                        name="price-tag"
                        color={colors.icon}
                        size={20}
                        style={{marginRight: 5}}
                    />
                    <Text style={{...FONTS.minor}}>
                        {companyProfile.company_type
                            ? companyProfile.company_type
                            : 'Not provided'}
                    </Text>
                </View>
                {companyProfile.business_size && (
                    <View style={styles.infoItemContainer}>
                        <FontAwesome5
                            name="users"
                            color={colors.icon}
                            size={20}
                            style={{marginRight: 5}}
                        />
                        <Text style={{...FONTS.minor}}>
                            {companyProfile.business_size} employees
                        </Text>
                    </View>
                )}
                <View style={styles.infoItemContainer}>
                    <Entypo
                        name="calendar"
                        color={colors.icon}
                        size={20}
                        style={{marginRight: 5}}
                    />
                    <Text style={{...FONTS.minor}}>
                        Established in{' '}
                        {companyProfile.establish_in
                            ? companyProfile.establish_in
                            : '(Not provided)'}
                    </Text>
                </View>
            </View>
        );
    };

    function renderContactSection() {
        return (
            <View style={styles.contactSectionContainer}>
                <Text style={{...FONTS.paragraph, marginBottom: 5}}>
                    Contact {companyProfile.company_name}
                </Text>
                <View style={styles.infoItemContainer}>
                    <MaterialCommunityIcons
                        name="cellphone-iphone"
                        color={colors.icon}
                        size={20}
                        style={{marginRight: 5}}
                    />
                    <Text style={{...FONTS.minor}}>
                        {companyProfile.phone
                            ? companyProfile.phone
                            : 'Not available'}
                    </Text>
                </View>
                <View style={styles.infoItemContainer}>
                    <MaterialCommunityIcons
                        name="email-outline"
                        color={colors.icon}
                        size={20}
                        style={{marginRight: 5}}
                    />
                    <Text style={{...FONTS.minor}}>
                        {companyProfile.email
                            ? companyProfile.email
                            : 'Not available'}
                    </Text>
                </View>
                <View style={styles.infoItemContainer}>
                    <Entypo
                        name="address"
                        color={colors.icon}
                        size={20}
                        style={{marginRight: 5}}
                    />
                    <Text style={{...FONTS.minor}}>
                        {companyProfile.address
                            ? companyProfile.address
                            : 'Not available'}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View>
            {/* INTRODUCTION */}
            {!!companyProfile.introduction && renderIntroductionSection()}
            {/* HOBBIES */}
            {renderAdditionalInfo()}
            {/* CONTACT */}
            {renderContactSection()}
        </View>
    );
};

export default CompanyProfileHomeSection;

const styles = StyleSheet.create({
    infoItemContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    introductionSectionContainer: {
        marginHorizontal: 10,
        width: sizes.width - 20,
        borderRadius: sizes.cardBorderRadius,
        marginTop: 10,
        padding: 20,
        minHeight: sizes.height * 0.1,
        backgroundColor: colors.main,
        elevation: 1,
    },
    additionInfoSectionContainer: {
        marginHorizontal: 10,
        width: sizes.width - 20,
        borderRadius: sizes.cardBorderRadius,
        marginTop: 10,
        padding: 20,
        minHeight: sizes.height * 0.1,
        backgroundColor: colors.main,
        elevation: 1,
    },
    skillsetSectionContainer: {
        marginHorizontal: 10,
        width: sizes.width - 20,
        borderRadius: sizes.cardBorderRadius,
        marginTop: 10,
        padding: 20,
        minHeight: sizes.height * 0.1,
        backgroundColor: colors.main,
        elevation: 1,
    },
    contactSectionContainer: {
        marginHorizontal: 10,
        width: sizes.width - 20,
        borderRadius: sizes.cardBorderRadius,
        marginVertical: 10,
        padding: 20,
        minHeight: sizes.height * 0.1,
        backgroundColor: colors.main,
        elevation: 1,
    },
});
