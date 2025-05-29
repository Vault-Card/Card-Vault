import pandas as pd
from PIL import Image
from io import BytesIO
import time
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
from torch.utils.data import Dataset, DataLoader

class ImageIdDataset(Dataset):
    def __init__(self, df, transform=None):
        self.df = df
        self.transform = transform
        self.unique_ids = self.df['id'].unique()
        self.id_to_label = {id: i for i, id in enumerate(self.unique_ids)}
        self.valid_indices = []
        for idx in range(len(self.df)):
            if self._load_and_process_image(self.df.iloc[idx]['png_uri']) is not None:
                self.valid_indices.append(idx)

    def __len__(self):
        return len(self.valid_indices)

    def __getitem__(self, idx):
        original_index = self.valid_indices[idx]
        png_uri = self.df.iloc[original_index]['png_uri']
        image = self._load_and_process_image(png_uri)
        image_id = self.df.iloc[original_index]['id']
        label = self.id_to_label[image_id] # Get the integer label
        return image, torch.tensor(label).long() # Ensure label is a LongTensor

    def _load_and_process_image(self, uri):
        try:
            image = Image.open(BytesIO(open(f"downloaded_images/{uri}", 'rb').read())).convert('RGB')
            if self.transform:
                image = self.transform(image)
            return image
        except Exception as e:
            print(f"Error loading image for {uri}: {e}")
            return None

def train_model(dataloader, model, criterion, optimizer, num_epochs):
    for epoch in range(num_epochs):
        for i, (batch_images, batch_labels) in enumerate(dataloader): # Renamed for clarity
            # Filter out None values from the batch
            valid_indices = [j for j, img in enumerate(batch_images) if img is not None]
            if not valid_indices:
                print("Warning: Skipping batch with no valid images.")
                continue

            # Select only the valid images and labels
            images = torch.stack([batch_images[j] for j in valid_indices])
            labels = batch_labels[torch.tensor(valid_indices)].long() # Convert list to a LongTensor

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            # Print training progress
            if (i + 1) % 100 == 0:
                print(f'Epoch [{epoch + 1}/{num_epochs}], Step [{i + 1}/{len(dataloader)}], Loss: {loss.item():.4f}')

    print('Finished Training')

if __name__ == '__main__':
    # Load your DataFrame
    df = pd.read_csv('test_data.csv') # Replace 'your_data.csv'

    # Define image transformations
    transform = transforms.Compose([
        transforms.Resize((313, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    # Create the dataset
    dataset = ImageIdDataset(df, transform=transform)

    # Create the dataloader
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)

    # Load a pre-trained CNN (e.g., ResNet-18) and modify the classifier
    model = models.resnet18(pretrained=True)
    num_ftrs = model.fc.in_features
    num_classes = len(dataset.unique_ids) # Number of unique IDs
    model.fc = nn.Linear(num_ftrs, num_classes)

    # Define loss function and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

    # Train the model
    num_epochs = 5 # Adjust as needed
    train_model(dataloader, model, criterion, optimizer, num_epochs)

    # Save the trained model
    torch.save(model.state_dict(), 'image_id_model.pth')