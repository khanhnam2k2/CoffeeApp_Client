import { View, Text, Pressable, TouchableOpacity } from "react-native";
import React from "react";
import { themeColors } from "../theme";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Image } from "expo-image";

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
              backgroundColor: checked ? themeColors.bgLight : "transparent",
              borderColor: themeColors.bgLight,
            }}
          >
            {checked && (
              <Ionicons name="checkmark" size={24} color={themeColors.white} />
            )}
          </Pressable>
        </View>
        <View>
          <Image
            source={{ uri: item?.product?.imageUrl }}
            className="w-28 h-28"
            contentFit="cover"
            transition={1000}
          />
        </View>
        <View className="flex-1">
          <Text>{item?.product?.name}</Text>
          <Text>{item?.size}</Text>
          <View className="flex-row items-center justify-between">
            <Text>${item?.price}</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity onPress={decrementQuantity}>
                <SimpleLineIcons name="minus" size={20} />
              </TouchableOpacity>
              <Text className="font-bold text-sm">{item?.quantity}</Text>
              <TouchableOpacity onPress={incrementQuantity}>
                <SimpleLineIcons name="plus" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItemCard;
