import pandas as pd
import requests
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

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        png_uri = self.df.iloc[idx]['png_uri']
        image = self._load_and_process_image(png_uri)
        image_id = self.df.iloc[idx]['id']
        return image, image_id

    def _load_and_process_image(self, uri):
        time.sleep(0.1)  # Respect the 100ms delay
        try:
            response = requests.get(uri, stream=True)
            response.raise_for_status()
            image = Image.open(BytesIO(response.content)).convert('RGB')
            if self.transform:
                image = self.transform(image)
            return image
        except requests.exceptions.RequestException as e:
            print(f"Error downloading image from {uri}: {e}")
            return None # Handle potential download errors

def train_model(dataloader, model, criterion, optimizer, num_epochs):
    for epoch in range(num_epochs):
        for i, (images, labels) in enumerate(dataloader):
            # Handle cases where image loading failed
            images = images.dropna()
            labels = labels[~torch.isnan(images.sum(dim=(1,2,3)))] # Remove corresponding labels

            if images.size(0) == 0:
                continue

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            # Print training progress
            if (i+1) % 100 == 0:
                print(f'Epoch [{epoch+1}/{num_epochs}], Step [{i+1}/{len(dataloader)}], Loss: {loss.item():.4f}')

    print('Finished Training')

if __name__ == '__main__':
    # Load your DataFrame
    df = pd.read_csv('your_data.csv') # Replace 'your_data.csv'

    # Define image transformations
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
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
    num_classes = df['id'].nunique() # Number of unique IDs
    model.fc = nn.Linear(num_ftrs, num_classes)

    # Define loss function and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)

    # Train the model
    num_epochs = 5 # Adjust as needed
    train_model(dataloader, model, criterion, optimizer, num_epochs)

    # Save the trained model
    torch.save(model.state_dict(), 'image_id_model.pth')