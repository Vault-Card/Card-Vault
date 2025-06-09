import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  TextInput,
} from "react-native";

const mockCardData = [
  {
    id: "1",
    img: "https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg?1614638838",
    name: "Black Lotus",
    numberOfListings: 3,
    averagePrice: 90000,
    rarity: "Rare",
    listings: [
      { condition: "NM", username: "vintageMTG", price: 95000, quantity: 1 },
      { condition: "LP", username: "powernine", price: 89000, quantity: 1 },
      { condition: "MP", username: "oldschooler", price: 87000, quantity: 1 },
    ],
  },
  {
    id: "2",
    img: "https://cards.scryfall.io/large/front/2/3/2398892d-28e9-4009-81ec-0d544af79d2b.jpg?1614638829",
    name: "Ancestral Recall",
    numberOfListings: 2,
    averagePrice: 20000,
    rarity: "Rare",
    listings: [
      { condition: "NM", username: "bluewizard", price: 22000, quantity: 1 },
      { condition: "LP", username: "timetwister", price: 18000, quantity: 1 },
    ],
  },
  {
    id: "3",
    img: "https://cards.scryfall.io/large/front/7/0/70901356-3266-4bd9-aacc-f06c27271de5.jpg?1614638832",
    name: "Time Walk",
    numberOfListings: 2,
    averagePrice: 18000,
    rarity: "Rare",
    listings: [
      { condition: "NM", username: "oldschooler", price: 20000, quantity: 1 },
      { condition: "SP", username: "moxruby", price: 16000, quantity: 1 },
    ],
  },
  {
    id: "4",
    img: "https://cards.scryfall.io/large/front/e/a/ea1feac0-d3a7-45eb-9719-1cdaf51ea0b6.jpg?1614638862",
    name: "Mox Sapphire",
    numberOfListings: 3,
    averagePrice: 11000,
    rarity: "Rare",
    listings: [
      { condition: "NM", username: "moxbox", price: 12000, quantity: 1 },
      { condition: "LP", username: "timetwister", price: 10500, quantity: 1 },
      { condition: "MP", username: "vintageMTG", price: 9500, quantity: 1 },
    ],
  },
  {
    id: "5",
    img: "https://cards.scryfall.io/large/front/5/f/5f6927e1-c580-483a-8e2a-6e2deb74800e.jpg?1614638844",
    name: "Mox Jet",
    numberOfListings: 2,
    averagePrice: 11500,
    rarity: "Rare",
    listings: [
      { condition: "LP", username: "underground", price: 12000, quantity: 1 },
      { condition: "MP", username: "darkritual", price: 11000, quantity: 1 },
    ],
  },
  {
    id: "6",
    img: "https://cards.scryfall.io/large/front/4/5/45fd6e91-df76-497f-b642-33dc3d5f6a5a.jpg?1682386918",
    name: "Mox Ruby",
    numberOfListings: 2,
    averagePrice: 9800,
    rarity: "Rare",
    listings: [
      { condition: "NM", username: "firebreather", price: 11000, quantity: 1 },
      { condition: "SP", username: "goblinfan", price: 8500, quantity: 1 },
    ],
  },
  {
    id: "7",
    img: "https://cards.scryfall.io/large/front/6/9/69daba76-96e8-4bcc-ab79-2f00189ad8fb.jpg?1619398799",
    name: "Tarmogoyf",
    numberOfListings: 4,
    averagePrice: 420,
    rarity: "Mythic",
    listings: [
      { condition: "NM", username: "modernmaster", price: 460, quantity: 1 },
      { condition: "LP", username: "greendevotion", price: 400, quantity: 1 },
      { condition: "SP", username: "elfball", price: 390, quantity: 1 },
      { condition: "MP", username: "golgari", price: 350, quantity: 1 },
    ],
  },
  {
    id: "8",
    img: "https://cards.scryfall.io/large/front/2/4/249db4d4-2542-47ee-a216-e13ffbc2319c.jpg?1673146896",
    name: "Emrakul, the Aeons Torn",
    numberOfListings: 2,
    averagePrice: 60,
    rarity: "Mythic",
    listings: [
      { condition: "NM", username: "eldrazifan", price: 65, quantity: 1 },
      { condition: "LP", username: "annihilator", price: 55, quantity: 1 },
    ],
  },
  {
    id: "9",
    img: "https://cards.scryfall.io/large/front/7/7/77c6fa74-5543-42ac-9ead-0e890b188e99.jpg?1706239968",
    name: "Lightning Bolt",
    numberOfListings: 3,
    averagePrice: 5,
    rarity: "Common",
    listings: [
      { condition: "NM", username: "burnbaby", price: 6, quantity: 2 },
      { condition: "LP", username: "redmage", price: 4, quantity: 1 },
      { condition: "MP", username: "pauperhero", price: 3.5, quantity: 1 },
    ],
  },
  {
    id: "10",
    img: "https://cards.scryfall.io/large/front/f/8/f87cf997-14b5-4a2c-a7d1-34b7de6561a2.jpg?1743206210",
    name: "Swords to Plowshares",
    numberOfListings: 3,
    averagePrice: 6,
    rarity: "Uncommon",
    listings: [
      { condition: "NM", username: "whiteweenie", price: 8, quantity: 2 },
      { condition: "LP", username: "banisher", price: 5, quantity: 1 },
      { condition: "MP", username: "vintageMTG", price: 4.5, quantity: 1 },
    ],
  },
];

