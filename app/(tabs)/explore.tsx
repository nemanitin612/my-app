import ZoomableVideo from "@/components/ZoomableVideo";
import { Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <ZoomableVideo
        source={{
          uri: "https://stikbook-bucket.s3.ca-central-1.amazonaws.com/original_quiks/20250331_181732214286528_062540c5-ac2a-46a6-990a-1d6861a07be7.mp4",
        }}
        videoProps={{
          shouldPlay: true,
          isMuted: false,
        }}
      />
    </View>
  );
}
