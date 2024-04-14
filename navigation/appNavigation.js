import React from "react";
import { Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import { View, LogBox } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { themeColors } from "../theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "../screens/CartScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import SearchScreen from "../screens/SearchScreen";
import LoginScreen from "../screens/LoginScreen";
import { AuthProvider } from "../context/AuthContext";
import RegisterScreen from "../screens/RegisterScreen";
import Toast from "react-native-toast-message";
import CheckoutScreen from "../screens/CheckoutScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
export default function AppNavigation() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator
          screenOptions={{
            contentStyle: { backgroundColor: "white" },
          }}
        >
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={HomeTabs}
          />
          <Stack.Screen
            name="ProductDetail"
            options={{ headerShown: false }}
            component={ProductDetailScreen}
          />
          <Stack.Screen
            name="Cart"
            options={{ headerShown: false }}
            component={CartScreen}
          />
          <Stack.Screen
            name="Checkout"
            options={{ headerShown: false }}
            component={CheckoutScreen}
          />
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="Register"
            options={{ headerShown: false }}
            component={RegisterScreen}
          />
        </Stack.Navigator>
      </AuthProvider>
      <Toast />
    </NavigationContainer>
  );
}
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => menuIcons(route, focused),
        tabBarStyle: {
          marginBottom: 20,
          borderRadius: 50,
          backgroundColor: themeColors.bgDark,
          marginHorizontal: 20,
          marginTop: 10,
        },
        tabBarItemStyle: {
          // marginTop: 2
        },
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="search" component={SearchScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
const menuIcons = (route, focused) => {
  let icon;

  if (route.name === "home") {
    icon = focused ? (
      <Entypo name="home" size={24} color={themeColors.bgDark} />
    ) : (
      <Feather name="home" size={24} color="white" />
    );
  } else if (route.name === "search") {
    icon = focused ? (
      <FontAwesome5 name="search" size={24} color={themeColors.bgDark} />
    ) : (
      <Feather name="search" size={24} color="white" />
    );
  } else if (route.name === "profile") {
    icon = focused ? (
      <FontAwesome5 name="user-alt" size={24} color={themeColors.bgDark} />
    ) : (
      <Feather name="user" size={24} color="white" />
    );
  }
  let buttonClass = focused ? "bg-white" : "";
  return (
    <View
      className={"flex items-center rounded-full  p-3 shadow " + buttonClass}
    >
      {icon}
    </View>
  );
};
