import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import TabNavigator from './TabNavigator';
import NavBar from '../NavBar';
import CustomDrawerContent from './CustomDrawerContent';

const DrawerNavigator = () => {
    const Drawer = createDrawerNavigator();

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}>
            <Drawer.Screen
                name="Tab"
                component={TabNavigator}
                options={{
                    title: '',
                    header: ({navigation}) => (
                        <NavBar navigation={navigation} />
                    ),
                    headerStyle: {height: 50},
                }}
            />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;

const styles = StyleSheet.create({});
