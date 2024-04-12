import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import Animated, { FadeInRight } from "react-native-reanimated";
import { themeColors } from "../theme";

const CategoryCard = ({
  item,
  index,
  activeCategory,
  handleChangeCategory,
}) => {
  let isActive = item?._id == activeCategory;
  let activeTextClass = isActive ? "text-white" : "text-gray-700";
  return (
    <Animated.View
      entering={FadeInRight.delay(index + 1 * 200)
        .duration(1000)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity
        style={{
          backgroundColor: isActive ? themeColors.bgLight : "rgba(0,0,0,0.07)",
        }}
        className="p-4 px-5 rounded-full shadow"
        onPress={() => handleChangeCategory(isActive ? null : item?._id)}
      >
        <View className="flex-row items-center gap-2">
          <Image source={{ uri: item?.icon }} className="w-7 h-7" />
          <Text className={"font-semibold" + activeTextClass}>
            {item?.name}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default CategoryCard;
