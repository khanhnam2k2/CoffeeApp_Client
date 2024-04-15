import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  useEffect(() => {
    const checkUserLogin = async () => {
      const userLogin = await AsyncStorage.getItem("user");
      const userLoginParse = JSON.parse(userLogin);
      setUser(userLoginParse);
    };
    checkUserLogin();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, cartItemCount, setCartItemCount }}
    >
      {children}
    </AuthContext.Provider>
  );
};
