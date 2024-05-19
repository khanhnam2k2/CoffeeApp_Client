import {
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { themeColors } from "../theme";
import { Feather, Ionicons, AntDesign } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import GlobalApi from "../api/GlobalApi";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CarouselHome from "../components/CarouselHome";
import Carousel from "react-native-snap-carousel";
import { AuthContext } from "../context/AuthContext";
import { slides } from "../constants";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const { user, cartItemCount, setCartItemCount } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      getTotalCartItem();
    }, [user?._id])
  );

  useEffect(() => {
    getProductBestSellers();
  }, []);

  // Hàm lấy số sp trong giỏ hàng
  const getTotalCartItem = async () => {
    if (user) {
      try {
        const resp = await GlobalApi.getCart(user?._id);
        setCartItemCount(resp?.data?.totalQuantity);
      } catch (error) {
        console.error("Có lỗi xảy ra");
      }
    }
  };

  // Hàm lấy sản phẩm theo best seller
  const getProductBestSellers = async () => {
    setLoadingProduct(true);
    try {
      const resp = await GlobalApi.getProductBestSellers();
      setProducts(resp?.data);
    } catch (error) {
      console.error("Có lỗi xảy ra");
    } finally {
      setLoadingProduct(false);
    }
  };

  return (
    <SafeAreaView className="flex-1  bg-white pt-4">
      <StatusBar />
      <Image
        source={require("../assets/images/beansBackground1.png")}
        className="w-full absolute -top-5 opacity-10"
      />
      <View className="flex-1 ">
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
                style={{ backgroundColor: themeColors.bgDark }}
              >
                <Feather name="camera" size={25} color="white" />
              </View>
            </View>
          </View>
          {user ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("Cart")}
              className="relative"
            >
              <View
                className="absolute bottom-5 left-4 rounded-full"
                style={{ backgroundColor: themeColors.bgDark }}
              >
                <Text className="px-1 text-xs text-white">{cartItemCount}</Text>
              </View>
              <AntDesign name="shoppingcart" size={27} color="black" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text>Login</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* search bar */}

        {/* Carousel */}
        <CarouselHome slides={slides} />

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
                <ProductCard
                  item={item}
                  index={index}
                  handleAddToCart={() =>
                    handleAddToCart(item?._id, item?.price)
                  }
                />
              )}
              layout={"default"}
              inactiveSlideOpacity={0.75}
              inactiveSlideScale={0.77}
              sliderWidth={400}
              itemWidth={260}

              // slideStyle={{ display: "flex", alignItems: "center" }}
            />
          ) : (
            <Carousel
              containerCustomStyle={{ overflow: "visible" }}
              data={[1, 2, 3, 4]}
              renderItem={({ item, index }) => (
                <View
                  key={index}
                  className="rounded-lg"
                  style={{
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
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
