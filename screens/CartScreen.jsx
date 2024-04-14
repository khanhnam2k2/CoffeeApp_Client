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
  }, [checkedItems, cartData]);

  // Hàm lấy danh sách sp trong giỏ hàng
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

  const getCheckedItemCount = (checkedList = checkedItems) => {
    const checkedItemCounts = Object.values(checkedList).filter(
      (isChecked) => isChecked
    ).length;
    setCheckedItemCount(checkedItemCounts);
  };
  const handleCheckbox = (itemId) => {
    setCheckedItems((prev) => {
      const updatedCheckedItems = {
        ...prev,
        [itemId]: !prev[itemId],
      };
      getCheckedItemCount(updatedCheckedItems);
      // Kiểm tra xem tất cả các sản phẩm đã được chọn hay chưa
      const allItemsChecked = cartData.items.every(
        (item) => updatedCheckedItems[item._id]
      );
      setSelectAllChecked(allItemsChecked); // Cập nhật trạng thái của ô "Chọn tất cả"
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
      const data = {
        userId: user?._id,
        itemId: itemId,
        quantity: newQuantity,
      };
      const resp = await GlobalApi.updateCartItemQuantity(data);
      if (resp?.data?.success) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: resp?.data?.message,
        });
        getCart();
      }
    } catch (error) {
      console.error("Có lỗi xảy ra");
    }
  };

  // Hàm tăng sl sp
  const incrementQuantity = (itemId) => {
    const updatedQuantity =
      cartData.items.find((item) => item._id === itemId).quantity + 1;
    updateCartItemQuantity(itemId, updatedQuantity);
  };

  // Hàm giảm sl sp
  const decrementQuantity = (itemId) => {
    const currentQuantity = cartData.items.find(
      (item) => item._id === itemId
    ).quantity;
    if (currentQuantity > 1) {
      const updatedQuantity = currentQuantity - 1;
      updateCartItemQuantity(itemId, updatedQuantity);
    }
  };

  // Xóa sản phẩm trong giỏ hàng
  const deleteCheckedItems = async () => {
    const checkedItemIds = Object.keys(checkedItems).filter(
      (itemId) => checkedItems[itemId]
    );
    if (checkedItemIds.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn sp muốn xóa");
      return;
    } // Không có sản phẩm nào được chọn

    try {
      for (const itemId of checkedItemIds) {
        await GlobalApi.deleteCartItem(user?._id, itemId);
      }
      getCart(); // Sau khi xóa, cập nhật lại dữ liệu giỏ hàng
      setCheckedItems({}); // Đặt lại trạng thái của các sản phẩm đã chọn
      setSelectAllChecked(false);
    } catch (error) {
      console.error("Có lỗi xảy ra. Vui lòng thử lại");
    }
  };

  // Hàm lọc ra các sp được checked
  const getCheckedItems = () => {
    return cartData.items.filter((item) => checkedItems[item._id]);
  };

  // Hàm chuyển hướng đặt hàng
  const handleCheckout = () => {
    const checkedItemIds = Object.keys(checkedItems).filter(
      (itemId) => checkedItems[itemId]
    );

    if (checkedItemIds.length === 0) {
      // Nếu không có sản phẩm nào được chọn, hiển thị thông báo lỗi
      Alert.alert("Lỗi", "Vui lòng chọn sản phẩm để thanh toán");
    } else {
      // Nếu có sản phẩm được chọn, chuyển đến màn hình đặt hàng và truyền checkedItems qua navigation
      navigation.navigate("Checkout", { itemCheckout: getCheckedItems() });
    }
  };

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
            <View className="flex-row gap-2 items-center">
              <View className="flex-row items-center gap-1">
                <Text>Tổng thanh toán</Text>
                <Text>${totalPrice ? totalPrice : 0}</Text>
              </View>
              <TouchableOpacity
                className="px-5 py-2"
                style={{ backgroundColor: themeColors.bgLight }}
                onPress={() => handleCheckout()}
              >
                <Text className="text-white font-bold text-lg">
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
