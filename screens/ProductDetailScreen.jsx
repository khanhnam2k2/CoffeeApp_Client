import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  EvilIcons,
  AntDesign,
  FontAwesome,
  Feather,
  FontAwesome6,
} from "@expo/vector-icons";
import { themeColors } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AuthContext } from "../context/AuthContext";
import GlobalApi from "../api/GlobalApi";
import Toast from "react-native-toast-message";
import { Image } from "expo-image";

const ProductDetailScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const { item } = route.params;
  const [size, setSize] = useState("small");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(item?.price);

  // Hàm thay đổi size và giá sp
  const handleChangeSize = (selectedSize) => {
    setSize(selectedSize);
    switch (selectedSize) {
      case "small":
        setPrice(parseFloat(item.price));
        break;
      case "medium":
        setPrice(parseFloat(item.price) + 10);
        break;
      case "large":
        setPrice(parseFloat(item.price) + 20);
        break;
      default:
        break;
    }
  };

  // Hàm thêm sp vào giỏ hàng
  const handleAddToCart = async (productId) => {
    try {
      const data = {
        userId: user?._id,
        productId: productId,
        quantity: quantity,
        size: size,
        price: price,
      };
      const response = await GlobalApi.addToCart(data);
      if (response?.data?.success) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: response?.data?.message,
        });
        navigation.navigate("Cart");
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng",
      });
    }
  };

  return (
    <ScrollView>
      <View className="flex-1">
        <StatusBar style="light" />
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <Image
            source={{ uri: item?.imageUrl }}
            style={{
              height: 300,
              borderBottomLeftRadius: 50,
              borderBottomRightRadius: 50,
            }}
            className="w-full"
          />
          <View className="w-full absolute p-3  flex-row justify-between items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <EvilIcons name="arrow-left" size={50} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full border-2 border-white p-2">
              <AntDesign name="heart" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </Animated.View>
        <SafeAreaView className="space-y-4 pt-2 ">
          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            className="flex-row items-center rounded-3xl p-1 px-2 space-x-1 w-16 opacity-90 mx-4"
            style={{ backgroundColor: themeColors.bgDark }}
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
              $ {price}
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
                    size == "small" ? themeColors.bgDark : "rgba(0,0,0,0.07)",
                }}
                onPress={() => handleChangeSize("small")}
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
                    size == "medium" ? themeColors.bgDark : "rgba(0,0,0,0.07)",
                }}
                onPress={() => handleChangeSize("medium")}
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
                    size == "large" ? themeColors.bgDark : "rgba(0,0,0,0.07)",
                }}
                onPress={() => handleChangeSize("large")}
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
            <View className="flex-row items-center space-x-1">
              <FontAwesome6 name="truck-fast" size={24} color="black" />
              <Text className="text-base text-black font-semibold">
                Miễn phí
              </Text>
            </View>
            <View className="flex-row items-center space-x-8 border-gray-500 border rounded-full p-1 px-4">
              <TouchableOpacity
                disabled={quantity == 1}
                style={{ opacity: quantity == 1 ? 0.3 : 1 }}
                onPress={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                <AntDesign name="minus" size={20} color={themeColors.text} />
              </TouchableOpacity>
              <Text
                className="font-extrabold text-lg"
                style={{ color: themeColors.text }}
              >
                {quantity}
              </Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)}>
                <AntDesign name="plus" size={20} color={themeColors.text} />
              </TouchableOpacity>
            </View>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(700).duration(600)}
            className="flex-row justify-between mx-4"
          >
            <TouchableOpacity
              onPress={() => handleAddToCart(item?._id)}
              className="p-4 rounded-full border border-gray-400"
            >
              <FontAwesome name="shopping-basket" size={25} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 rounded-full flex-1 ml-3"
              style={{ backgroundColor: themeColors.bgDark }}
              onPress={() =>
                navigation.navigate("Checkout", {
                  itemCheckout: [{ product: item, quantity, size, price }],
                })
              }
            >
              <Text className="text-center text-base font-semibold text-white">
                MUA NGAY
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </SafeAreaView>
      </View>
    </ScrollView>
  );
};

export default ProductDetailScreen;
