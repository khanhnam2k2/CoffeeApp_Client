import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { themeColors } from "../theme";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { formatCurrency } from "../helpers";
import { API_URL } from "../config";

const CartItemCard = ({
  checked,
  handleCheckbox,
  item,
  incrementQuantity,
  decrementQuantity,
}) => {
  return (
    <View className=" border-b-2 pb-2 mb-4">
      <View className="flex-row items-center gap-4 ">
        <View>
          <Pressable
            className="w-6 h-6 rounded border-2 bg-transparent"
            onPress={handleCheckbox}
            style={{
              backgroundColor: checked ? themeColors.bgDark : "transparent",
              borderColor: themeColors.bgDark,
            }}
          >
            {checked && (
              <Ionicons name="checkmark" size={24} color={themeColors.white} />
            )}
          </Pressable>
        </View>
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
            <Text>{formatCurrency(item?.price)}đ</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity onPress={decrementQuantity}>
                <SimpleLineIcons name="minus" size={24} />
              </TouchableOpacity>
              <Text className="font-bold text-base">{item?.quantity}</Text>
              <TouchableOpacity onPress={incrementQuantity}>
                <SimpleLineIcons name="plus" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItemCard;
