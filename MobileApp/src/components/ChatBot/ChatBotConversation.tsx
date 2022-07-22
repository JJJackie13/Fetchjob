import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {colors, FONTS, sizes} from '../../constants';
import {IRootState} from '../../store/store';
import ChatBotConversationBubble from './ChatBotConversationBubble';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TypingAnimation} from 'react-native-typing-animation';
import {BottomSheetFlatList as FlatList} from '@gorhom/bottom-sheet';

const ChatBotConversation: React.FC<any> = ({
    data,
    send,
    isTyping,
    snapChatBotBtmSheet,
}) => {
    const AnimatedTouchable =
        Animated.createAnimatedComponent(TouchableOpacity);
    const userId = useSelector((state: IRootState) => state.auth.user?.id);
    const chatRef = useRef<SectionList<any>>(null);
    const [input, setInput] = useState('');
    const [currentDate, setCurrentDate] = useState();
    const flatListOffset = useSharedValue(0);

    const resetInput = () => setInput('');

    const onSend = () => {
        let message = {
            message: input,
            createdAt: new Date(),
            userId: userId,
            data: [],
        };
        send(message, resetInput);
    };

    const animatedStyles = useAnimatedStyle(() => {
        return {
            display: flatListOffset.value < 400 ? 'none' : 'flex',
            position: 'absolute',
            // display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            right: sizes.width * 0.05,
            bottom: sizes.width * 0.05,
            height: sizes.width * 0.1,
            width: sizes.width * 0.1,
            borderRadius: (sizes.width * 0.1) / 2,
            backgroundColor: colors.main,
            elevation: 5,
        };
    });

    const scrollToBtm = useCallback(
        () =>
            chatRef.current?.scrollToLocation({
                animated: true,
                sectionIndex: 0,
                viewPosition: 1,
                viewOffset: 0,
                itemIndex: 0,
            }),
        [],
    );

    const renderStickyDate = () => {
        return currentDate ? (
            <View style={styles.stickyDateBubbleContainer}>
                <View
                    style={{
                        ...styles.stickyDateBubble,
                    }}>
                    <Text style={{...FONTS.caption, fontWeight: 'bold'}}>
                        {currentDate}
                    </Text>
                </View>
            </View>
        ) : null;
    };

    const renderBubble = useCallback(
        ({item, index}) => (
            <ChatBotConversationBubble
                key={item._id}
                data={item}
                snapChatBotBtmSheet={snapChatBotBtmSheet}
            />
        ),
        [],
    );

    function renderInput() {
        return (
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    multiline
                    value={input}
                    onChangeText={(text) => {
                        setInput(text);
                    }}
                />
                <View style={styles.sendBtnContainer}>
                    <TouchableOpacity
                        onPress={onSend}
                        disabled={input.trim() === ''}>
                        <MaterialCommunityIcons
                            name="send-circle"
                            size={35}
                            color={
                                input.trim() === ''
                                    ? colors.icon
                                    : colors.button
                            }
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    function renderTypingBubble() {
        return (
            <>
                {isTyping && (
                    <View style={styles.typingBubbleContainer}>
                        <View style={styles.typingBubble}>
                            <TypingAnimation
                                dotColor={colors.paragraph}
                                dotMargin={5}
                                dotAmplitude={3}
                                dotSpeed={0.2}
                                dotRadius={3}
                                dotX={-5}
                                dotY={-6}
                            />
                        </View>
                    </View>
                )}
            </>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{flex: 1, position: 'relative'}}>
                {renderStickyDate()}

                <FlatList
                    ListHeaderComponent={renderTypingBubble}
                    overScrollMode="never"
                    data={data}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={renderBubble}
                    inverted
                    removeClippedSubviews={true}
                    // showsVerticalScrollIndicator={false}
                />
                <AnimatedTouchable
                    onPress={scrollToBtm}
                    style={{...animatedStyles}}
                    activeOpacity={0.6}>
                    <MaterialIcon
                        name="keyboard-arrow-down"
                        size={sizes.width * 0.08}
                    />
                </AnimatedTouchable>
            </View>
            {renderInput()}
        </View>
    );
};

export default ChatBotConversation;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.main,
    },
    // scrollToBtmBtn: {
    //     position: 'absolute',
    //     display: 'flex',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     right: sizes.width * 0.05,
    //     bottom: sizes.width * 0.05,
    //     height: sizes.width * 0.1,
    //     width: sizes.width * 0.1,
    //     borderRadius: (sizes.width * 0.1) / 2,
    //     backgroundColor: colors.main,
    //     elevation: 5,
    // },
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: sizes.width,
        // minHeight: 40,
        backgroundColor: colors.main,
        padding: 5,
        elevation: 5,
    },
    input: {
        width: '85%',
        // minHeight: 40,
        paddingHorizontal: 15,
        backgroundColor: colors.tertiary,
        borderRadius: 5,
    },
    sendBtnContainer: {
        width: '15%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 15,
    },
    dateBubbleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: sizes.width,
        height: 40,
    },
    stickyDateBubbleContainer: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: sizes.width,
        height: 0,
        zIndex: 1000,
    },
    dateBubble: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        width: sizes.width * 0.25,
        borderRadius: 5,
        elevation: 2,
        backgroundColor: colors.tertiary,
    },
    stickyDateBubble: {
        position: 'absolute',
        bottom: -25,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 25,
        width: sizes.width * 0.25,
        borderRadius: 5,
        elevation: 5,
        backgroundColor: colors.tertiary,
    },
    stickyDate: {
        alignSelf: 'center',
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9c2ff',
        borderRadius: 10,
        marginBottom: 10,
    },
    stickyDateText: {
        color: '#000',
        padding: 5,
    },
    typingBubbleContainer: {
        width: sizes.width,
        height: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingHorizontal: sizes.width * 0.15 + 5,
    },
    typingBubble: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1efef',
        paddingHorizontal: 10,
        minWidth: sizes.width * 0.15,
        borderRadius: 10,
    },
});
