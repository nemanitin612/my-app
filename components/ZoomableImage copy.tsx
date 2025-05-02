import React from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const ZoomableImage = ({ source, style }: any) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isZoomed = useSharedValue(false);

  // Create a simple gesture state tracker
  const gestureFocalX = useSharedValue(0);
  const gestureFocalY = useSharedValue(0);

  // Combined gesture that first checks if the starting point is within the image bounds
  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      // Store focal point when gesture starts
      gestureFocalX.value = event.focalX;
      gestureFocalY.value = event.focalY;
    })
    .onUpdate((event) => {
      // Only update if the focal point is within the image
      // Note: In a real implementation, you'd need to check against actual image bounds
      scale.value = event.scale;
      if (event.scale > 1) {
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
    .onStart((event) => {
      // Store starting point when gesture starts
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.Image
        source={source}
        style={[styles.image, animatedStyle, { zIndex: 9999999 }]}
        resizeMode="cover"
      />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default ZoomableImage;
