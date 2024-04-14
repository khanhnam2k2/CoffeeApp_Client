import { View } from "react-native";
import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import { themeColors } from "../theme";
export default function CarouselHome() {
  const slides = [
    "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return (
    <View className="">
      <SliderBox
        images={slides}
        dotColor={themeColors.bgDark}
        inactiveDotColor={themeColors.bgDark}
        ImageComponentStyle={{
          // borderRadius: 20,
          width: "100%",
          marginTop: 15,
        }}
        autoplay
        circleLoop
        imageLoadingColor={themeColors.bgDark}
      />
    </View>
  );
}
