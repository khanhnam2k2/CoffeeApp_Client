import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import Animated, { FadeInRight } from "react-native-reanimated";
import { Image } from "expo-image";

import { TouchableOpacity } from "react-native";
import { formatCurrency, truncateText } from "../helpers";
import { API_URL } from "../config";
const ProductCard = ({ item, index, isSmallItem }) => {
  const navigation = useNavigation();
  return (
    <Animated.View>
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetail", { item })}
        className="rounded-lg"
        style={{
          backgroundColor: themeColors.bgDark,
          height: isSmallItem ? 230 : 350,
          width: isSmallItem ? 180 : 250,
          marginBottom: 10,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            shadowColor: "black",
            shadowRadius: 30,
            shadowOffset: { width: 0, height: 40 },
            shadowOpacity: 0.8,
          }}
          className=" flex-row justify-center pt-1 px-1"
        >
          <Image
            source={
              item?.imagesUrl && item?.imagesUrl.length > 0
                ? API_URL + "/images/" + item.imagesUrl[0]
                : null
            }
            style={{
              height: isSmallItem ? 100 : 200,
            }}
            className="rounded-lg w-full"
            transition={1000}
          />
        </View>
        <View className="px-5 mt-1 space-y-3">
          <Text
            className=" text-white font-semibold z-10"
            style={{ fontSize: isSmallItem ? 18 : 24 }}
          >
            {truncateText(item?.name, 15)}
          </Text>
          <View
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            className="flex-row justify-center items-center rounded-3xl px-2 space-x-1 w-14"
          >
            <AntDesign name="star" size={15} color="white" />
            <Text
              className="font-semibold text-white"
              style={{ fontSize: isSmallItem ? 12 : 14 }}
            >
              {item?.rating}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text
              className="text-white font-bold text-lg"
              style={{ fontSize: isSmallItem ? 16 : 18 }}
            >
              {formatCurrency(item?.price)}đ
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ProductCard;
