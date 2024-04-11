import React from "react";
import { Entypo, AntDesign, Feather } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import { View, Text, LogBox } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { themeColors } from "../theme";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "../screens/CartScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
export default function AppNavigation() {
  return (
    <NavigationContainer>
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
      </Stack.Navigator>
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
          backgroundColor: themeColors.bgLight,
          marginHorizontal: 20,
          marginTop: 10,
        },
        tabBarItemStyle: {
          // marginTop: 2
        },
      })}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="favourite" component={HomeScreen} />
      <Tab.Screen name="cart" component={CartScreen} />
    </Tab.Navigator>
  );
};
const menuIcons = (route, focused) => {
  let icon;

  if (route.name === "home") {
    icon = focused ? (
      <Entypo name="home" size={24} color={themeColors.bgLight} />
    ) : (
      <Feather name="home" size={24} color="white" />
    );
  } else if (route.name === "favourite") {
    icon = focused ? (
      <AntDesign name="heart" size={24} color={themeColors.bgLight} />
    ) : (
      <AntDesign name="hearto" size={24} color="white" />
    );
  } else if (route.name === "cart") {
    icon = focused ? (
      <Entypo name="shopping-cart" size={24} color={themeColors.bgLight} />
    ) : (
      <AntDesign name="shoppingcart" size={24} color="white" />
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
