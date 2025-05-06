import { useCardList } from "@/contexts/cardListContext";
import { Card } from "@/types/card";
import CardList from "./CardList";
import { Box } from "./ui/box";
import { Button, ButtonText } from "./ui/button";
import { Divider } from "./ui/divider";
import { Drawer, DrawerBackdrop, DrawerBody, DrawerContent } from "./ui/drawer";
import { Heading } from "./ui/heading";
import { Text } from "./ui/text";
import { HStack } from "./ui/hstack";
import { Center } from "./ui/center";

export type CardListDrawerProps = {
  scannedCards: Card[]
  isOpen: boolean
  onSave: () => void
  onClear: () => void
  onClose?: () => void
}

export default function CardListDrawer({
  scannedCards,
  isOpen,
  onSave,
  onClear,
  onClose
}: CardListDrawerProps) {
  return (
    <Drawer
      size='lg'
      anchor='right'
      isOpen={isOpen}
      onClose={onClose}
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerBody>
          <Heading>Scanned Cards</Heading>
          <Divider />
          <Box className='mt-2'>
            {
              scannedCards.length > 0
                ? <>
                    <CardList cards={scannedCards} clickable={false} />
                    <Center className='mt-16' >
                      <HStack space='4xl'>
                        <Button className='bg-error-900 grow' onPress={onClear}>
                          <ButtonText>Clear</ButtonText>
                        </Button>
                        <Button onPress={onSave}>
                          <ButtonText>Save</ButtonText>
                        </Button>
                      </HStack>
                    </Center>
                  </>
                : <Text>No cards scanned</Text>
            }
          </Box>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}