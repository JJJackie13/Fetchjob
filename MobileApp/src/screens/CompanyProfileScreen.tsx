import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    RefreshControl,
    Pressable,
} from 'react-native';
import {Button} from 'native-base';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import {useFocusEffect} from '@react-navigation/native';
import {format} from 'fecha';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {RootStackParamList} from '../types/types';

import MinorNavBar from '../components/MinorNavBar';
import CompanyProfileHomeSection from '../components/UserProfile/CompanyProfileHomeSection';
import ProfilePostSection from '../components/UserProfile/ProfilePostSection';
import CompanyReviewSection from '../components/UserProfile/CompanyReviewSection';
import CompanyProfileNonOwnerBottomSheet from '../components/BottomSheets/CompanyProfileNonOwnerBottomSheet';
import EditCompanyAvatarContent from '../components/BottomSheets/EditCompanyAvatarContent';
import EditCompanyBannerContent from '../components/BottomSheets/EditCompanyBannerContent';
import LoadingComponent from '../components/LoadingComponent';

import {API_URL} from '@env';
import {colors, images, sizes, FONTS, formats} from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CompanyProfileProps} from '../types/types';
import CompanyJobSection from '../components/UserProfile/CompanyJobSection';

type Props = NativeStackScreenProps<RootStackParamList, 'CompanyProfile'>;

enum Pages {
    Home = 'Home',
    Posts = 'Posts',
    Review = 'Review',
    Job = 'Job',
}

