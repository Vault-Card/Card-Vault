import CardList from '@/components/CardList';
import { Box } from '@/components/ui/box';
import { useCardList } from '@/contexts/cardListContext';
import { View } from 'react-native';

export default function Collection() {
  const { cardList } = useCardList();

  return (
    <View>
      <Box className='p-4'>
        <CardList cards={cardList} clickable={true} />
      </Box>
    </View>
  );
}


