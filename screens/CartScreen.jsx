import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { themeColors } from "../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthContext";
import GlobalApi from "../api/GlobalApi";
import CartItemCard from "../components/CartItemCard";
import MasonryList from "@react-native-seoul/masonry-list";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import { formatCurrency } from "../helpers";

const CartScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [checkedItemCount, setCheckedItemCount] = useState(0);

  useEffect(() => {
    getCart();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (user) {
        getCart();
        setCheckedItems({});
        setCheckedItemCount(0);
        setSelectAllChecked(false);
      } else {
        setCartData([]);
      }
    }, [])
  );

  useEffect(() => {
    const totals = cartData?.items?.reduce((total, item) => {
      if (checkedItems[item._id]) {
        return total + item.quantity * item.price;
      }
      return total;
    }, 0);
    setTotalPrice(totals);
    setCheckedItemCount(
      Object.values(checkedItems).filter((isChecked) => isChecked).length
    );
  }, [checkedItems, cartData]);

  const getCart = async () => {
    setLoading(true);
    try {
      const resp = await GlobalApi.getCart(user?._id);
      setCartData(resp?.data);
    } catch (error) {
      console.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckbox = (itemId) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = { ...prev, [itemId]: !prev[itemId] };
      const allItemsChecked = cartData.items.every(
        (item) => updatedCheckedItems[item._id]
      );
      setSelectAllChecked(allItemsChecked);
      return updatedCheckedItems;
    });
  };

  const toggleSelectAll = () => {
    setSelectAllChecked((prev) => !prev);
    const newCheckedItems = {};
    cartData?.items?.forEach((item) => {
      newCheckedItems[item?._id] = !selectAllChecked;
    });
    setCheckedItems(newCheckedItems);
  };

  const updateCartItemQuantity = async (itemId, newQuantity) => {
    try {
      const data = { userId: user?._id, itemId: itemId, quantity: newQuantity };
      const resp = await GlobalApi.updateCartItemQuantity(data);
      if (resp?.data?.success) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: resp?.data?.message,
        });
        getCart();
      } else {
        Toast.show({
          type: "error",
          text1: "Thất bại",
          text2: resp?.data?.message,
        });
      }
    } catch (error) {
      console.error("Có lỗi xảy ra");
    }
  };

  const incrementQuantity = (itemId) => {
    const updatedQuantity =
      cartData.items.find((item) => item._id === itemId).quantity + 1;
    updateCartItemQuantity(itemId, updatedQuantity);
  };

  const decrementQuantity = (itemId) => {
    const currentQuantity = cartData.items.find(
      (item) => item._id === itemId
    ).quantity;
    if (currentQuantity > 1) {
      const updatedQuantity = currentQuantity - 1;
      updateCartItemQuantity(itemId, updatedQuantity);
    }
  };

  const deleteCheckedItems = async () => {
    const checkedItemIds = Object.keys(checkedItems).filter(
      (itemId) => checkedItems[itemId]
    );
    if (checkedItemIds.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn sản phẩm muốn xóa");
      return;
    }

    try {
      await Promise.all(
        checkedItemIds.map((itemId) =>
          GlobalApi.deleteCartItem(user?._id, itemId)
        )
      );
      getCart();
      setCheckedItems({});
      setSelectAllChecked(false);
    } catch (error) {
      console.error("Có lỗi xảy ra. Vui lòng thử lại");
    }
  };

  const handleCheckout = () => {
    const checkedItemIds = Object.keys(checkedItems).filter(
      (itemId) => checkedItems[itemId]
    );
    if (checkedItemIds.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn sản phẩm để thanh toán");
    } else {
      navigation.navigate("Checkout", {
        itemCheckout: getCheckedItems(),
        totalPrice: totalPrice,
        type: "Cart",
      });
    }
  };

  const getCheckedItems = () =>
    cartData.items.filter((item) => checkedItems[item._id]);

  return (
    <View className="flex-1 bg-white mt-">
      <SafeAreaView className="flex-1 mt-3 mx-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={30}
                color={themeColors.bgDark}
              />
            </TouchableOpacity>
            <Text className="text-xl">Giỏ hàng</Text>
          </View>
          <TouchableOpacity onPress={deleteCheckedItems}>
            <Ionicons
              name="trash-outline"
              size={30}
              color={themeColors.bgDark}
            />
          </TouchableOpacity>
        </View>
        <View className="flex-1 mt-10">
          {loading ? (
            <ActivityIndicator size={30} color={themeColors.bgDark} />
          ) : cartData && cartData.items && cartData.items.length ? (
            <View className="flex-1">
              <MasonryList
                data={cartData.items}
                numColumns={1}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <CartItemCard
                    checked={checkedItems[item?._id]}
                    handleCheckbox={() => handleCheckbox(item?._id)}
                    item={item}
                    incrementQuantity={() => incrementQuantity(item?._id)}
                    decrementQuantity={() => decrementQuantity(item?._id)}
                  />
                )}
              />
            </View>
          ) : (
            <View>
              <Text>asdsa</Text>
            </View>
          )}
        </View>
        <View className="mt-10 pb-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={toggleSelectAll}
              >
                {/* Thêm nút checkbox chọn tất cả */}
                <MaterialCommunityIcons
                  name={
                    selectAllChecked
                      ? "checkbox-marked"
                      : "checkbox-blank-outline"
                  }
                  size={30}
                  color={themeColors.bgDark}
                />
                <Text>Tất cả</Text>
              </TouchableOpacity>
            </View>
            <View className="">
              <View className="flex-row items-center gap-1">
                <Text className="font-bold text-base">Tổng thanh toán:</Text>
                <Text>{totalPrice ? formatCurrency(totalPrice) : 0}đ</Text>
              </View>
              <TouchableOpacity
                className="px-5 py-2"
                style={{ backgroundColor: themeColors.bgDark }}
                onPress={() => handleCheckout()}
              >
                <Text className="text-white font-bold text-lg text-center">
                  Mua hàng ({checkedItemCount})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CartScreen;
