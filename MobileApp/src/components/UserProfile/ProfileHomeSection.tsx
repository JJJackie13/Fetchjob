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
import {UserProfileProps} from '../../types/types';
import {format} from 'fecha';

import {colors, images, sizes, FONTS} from '../../constants';

interface ProfileHomeSectionProps {
    userProfile: UserProfileProps;
    hobbies: Array<{id: number; content: string}>;
    skills: Array<{id: number; content: string}>;
}

const ProfileHomeSection: React.FC<ProfileHomeSectionProps> = ({
    userProfile,
    hobbies,
    skills,
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
                        {userProfile.introduction}
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
                    More about {userProfile.first_name}
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
                            color: userProfile.website ? 'blue' : colors.icon,
                        }}
                        onPress={() => {
                            if (userProfile.website) {
                                Linking.openURL(userProfile.website);
                            }
                        }}>
                        {userProfile.website
                            ? userProfile.website
                            : 'Not provided'}
                    </Text>
                </View>
                <View style={styles.infoItemContainer}>
                    <Ionicons
                        name="school"
                        color={colors.icon}
                        size={20}
                        style={{marginRight: 5}}
                    />
                    <Text style={{...FONTS.minor}}>
                        {userProfile.education
                            ? userProfile.education
                            : 'Not provided'}
                    </Text>
                </View>
                <View style={styles.infoItemContainer}>
                    <MaterialIcons
                        name="sports-bar"
                        color={colors.icon}
                        size={20}
                        style={{marginRight: 5}}
                    />
                    <Text style={{...FONTS.minor}}>
                        {hobbies && hobbies.length > 0
                            ? hobbies.map((hobby) => hobby.content).join(', ')
                            : 'Not provided'}
                    </Text>
                </View>
                <View style={styles.infoItemContainer}>
                    <FontAwesome
                        name="birthday-cake"
                        color={colors.icon}
                        size={20}
                        style={{marginRight: 5}}
                    />
                    <Text style={{...FONTS.minor}}>
                        {userProfile.birthday
                            ? format(
                                  new Date(userProfile.birthday),
                                  'DDMMMYYYY',
                              )
                            : 'Not provided'}
                    </Text>
                </View>
            </View>
        );
    };

    function renderSkillsetSection() {
        return (
            <View style={styles.skillsetSectionContainer}>
                <Text style={{...FONTS.paragraph, marginBottom: 5}}>
                    Skillsets
                </Text>
                <View style={styles.infoItemContainer}>
                    <MaterialCommunityIcons
                        name="shape-plus"
                        color={colors.icon}
                        size={20}
                        style={{marginRight: 5}}
                    />
                    <Text style={{...FONTS.minor}}>
                        {skills.length > 0
                            ? skills.map((skill) => skill.content).join(', ')
                            : 'Not provided'}
                    </Text>
                </View>
            </View>
        );
    }

    function renderContactSection() {
        return (
            <View style={styles.contactSectionContainer}>
                <Text style={{...FONTS.paragraph, marginBottom: 5}}>
                    Contact {userProfile.first_name}
                </Text>
                <View style={styles.infoItemContainer}>
                    <MaterialCommunityIcons
                        name="cellphone-iphone"
                        color={colors.icon}
                        size={20}
                        style={{marginRight: 5}}
                    />
                    <Text style={{...FONTS.minor}}>
                        {userProfile.phone
                            ? userProfile.phone
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
                        {userProfile.email
                            ? userProfile.email
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
                        {userProfile.address
                            ? userProfile.address
                            : 'Not available'}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View>
            {/* INTRODUCTION */}
            {!!userProfile.introduction && renderIntroductionSection()}
            {/* HOBBIES */}
            {renderAdditionalInfo()}
            {/* SKILLSET */}
            {skills && renderSkillsetSection()}
            {/* CONTACT */}
            {renderContactSection()}
        </View>
    );
};

export default ProfileHomeSection;

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
        marginTop: 10,
        padding: 20,
        minHeight: sizes.height * 0.1,
        backgroundColor: colors.main,
        elevation: 1,
    },
});
