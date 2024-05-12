import { View, Text, StatusBar, Image, TouchableOpacity } from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { Feather, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { themeColors } from "../theme";
import { AuthContext } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import GlobalApi from "../api/GlobalApi";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const { user, setUser } = useContext(AuthContext);
  const [avatar, setAvatar] = useState(user?.avatar);
  const [totalOrders, setTotalOrders] = useState({
    pending: 0,
    delivering: 0,
    complete: 0,
  });

  const navigation = useNavigation();

  const getTotalOrders = async () => {
    try {
      const response = await GlobalApi.getTotalOrders(user?._id);
      if (response.status === 200) {
        setTotalOrders(response.data);
      }
    } catch (error) {}
  };

  useFocusEffect(
    useCallback(() => {
      getTotalOrders();
    }, [user?._id])
  );

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      setUser(null);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Có lỗi xảy ra");
    }
  };
  const updateAvatarUser = async (avatarUri) => {
    try {
      const data = {
        avatar: avatarUri,
      };

      const response = await GlobalApi.updateProfileUser(user?._id, data);
      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Cập nhật ảnh đại diện thành công",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const openImagePicker = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Cần có quyền truy cập vào cuộn camera!",
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const newAvatarUri = result.assets[0].uri;
      setAvatar(newAvatarUri);
      updateAvatarUser(newAvatarUri);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar />
      <View
        className="py-4 mb-4 pb-10"
        style={{ backgroundColor: themeColors.bgDark }}
      >
        {user ? (
          <View className="mx-4 ">
            <View className="flex-row items-center justify-end gap-6">
              <View className="">
                <Feather name="settings" size={24} color="white" />
              </View>
              <View>
                <TouchableOpacity onPress={() => logout()}>
                  <AntDesign name="logout" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row justify-between items-center mt-4">
              <View className="flex-row items-center gap-4">
                <TouchableOpacity
                  onPress={openImagePicker}
                  className="relative"
                >
                  {avatar ? (
                    <Image
                      source={{ uri: avatar }}
                      className="w-14 h-14 rounded-full"
                    />
                  ) : (
                    <Image
                      source={require("../assets/images/avatar.png")}
                      className="w-14 h-14 rounded-full"
                    />
                  )}

                  <View className="absolute top-8 left-8">
                    <Feather name="edit" size={20} color="white" />
                  </View>
                </TouchableOpacity>
                <View>
                  <Text className="text-lg font-bold text-white">
                    {user?.username}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="mx-6 justify-center py-6">
            <View className="flex-row items-center justify-end gap-6">
              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                className="border px-4 py-2"
                style={{ backgroundColor: themeColors.white }}
              >
                <Text
                  className="text-base font-bold"
                  style={{ color: themeColors.bgDark }}
                >
                  Đăng nhập
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="px-4 py-2"
                onPress={() => navigation.navigate("Register")}
              >
                <Text className="text-base text-white font-bold">Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <View className="mx-4 mt-4 border-b-2 pb-6 border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-lg font-bold">Đơn mua</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Order")}
            className="flex-row items-center gap-1"
          >
            <Text>Xem lịch sử mua hàng</Text>
            <AntDesign name="arrowright" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center justify-between mt-10">
          <TouchableOpacity
            className=" items-center"
            onPress={() => navigation.navigate("Order", { tabIndex: 0 })}
          >
            <View className="relative">
              <MaterialCommunityIcons
                name="truck-fast"
                size={40}
                color="black"
              />
              {totalOrders?.pending > 0 && (
                <View
                  className="absolute -top-1 -right-3 px-2 rounded-full"
                  style={{ backgroundColor: themeColors.bgDark }}
                >
                  <Text className="text-white font-bold">
                    {totalOrders?.pending}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-sm font-semibold">Chờ xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" items-center"
            onPress={() => navigation.navigate("Order", { tabIndex: 1 })}
          >
            <View className="relative">
              <MaterialCommunityIcons
                name="truck-fast"
                size={40}
                color="black"
              />
              {totalOrders?.delivering > 0 && (
                <View
                  className="absolute -top-1 -right-3 px-2 rounded-full"
                  style={{ backgroundColor: themeColors.bgDark }}
                >
                  <Text className="text-white font-bold">
                    {totalOrders?.delivering}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-sm font-semibold">Đang giao </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className=" items-center"
            onPress={() => navigation.navigate("Order", { tabIndex: 2 })}
          >
            <View className="relative">
              <MaterialCommunityIcons
                name="truck-fast"
                size={40}
                color="black"
              />
              {totalOrders?.complete > 0 && (
                <View
                  className="absolute -top-1 -right-3 px-2 rounded-full"
                  style={{ backgroundColor: themeColors.bgDark }}
                >
                  <Text className="text-white font-bold">
                    {totalOrders?.complete}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-sm font-semibold">Hoàn thành </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
