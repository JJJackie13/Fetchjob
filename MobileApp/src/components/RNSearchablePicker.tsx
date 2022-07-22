import React, {useState} from 'react';
import {
    Platform,
    TextInput,
    View,
    Text,
    FlatList,
    TouchableHighlight,
    TouchableNativeFeedback,
    Image,
    StyleSheet,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {colors, FONTS} from '../constants';

const RNSearchablePicker: React.FC<any> = ({
    placeholder,
    emptyMessage,
    // defaultValue = '',
    defaultSearchBoxValue = '',
    data,
    onSelect,
    inputStyles,
    containerStyles,
    emptyMessageStyles,
    listStyles,
    itemStyles,
    inputContainerStyle,
    listEmptyValue = '',
}) => {
    // const [inputValue, setInputValue] = useState(defaultValue);
    const [searchBoxValue, setSearchBoxValue] = useState(defaultSearchBoxValue);
    const [listVisibility, setListVisibility] = useState(false);
    const [filteredData, setFilteredData] = useState(data);

    type TouchableType =
        | typeof TouchableNativeFeedback
        | typeof TouchableHighlight;

    const Touchable: TouchableType =
        Platform.OS === 'android'
            ? TouchableNativeFeedback
            : TouchableHighlight;

    const onChange = (val: string) => {
        setSearchBoxValue(val);
        setListVisibility(true);
        if (data && val && val.trim()) {
            const filtered = data.filter((item: any) => {
                return (
                    typeof item['label'] === 'string' &&
                    item['label'].toLowerCase().includes(val.toLowerCase())
                );
            });
            if (filtered.length) setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };

    return (
        <View style={{...containerStyles}}>
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    ...inputContainerStyle,
                }}>
                <TextInput
                    value={searchBoxValue}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    style={{flex: 1, ...inputStyles}}
                />
                <TouchableOpacity
                    // background={TouchableNativeFeedback.Ripple(null, true)}
                    onPress={() => setListVisibility(!listVisibility)}>
                    {listVisibility ? (
                        <Text
                            style={{fontSize: 28, color: '#000', padding: 10}}>
                            &#9652;
                        </Text>
                    ) : (
                        <Text
                            style={{fontSize: 28, color: '#000', padding: 10}}>
                            &#9662;
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
            {listVisibility ? (
                <View>
                    {Array.isArray(data) && data.length ? (
                        <FlatList
                            nestedScrollEnabled={true}
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                marginTop: 5,
                                zIndex: 20000,
                                ...listStyles,
                            }}
                            data={filteredData}
                            keyExtractor={(item) => item.value}
                            renderItem={({item}) => (
                                <TouchableOpacity
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingHorizontal: 10,
                                        borderBottomColor: '#ccc',
                                        borderBottomWidth: 1,
                                        backgroundColor: colors.main,
                                    }}
                                    onPress={() => {
                                        onSelect(item.value);
                                        // setInputValue(item.value);
                                        setSearchBoxValue(item.label);
                                        setListVisibility(false);
                                    }}>
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'flex-start',
                                            overflow: 'hidden',
                                            paddingVertical: 10,
                                            width: '90%',
                                            // height: 60,
                                        }}>
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                // paddingVertical: 10,
                                                paddingHorizontal: 5,
                                                ...itemStyles,
                                            }}>
                                            {item.value === ''
                                                ? listEmptyValue
                                                : item.label}
                                        </Text>
                                        {item.caption ? (
                                            <Text
                                                numberOfLines={1}
                                                style={{
                                                    ...FONTS.caption,
                                                    paddingHorizontal: 5,
                                                }}>
                                                {item.caption}
                                            </Text>
                                        ) : null}
                                    </View>
                                    {item.image && (
                                        <View style={{width: '10%'}}>
                                            <Image
                                                style={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: 15,
                                                }}
                                                resizeMode="cover"
                                                source={item.image}
                                            />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            )}
                        />
                    ) : (
                        <Text
                            style={{
                                textAlign: 'center',
                                marginVertical: 5,
                                ...emptyMessageStyles,
                            }}>
                            {emptyMessage}
                        </Text>
                    )}
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        position: 'relative',
    },
    dropDown: {
        position: 'absolute',
        backgroundColor: colors.main,
    },
});

export default RNSearchablePicker;
