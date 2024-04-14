import React from "react";
import { View, Image, Text, ActivityIndicator } from "react-native";
import { themeColors } from "../theme";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import Animated, { FadeInRight } from "react-native-reanimated";

import { TouchableOpacity } from "react-native";
const ProductCard = ({
  item,
  index,
  isSmallItem,
  handleAddToCart,
  loadingItem,
}) => {
  const navigation = useNavigation();
  return (
    <Animated.View>
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductDetail", { item })}
        style={{
          borderRadius: 40,
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
          className=" flex-row justify-center mt-3"
        >
          <Image
            source={{ uri: item?.imageUrl }}
            style={{
              width: isSmallItem ? 150 : 200,
              height: isSmallItem ? 100 : 150,
              borderRadius: 20,
            }}
          />
        </View>
        <View className="px-5 mt-3 space-y-3">
          <Text
            className=" text-white font-semibold z-10"
            style={{ fontSize: isSmallItem ? 18 : 30 }}
          >
            {item?.name}
          </Text>
          {!isSmallItem && (
            <View
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
              className="flex-row items-center rounded-3xl px-2 space-x-1 w-20"
            >
              <AntDesign name="star" size={15} color="white" />
              <Text className="text-base font-semibold text-white">
                {item?.rating}
              </Text>
            </View>
          )}

          <View className="flex-row justify-between items-center">
            <Text className="text-white font-bold text-lg">
              $ {item?.price}
            </Text>
            <TouchableOpacity
              onPress={handleAddToCart}
              className="p-3 bg-white rounded-full"
              disabled={loadingItem == item?._id}
            >
              {loadingItem == item?._id ? (
                <ActivityIndicator
                  size={isSmallItem ? 20 : 25}
                  color={themeColors.bgDark}
                />
              ) : (
                <AntDesign
                  name="pluscircleo"
                  size={isSmallItem ? 20 : 25}
                  color={themeColors.bgDark}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ProductCard;