const CompanyProfileScreen: React.FC<{
    navigation: Props['navigation'];
    route: Props['route'];
}> = ({navigation, route}) => {
    const companyId = route.params.companyId;
    const [page, setPage] = useState<Pages>(Pages.Home);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [scrollRefresh, setScrollRefresh] = useState<boolean>(false);
    const [companyProfile, setCompanyProfile] = useState<CompanyProfileProps>();
    const [avatar, setAvatar] = useState();
    const [banner, setBanner] = useState();
    const [isFollower, setIsFollower] = useState(false);
    const [followerCount, setFollowerCount] = useState<number>(0);
    const [isOwner, setIsOwner] = useState(false);
    const [controlLevel, setControlLevel] = useState(0);
    const connectionModalRef = useRef<BottomSheet>(null);
    const chgAvatarModalRef = useRef<BottomSheet>(null);
    const chgBannerModalRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['25%'], []);
    const editImgSnapPoints = useMemo(() => ['95%'], []);

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        [],
    );

    function handleOptionBtn() {
        if (!isOwner) {
            connectionModalRef.current?.expand();
        } else if (isOwner) {
            navigation.navigate('CompanySetting', {
                companyId: companyId,
                companyName: companyProfile?.company_name
                    ? companyProfile?.company_name
                    : '',
                companyAvatar: companyProfile?.avatar
                    ? companyProfile.avatar
                    : '',
                controlLevel: controlLevel,
            });
        }
    }

    function openChangeAvatarModal() {
        if (isOwner) {
            chgAvatarModalRef.current?.expand();
        }
    }
    function openChangeBannerModal() {
        if (isOwner) {
            chgBannerModalRef.current?.expand();
        }
    }

    const LeftComponent = () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <IonIcon name="arrow-back" size={25} />
        </TouchableOpacity>
    );

    const RightComponent = () => (
        <TouchableOpacity
            onPress={isLoading ? () => {} : () => handleOptionBtn()}>
            <MaterialCommunityIcons name="dots-horizontal" size={25} />
        </TouchableOpacity>
    );

    function followStateHandler(isFollowed: boolean) {
        if (isFollowed) {
            setFollowerCount((prev) => prev + 1);
        } else {
            setFollowerCount((prev) => prev - 1);
        }
        setIsFollower(isFollowed);
    }

    function closeAllModels() {
        connectionModalRef.current?.close();
        chgAvatarModalRef.current?.close();
        chgBannerModalRef.current?.close();
    }

    function renderProfileHeader() {
        return (
            <View style={styles.profileHeader}>
                <View style={styles.coverImgContainer}>
                    <Image
                        style={styles.coverImg}
                        source={
                            banner
                                ? formats.httpFormat.test(banner)
                                    ? {
                                          uri: `${banner}`,
                                      }
                                    : {
                                          uri: `${API_URL}/${banner}`,
                                      }
                                : images.noBanner
                        }
                    />
                    {isOwner ? (
                        <TouchableOpacity
                            style={styles.changeCoverBtn}
                            onPress={openChangeBannerModal}>
                            <MaterialIcons
                                size={25}
                                color="#fff"
                                name="add-photo-alternate"
                            />
                        </TouchableOpacity>
                    ) : null}
                    <Image
                        style={styles.avatar}
                        source={
                            avatar
                                ? formats.httpFormat.test(avatar)
                                    ? {
                                          uri: `${avatar}`,
                                      }
                                    : {
                                          uri: `${API_URL}/${avatar}`,
                                      }
                                : images.noCompanyAvatar
                        }
                    />
                    {isOwner ? (
                        <TouchableOpacity
                            style={styles.changeAvatarBtn}
                            onPress={openChangeAvatarModal}>
                            <MaterialIcons
                                size={25}
                                color="#fff"
                                name="add-a-photo"
                            />
                        </TouchableOpacity>
                    ) : null}
                </View>
                <View style={styles.userBasicInfoContainer}>
                    <Text style={{...FONTS.main, marginBottom: 10}}>
                        {companyProfile?.company_name}
                    </Text>

                    {companyProfile?.city && (
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 10,
                            }}>
                            <Entypo
                                name="location"
                                size={20}
                                color={colors.icon}
                                style={{marginRight: 5, marginLeft: 1}}
                            />
                            <Text style={{...FONTS.minor}}>
                                {companyProfile.city}
                                {companyProfile.country
                                    ? `, ${companyProfile.country}`
                                    : ''}
                            </Text>
                        </View>
                    )}
                    {companyProfile?.company_name && (
                        <View
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginBottom: 10,
                            }}>
                            <IonIcon
                                name="md-business-sharp"
                                size={15}
                                color={colors.icon}
                                style={{marginRight: 8, marginLeft: 5}}
                            />
                            <Text style={{...FONTS.minor}}>
                                {companyProfile.company_name}
                            </Text>
                        </View>
                    )}
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: 10,
                        }}>
                        <FontAwesome5
                            name="user-friends"
                            size={15}
                            color={colors.highlight}
                            style={{marginRight: 8, marginLeft: 1}}
                        />
                        <Text style={{...FONTS.minor, color: colors.highlight}}>
                            {followerCount} Followers
                        </Text>
                    </View>
                    {companyProfile?.created_at && (
                        <Text style={{...FONTS.caption}}>
                            Joined on{' '}
                            {format(
                                new Date(companyProfile.created_at),
                                'DDMMMYYYY',
                            )}
                        </Text>
                    )}
                </View>
            </View>
        );
    }

    function renderBtnGroup() {
        return (
            <ScrollView
                style={styles.sectionBtnContainer}
                horizontal
                showsHorizontalScrollIndicator={false}>
                <Button.Group>
                    <Button
                        onPress={() => setPage(Pages.Home)}
                        disabled={page === Pages.Home}
                        variant="ghost"
                        _pressed={{backgroundColor: '#ccc'}}
                        _text={{
                            color:
                                page === Pages.Home
                                    ? colors.highlight
                                    : colors.headline,
                        }}
                        style={{borderColor: colors.headline}}>
                        {Pages.Home}
                    </Button>
                    <Button
                        onPress={() => setPage(Pages.Posts)}
                        disabled={page === Pages.Posts}
                        variant="ghost"
                        _pressed={{backgroundColor: '#ccc'}}
                        _text={{
                            color:
                                page === Pages.Posts
                                    ? colors.highlight
                                    : colors.headline,
                        }}
                        style={{borderColor: colors.headline}}>
                        {Pages.Posts}
                    </Button>
                    <Button
                        onPress={() => setPage(Pages.Review)}
                        disabled={page === Pages.Review}
                        variant="ghost"
                        _pressed={{backgroundColor: '#ccc'}}
                        _text={{
                            color:
                                page === Pages.Review
                                    ? colors.highlight
                                    : colors.headline,
                        }}
                        style={{borderColor: colors.headline}}>
                        {Pages.Review}
                    </Button>
                    <Button
                        onPress={() => setPage(Pages.Job)}
                        disabled={page === Pages.Job}
                        variant="ghost"
                        _pressed={{backgroundColor: '#ccc'}}
                        _text={{
                            color:
                                page === Pages.Job
                                    ? colors.highlight
                                    : colors.headline,
                        }}
                        style={{borderColor: colors.headline}}>
                        {Pages.Job}
                    </Button>
                </Button.Group>
            </ScrollView>
        );
    }

    const renderMainContent = () => {
        switch (page) {
            case Pages.Home:
                return (
                    <>
                        {companyProfile && (
                            <CompanyProfileHomeSection
                                companyProfile={companyProfile}
                            />
                        )}
                    </>
                );
            case Pages.Posts:
                return (
                    <>
                        <ProfilePostSection
                            scrollRefresh={scrollRefresh}
                            setScrollRefresh={setScrollRefresh}
                            companyId={companyId}
                        />
                    </>
                );
            case Pages.Review:
                return (
                    <>
                        <CompanyReviewSection
                            scrollRefresh={scrollRefresh}
                            setScrollRefresh={setScrollRefresh}
                            companyId={companyId}
                        />
                    </>
                );
            case Pages.Job:
                return (
                    <>
                        <CompanyJobSection
                            scrollRefresh={scrollRefresh}
                            setScrollRefresh={setScrollRefresh}
                            companyId={companyId}
                        />
                    </>
                );
            default:
                return (
                    <>
                        {companyProfile && (
                            <CompanyProfileHomeSection
                                companyProfile={companyProfile}
                            />
                        )}
                    </>
                );
        }
    };

    async function fetchData() {
        try {
            const res = await fetch(`${API_URL}/company/info/${companyId}`, {
                headers: {
                    Authorization: `Bearer ${await AsyncStorage.getItem(
                        'token',
                    )}`,
                },
            });
            const parseRes = await res.json();
            if (res.ok) {
                // console.log(parseRes);
                setCompanyProfile(parseRes.data);
                setAvatar(parseRes.data.avatar);
                setBanner(parseRes.data.banner);
                setIsFollower(parseRes.isFollower);
                setIsOwner(parseRes.isOwner);
                setControlLevel(parseRes.ownerControlLevel);
                setFollowerCount(parseRes.followerCount);
                setIsLoading(false);
            } else {
                console.log(parseRes.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            let isMounted = true;
            fetchData();
            return () => {
                isMounted = false;
            };
        }, []),
    );

    return (
        <View style={styles.container}>
            <MinorNavBar
                LeftComponent={LeftComponent}
                RightComponent={RightComponent}
            />
            {isLoading ? (
                <LoadingComponent />
            ) : (
                <>
                    <ScrollView
                        overScrollMode="never"
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={10}
                        refreshControl={
                            page === Pages.Posts || page === Pages.Job ? (
                                <RefreshControl
                                    refreshing={scrollRefresh || isLoading}
                                    onRefresh={() => {
                                        if (
                                            page === Pages.Posts ||
                                            page === Pages.Job
                                        ) {
                                            setScrollRefresh(true);
                                        }
                                    }}
                                />
                            ) : undefined
                        }>
                        <Pressable onPress={closeAllModels}>
                            {renderProfileHeader()}
                            {renderBtnGroup()}
                        </Pressable>
                        {renderMainContent()}
                    </ScrollView>
                    {isOwner ? (
                        <>
                            <BottomSheet
                                style={styles.bottomSheet}
                                ref={chgAvatarModalRef}
                                index={-1}
                                snapPoints={editImgSnapPoints}
                                enablePanDownToClose
                                enableHandlePanningGesture
                                backdropComponent={renderBackdrop}>
                                <EditCompanyAvatarContent
                                    companyId={companyId}
                                    closeAllModels={closeAllModels}
                                    avatar={avatar}
                                    setAvatar={setAvatar}
                                />
                            </BottomSheet>
                            <BottomSheet
                                style={styles.bottomSheet}
                                ref={chgBannerModalRef}
                                index={-1}
                                snapPoints={editImgSnapPoints}
                                enablePanDownToClose
                                enableHandlePanningGesture
                                backdropComponent={renderBackdrop}>
                                <EditCompanyBannerContent
                                    companyId={companyId}
                                    closeAllModels={closeAllModels}
                                    banner={banner}
                                    setBanner={setBanner}
                                />
                            </BottomSheet>
                        </>
                    ) : (
                        <BottomSheet
                            style={styles.bottomSheet}
                            ref={connectionModalRef}
                            index={-1}
                            snapPoints={snapPoints}
                            enablePanDownToClose
                            enableHandlePanningGesture
                            backdropComponent={renderBackdrop}>
                            <CompanyProfileNonOwnerBottomSheet
                                companyId={companyId}
                                isFollower={isFollower}
                                followStateHandler={followStateHandler}
                            />
                        </BottomSheet>
                    )}
                </>
            )}
        </View>
    );
};

