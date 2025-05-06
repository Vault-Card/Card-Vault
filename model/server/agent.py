import torch
import torchvision.transforms as transforms
from PIL import Image
from io import BytesIO
import requests
import sys
import logging
import json

# Define the device (CPU or GPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load the trained model
def load_model(model_path, num_classes):
    """Loads the trained PyTorch model.

    Args:
        model_path (str): Path to the saved model file (.pth).
        num_classes (int): The number of unique IDs (output classes).

    Returns:
        torch.nn.Module: The loaded PyTorch model.
    """
    # Import the model definition.  This is CRUCIAL.  The model
    # architecture must be defined *exactly* the same way as it was
    # during training.  This code cannot guess your model structure.
    #  For this example, I'm assuming it's a ResNet-18, but YOU MUST
    #  REPLACE THIS with your actual model definition.
    import torchvision.models as models
    model = models.resnet18(pretrained=False) # Important: pretrained=False
    num_ftrs = model.fc.in_features
    model.fc = torch.nn.Linear(num_ftrs, num_classes).to(device)  # Move to the correct device
    model.load_state_dict(torch.load(model_path, map_location=device)) # Load state dict and map to device
    model.eval()  # Set to evaluation mode
    return model

# Preprocess the image
def preprocess_image(image_bytes):
    """Preprocesses the image data for the model.

    Args:
        image_bytes (bytes): The raw bytes of the image data.

    Returns:
        torch.Tensor: The preprocessed image tensor.  Returns None on error.
    """
    try:
        image = Image.open(BytesIO(image_bytes)).convert('RGB')
    except Exception as e:
        print(f"Error opening image: {e}")
        return None

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    return transform(image).unsqueeze(0).to(device)  # Add batch dimension and move to device

def predict_id(model, image_bytes, id_to_label):
    """Predicts the ID from the given image data.

    Args:
        model (torch.nn.Module): The trained PyTorch model.
        image_bytes (bytes): The raw bytes of the image data.
        id_to_label (dict): A mapping from numerical ID to original ID.

    Returns:
        str: The predicted ID, or None on error.
    """
    preprocessed_image = preprocess_image(image_bytes)
    if preprocessed_image is None:
        return None  # Error was already printed by preprocess_image

    with torch.no_grad():
        outputs = model(preprocessed_image)
        _, predicted = torch.max(outputs, 1)
        predicted_id_num = predicted.item()
    if predicted_id_num in id_to_label:
        return id_to_label[predicted_id_num]
    else:
        print(f"Error: Predicted ID {predicted_id_num} not found in id_to_label mapping.")
        return None

def create_id_to_label_mapping(df):
    """Creates a mapping from numerical ID (0, 1, 2, ...) to the original ID.

    This is crucial because your model outputs a numerical index,
    not the original ID.  This mapping is created from your original
    dataframe.

    Args:
      df (pd.DataFrame):  The dataframe containing the 'id' column.

    Returns:
      dict: A dictionary mapping numerical ID to original ID.
    """
    unique_ids = df['id'].unique()
    id_to_label = {i: label for i, label in enumerate(unique_ids)}
    return id_to_label

def load_data(csv_path):
  """Loads the data and returns the dataframe.

  Args:
    csv_path (str): Path to the CSV file.

  Returns:
    pd.DataFrame: The dataframe.
  """
  import pandas as pd
  return pd.read_csv(csv_path)

def get_image_bytes_from_url(url):
    """Downloads the image from the URL and returns the image bytes.

    Args:
        url (str): The URL of the image.

    Returns:
        bytes: The image bytes, or None on error.
    """
    """
    try:
        # response = requests.get(url)
        # response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
        return url
    except requests.exceptions.RequestException as e:
        print(f"Error downloading image from {url}: {e}")
        return None
    """    
    with open(url, 'rb') as f:
        image_bytes = f.read()

    try:
        return image_bytes
    except:
        print(f"Error handling image at {url}")
        return None
    

def main(model_path, csv_path, image_path):
    """Main function to run the agent.

    Args:
        model_path (str): Path to the saved model file (.pth).
        csv_path (str): Path to the CSV file containing the data.
        image_url (str): The URL of the image to predict.
    """

    # Load data to create the id_to_label mapping
    df = load_data(csv_path)
    id_to_label = create_id_to_label_mapping(df)
    num_classes = len(id_to_label)

    # Load the model
    model = load_model(model_path, num_classes)

    # Get image bytes from URL
    image_bytes = get_image_bytes_from_url(image_url)
    if image_bytes is None:
        print("Failed to get image bytes. Exiting.")
        return

    # Predict the ID
    predicted_id = predict_id(model, image_bytes, id_to_label)
    if predicted_id:
        # print(f"predicted ID: {predicted_id}")
        print(json.dumps({"status": "success", "id": predicted_id}))
    else:
        print("Failed to predict ID.")

if __name__ == '__main__':
    
    if len(sys.argv) != 2:
        logging.error("Usage: agent.py <image_file_path>")
        sys.exit(1)

    image_url = sys.argv[1]
    logging.info(f"Agent started. Processing image: {image_url}")

    model_path = 'image_id_model.pth'  # Path to your saved model
    csv_path = 'test_data.csv'  # Path to your CSV file
    image_url = 'image_file_path'  # Replace with a real image URL for testing

    main(model_path, csv_path, image_url)
    