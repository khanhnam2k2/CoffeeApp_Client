import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Text,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { themeColors } from "../theme";
import { Feather, Ionicons, EvilIcons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import GlobalApi from "../api/GlobalApi";
import CategoryCard from "../components/CategoryCard";
import { debounce } from "lodash";
import MasonryList from "@react-native-seoul/masonry-list";
import { useFocusEffect } from "@react-navigation/native";
import Searching from "../components/common/Searching";
import Empty from "../components/common/Empty";

const SearchScreen = ({ navigation }) => {
  const [activeCategory, setActiveCategory] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      searchInputRef.current.focus();
    }, [])
  );

  useEffect(() => {
    getCategoryList();
  }, []);

  // Hàm lấy danh sách danh mục sp
  const getCategoryList = async () => {
    setLoadingCategory(true);
    try {
      const resp = await GlobalApi.getCategoryList();
      setCategoryList(resp?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCategory(false);
    }
  };

  /**
   * Hàm lấy sản phẩm
   * @param {String} activeCategory - id của category active
   * @param {String} text - keyword search
   */
  const getProductList = async (activeCategory = null, text = "") => {
    setLoadingProduct(true);
    try {
      let resp;
      if (activeCategory) {
        resp = await GlobalApi.getProductByCategory(activeCategory);
        setProducts(resp?.data);
      } else if (text) {
        resp = await GlobalApi.searchProductList(text);
        setProducts(resp?.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingProduct(false);
    }
  };

  /**
   * Hàm lấy sản phẩm theo category
   * @param {String} categoryId - id của category
   */
  const handleChangeCategory = async (categoryId) => {
    setActiveCategory(categoryId);
    clearSearch();
    setProducts([]);
    await getProductList(categoryId);
  };

  /**
   * Hàm tìm kiếm sp theo keyword
   * @param {String} text - keyword search
   */
  const handleSearch = async (text) => {
    setSearch(text);
    if (text.length > 2) {
      setActiveCategory(null);
      await getProductList(null, text);
    }
    if (text == "") {
      searchInputRef?.current?.clear();
      setActiveCategory(null);
      setProducts([]);
    }
  };

  // Hàm xóa ô tìm kiếm
  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };

  // Hàm thực hiện tìm kiếm khi người dùng thay đổi input
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <SafeAreaView className="flex-1  bg-white">
      <View className="flex-1 pt-4">
        {/* search bar */}
        <View className="flex-row items-center  mx-2">
          <View>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <EvilIcons name="arrow-left" size={40} color="black" />
            </TouchableOpacity>
          </View>
          <View className="flex-1 flex-row justify-center items-center  rounded-full p-1 bg-[#e6e6e6]">
            <TextInput
              onChangeText={handleTextDebounce}
              ref={searchInputRef}
              placeholder="Tìm kiếm sản phẩm"
              className="p-2 flex-1 font-semibold text-gray-700"
            />
            {search ? (
              <TouchableOpacity
                className="rounded-full p-2"
                style={{ backgroundColor: themeColors.bgDark }}
                onPress={() => handleSearch("")}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <View
                className="rounded-full p-2"
                style={{ backgroundColor: themeColors.bgDark }}
              >
                <Feather name="search" size={25} color="white" />
              </View>
            )}
          </View>
        </View>
        {/* categories */}
        <View className="px-5 mt-6">
          {!loadingCategory ? (
            <FlatList
              contentContainerStyle={{ columnGap: 10 }}
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
                    handleChangeCategory={handleChangeCategory}
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
                    className="w-32 h-14 p-4 px-8 rounded-full mr-2 shadow"
                    style={{
                      backgroundColor: "rgba(0,0,0,0.07)",
                    }}
                  ></View>
                );
              })}
            </View>
          )}
        </View>

        <View className="flex-1">
          {!loadingProduct ? (
            products.length > 0 ? (
              <MasonryList
                contentContainerStyle={{
                  paddingVertical: 20,
                  marginHorizontal: 10,
                }}
                data={products}
                renderItem={({ item, index }) => (
                  <ProductCard item={item} index={index} isSmallItem={true} />
                )}
                showsHorizontalScrollIndicator={false}
                numColumns={2}
                keyExtractor={(item) => item._id}
              />
            ) : search.length > 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Empty />
                <Text className="mt-3 text-base">Không có sản phẩm nào</Text>
              </View>
            ) : null
          ) : (
            <View className="flex-1 justify-center items-center gap-4 mx-3">
              <Searching />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;
