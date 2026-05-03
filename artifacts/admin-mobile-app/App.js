import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ShieldCheck, Package, LogOut } from 'lucide-react-native';

import LoginScreen from './src/screens/LoginScreen';
import WarrantyScreen from './src/screens/WarrantyScreen';
import ProductScreen from './src/screens/ProductScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Bảo Hành') {
            return <ShieldCheck size={size} color={color} />;
          } else if (route.name === 'Sản Phẩm') {
            return <Package size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Bảo Hành" component={WarrantyScreen} />
      <Tab.Screen name="Sản Phẩm" component={ProductScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isLoggedIn ? (
            <Stack.Screen name="Login">
              {props => <LoginScreen {...props} onLoginSuccess={() => setIsLoggedIn(true)} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Main" component={AdminTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
