import {
  View,
  Text,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { EvilIcons, AntDesign, FontAwesome, Feather } from "@expo/vector-icons";
import { themeColors } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";

const ProductDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { item } = route.params;
  const [size, setSize] = useState("small");

  return (
    <ScrollView>
      <View className="flex-1">
        <StatusBar style="light" />
        <Image
          source={require("../assets/images/beansBackground2.png")}
          style={{
            height: 250,
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
          }}
          className="w-full absolute"
        />
        <SafeAreaView className="space-y-4 pt-2 ">
          <View className="mx-4 flex-row justify-between items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <EvilIcons name="arrow-left" size={50} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full border-2 border-white p-2">
              <AntDesign name="heart" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Animated.View
            entering={FadeInDown.delay(100).duration(600)}
            className="flex-row justify-center"
            style={{
              shadowColor: themeColors.bgDark,
              shadowRadius: 30,
              shadowOffset: { width: 0, height: 30 },
              shadowOpacity: 0.9,
            }}
          >
            <Image source={{ uri: item?.imageUrl }} className="h-60 w-60" />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            className="flex-row items-center rounded-3xl p-1 px-2 space-x-1 w-16 opacity-90 mx-4"
            style={{ backgroundColor: themeColors.bgLight }}
          >
            <AntDesign name="star" size={15} color="white" />
            <Text className="text-base font-semibold text-white">
              {item?.rating}
            </Text>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(300).duration(600)}
            className="mx-4 flex-row justify-between items-center"
          >
            <Text
              className="text-3xl font-semibold"
              style={{ color: themeColors.text }}
            >
              {item?.name}
            </Text>
            <Text
              className="text-lg font-semibold"
              style={{ color: themeColors.text }}
            >
              $ {item?.price}
            </Text>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            w
            className="mx-4 space-y-2"
          >
            <Text
              className="text-lg font-semibold"
              style={{ color: themeColors.text }}
            >
              Coffee size
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="p-3 px-8 rounded-full"
                style={{
                  backgroundColor:
                    size == "small" ? themeColors.bgLight : "rgba(0,0,0,0.07)",
                }}
                onPress={() => setSize("small")}
              >
                <Text
                  className={size == "small" ? "text-white" : "text-gray-700"}
                >
                  Small
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 px-8 rounded-full"
                style={{
                  backgroundColor:
                    size == "medium" ? themeColors.bgLight : "rgba(0,0,0,0.07)",
                }}
                onPress={() => setSize("medium")}
              >
                <Text
                  className={size == "medium" ? "text-white" : "text-gray-700"}
                >
                  Medium
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="p-3 px-8 rounded-full"
                style={{
                  backgroundColor:
                    size == "large" ? themeColors.bgLight : "rgba(0,0,0,0.07)",
                }}
                onPress={() => setSize("large")}
              >
                <Text
                  className={size == "large" ? "text-white" : "text-gray-700"}
                >
                  Large
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(500).duration(600)}
            className="mx-4 space-y-2 h-28"
          >
            <Text
              style={{ color: themeColors.text }}
              className="text-lg font-bold"
            >
              About
            </Text>
            <Text className="text-gray-600">{item?.description}</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600).duration(600)}
            className="flex-row justify-between items-center mx-4 mb-2"
          >
            {/* <View className="flex-row items-center space-x-1">
              <Text className="text-base text-gray-700 font-semibold opacity-60">
                Volume
              </Text>
              <Text className="text-base text-black font-semibold">
                {item.volume}
              </Text>
            </View> */}
            <View className="flex-row items-center space-x-4 border-gray-500 border rounded-full p-1 px-4">
              <TouchableOpacity>
                <AntDesign name="minus" size={20} color={themeColors.text} />
              </TouchableOpacity>
              <Text
                className="font-extrabold text-lg"
                style={{ color: themeColors.text }}
              >
                2
              </Text>
              <TouchableOpacity>
                <AntDesign name="plus" size={20} color={themeColors.text} />
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(700).duration(600)}
            className="flex-row justify-between mx-4"
          >
            <TouchableOpacity className="p-4 rounded-full border border-gray-400">
              <FontAwesome name="shopping-basket" size={25} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 rounded-full flex-1 ml-3"
              style={{ backgroundColor: themeColors.bgLight }}
            >
              <Text className="text-center text-base font-semibold text-white">
                Buy now
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
};

export default ProductDetailScreen;
