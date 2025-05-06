import { Card } from "@/types/card";
import { Link } from "expo-router";
import { Box } from "./ui/box";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

export type CardListProps = {
  cards: Card[]
  clickable: boolean
}

export default function CardList({ cards, clickable }: CardListProps) {
  return (
    <VStack>
      {
        cards.map((c, i) =>
          <Box className='mb-4' key={i}>
            {
              clickable
                ? <Link href={`/card/${c.scryfallId}`}>
                    <Text className='text-lg'>{c.name}</Text>
                  </Link>
                : <Text className='text-lg'>{c.name}</Text>
            }
          </Box>
        )
      }
    </VStack>
  );
}