import csv
import os
import shutil

def organize_images_by_csv(
    input_csv_path,
    source_image_dir,
    destination_image_dir,
    missing_cards_csv_path
):
    """
    Reads a CSV file, checks for corresponding images in a source directory,
    moves found images to a destination directory, and logs missing cards
    to a separate CSV file.

    Args:
        input_csv_path (str): Path to the input CSV file containing 'id' column.
        source_image_dir (str): Path to the directory where images are currently stored.
        destination_image_dir (str): Path to the directory where found images will be moved.
        missing_cards_csv_path (str): Path for the CSV file to store entries of missing images.
    """
    found_images_count = 0
    missing_images_data = [] # To store rows of cards whose images were not found
    input_csv_headers = [] # To store headers from the input CSV for missing_cards_csv

    print(f"Starting image organization process...")
    print(f"Input CSV: {input_csv_path}")
    print(f"Source Image Directory: {source_image_dir}")
    print(f"Destination Image Directory: {destination_image_dir}")
    print(f"Missing Cards Log: {missing_cards_csv_path}\n")

    # 1. Validate input paths and create necessary directories
    if not os.path.exists(input_csv_path):
        print(f"Error: Input CSV file not found at '{input_csv_path}'")
        return
    if not os.path.isdir(source_image_dir):
        print(f"Error: Source image directory not found at '{source_image_dir}'")
        return

    # Create the destination directory if it doesn't exist
    os.makedirs(destination_image_dir, exist_ok=True)
    print(f"Ensured destination directory '{destination_image_dir}' exists.")

    try:
        # 2. Read the input CSV file
        with open(input_csv_path, 'r', newline='', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)
            input_csv_headers = reader.fieldnames # Capture all headers for the output CSV

            if 'id' not in input_csv_headers:
                print(f"Error: Input CSV must contain an 'id' column. Found headers: {input_csv_headers}")
                return

            line_num = 1 # For debugging and user feedback

            for row in reader:
                line_num += 1 # Increment for current data row
                card_id = row.get('id')

                if card_id is None or card_id.strip() == '':
                    print(f"Warning: Skipping row {line_num} due to missing or empty 'id'. Row data: {row}")
                    missing_images_data.append(row) # Log even if ID is missing
                    continue

                # Construct the full path to the potential image file
                image_filename = f"{card_id}.png"
                source_image_path = os.path.join(source_image_dir, image_filename)
                destination_image_path = os.path.join(destination_image_dir, image_filename)

                # 3. Check if the image exists
                if os.path.exists(source_image_path):
                    try:
                        # 4. Move the image if found
                        shutil.move(source_image_path, destination_image_path)
                        found_images_count += 1
                        # print(f"Moved: '{image_filename}' to '{destination_image_dir}'") # Uncomment for verbose logging
                    except shutil.Error as e:
                        print(f"Error moving '{image_filename}': {e}. Skipping move for this file.")
                        missing_images_data.append(row) # Log as missing if move fails
                    except Exception as e:
                        print(f"An unexpected error occurred while moving '{image_filename}': {e}. Skipping move.")
                        missing_images_data.append(row) # Log as missing if move fails
                else:
                    # 5. Log the entry if the image is not found
                    missing_images_data.append(row)
                    # print(f"Not Found: '{image_filename}' in '{source_image_dir}'") # Uncomment for verbose logging

        print(f"\nFinished processing all entries in '{input_csv_path}'.")
        print(f"Total images found and moved: {found_images_count}")
        print(f"Total entries with missing images: {len(missing_images_data)}")

        # 6. Write the missing cards data to a new CSV file
        if missing_images_data:
            with open(missing_cards_csv_path, 'w', newline='', encoding='utf-8') as outfile:
                # Use the headers from the input CSV to ensure all original columns are preserved
                writer = csv.DictWriter(outfile, fieldnames=input_csv_headers)
                writer.writeheader()
                writer.writerows(missing_images_data)
            print(f"Missing card entries saved to '{missing_cards_csv_path}'.")
        else:
            print("No missing card entries to log. All images found or 'id' was missing.")

    except FileNotFoundError:
        print(f"Error: A file operation failed. Check paths and permissions.")
    except Exception as e:
        print(f"An unexpected error occurred during the process: {e}")

if __name__ == "__main__":
    # --- Configuration ---
    # IMPORTANT: Adjust these paths to match your actual file and directory locations
    INPUT_CSV = "english-png.csv" # e.g., "all_cards_with_ids.csv"
    SOURCE_IMAGES = "downloaded_images"      # e.g., "C:/Users/YourUser/Downloads/scryfall_images"
    DESTINATION_IMAGES = "englishCards" # This directory will be created if it doesn't exist
    MISSING_CARDS_LOG = "cardsToFind.csv"

    organize_images_by_csv(INPUT_CSV, SOURCE_IMAGES, DESTINATION_IMAGES, MISSING_CARDS_LOG)

    print("\nProcess complete. Check the 'englishCards' directory and 'cardsToFind.csv'.")
    # Clean up dummy files/dirs after running example (OPTIONAL)
    # import time
    # time.sleep(1) # Give a moment for files to close
    # if os.path.exists(INPUT_CSV): os.remove(INPUT_CSV)
    # if os.path.exists(MISSING_CARDS_LOG): os.remove(MISSING_CARDS_LOG)
    # if os.path.exists(os.path.join(SOURCE_IMAGES, 'card_001.png')): os.remove(os.path.join(SOURCE_IMAGES, 'card_001.png'))
    # if os.path.exists(os.path.join(SOURCE_IMAGES, 'card_002.png')): os.remove(os.path.join(SOURCE_IMAGES, 'card_002.png'))
    # if os.path.exists(os.path.join(SOURCE_IMAGES, 'card_004.png')): os.remove(os.path.join(SOURCE_IMAGES, 'card_004.png'))
    # if os.path.exists(os.path.join(SOURCE_IMAGES, 'card_006.png')): os.remove(os.path.join(SOURCE_IMAGES, 'card_006.png'))
    # if os.path.exists(SOURCE_IMAGES): os.rmdir(SOURCE_IMAGES)
    # if os.path.exists(DESTINATION_IMAGES):
    #     # Check if directory is empty before removing
    #     if not os.listdir(DESTINATION_IMAGES):
    #         os.rmdir(DESTINATION_IMAGES)
    #     else:
    #         print(f"Not removing '{DESTINATION_IMAGES}' as it contains files.")
