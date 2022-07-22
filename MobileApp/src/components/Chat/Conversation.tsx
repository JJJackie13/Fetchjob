import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    SectionList,
    FlatList,
    TextInput,
    TouchableOpacity,
    FlatListProps,
} from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';
import {colors, FONTS, sizes} from '../../constants';
import {IRootState} from '../../store/store';
import ConversationBubble from './ConversationBubble';
import uuid from 'react-native-uuid';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TypingAnimation } from "react-native-typing-animation";

const Conversation: React.FC<any> = ({data, send, isTyping,emitTyping}) => {
    const AnimatedTouchable =
        Animated.createAnimatedComponent(TouchableOpacity);
    const userId = useSelector((state: IRootState) => state.auth.user?.id);
    const userAvatar = useSelector(
        (state: IRootState) => state.auth.user?.avatar,
    );
    const userName = useSelector((state: IRootState) => state.auth.user?.name);
    const chatRef = useRef<SectionList<any>>(null);
    const [input, setInput] = useState('');
    const [currentDate, setCurrentDate] = useState();
    const flatListOffset = useSharedValue(0);

    const resetInput = () => setInput('');

    const onSend = () => {
        let message = {
            temp_id: uuid.v4(),
            text: input,
            createdAt: new Date(),
            user: {
                _id: userId,
                name: userName,
                avatar: userAvatar,
            },
            pending: true,
            sent: false,
            received: false,
            read: false,
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

    // const updateStickyDate = ({viewableItems, changed}: any) => {
    //     if (viewableItems && viewableItems.length) {
    //         const lastItem = viewableItems[viewableItems.length - 1];
    //         if (lastItem && lastItem.section) {
    //             setCurrentDate(lastItem.section.date);
    //         }
    //     }
    // };

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

    const renderDateBubble = useCallback(
        ({date}) => (
            <View style={styles.dateBubbleContainer}>
                <View style={styles.dateBubble}>
                    <Text
                        style={{
                            ...FONTS.caption,
                            fontWeight: 'bold',
                        }}>
                        {date}
                    </Text>
                </View>
            </View>
        ),
        [],
    );

    const renderBubble = useCallback(
        ({item, index}) => (
            <ConversationBubble
                key={item._id}
                userId={userId}
                data={item}
                index={index}
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
                    onChangeText={(text) => 
                        {setInput(text)
                        emitTyping()}}
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

    function renderTypingBubble(){
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
        )
    }

    return (
        <View style={styles.container}>
            <View style={{flex: 1, position: 'relative'}}>
                {renderStickyDate()}
                <SectionList
                    overScrollMode="never"
                    sections={data}
                    extraData={data}
                    scrollEventThrottle={10}
                    ref={chatRef}
                    removeClippedSubviews={true}
                    inverted={true}
                    // onViewableItemsChanged={updateStickyDate}
                    viewabilityConfig={{
                        minimumViewTime: 500,
                        viewAreaCoveragePercentThreshold: 80,
                    }}
                    ListHeaderComponent={renderTypingBubble}
                    renderItem={({item, index}) => renderBubble({item, index})}
                    renderSectionFooter={({section: {date}}) =>
                        renderDateBubble({date})
                    }
                    onScroll={(e) => {
                        // console.log(e.nativeEvent.contentOffset.y);
                        flatListOffset.value = e.nativeEvent.contentOffset.y;
                    }}
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

export default Conversation;

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
    typingBubbleContainer:{
        width:sizes.width,
        height: 30,
        display:"flex",
        flexDirection:"row",
        justifyContent:"flex-start",
        paddingHorizontal:sizes.width * 0.15 + 5,

    },
    typingBubble:{
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#f1efef",
        paddingHorizontal:10,
        minWidth: sizes.width * 0.15,
        borderRadius: 10
    },
});
