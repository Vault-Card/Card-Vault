import CardList from '@/components/CardList';
import { Box } from '@/components/ui/box';
import { useCardList } from '@/contexts/cardListContext';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Collection() {
  const { cardList } = useCardList();

  return (
    <ScrollView>
      <Box className='p-4'>
          <View>
            {/* Table Header */}
            <View style={styles.row}>
              <Text style={[styles.cell, styles.header]}>Name</Text>
              <Text style={[styles.cell, styles.header]}>Set</Text>
              <Text style={[styles.cell, styles.header]}>Amount</Text>
              <Text style={[styles.cell, styles.header]}>Price</Text>
            </View>

            {/* Table Rows */}
            {cardList.map((card) => (
              <View key={card.scryfallId} style={styles.row}>
                <Text style={styles.cell}>{card.name}</Text>
                <Text style={styles.cell}>{card.set}</Text>
                <Text style={styles.cell}>{card.amount}</Text>
                <Text style={styles.cell}>${card.price}</Text>
              </View>
            ))}
          </View>
      </Box>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 4,
    fontSize: 14,
    color: 'white',
  },
  header: {
    fontWeight: 'bold',
    color: '#FFD700',
  },
});
