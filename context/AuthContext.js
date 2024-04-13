import { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserLogin = async () => {
      const userLogin = await AsyncStorage.getItem("user");
      const userLoginParse = JSON.parse(userLogin);
      setUser(userLoginParse);
    };
    checkUserLogin();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
