import { Button } from 'native-base';
import React, { useState } from 'react';
import { FlatList, Platform, ScrollView, Slider, StatusBar, StyleSheet, Switch, Text, View  } from 'react-native';
import { colors } from '../constants';

const ButtonView = (props) => {
    return (
      <Button
        style={{
          height: 40,
          width: props.size,
          backgroundColor: colors.button,
        }}
        
      />
    );
  };

const JobScreen: React.FC = () => {
    

    return (
        <ScrollView horizontal={true} >
          <ButtonView size={100} color="red" />
          <ButtonView size={100} color="blue" />
          <ButtonView size={100} color="green" />
          <ButtonView size={100} color="yellow" />
          <ButtonView size={100} color="gray" />
          <ButtonView size={100} color="cyan" />
          <ButtonView size={100} color="black" />
        </ScrollView>
    );
};