import { View } from "react-native";
import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import { themeColors } from "../theme";
export default function CarouselHome() {
  const slides = [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];
  return (
    <View className="">
      <SliderBox
        images={slides}
        dotColor={themeColors.bgDark}
        inactiveDotColor={themeColors.bgLight}
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
