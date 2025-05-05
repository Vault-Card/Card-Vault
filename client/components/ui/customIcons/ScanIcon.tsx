import { Image } from 'expo-image';
import { View, StyleSheet } from "react-native";

const ScanIcon = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/collection.svg')} style={{ width: 30, height: 30 }} />
    </View>
  );
}

export default ScanIcon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});