import pandas as pd
from PIL import Image
from io import BytesIO
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
from torch.utils.data import Dataset, DataLoader
import os

class ImageIdDataset(Dataset):
    def __init__(self, df, transform=None):
        """
        Args:
            df (pd.DataFrame): DataFrame containing image information.
            transform (callable, optional): Optional transform to be applied
                on a sample.
        """
        self.df = df
        self.transform = transform
        self.unique_ids = self.df['id'].unique()
        self.id_to_label = {id: i for i, id in enumerate(self.unique_ids)}
        self.image_paths = [
            os.path.join("downloaded_images", uri) for uri in self.df['png_uri']
        ]  # Store image paths

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        image_path = self.image_paths[idx]  # Get from stored paths
        image = self._load_and_process_image(image_path)
        image_id = self.df.iloc[idx]['id']
        label = self.id_to_label[image_id]
        return image, torch.tensor(label).long()

    def _load_and_process_image(self, uri):
        try:
            image = Image.open(BytesIO(open(uri, 'rb').read())).convert('RGB')
            if self.transform:
                image = self.transform(image)
            return image
        except Exception as e:
            print(f"Error loading image for {uri}: {e}")
            return None  # Return None on error, but handle it in training loop


def train_model(
    dataloader, model, criterion, optimizer, num_epochs, start_epoch=0
):  # Added start_epoch
    for epoch in range(
        start_epoch, num_epochs
    ):  # Start from start_epoch, important for retraining
        for i, (batch_images, batch_labels) in enumerate(dataloader):
            # Filter out None values from the batch
            valid_indices = [
                j for j, img in enumerate(batch_images) if img is not None
            ]
            if not valid_indices:
                print("Warning: Skipping batch with no valid images.")
                continue
            # Select only the valid images and labels
            images = torch.stack([batch_images[j] for j in valid_indices])
            labels = batch_labels[torch.tensor(valid_indices)].long()

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            # Print training progress
            if (i + 1) % 100 == 0:
                print(
                    f"Epoch [{epoch + 1}/{num_epochs}], Step [{i + 1}/{len(dataloader)}], Loss: {loss.item():.4f}"
                )
        print(f"Epoch [{epoch + 1}/{num_epochs}] finished.")

    print('Finished Training')



if __name__ == '__main__':
    # Load your DataFrame
    df = pd.read_csv('test_data.csv')  # Replace 'your_data.csv'
    #print(df.head()) #debug

    # Define image transformations.  Consider adding more transforms.
    transform = transforms.Compose(
        [
            transforms.Resize((224, 224)),  # Ensure consistent size
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
            ),  # Standard normalization
        ]
    )

    # Create the dataset
    dataset = ImageIdDataset(df, transform=transform)
    #print(f"Dataset size: {len(dataset)}") #debug

    # Create the dataloader
    dataloader = DataLoader(dataset, batch_size=32, shuffle=True)
    #print(f"Number of batches: {len(dataloader)}") #debug

    # Load a pre-trained CNN (e.g., ResNet-18) and modify the classifier
    model = models.resnet18(pretrained=True)
    num_ftrs = model.fc.in_features
    num_classes = len(dataset.unique_ids)  # Number of unique IDs
    model.fc = nn.Linear(num_ftrs, num_classes)
    #print(f"Number of classes: {num_classes}") #debug

    # Define loss function and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(
        model.parameters(), lr=0.0001
    )  # Consider a lower learning rate

    # Load the model state if retraining
    start_epoch = 0
    if os.path.exists('image_id_model.pth'):
        model.load_state_dict(torch.load('image_id_model.pth'))
        print("Loaded existing model state for retraining.")
        # Optionally load optimizer state.  Requires you to have saved it.
        # if os.path.exists('optimizer_state.pth'):
        #    optimizer.load_state_dict(torch.load('optimizer_state.pth'))
        #    print("Loaded optimizer state.")
        # Determine starting epoch if it's in the filename
        # try:
        #     start_epoch = int(os.path.splitext(os.path.basename('image_id_model.pth'))[0].split('_epoch_')[-1]) + 1
        #     print(f"Starting from epoch {start_epoch}")
        # except:
        #     print("Epoch information not found in model filename.  Starting from epoch 0.")
        #     start_epoch = 0
    else:
        print("Starting training from scratch.")

    # Train the model
    num_epochs = 10  # Adjust as needed.  10 is a minimum for demonstration.
    train_model(
        dataloader, model, criterion, optimizer, num_epochs, start_epoch
    )  # Pass start_epoch

    # Save the trained model
    torch.save(model.state_dict(), 'image_id_model.pth')
    print("Trained Model Saved")
    # Optionally save optimizer state
    # torch.save(optimizer.state_dict(), 'optimizer_state.pth')
    # print("Optimizer state saved.")
