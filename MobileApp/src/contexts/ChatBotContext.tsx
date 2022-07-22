import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
    useMemo,
} from 'react';
import {StyleSheet, Text, View, Keyboard} from 'react-native';
import {API_URL} from '@env';
import ChatBotPage from '../components/ChatBot/ChatBotPage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomSheet, {
    BottomSheetBackdrop,
    TouchableOpacity,
} from '@gorhom/bottom-sheet';
import {Portal, PortalHost} from '@gorhom/portal';
import {FONTS, sizes, colors} from '../constants';
import {useSelector} from 'react-redux';

export const ChatBotContext = createContext<any>(undefined!);

export const useChatBot = () => useContext(ChatBotContext);

const ChatBotProvider: React.FC<any> = ({...props}) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const chatBotBtmSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['8%', '99%'], []);

    function snapChatBotBtmSheet() {
        chatBotBtmSheetRef.current?.snapToIndex(0);
    }

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                opacity={0.2}
                disappearsOnIndex={0}
                appearsOnIndex={1}
            />
        ),
        [],
    );

    function renderHeader() {
        return (
            <View style={styles.btmSheetHeader}>
                <TouchableOpacity
                    onPress={() => {
                        chatBotBtmSheetRef.current?.close();
                        Keyboard.dismiss();
                    }}>
                    <View>
                        <Text style={{...FONTS.caption}}>Hide</Text>
                    </View>
                </TouchableOpacity>
                <View>
                    <Text style={{...FONTS.minor, fontWeight: 'bold'}}>
                        FetchJob Chat Bot
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => {
                        chatBotBtmSheetRef.current?.snapToIndex(1);
                    }}>
                    <View>
                        <Text style={{...FONTS.caption}}>expand</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    const values = {
        isLoading,
        chatBotBtmSheetRef,
    };

    return (
        <ChatBotContext.Provider value={values}>
            {props.children}
            <Portal>
                <BottomSheet
                    android_keyboardInputMode="adjustPan"
                    style={styles.bottomSheet}
                    ref={chatBotBtmSheetRef}
                    handleComponent={renderHeader}
                    index={-1}
                    snapPoints={snapPoints}
                    enablePanDownToClose={false}
                    enableHandlePanningGesture
                    enableContentPanningGesture={false}
                    backdropComponent={renderBackdrop}>
                    <ChatBotPage snapChatBotBtmSheet={snapChatBotBtmSheet} />
                </BottomSheet>
                <PortalHost name="chatbot_bottomsheet" />
            </Portal>
        </ChatBotContext.Provider>
    );
};

export default ChatBotProvider;

const styles = StyleSheet.create({
    bottomSheet: {
        elevation: 15,
        marginHorizontal: 5,
        // backgroundColor: colors.main,
        // borderTopLeftRadius: 10,
        // borderTopRightRadius: 10,
        borderRadius: 5,
        zIndex: 2000,
    },
    btmSheetHeader: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        height: sizes.height * 0.08,
        backgroundColor: colors.tertiary,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
});
