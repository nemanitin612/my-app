import React from "react";
import { StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Video } from "expo-av";

const AnimatedVideo = Animated.createAnimatedComponent(Video);

const ZoomableVideo = ({ source, style, videoProps = {} }: any) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isZoomed = useSharedValue(false);

  // Create a simple gesture state tracker
  const gestureFocalX = useSharedValue(0);
  const gestureFocalY = useSharedValue(0);

  // Pinch gesture for zooming
  const pinchGesture = Gesture.Pinch()
    .onStart((event) => {
      // Store focal point when gesture starts
      gestureFocalX.value = event.focalX;
      gestureFocalY.value = event.focalY;
    })
    .onUpdate((event) => {
      // Update scale based on pinch
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

  // Pan gesture for moving around when zoomed
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

  // Combine both gestures to work simultaneously
  const combinedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  // Animation style for transformations
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={combinedGesture}>
      <AnimatedVideo
        source={source}
        style={[styles.video, animatedStyle, style, { zIndex: 9999999 }]}
        resizeMode="cover"
        shouldPlay
        isLooping
        {...videoProps}
      />
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

export default ZoomableVideo;
