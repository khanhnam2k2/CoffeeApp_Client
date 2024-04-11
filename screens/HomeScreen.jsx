import {
  View,
  Text,
  StatusBar,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { themeColors } from "../theme";
import { Feather } from "@expo/vector-icons";
import { categories, coffeeItems } from "../constants";
import CoffeeCard from "../components/CoffeeCard";
// import Carousel from "react-native-snap-carousel";

const HomeScreen = () => {
  const [activeCateory, setActiveCategory] = useState(1);

  return (
    <View className="flex-1  bg-white">
      <StatusBar />
      <Image
        source={require("../assets/images/beansBackground1.png")}
        className="w-full absolute -top-5 opacity-10"
      />
      <SafeAreaView className="flex-1 pt-4">
        <View className="px-4 flex-row justify-between items-center">
          <Image
            source={require("../assets/images/avatar.png")}
            className="h-9 w-9 rounded-full"
          />
          <View className="flex-row items-center space-x-2">
            <Feather name="map-pin" size={24} color={themeColors.bgLight} />
            <Text className="text-base font-semibold">New York, NYC</Text>
          </View>
          <Feather name="bell" size={27} color="black" />
        </View>
        {/* search bar */}
        <View className="mx-5 mt-14">
          <View className="flex-row justify-center items-center  rounded-full p-1 bg-[#e6e6e6]">
            <TextInput
              placeholder="Search"
              className="p-4 flex-1 font-semibold text-gray-700"
            />
            <TouchableOpacity
              className="rounded-full p-2"
              style={{ backgroundColor: themeColors.bgLight }}
            >
              <Feather name="search" size={25} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        {/* categories */}
        <View className="px-5 mt-6">
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              let isActive = item.id == activeCateory;
              let activeTextClass = isActive ? "text-white" : "text-gray-700";
              return (
                <TouchableOpacity
                  style={{
                    backgroundColor: isActive
                      ? themeColors.bgLight
                      : "rgba(0,0,0,0.07)",
                  }}
                  className="p-4 px-5 rounded-full mr-2 shadow"
                  onPress={() => setActiveCategory(item.id)}
                >
                  <Text className={"font-semibold" + activeTextClass}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
            className="overflow-visible"
          />
        </View>
        {/* coffee cards */}
        <View className=" mt-10 py-2">
          <FlatList
            data={coffeeItems}
            renderItem={({ item }) => <CoffeeCard item={item} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
