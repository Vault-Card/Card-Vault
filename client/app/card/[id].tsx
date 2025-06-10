import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useCardList } from "@/contexts/cardListContext";
import { Divider } from "@aws-amplify/ui-react-native/dist/primitives";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function Card() {
  const { cardList } = useCardList();
  const { id } = useLocalSearchParams();
  const card = cardList.find((c) => c.scryfallId == id);

  return (
    !card
      ? <Text>No card found.</Text>
      : <Box style={styles.container}>
        <View style={styles.imageContainer}>
          <Stack.Screen options={{ title: card.name ?? 'Card Details' }} />
          <Image source={card.imageUrl} style={styles.image} contentFit="contain" />

          <Box style={styles.detailsContainer}>
            <HStack style={{ justifyContent: "space-between" }}>
              <Text style={styles.cardName}>{card.name}</Text>
              <Text>${card.price}</Text>
            </HStack>
            <Divider />

            <HStack style={{ justifyContent: "space-between" }}>
              <Text>{card.type}</Text>
              <Text>{card.set}</Text>
            </HStack>

            <Text style={styles.oracleText}>{card.text}</Text>
          </Box>
        </View>
      </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
  },
  imageContainer: {
    height: 500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%'
  },
  detailsContainer: {
    marginTop: 16
  },
  cardName: {
    fontSize: 24,
    paddingTop: 8
  },
  oracleText: {
    marginTop: 16
  }
});