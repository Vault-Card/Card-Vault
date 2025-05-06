import { useCardList } from "@/contexts/cardListContext";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Card() {
  const { cardList } = useCardList();
  const { id } = useLocalSearchParams();
  const card = cardList.find((c) => c.scryfallId == id);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: card?.name ?? 'Card Details' }} />
      <Image source={card?.imageUrl} style={styles.image} contentFit="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
  },
});