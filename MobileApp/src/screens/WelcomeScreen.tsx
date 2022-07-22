import React, {useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Button} from 'native-base';
import Carousel from 'react-native-looped-carousel'; // Type error can ignore

import {colors, sizes, images} from '../constants';

const WelcomeScreen: React.FC<any> = ({setAuth, navigation}) => {
    const [btnPressed, setBtnPressed] = useState<boolean>(false);

    return (
        <View style={styles.container}>
            <View style={styles.logoSection}>
                <Image style={styles.logo} source={images.logoHorizon} />
            </View>
            <Carousel
                delay={6000}
                style={styles.welcomeImageSection}
                autoplay
                bullets
                bulletsContainerStyle={styles.bulletContainer}
                bulletStyle={styles.bullet}
                chosenBulletStyle={styles.chosenBullet}
                onAnimateNextPage={() => {}}>
                <View style={styles.welcomeImageContainer}>
                    <View
                        style={[
                            styles.backgroundColor,
                            {backgroundColor: colors.tertiary},
                        ]}
                    />
                    <Image
                        source={images.welcomeImage1}
                        style={styles.welcomeImage}
                    />
                    <Text style={styles.welcomeImageCaption}>
                        Welcome to your professional community
                    </Text>
                </View>
                <View style={styles.welcomeImageContainer}>
                    <View
                        style={[
                            styles.backgroundColor,
                            {backgroundColor: '#918c80'},
                        ]}
                    />
                    <Image
                        source={images.welcomeImage2}
                        style={styles.welcomeImage}
                    />
                    <Text style={styles.welcomeImageCaption}>
                        Networking is key to success.
                    </Text>
                </View>
                <View style={styles.welcomeImageContainer}>
                    <View
                        style={[
                            styles.backgroundColor,
                            {backgroundColor: colors.highlight},
                        ]}
                    />
                    <Image
                        source={images.welcomeImage3}
                        style={styles.welcomeImage}
                    />
                    <Text style={styles.welcomeImageCaption}>
                        Exceed your potential… come join us!
                    </Text>
                </View>
            </Carousel>
            <View style={styles.buttonSection}>
                <Button
                    style={[styles.button, {backgroundColor: colors.button}]}
                    onPress={() => {
                        navigation.navigate('Login');
                    }}>
                    Sign In
                </Button>
                <Button
                    style={styles.button}
                    _text={{
                        color: btnPressed ? colors.main : colors.buttonText,
                    }}
                    variant="ghost"
                    onPressIn={() => setBtnPressed(true)}
                    onPressOut={() => setBtnPressed(false)}
                    _pressed={styles.registerBtnClicked}
                    onPress={() => navigation.navigate('Register')}>
                    Register
                </Button>
            </View>
        </View>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: colors.main,
    },
    logoSection: {
        display: 'flex',
        justifyContent: 'flex-start',
        paddingLeft: sizes.width * 0.05,
        // paddingTop: sizes.height* 0.05,
        height: sizes.height * 0.1,
        width: sizes.width,
    },
    logo: {
        width: sizes.width * 0.3,
        height: '100%',
        resizeMode: 'contain',
    },
    welcomeImageSection: {
        height: sizes.height * 0.85,
        overflow: 'hidden',
        paddingTop: sizes.height * 0.05,
    },
    welcomeImageContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: sizes.height * 0.1,
        paddingBottom: sizes.height * 0.05,
        width: sizes.width,
        height: sizes.height * 0.8,
    },
    backgroundColor: {
        position: 'absolute',
        top: '15%',
        width: sizes.width * 0.75,
        borderRadius: ((sizes.width * 0.75) / 2) * 0.75,
        aspectRatio: 1,
        opacity: 0.8,
    },
    bulletContainer: {
        height: 30,
        transform: [{translateY: -35}],
    },
    bullet: {
        borderWidth: 1,
        borderColor: colors.icon,
    },
    chosenBullet: {
        backgroundColor: colors.icon,
    },
    welcomeImage: {
        width: sizes.width * 0.8,
        height: '50%',
        resizeMode: 'contain',
    },
    welcomeImageCaption: {
        fontSize: sizes.title + 1,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        color: colors.paragraph,
        marginTop: '20%',
        marginBottom: '20%',
        marginHorizontal: '10%',
    },
    buttonSection: {
        display: 'flex',
        flexDirection: 'column',
        height: sizes.height * 0.2,
    },
    button: {
        marginHorizontal: sizes.width * 0.1,
        height: 40,
        borderRadius: 20,
        marginTop: 5,
    },
    registerBtnClicked: {
        backgroundColor: '#cccccc89',
    },
});