export default CompanyProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.tertiary,
    },
    profileHeader: {
        minHeight: sizes.height * 0.5,
        width: sizes.width,
        backgroundColor: colors.main,
    },
    coverImgContainer: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: sizes.width - 15 * 2,
        height: sizes.height * 0.2,
        margin: 15,
        marginTop: 5,
        marginBottom: (sizes.height * 0.25) / 3,
    },
    coverImg: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 10,
    },
    changeCoverBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 10,
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: '#0000005a',
    },
    avatar: {
        position: 'absolute',
        width: sizes.width * 0.3,
        height: sizes.width * 0.3,
        borderRadius: (sizes.width * 0.3) / 2,
        transform: [{translateY: (sizes.height * 0.25) / 2.5}],
        borderWidth: 3,
        borderColor: colors.main,
    },
    changeAvatarBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: sizes.width * 0.3,
        height: sizes.width * 0.3,
        borderRadius: (sizes.width * 0.3) / 2,
        backgroundColor: '#0000005a',
        position: 'absolute',
        transform: [{translateY: (sizes.height * 0.25) / 2.5}],
    },
    userBasicInfoContainer: {
        display: 'flex',
        marginHorizontal: 20,
        paddingBottom: 10,
    },
    sectionBtnContainer: {
        display: 'flex',
        backgroundColor: colors.main,
        minHeight: 30,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopColor: '#ccc',
        borderTopWidth: 0.2,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.2,
    },
    bottomSheet: {
        elevation: 15,
        marginHorizontal: 5,
        backgroundColor: colors.main,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
});
