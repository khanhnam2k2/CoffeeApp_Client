import { View } from "react-native";
import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import { themeColors } from "../theme";
import { API_URL } from "../config";
export default function CarouselHome({
  slides,
  marginTop = 15,
  height = 200,
  border,
  isProduct,
}) {
  let productSlide = [];
  if (isProduct) {
    slides.forEach((slide) => productSlide.push(API_URL + "/images/" + slide));
  }
  return (
    <View className="">
      <SliderBox
        images={isProduct ? productSlide : slides}
        dotColor={themeColors.bgDark}
        inactiveDotColor={themeColors.bgDark}
        ImageComponentStyle={{
          borderBottomLeftRadius: border,
          borderBottomRightRadius: border,
          width: "100%",
          marginTop: marginTop,
          height: height,
        }}
        autoplay
        circleLoop
        imageLoadingColor="transparent"
      />
    </View>
  );
}
