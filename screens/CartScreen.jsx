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
import Empty from "../components/common/Empty";

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

  // Hàm lấy thông tin giỏ hàng của người dùng
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

  /**
   * Hàm chọn sản phẩm
   * @param {String} itemId - id của sản phẩm
   */
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

  // Hàm chọn tất cả sp trong giỏ hàng
  const toggleSelectAll = () => {
    setSelectAllChecked((prev) => !prev);
    const newCheckedItems = {};
    cartData?.items?.forEach((item) => {
      newCheckedItems[item?._id] = !selectAllChecked;
    });
    setCheckedItems(newCheckedItems);
  };

  /**
   * Hàm cập nhật số lượng sản phẩm trong giỏ hàng
   * @param {String} itemId - id của sản phẩm
   * @param {Number} newQuantity - số lượng sp muốn cập nhật
   */
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

  /**
   * Hàm tăng số lượng sản phẩm
   * @param {String} itemId - id của sản phẩm
   */
  const incrementQuantity = (itemId) => {
    const updatedQuantity =
      cartData.items.find((item) => item._id === itemId).quantity + 1;
    updateCartItemQuantity(itemId, updatedQuantity);
  };

  /**
   * Hàm giảm số lượng sản phẩm
   * @param {String} itemId - id của sản phẩm
   */
  const decrementQuantity = (itemId) => {
    const currentQuantity = cartData.items.find(
      (item) => item._id === itemId
    ).quantity;
    if (currentQuantity > 1) {
      const updatedQuantity = currentQuantity - 1;
      updateCartItemQuantity(itemId, updatedQuantity);
    }
  };

  // Hàm xóa sản phẩm được chọn ra khỏi giỏ hàng
  const deleteCheckedItems = async () => {
    const checkedItemIds = Object.keys(checkedItems).filter(
      (itemId) => checkedItems[itemId]
    );
    if (checkedItemIds.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn sản phẩm muốn xóa");
      return;
    }

    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: async () => {
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
        },
      },
    ]);
  };

  // Hàm xử lý thanh toán
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

  // Hàm trả về các sp được chọn
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
          {!loading ? (
            cartData && cartData.items && cartData.items.length ? (
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
              <View className="flex-1 justify-center items-center gap-4 mx-3">
                <Empty />
                <Text className="mt-3 text-base">
                  Giỏ hàng của bạn đang trống
                </Text>
              </View>
            )
          ) : (
            <ActivityIndicator size={30} color={themeColors.bgDark} />
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
