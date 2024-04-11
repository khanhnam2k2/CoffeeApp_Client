import React from "react";
import { View, Image, Text } from "react-native";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";

import { TouchableOpacity } from "react-native";
const CoffeeCard = ({ item }) => {
  const navigation = useNavigation();
  return (
    <View
      className="relative"
      style={{
        borderRadius: 40,
        backgroundColor: themeColors.bgDark,
        height: 400,
        width: 250,
        marginLeft: 20,
      }}
    >
      <View
        style={{
          shadowColor: "black",
          shadowRadius: 30,
          shadowOffset: { width: 0, height: 40 },
          shadowOpacity: 0.8,
        }}
        className=" flex-row justify-center mt-3"
      >
        <Image source={item.image} className="h-40 w-40" />
      </View>
      <View className="px-5 mt-3 space-y-3">
        <Text className="text-3xl text-white font-semibold z-10">
          {item.name}
        </Text>
        <View
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          className="flex-row items-center rounded-3xl px-2 space-x-1 w-20"
        >
          <AntDesign name="star" size={15} color="white" />
          <Text className="text-base font-semibold text-white">
            {item.stars}
          </Text>
        </View>
        <View className="flex-row space-x-1 z-10 ">
          <Text className="text-base text-white font-semibold opacity-60">
            Volume
          </Text>
          <Text className="text-base text-white font-semibold">
            {item.volume}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-bold text-lg">$ {item.price}</Text>
          <TouchableOpacity
            onPress={() => {}}
            className="p-3 bg-white rounded-full"
          >
            <AntDesign
              name="pluscircleo"
              size={25}
              color={themeColors.bgDark}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CoffeeCard;
