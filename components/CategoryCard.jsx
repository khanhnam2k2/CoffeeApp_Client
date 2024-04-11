import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import Animated, { FadeInRight } from "react-native-reanimated";

const CategoryCard = ({ item, index, activeCategory, setActiveCategory }) => {
  let isActive = item?.name == activeCategory;
  let activeTextClass = isActive ? "text-white" : "text-gray-700";
  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(1000)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity
        style={{
          backgroundColor: isActive ? themeColors.bgLight : "rgba(0,0,0,0.07)",
        }}
        className="p-4 px-5 rounded-full mr-2 shadow"
        onPress={() => setActiveCategory(isActive ? null : item?.name)}
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