export default function Marketplace() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [search, setSearch] = useState("");
    
    // Only show cards that match the search text
    const filteredData = mockCardData.filter(card =>
      card.name.toLowerCase().includes(search.trim().toLowerCase())
    );
  
    const openModal = (card) => {
      setSelectedCard(card);
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
      setSelectedCard(null);
    };
  
    const renderListing = ({ item }) => (
      <View style={styles.listingRow}>
        <Text style={styles.listingCell}>{item.condition}</Text>
        <Text style={styles.listingCell}>{item.username}</Text>
        <Text style={styles.listingCell}>${item.price}</Text>
        <Text style={styles.listingCell}>x{item.quantity}</Text>
      </View>
    );
  
    const renderCard = ({ item }) => (
      <TouchableOpacity onPress={() => openModal(item)}>
        <View style={styles.cardContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={{ uri: item.img }} style={styles.cardImage} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardRarity}>{item.rarity}</Text>
              <Text style={styles.cardPrice}>Avg: ${item.averagePrice}</Text>
              <Text style={styles.cardListings}>Listings: {item.numberOfListings}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  
    return (
      <View style={styles.screen}>
        {/* Search Bar */}
        <TextInput
          style={styles.searchBar}
          placeholder="Search for cards..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {/* Show prompt or filtered results */}
        {search.trim().length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Search for cards</Text>
          </View>
        ) : filteredData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No cards found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
        )}
        {/* Modal for Add to Cart */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {selectedCard && (
                <>
                  <Image source={{ uri: selectedCard.img }} style={styles.modalImage} />
                  <Text style={styles.modalTitle}>{selectedCard.name}</Text>
                  <Text style={styles.modalRarity}>{selectedCard.rarity}</Text>
                  <Text style={styles.modalListings}>
                    Avg: ${selectedCard.averagePrice} | Listings: {selectedCard.numberOfListings}
                  </Text>
                  <View style={styles.listingHeader}>
                    <Text style={styles.listingCell}>Condition</Text>
                    <Text style={styles.listingCell}>Seller</Text>
                    <Text style={styles.listingCell}>Price</Text>
                    <Text style={styles.listingCell}>Qty</Text>
                  </View>
                  <View style={{ maxHeight: 220, width: "100%" }}>
                    <FlatList
                      data={selectedCard.listings}
                      keyExtractor={(_, idx) => idx.toString()}
                      renderItem={renderListing}
                    />
                  </View>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
                    <Button
                      title="Add to Cart"
                      onPress={() => {
                        // You would handle cart logic here
                        closeModal();
                      }}
                    />
                    <Button title="Close" color="#888" onPress={closeModal} />
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: "#f6f8fa" },
    searchBar: {
      height: 44,
      borderRadius: 10,
      backgroundColor: "#fff",
      paddingHorizontal: 16,
      fontSize: 16,
      margin: 16,
      borderWidth: 1,
      borderColor: "#e1e4e8",
    },
    emptyContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    emptyText: {
      fontSize: 18,
      color: "#888",
      fontStyle: "italic",
      marginTop: 24,
    },
    cardContainer: {
      backgroundColor: "#fff",
      borderRadius: 16,
      padding: 16,
      marginBottom: 18,
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
      elevation: 2,
    },
    cardImage: {
      width: 64,
      height: 92,
      borderRadius: 8,
      backgroundColor: "#ddd",
    },
    cardTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 4 },
    cardRarity: { color: "#888", marginBottom: 4 },
    cardPrice: { color: "#348e91", fontWeight: "600" },
    cardListings: { color: "#666", fontSize: 12 },
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: "#fff",
      borderRadius: 18,
      padding: 22,
      width: "86%",
      shadowColor: "#000",
      shadowOpacity: 0.15,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 16,
      elevation: 6,
      alignItems: "center",
    },
    modalImage: {
      width: 90,
      height: 130,
      borderRadius: 10,
      backgroundColor: "#eee",
      marginBottom: 12,
    },
    modalTitle: { fontWeight: "bold", fontSize: 20, marginBottom: 6 },
    modalRarity: { color: "#888", marginBottom: 3 },
    modalListings: { color: "#555", fontSize: 13, marginBottom: 6 },
    listingHeader: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#e1e4e8",
      marginBottom: 4,
      marginTop: 8,
      width: "100%",
    },
    listingRow: { flexDirection: "row", paddingVertical: 5 },
    listingCell: { flex: 1, textAlign: "center", fontSize: 14 },
  });