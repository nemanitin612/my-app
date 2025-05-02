import ZoomableImage from "@/components/ZoomableImage";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
const { height, width } = Dimensions.get("screen");

const Haha = () => {
  return (
    <View>
      <View style={{ width, height: height * 0.6, backgroundColor: "red" }}>
        <ZoomableImage
          source={{
            uri: "https://media.istockphoto.com/id/814423752/photo/eye-of-model-with-colorful-art-make-up-close-up.jpg?s=612x612&w=0&k=20&c=l15OdMWjgCKycMMShP8UK94ELVlEGvt7GmB_esHWPYE=",
          }}
        />
      </View>
    </View>
  );
};

export default Haha;
