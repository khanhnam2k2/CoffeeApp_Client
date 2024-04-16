import { View } from "react-native";
import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import { themeColors } from "../theme";
export default function CarouselHome({
  slides,
  marginTop = 15,
  height = 200,
  border,
}) {
  return (
    <View className="">
      <SliderBox
        images={slides}
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
