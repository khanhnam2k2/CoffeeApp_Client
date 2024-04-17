import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { AntDesign } from "@expo/vector-icons";
import { themeColors } from "../theme";
import GlobalApi from "../api/GlobalApi";
import { formatCurrency } from "../helpers";
// Hàm gọi API để lấy danh sách đơn hàng dựa trên trạng thái
const fetchOrdersByStatus = async (status) => {
  try {
    const response = await GlobalApi.getOrderListByStatus(status);
    return response?.data;
  } catch (error) {
    console.error("Lỗi", error);
    return [];
  }
};
const renderItem = ({ item }) => {
  return (
    <View className="mb-4 border-2 p-3 ">
      <FlatList
        data={item.items}
        renderItem={({ item: orderItem }) => (
          <View className="flex-row items-center gap-4">
            <Image
              source={{ uri: orderItem?.product?.imagesUrl[0] }}
              className="w-20
               h-20
              "
            />
            <View>
              <Text className="font-bold text-base">
                {orderItem?.product?.name}
              </Text>
              <Text>
                {formatCurrency(orderItem?.price)}đ x {orderItem?.quantity}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(orderItem) => orderItem?._id}
      />
      <View className="mt-2 items-end">
        <View className="flex-row items-center gap-1">
          <Text className="">Tổng tiền:</Text>
          <Text className="font-bold">{formatCurrency(item?.totalPrice)}đ</Text>
        </View>
      </View>
    </View>
  );
};
// Component con cho tab "Chờ xác nhận"
const PendingOrdersScreen = ({ orders }) => {
  return (
    <View className="flex-1 mt-4">
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(order) => order?._id}
      />
    </View>
  );
};

// Component con cho tab "Đang giao"
const ShippingOrdersScreen = ({ orders }) => {
  return (
    <View className="flex-1 mt-4">
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(order) => order._id}
      />
    </View>
  );
};

// Component con cho tab "Hoàn thành"
const CompletedOrdersScreen = ({ orders }) => {
  return (
    <View className="flex-1 mt-4">
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={(order) => order._id}
      />
    </View>
  );
};

const OrderScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0); // Chỉ số của tab hiện tại
  const [routes] = useState([
    { key: "pending", title: "Chờ xác nhận" },
    { key: "shipping", title: "Đang giao" },
    { key: "completed", title: "Hoàn thành" },
  ]);
  const [orders, setOrders] = useState({
    pending: [],
    shipping: [],
    completed: [],
  });

  useEffect(() => {
    const fetchOrders = async () => {
      const pendingOrders = await fetchOrdersByStatus(0);
      const shippingOrders = await fetchOrdersByStatus(1);
      const completedOrders = await fetchOrdersByStatus(2);
      setOrders({
        pending: pendingOrders,
        shipping: shippingOrders,
        completed: completedOrders,
      });
    };

    fetchOrders();
  }, []);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "pending":
        return <PendingOrdersScreen orders={orders.pending} />;
      case "shipping":
        return <ShippingOrdersScreen orders={orders.shipping} />;
      case "completed":
        return <CompletedOrdersScreen orders={orders.completed} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: themeColors.bgDark }}
      style={{ backgroundColor: "#fff" }}
      labelStyle={{
        color: themeColors.bgDark,
        fontSize: 14,
        textTransform: "none",
      }}
    />
  );

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 mx-4">
        <View className="flex-row items-center justify-between py-4 mb-2">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={30}
                color={themeColors.bgDark}
              />
            </TouchableOpacity>
            <Text className="text-xl">Đơn mua</Text>
          </View>
          {/* <TouchableOpacity>
            <Ionicons
              name="trash-outline"
              size={30}
              color={themeColors.bgDark}
            />
          </TouchableOpacity> */}
        </View>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={renderTabBar}
        />
      </View>
    </SafeAreaView>
  );
};

export default OrderScreen;
