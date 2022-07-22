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
import Entypo from 'react-native-vector-icons/Entypo';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useSelector, useDispatch} from 'react-redux';
import {format} from 'fecha';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {RootStackParamList} from '../types/types';

import MinorNavBar from '../components/MinorNavBar';
import ProfileHomeSection from '../components/UserProfile/ProfileHomeSection';
import ProfilePostSection from '../components/UserProfile/ProfilePostSection';
import ProfileNonSelfBottomSheet from '../components/BottomSheets/ProfileNonSelfBottomSheet';
import EditUserAvatarContent from '../components/BottomSheets/EditUserAvatarContent';
import EditUserBannerContent from '../components/BottomSheets/EditUserBannerContent';
import LoadingComponent from '../components/LoadingComponent';

import {API_URL} from '@env';
import {colors, images, sizes, FONTS, formats} from '../constants';
import {IRootState} from '../store/store';
import {fetchUserById} from '../store/thunks/userThunk';

type Props = NativeStackScreenProps<RootStackParamList, 'UserProfile'>;

enum Pages {
    Home = 'Home',
    Posts = 'Posts',
}

const UserProfileScreen: React.FC<{
    navigation: Props['navigation'];
    route: Props['route'];
}> = ({navigation, route}) => {
    const dispatch = useDispatch();
    const currentUserId = useSelector(
        (state: IRootState) => state.auth.user?.id,
    );
    const profileUserId = route.params.userId;
    let userProfile = useSelector((state: IRootState) => state.user.info);
    const hobbies = useSelector((state: IRootState) => state.user.hobbies);
    const skills = useSelector((state: IRootState) => state.user.skills);
    const numberOfConnections = useSelector(
        (state: IRootState) => state.user.numberOfConnections,
    );
    const [page, setPage] = useState<string>('Home');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [scrollRefresh, setScrollRefresh] = useState<boolean>(false);
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
        if (currentUserId !== profileUserId) {
            connectionModalRef.current?.expand();
        } else if (currentUserId === profileUserId) {
            navigation.navigate('UserSetting');
        }
    }

    function openChangeAvatarModal() {
        if (currentUserId === profileUserId) {
            chgAvatarModalRef.current?.expand();
        }
    }
    function openChangeBannerModal() {
        if (currentUserId === profileUserId) {
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
                            userProfile?.banner
                                ? formats.httpFormat.test(userProfile?.banner)
                                    ? {
                                          uri: `${userProfile?.banner}`,
                                      }
                                    : {
                                          uri: `${API_URL}/${userProfile?.banner}`,
                                      }
                                : images.noBanner
                        }
                    />
                    {currentUserId === profileUserId ? (
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
                            userProfile?.avatar
                                ? formats.httpFormat.test(userProfile?.avatar)
                                    ? {
                                          uri: `${userProfile?.avatar}`,
                                      }
                                    : {
                                          uri: `${API_URL}/${userProfile?.avatar}`,
                                      }
                                : images.noAvatar
                        }
                    />
                    {currentUserId === profileUserId ? (
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
                    <Text style={{...FONTS.main}}>
                        {userProfile?.first_name} {userProfile?.last_name}
                    </Text>
                    {userProfile?.headline && (
                        <Text style={{...FONTS.minor, marginBottom: 10}}>
                            {userProfile.headline}
                            {userProfile.industry
                                ? `, ${userProfile.industry}`
                                : ''}
                        </Text>
                    )}
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
                            {userProfile?.city
                                ? userProfile.city
                                : 'Not provided'}
                            {userProfile?.city && userProfile?.country
                                ? `, ${userProfile?.country}`
                                : ''}
                        </Text>
                    </View>
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
                            {userProfile?.company_name
                                ? userProfile.company_name
                                : 'Not provided'}
                        </Text>
                    </View>
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
                            {numberOfConnections} Connections
                        </Text>
                    </View>
                    {userProfile?.created_at && (
                        <Text style={{...FONTS.caption}}>
                            Joined on{' '}
                            {format(
                                new Date(userProfile.created_at),
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
                        onPress={() => setPage('Home')}
                        disabled={page === 'Home'}
                        variant="ghost"
                        _pressed={{backgroundColor: '#ccc'}}
                        _text={{
                            color:
                                page === 'Home'
                                    ? colors.highlight
                                    : colors.headline,
                        }}
                        style={{borderColor: colors.headline}}>
                        Home
                    </Button>
                    <Button
                        onPress={() => setPage('Posts')}
                        disabled={page === 'Posts'}
                        variant="ghost"
                        _pressed={{backgroundColor: '#ccc'}}
                        _text={{
                            color:
                                page === 'Posts'
                                    ? colors.highlight
                                    : colors.headline,
                        }}
                        style={{borderColor: colors.headline}}>
                        Posts
                    </Button>
                </Button.Group>
            </ScrollView>
        );
    }

    const MainContent: React.FC = () => {
        switch (page) {
            case Pages.Home:
                return (
                    <>
                        {userProfile && hobbies && skills && (
                            <ProfileHomeSection
                                userProfile={userProfile}
                                hobbies={hobbies}
                                skills={skills}
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
                            userId={profileUserId}
                        />
                    </>
                );
            default:
                return (
                    <>
                        {userProfile && hobbies && skills && (
                            <ProfileHomeSection
                                userProfile={userProfile}
                                hobbies={hobbies}
                                skills={skills}
                            />
                        )}
                    </>
                );
        }
    };

    async function fetchData() {
        const success = await fetchUserById(route.params.userId)(dispatch);
        if (success) {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        let isMounted = true;
        if (isMounted) {
            // console.log(route.params.userId);
            setIsLoading(true);
            fetchData();
        }
        () => {
            isMounted = false;
        };
    }, [route.params.userId]);

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
                            page === Pages.Posts ? (
                                <RefreshControl
                                    refreshing={scrollRefresh || isLoading}
                                    onRefresh={() => {
                                        if (page === Pages.Posts) {
                                            // console.log('scrolled Post');
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
                        <MainContent />
                    </ScrollView>
                    {currentUserId === profileUserId ? (
                        <>
                            <BottomSheet
                                style={styles.bottomSheet}
                                ref={chgAvatarModalRef}
                                index={-1}
                                snapPoints={editImgSnapPoints}
                                enablePanDownToClose
                                enableHandlePanningGesture
                                backdropComponent={renderBackdrop}>
                                <EditUserAvatarContent
                                    closeAllModels={closeAllModels}
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
                                <EditUserBannerContent
                                    closeAllModels={closeAllModels}
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
                            <ProfileNonSelfBottomSheet
                                targetUserId={profileUserId}
                            />
                        </BottomSheet>
                    )}
                </>
            )}
        </View>
    );
};

export default UserProfileScreen;

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
