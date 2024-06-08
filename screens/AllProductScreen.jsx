import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { themeColors } from "../theme";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import GlobalApi from "../api/GlobalApi";
import ProductCard from "../components/ProductCard";

const AllProductScreen = ({ navigation }) => {
  const [productList, setProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [page]);

  const loadProducts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await GlobalApi.getAllProducts(page, 6);
      const { products: newProducts, totalPages } = response.data;
      setProductList((prevProducts) => [...prevProducts, ...newProducts]);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const renderFooter = () => {
    return loading ? (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="large" color="black" />
      </View>
    ) : null;
  };

  return (
    <SafeAreaView className="flex-1 pt-4 mx-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={30} color={themeColors.bgDark} />
          </TouchableOpacity>
          <Text className="text-xl">Sản phẩm</Text>
        </View>
      </View>
      <View className="flex-1 mt-10">
        <FlatList
          data={productList}
          numColumns={2}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ProductCard item={item} isSmallItem={true} spacing={10} />
          )}
          onEndReached={() => {
            if (page < totalPages) setPage(page + 1);
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      </View>
    </SafeAreaView>
  );
};

export default AllProductScreen;
