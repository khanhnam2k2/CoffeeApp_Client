import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { formatCurrency } from "../helpers";
import { API_URL } from "../config";

const CheckoutCard = ({ item }) => {
  return (
    <View className=" border-b-2 pb-3 mb-4">
      <View className="flex-row items-center gap-4 ">
        <View className="border-gray-400 border-2 rounded-lg px-2">
          <Image
            source={API_URL + "/images/" + item?.product?.imagesUrl[0]}
            className="w-28 h-28"
            contentFit="cover"
            transition={1000}
          />
        </View>
        <View className="flex-1">
          <Text className="font-bold text-base mb-3">
            {item?.product?.name}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text>
              {formatCurrency(item?.price)}đ x {item?.quantity}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CheckoutCard;
