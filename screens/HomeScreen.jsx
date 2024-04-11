import {
  View,
  Text,
  StatusBar,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { themeColors } from "../theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import CoffeeCard from "../components/CoffeeCard";
import GlobalApi from "../api/GlobalApi";
import CategoryCard from "../components/CategoryCard";

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [productBestSellers, setProductBestSellers] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);

  useEffect(() => {
    getCategoryList();
    getProductBestSellers();
  }, []);

  // Hàm lấy danh sách danh mục sp
  const getCategoryList = () => {
    setLoadingCategory(true);
    GlobalApi.getCategoryList()
      .then((resp) => {
        setCategoryList(resp?.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoadingCategory(false);
      });
  };

  // Hàm lấy sản phẩm nổi bật
  const getProductBestSellers = () => {
    setLoadingProduct(true);
    GlobalApi.getProductBestSellers()
      .then((resp) => {
        setProductBestSellers(resp?.data);
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
        <View className="px-4 flex-row justify-between items-center">
          <Image
            source={require("../assets/images/avatar.png")}
            className="h-9 w-9 rounded-full"
          />
          <View className="flex-row items-center space-x-2">
            <Feather name="map-pin" size={24} color={themeColors.bgLight} />
            <Text className="text-base font-semibold">New York, NYC</Text>
          </View>
          <Feather name="bell" size={27} color="black" />
        </View>
        {/* search bar */}
        <View className="mx-5 mt-14">
          <View className="flex-row justify-center items-center  rounded-full p-1 bg-[#e6e6e6]">
            <TextInput
              placeholder="Search"
              className="p-4 flex-1 font-semibold text-gray-700"
            />
            <TouchableOpacity
              className="rounded-full p-2"
              style={{ backgroundColor: themeColors.bgLight }}
            >
              <Feather name="search" size={25} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        {/* categories */}
        <View className="px-5 mt-6">
          {!loadingCategory ? (
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={categoryList}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => {
                return (
                  <CategoryCard
                    item={item}
                    index={index}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                  />
                );
              }}
              className="overflow-visible"
            />
          ) : (
            <View className="flex-row items-center gap-4">
              {[1, 2, 3, 4].map((item, index) => {
                return (
                  <View
                    key={index}
                    className="w-24 h-12 p-4 px-5 rounded-full mr-2 shadow"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.07)",
                    }}
                  ></View>
                );
              })}
            </View>
          )}
        </View>

        {/* coffee cards */}
        <View className=" mt-5 py-2">
          <View className="flex-row items-center justify-between mx-5 mb-4">
            <Text className="text-2xl font-bold">Best Sellers</Text>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons name="grid" size={24} color="black" />
            </TouchableOpacity>
          </View>
          {!loadingProduct ? (
            <FlatList
              data={productBestSellers}
              renderItem={({ item, index }) => (
                <CoffeeCard item={item} index={index} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item._id}
            />
          ) : (
            <View
              style={{
                borderRadius: 40,
                backgroundColor: themeColors.bgLight,
                height: 350,
                width: 250,
                marginLeft: 20,
              }}
            ></View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
