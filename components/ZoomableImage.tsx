import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
const { height, width } = Dimensions.get("screen");

const maxScale = 3; // Adjust this value as needed

const ZoomableImage = ({ source, style, gestureEnabled }: any) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isZoomed = useSharedValue(false);

  // Create a simple gesture state tracker
  const gestureFocalX = useSharedValue(0);
  const gestureFocalY = useSharedValue(0);

  // Combined gesture that first checks if the starting point is within the image bounds
  const pinchGesture = Gesture.Pinch()
    .enabled(gestureEnabled)
    .onStart((event) => {
      isZoomed.value = true;
      // Store focal point when gesture starts
      gestureFocalX.value = event.focalX;
      gestureFocalY.value = event.focalY;
    })
    .onUpdate((event) => {
      // Only update if the focal point is within the image
      // Note: In a real implementation, you'd need to check against actual image bounds
      if (event.scale > 1) {
        scale.value = Math.min(event.scale, maxScale);
        isZoomed.value = true;
      }
    })
    .onEnd(() => {
      isZoomed.value = false;
      scale.value = withTiming(1);
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
    });

  const panGesture = Gesture.Pan()
    .minPointers(2)
    .onStart((event) => {
      gestureFocalX.value = event.x;
      gestureFocalY.value = event.y;
    })
    .onUpdate((event) => {
      // Only allow panning when zoomed
      if (isZoomed.value) {
        const speedFactor = 0.5;
        translateX.value = event.translationX * speedFactor;
        translateY.value = event.translationY * speedFactor;
      }
    });

  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    console.log(isZoomed.value, " KJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ");
    return {
      transform: [
        { scale: scale.value },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      // position: "relative",
      // top: isZoomed.value ? 0 : undefined,
      // left: isZoomed.value ? 0 : undefined,
      // width: isZoomed.value ? width : "100%",
      // height: isZoomed.value ? height : "100%",
      // zIndex: isZoomed.value ? 9999 : 0,
    };
  });

  return (
    <GestureDetector gesture={combinedGesture}>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={source}
          style={[styles.image, animatedStyle]}
          resizeMode="cover"
        />
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width,
    height: height * 0.6,
    backgroundColor: "red",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default ZoomableImage;
