import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  EvilIcons,
  AntDesign,
  FontAwesome,
  FontAwesome6,
} from "@expo/vector-icons";
import { themeColors } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { AuthContext } from "../context/AuthContext";
import GlobalApi from "../api/GlobalApi";
import Toast from "react-native-toast-message";
import CarouselHome from "../components/CarouselHome";
import { formatCurrency } from "../helpers";

const ProductDetailScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const { item } = route.params;
  const [loadingAddToCart, setLoadingAddToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Hàm thêm sp vào giỏ hàng
  const handleAddToCart = async (productId) => {
    if (user) {
      setLoadingAddToCart(true);
      try {
        const data = {
          userId: user?._id,
          productId: productId,
          quantity: quantity,
          price: item?.price,
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
      } finally {
        setLoadingAddToCart(false);
      }
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <ScrollView>
      <View className="flex-1">
        <StatusBar style="light" />
        <Animated.View entering={FadeInDown.delay(100).duration(600)}>
          <CarouselHome
            height={300}
            marginTop={0}
            border={20}
            slides={
              item?.imagesUrl && item?.imagesUrl.length > 0
                ? item.imagesUrl
                : null
            }
          />
          <View className="w-full absolute p-3  flex-row justify-between items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <EvilIcons
                name="arrow-left"
                size={50}
                color={themeColors.bgDark}
              />
            </TouchableOpacity>
            <TouchableOpacity className="rounded-full border-2 border-white p-2">
              <AntDesign name="heart" size={24} color={themeColors.bgDark} />
            </TouchableOpacity>
          </View>
        </Animated.View>
        <SafeAreaView className="space-y-4 pt-4 ">
          <Animated.View
            entering={FadeInDown.delay(200).duration(600)}
            className="mx-4 flex-row justify-between items-center"
          >
            <Text
              className="text-3xl font-semibold"
              style={{ color: themeColors.text }}
            >
              {item?.name}
            </Text>
            <View
              className="flex-row items-center justify-center rounded-3xl p-1  space-x-1 w-16 opacity-90 mx-4"
              style={{ backgroundColor: themeColors.bgDark }}
            >
              <AntDesign name="star" size={15} color="white" />
              <Text className="text-base font-semibold text-white">
                {item?.rating}
              </Text>
            </View>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(300).duration(600)}
            className="mx-4 flex-row items-center"
          >
            <Text className="text-lg font-semibold mr-2">Giá:</Text>
            <Text
              className="text-lg font-semibold"
              style={{ color: themeColors.text }}
            >
              {formatCurrency(item?.price)}đ
            </Text>
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(500).duration(600)}
            className="mx-4"
          >
            <View className="mb-3">
              <Text
                className="text-lg font-semibold mb-2"
                style={{ color: themeColors.text }}
              >
                Chất liệu
              </Text>
              <Text className="text-gray-600">{item?.materials}</Text>
            </View>
            <Text
              style={{ color: themeColors.text }}
              className="text-lg font-bold mb-2"
            >
              Mô tả sản phẩm
            </Text>
            <Text className="text-gray-600">{item?.description}</Text>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(600).duration(600)}
            className="flex-row justify-between items-center mx-4 mb-4"
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
                className="p-2"
              >
                <AntDesign name="minus" size={20} color={themeColors.text} />
              </TouchableOpacity>
              <Text
                className="font-extrabold text-lg"
                style={{ color: themeColors.text }}
              >
                {quantity}
              </Text>
              <TouchableOpacity
                className="p-2"
                onPress={() => setQuantity(quantity + 1)}
              >
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
              {loadingAddToCart ? (
                <ActivityIndicator size={25} color="black" />
              ) : (
                <FontAwesome name="shopping-basket" size={25} color="black" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 rounded-full flex-1 ml-3"
              style={{ backgroundColor: themeColors.bgDark }}
              onPress={() =>
                navigation.navigate("Checkout", {
                  itemCheckout: [
                    { product: item, quantity, size, price: item?.price },
                  ],
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
