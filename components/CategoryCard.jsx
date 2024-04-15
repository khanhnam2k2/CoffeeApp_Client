import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Animated, { FadeInRight } from "react-native-reanimated";
import { themeColors } from "../theme";
import { Image } from "expo-image";

const CategoryCard = ({
  item,
  index,
  activeCategory,
  handleChangeCategory,
}) => {
  let isActive = item?._id == activeCategory;
  return (
    <Animated.View
      entering={FadeInRight.delay(index + 1 * 200)
        .duration(1000)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity
        style={{
          backgroundColor: isActive ? themeColors.bgDark : "rgba(0,0,0,0.07)",
        }}
        className="p-4 px-8 rounded-full shadow"
        onPress={() => handleChangeCategory(isActive ? null : item?._id)}
      >
        <View className="flex-row items-center gap-2">
          <Image source={item?.icon} className="w-7 h-7" transition={1000} />
          <Text
            className="font-semibold"
            style={{ color: isActive ? themeColors.white : themeColors.bgGray }}
          >
            {item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CategoryCard;
