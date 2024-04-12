import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Formik } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { themeColors } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GlobalApi from "../api/GlobalApi";

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Mật khẩu cần dài ít nhất 8 ký tự")
    .required("Mật khẩu là bắt buộc"),
  email: Yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
});

export default function LoginScreen({ navigation }) {
  const { user, setUser } = useContext(AuthContext);
  const [loader, setLoader] = useState(false);
  const [obsecureText, setObsecureText] = useState(true);
  // Hàm xử lý form lỗi
  const inValidForm = () => {
    Alert.alert("Lỗi", "Vui lòng cung cấp tất cả các trường bắt buộc", [
      {
        text: "Đồng ý",
        onPress: () => {},
      },
    ]);
  };

  // Hàm đăng nhập
  const handleLogin = (values) => {
    setLoader(true);
    GlobalApi.login(values).then((resp) => {
      if (!resp.data.error) {
        AsyncStorage.setItem("user", JSON.stringify(resp?.data));
        setUser(resp?.data);
        navigation.replace("Home");
      } else {
        setLoader(false);
        Alert.alert("Lỗi đăng nhập", resp?.data?.error, [
          {
            text: "Đồng ý",
            onPress: () => {},
          },
        ]);
      }
    });
  };
  return (
    <ScrollView>
      <SafeAreaView className="mx-5">
        <View>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-3 z-50"
          >
            <Ionicons
              name="chevron-back-circle"
              size={30}
              color={themeColors.bgLight}
            />
          </TouchableOpacity>
          <Image
            source={require("../assets/images/coffee.png")}
            style={{
              height: 300,
              width: 200,
              resizeMode: "contain",
              marginBottom: 40,
            }}
          />
          <Text
            className="text-center font-extrabold mb-4 text-2xl"
            style={{ color: themeColors.bgLight }}
          >
            Chào mừng bạn đến với chúng tôi
          </Text>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleLogin(values)}
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
              <View>
                <View className="mb-5 mx-5">
                  <Text className="mb-1 me-1 text-right text-sm">Email</Text>
                  <View
                    className="border h-12 flex-row rounded-lg px-3 items-center "
                    style={{
                      backgroundColor: themeColors.lightWhite,
                      borderColor: touched.email
                        ? themeColors.bgLight
                        : themeColors.offwhite,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="email-outline"
                      size={20}
                      color={themeColors.bgGray}
                    />
                    <TextInput
                      className="ml-2 flex-1"
                      placeholder="example@gmail.com"
                      onFocus={() => {
                        setFieldTouched("email");
                      }}
                      onBlur={() => {
                        setFieldTouched("email", "");
                      }}
                      value={values.email}
                      onChangeText={handleChange("email")}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text className="text-red-500 mt-1 ml-1 text-sm">
                      {errors.email}
                    </Text>
                  )}
                </View>
                <View className="mb-5 mx-5">
                  <Text className="mb-1 me-1 text-right text-sm">Mật khẩu</Text>
                  <View
                    className="border h-12 flex-row rounded-lg px-3 items-center "
                    style={{
                      backgroundColor: themeColors.lightWhite,
                      borderColor: touched.password
                        ? themeColors.bgLight
                        : themeColors.offwhite,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="lock-outline"
                      size={20}
                      color={themeColors.bgGray}
                    />
                    <TextInput
                      className="ml-2 flex-1"
                      secureTextEntry={obsecureText}
                      placeholder="Mật khẩu"
                      onFocus={() => {
                        setFieldTouched("password");
                      }}
                      onBlur={() => {
                        setFieldTouched("password", "");
                      }}
                      value={values.password}
                      onChangeText={handleChange("password")}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setObsecureText(!obsecureText)}
                    >
                      <MaterialCommunityIcons
                        name={!obsecureText ? "eye-outline" : "eye-off-outline"}
                        size={18}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text className="text-red-500 mt-1 ml-1 text-sm">
                      {errors.password}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  disabled={!isValid}
                  onPress={isValid ? handleSubmit : () => inValidForm()}
                  className="h-12 my-5 w-full justify-center items-center rounded-full "
                  style={{
                    backgroundColor: !isValid
                      ? themeColors.bgGray
                      : themeColors.bgLight,
                  }}
                >
                  {!loader ? (
                    <Text className="font-bold text-base text-white">
                      ĐĂNG NHẬP
                    </Text>
                  ) : (
                    <ActivityIndicator size={30} color="white" />
                  )}
                </TouchableOpacity>

                <View className="flex-row mt-4 items-center justify-center">
                  <Text>Bạn chưa có tài khoản?</Text>
                  <Text
                    className="text-center ml-1 font-bold"
                    style={{ color: themeColors.bgDark }}
                    onPress={() => navigation.navigate("Register")}
                  >
                    Đăng ký ngay
                  </Text>
                </View>
              </View>
            )}
          </Formik>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
