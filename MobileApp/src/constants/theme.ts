import {Dimensions} from 'react-native';
import {StyleSheet} from 'react-native';
const {width, height} = Dimensions.get('window');

export const sizes = {
    width,
    height,
    heading: 25,
    title: 22,
    paragraph: 18,
    secondary: 15,
    caption: 13,
    input: 17,
    navBar: 50,
    // tabBar: 10,
    cardBorderRadius: 15,
};

export const colors = {
    headline: '#232323',
    paragraph: '#222525',
    button: '#078080',
    buttonText: '#232323',
    main: '#FFFFFE',
    highlight: '#078080',
    tertiary: '#F8F5F2',
    border: '#CCCCCC',
    icon: '#868080',
    background: '#F8F5F2',
    minorText: '#868080',
    warning: '#EC0B43',
    online: '#39FF14',
};

export const FONTS = StyleSheet.create({
    main: {
        fontSize: sizes.heading,
        color: colors.headline,
        fontFamily: 'Roboto-Bold',
        fontWeight: 'bold',
    },
    title: {
        fontSize: sizes.title,
        color: colors.headline,
        fontFamily: 'Roboto-Bold',
        fontWeight: 'bold',
    },
    paragraph: {
        fontSize: sizes.paragraph,
        color: colors.paragraph,
        fontFamily: 'Roboto-Regular',
    },
    minor: {
        fontSize: sizes.secondary,
        color: colors.paragraph,
        fontFamily: 'OpenSans-Regular',
    },
    caption: {
        fontSize: sizes.caption,
        color: colors.minorText,
        fontFamily: 'OpenSans-Regular',
    },
});
