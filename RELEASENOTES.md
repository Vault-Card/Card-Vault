# Release Notes
6.10.25

## Initial Release - Multicard Scanning, Marketplace, Collection Management

### Overview
Implemented MTG Card Marketplace, Collection Management, Multicard Scanning, Style/UI Changes, Auth.

### Technical Summary
- Card Vault now has user authentication by way of AWS Cognito/Amplify. You can create an account to sign in to manage your personal collections. 
- Multicard Scanning now allows you to save the scanned cards to a personal collection (new tab and style).
- Flask server uses a newly trained PyTorch CNN model to predict multiple card identities.
- Server returns Scryfall IDs to the client.
- Client fetches card images from Scryfall using these IDs.
- Client side handles taking this card information -> getting relevant info from Scryfall -> adding to personal user collection.
- User Collections lets you see which cards, the quantity, price, photo, and description in your personal library.
- Marketplace allows you to browse cards listed by other players, their prices, the quantity, and other relevant information.
  

### Next Steps
- Add real time pricing in marketplace and collections

