import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HeaderComponent = ({ showBack, navigation, showUser=true }) => {
  return (
    <View style={styles.shadowContainer}>
      <LinearGradient
        colors={['#fff', '#f2e7d6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.header}
      >
        {showBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={30} color="#2b2a29" />
            </TouchableOpacity>
          ) : (
            <View style={styles.placeholderIcon} />
        )}
        <Text style={styles.title}>TravelBuddy</Text>
        {showUser ? (
        <TouchableOpacity onPress={() => navigation.navigate('UserDetail')} style={styles.iconButton}>
          <Ionicons name="person-circle" size={30} color="#2b2a29" />
        </TouchableOpacity>
        ) : (
            <View style={styles.placeholderIcon} />
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 10,
    height: 110,
  },
  title: {
    fontSize: 30,
    fontFamily: 'MadimiOne',
    color: '#2b2a29',
  },
  iconButton: {
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  placeholderIcon: {
    width: 50,
  },
});

export default HeaderComponent;
