import {
  View,
  Text,
  StatusBar,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { themeColors } from "../theme";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import CoffeeCard from "../components/CoffeeCard";
import GlobalApi from "../api/GlobalApi";
import { useNavigation } from "@react-navigation/native";
import CarouselHome from "../components/CarouselHome";
import Carousel from "react-native-snap-carousel";
const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    getProductBestSellers();
  }, []);

  // Hàm lấy sản phẩm theo best seller
  const getProductBestSellers = () => {
    setLoadingProduct(true);
    GlobalApi.getProductBestSellers()
      .then((resp) => {
        setProducts(resp?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingProduct(false);
      });
  };

  return (
    <View className="flex-1  bg-white">
      <StatusBar />
      <Image
        source={require("../assets/images/beansBackground1.png")}
        className="w-full absolute -top-5 opacity-10"
      />
      <SafeAreaView className="flex-1 pt-4">
        <View className="px-4 flex-row gap-2 items-center">
          <View className="flex-1 ">
            <View className="flex-row justify-center items-center rounded-full p-1 pl-2 bg-[#e6e6e6]">
              <Feather name="search" size={25} color="black" />
              <TextInput
                value=""
                placeholder="Tìm kiếm sản phẩm"
                className="p-2 flex-1 font-semibold text-gray-700"
                onPressIn={() => navigation.navigate("search")}
              />
              <View
                className="rounded-full p-2"
                style={{ backgroundColor: themeColors.bgLight }}
              >
                <Feather name="camera" size={25} color="white" />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("cart")}
            className="relative"
          >
            <View
              className="absolute bottom-5 left-4 rounded-full"
              style={{ backgroundColor: themeColors.bgDark }}
            >
              <Text className="px-1 text-xs text-white">6</Text>
            </View>
            <AntDesign name="shoppingcart" size={27} color="black" />
          </TouchableOpacity>
        </View>
        {/* search bar */}

        {/* Carousel */}
        <CarouselHome />

        {/* coffee cards */}
        <View className="py-5 mx-4">
          <View className="flex-row items-center justify-between mx-2 mb-2">
            <Text className="text-2xl font-bold">Best Sellers</Text>
            <TouchableOpacity
              className="p-3 rounded-full shadow bg-gray-300"
              onPress={() => {}}
            >
              <Ionicons name="grid" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {!loadingProduct ? (
            <Carousel
              containerCustomStyle={{ overflow: "visible" }}
              data={products}
              renderItem={({ item, index }) => (
                <CoffeeCard item={item} index={index} />
              )}
              firstItem={1}
              inactiveSlideOpacity={0.75}
              inactiveSlideScale={0.77}
              sliderWidth={400}
              itemWidth={260}
              slideStyle={{ display: "flex", alignItems: "center" }}
            />
          ) : (
            <Carousel
              containerCustomStyle={{ overflow: "visible" }}
              data={[1, 2, 3, 4]}
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  style={{
                    borderRadius: 40,
                    backgroundColor: themeColors.bgDark,
                    height: 350,
                    width: 250,
                    marginLeft: 10,
                  }}
                ></View>
              )}
              firstItem={1}
              inactiveSlideOpacity={0.75}
              inactiveSlideScale={0.77}
              sliderWidth={400}
              itemWidth={260}
              slideStyle={{ display: "flex", alignItems: "center" }}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
