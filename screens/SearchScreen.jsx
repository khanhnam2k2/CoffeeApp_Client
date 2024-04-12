import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { themeColors } from "../theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import CoffeeCard from "../components/CoffeeCard";
import GlobalApi from "../api/GlobalApi";
import CategoryCard from "../components/CategoryCard";
import { debounce } from "lodash";
import MasonryList from "@react-native-seoul/masonry-list";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const SearchScreen = () => {
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

  // Hàm lấy sản phẩm
  const getProductList = (activeCategory = null, text = "") => {
    setLoadingProduct(true);
    const fetchFn = activeCategory
      ? () => GlobalApi.getProductByCategory(activeCategory)
      : text
      ? () => GlobalApi.searchProductList(text)
      : GlobalApi.getProductList;

    fetchFn()
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

  // Hàm lấy sản phẩm theo category
  const handleChangeCategory = (categoryId) => {
    setActiveCategory(categoryId);
    clearSearch();
    setProducts([]);
    getProductList(categoryId);
  };

  // Hàm tìm kiếm sp
  const handleSearch = (text) => {
    setSearch(text);
    if (text.length > 2) {
      setActiveCategory(null);
      getProductList(null, text);
    }
    if (text == "") {
      searchInputRef?.current?.clear();
      setActiveCategory(null);
      getProductList();
    }
  };

  // Hàm xóa ô tìm kiếm
  const clearSearch = () => {
    setSearch("");
    searchInputRef?.current?.clear();
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);

  return (
    <View className="flex-1  bg-white">
      <View className="flex-1">
        {/* search bar */}
        <View className="mx-5 mt-14">
          <View className="flex-row justify-center items-center  rounded-full p-1 bg-[#e6e6e6]">
            <TextInput
              onChangeText={handleTextDebounce}
              ref={searchInputRef}
              placeholder="Tìm kiếm sản phẩm"
              className="p-4 flex-1 font-semibold text-gray-700"
            />
            {search ? (
              <TouchableOpacity
                className="rounded-full p-2"
                style={{ backgroundColor: themeColors.bgLight }}
                onPress={() => handleSearch("")}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <View
                className="rounded-full p-2"
                style={{ backgroundColor: themeColors.bgLight }}
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
        <View className="flex-1">
          {!loadingProduct ? (
            <MasonryList
              contentContainerStyle={{
                paddingVertical: 20,
                marginHorizontal: 10,
              }}
              data={products}
              renderItem={({ item, index }) => (
                <CoffeeCard item={item} index={index} isSmallItem={true} />
              )}
              showsHorizontalScrollIndicator={false}
              numColumns={2}
              keyExtractor={(item) => item._id}
            />
          ) : (
            <View className="flex-1 justify-center items-center gap-4 mx-3">
              <ActivityIndicator size={50} color={themeColors.bgDark} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default SearchScreen;
