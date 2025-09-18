import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


const SafeScreen = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  return (

    <View style={{  flex: 1, paddingTop: insets.top,paddingBottom: insets.bottom,backgroundColor: "#f3f3f3"  }}>
      {children}
    </View>
  );
};

export default SafeScreen;
