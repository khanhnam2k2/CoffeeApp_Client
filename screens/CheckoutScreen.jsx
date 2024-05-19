import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import { useRoute } from "@react-navigation/native";
import GlobalApi from "../api/GlobalApi";
import { AuthContext } from "../context/AuthContext";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { themeColors } from "../theme";
import MasonryList from "@react-native-seoul/masonry-list";
import CheckoutCard from "../components/CheckoutCard";
import { Formik } from "formik";
import * as Yup from "yup";
import { formatCurrency } from "../helpers";
import Toast from "react-native-toast-message";

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .min(8, "Địa chỉ phải có ít nhất 8 ký tự")
    .required("Địa chỉ là bắt buộc"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số")
    .required("Số điện thoại là bắt buộc"),
});

const CheckoutScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const route = useRoute();
  const { itemCheckout, totalPrice, type } = route.params;
  const [loading, setLoading] = useState(false);

  /**
   * Hàm xử lý đặt hàng
   * @param {*} values - Thông tin đặt hàng
   */
  const checkout = async (values) => {
    setLoading(true);
    try {
      const data = {
        userId: user._id,
        items: itemCheckout.map((item) => ({
          _id: item?._id,
          product: item.product._id,
          quantity: item?.quantity,
          price: item?.price,
        })),
        address: values.address,
        phone: values.phone,
        type: type,
      };

      const response = await GlobalApi.createOrder(data);
      if (response?.data?.success) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: response?.data?.message,
        });
        navigation.replace("Order");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white  pt-4 mx-4 ">
      <View className="flex-1">
        <View className="flex-row items-center justify-between ">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign
                name="arrowleft"
                size={30}
                color={themeColors.bgDark}
              />
            </TouchableOpacity>
            <Text className="text-xl">Thanh toán</Text>
          </View>
        </View>
        <View className="flex-1 mt-4">
          <MasonryList
            contentContainerStyle={{
              paddingBottom: 20,
            }}
            numColumns={1}
            data={itemCheckout}
            showsVerticalScrollIndicator={false}
            // keyExtractor={(item) => item._id}
            renderItem={({ item }) => <CheckoutCard item={item} />}
          />

          <ScrollView
            keyboardShouldPersistTaps="handled"
            className="flex-1 p-2"
          >
            <View className="flex-row items-center gap-1 justify-end mb-4">
              <Text>Tổng thanh toán:</Text>
              <Text>{formatCurrency(totalPrice)}đ</Text>
            </View>
            <Text className="text-base font-bold">Thông tin đặt hàng</Text>
            <Formik
              className="flex-1"
              initialValues={{ address: "", phone: "" }}
              validationSchema={validationSchema}
              onSubmit={(values) => checkout(values)}
            >
              {({
                handleChange,
                handleSubmit,
                touched,
                values,
                errors,
                isValid,
                setFieldTouched,
              }) => (
                <View className="">
                  <View className="mb-3 mx-5">
                    <Text className="mb-1 me-1 text-right text-sm">
                      Số điện thoại
                    </Text>
                    <View
                      className="border h-12 flex-row rounded-lg px-3 items-center"
                      style={{
                        backgroundColor: themeColors.lightWhite,
                        borderColor: touched.phone
                          ? themeColors.bgDark
                          : themeColors.offwhite,
                      }}
                    >
                      <Feather
                        name="phone"
                        size={20}
                        color={themeColors.bgGray}
                      />
                      <TextInput
                        className="ml-2 flex-1"
                        placeholder="Nhập số điện thoại"
                        onFocus={() => {
                          setFieldTouched("phone");
                        }}
                        onBlur={() => {
                          setFieldTouched("phone", "");
                        }}
                        value={values.phone}
                        onChangeText={handleChange("phone")}
                        autoCapitalize="none"
                        keyboardType="numeric"
                      />
                    </View>
                    {touched.phone && errors.phone && (
                      <Text className="text-red-500 mt-1 ml-1 text-sm">
                        {errors.phone}
                      </Text>
                    )}
                  </View>
                  <View className="mb-3 mx-5">
                    <Text className="mb-1 me-1 text-right text-sm">
                      Địa chỉ
                    </Text>
                    <View
                      className="border h-20 flex-row rounded-lg px-3 items-center"
                      style={{
                        backgroundColor: themeColors.lightWhite,
                        borderColor: touched.address
                          ? themeColors.bgDark
                          : themeColors.offwhite,
                        width: "100%",
                      }}
                    >
                      <Ionicons
                        name="location-outline"
                        size={20}
                        color={themeColors.bgGray}
                      />
                      <TextInput
                        numberOfLines={5}
                        className="ml-2 flex-1"
                        placeholder="Nhập địa chỉ giao hàng"
                        onFocus={() => {
                          setFieldTouched("address");
                        }}
                        onBlur={() => {
                          setFieldTouched("address", "");
                        }}
                        value={values.address}
                        onChangeText={handleChange("address")}
                        autoCapitalize="none"
                        multiline={true}
                        style={{ maxHeight: 120 }}
                      />
                    </View>
                    {touched.address && errors.address && (
                      <Text className="text-red-500 mt-1 ml-1 text-sm">
                        {errors.address}
                      </Text>
                    )}
                  </View>

                  <TouchableOpacity
                    disabled={!isValid}
                    className="h-12 my-5 w-full items-center justify-center rounded-full"
                    style={{
                      backgroundColor: isValid
                        ? themeColors.bgDark
                        : themeColors.bgGray,
                    }}
                    onPress={isValid ? handleSubmit : () => inValidForm()}
                  >
                    {loading ? (
                      <ActivityIndicator size={30} color={themeColors.white} />
                    ) : (
                      <Text className="font-bold text-white">ĐẶT HÀNG</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutScreen;
