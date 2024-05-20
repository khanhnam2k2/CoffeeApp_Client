import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { AntDesign } from "@expo/vector-icons";
import { themeColors } from "../theme";
import GlobalApi from "../api/GlobalApi";
import { formatCurrency } from "../helpers";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../config";
import { AuthContext } from "../context/AuthContext";
import { useRoute } from "@react-navigation/native";
import Empty from "../components/common/Empty";
import Searching from "../components/common/Searching";
import moment from "moment";

// Hiển thị các sp trong đơn hàng
const renderItem = ({ item }) => {
  return (
    <View className="mb-4 border-2 p-3 ">
      <View className="flex-row items-center gap-1 px-1">
        <Text className="font-bold">Ngày đặt: </Text>
        <Text>{moment(item.createdAt).format("DD/MM/YYYY")}</Text>
      </View>
      <FlatList
        data={item.items}
        renderItem={({ item: orderItem }) => (
          <View className="flex-row items-center gap-4">
            <Image
              source={{
                uri: API_URL + "/images/" + orderItem?.product?.imagesUrl[0],
              }}
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
const PendingOrdersScreen = ({ orders, loading }) => {
  return (
    <View className="flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Searching />
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Empty />
          <Text className="text-base font-bold mt-2">
            Không có đơn hàng nào
          </Text>
        </View>
      ) : (
        <FlatList
          className="mt-4"
          data={orders}
          renderItem={renderItem}
          keyExtractor={(order) => order?._id}
        />
      )}
    </View>
  );
};

// Component con cho tab "Đang giao"
const ShippingOrdersScreen = ({ orders, loading }) => {
  return (
    <View className="flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Searching />
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Empty />
          <Text className="text-base font-bold mt-2">
            Không có đơn hàng nào
          </Text>
        </View>
      ) : (
        <FlatList
          className="mt-4"
          data={orders}
          renderItem={renderItem}
          keyExtractor={(order) => order._id}
        />
      )}
    </View>
  );
};

// Component con cho tab "Hoàn thành"
const CompletedOrdersScreen = ({ orders, loading }) => {
  return (
    <View className="flex-1">
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Searching />
        </View>
      ) : orders.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Empty />
          <Text className="text-base font-bold mt-2">
            Không có đơn hàng nào
          </Text>
        </View>
      ) : (
        <FlatList
          className="mt-4"
          data={orders}
          renderItem={renderItem}
          keyExtractor={(order) => order._id}
        />
      )}
    </View>
  );
};

const OrderScreen = ({ navigation }) => {
  const route = useRoute();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  // Hàm gọi API để lấy danh sách đơn hàng dựa trên trạng thái
  const fetchOrdersByStatus = async (status) => {
    try {
      const response = await GlobalApi.getOrderListByStatus(user?._id, status);
      return response?.data;
    } catch (error) {
      console.error("Lỗi", error);
    }
  };

  const [index, setIndex] = useState(route.params?.tabIndex || 0); // Chỉ số của tab hiện tại
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
      setLoading(true);
      const pendingOrders = await fetchOrdersByStatus(0);
      const shippingOrders = await fetchOrdersByStatus(1);
      const completedOrders = await fetchOrdersByStatus(2);
      setOrders({
        pending: pendingOrders,
        shipping: shippingOrders,
        completed: completedOrders,
      });
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "pending":
        return (
          <PendingOrdersScreen orders={orders.pending} loading={loading} />
        );
      case "shipping":
        return (
          <ShippingOrdersScreen orders={orders.shipping} loading={loading} />
        );
      case "completed":
        return (
          <CompletedOrdersScreen orders={orders.completed} loading={loading} />
        );
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
