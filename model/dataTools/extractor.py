import json
import csv

json_file_path = "all-cards.json"  # Assuming the downloaded file is named this

try:
    with open(json_file_path, 'r', encoding='utf-8') as f:
        all_cards_data = json.load(f)

    print(f"Successfully loaded JSON data. Number of cards: {len(all_cards_data)}")

    # Now you can proceed to convert it to CSV as shown in the previous example.
    csv_file_path = "all_cards.csv"

    if all_cards_data:
        # Get the headers from the first card object (you might want to customize these)
        headers = all_cards_data[0].keys()

        with open('card_images.csv', 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['id', 'image_uris']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            for card_data in all_cards_data:
                # The DictWriter will automatically select only the 'id' and 'image_uris'
                # if they exist in the 'card_data' dictionary. If 'image_uris' is a
                # nested dictionary, you might need to adjust how you access the image URL.
                writer.writerow({'id': card_data.get('id'), 'image_uris': card_data.get('image_uris')})

        print(f"Successfully converted bulk JSON data to {csv_file_path}")
    else:
        print("No card data found in the JSON file.")

except FileNotFoundError:
    print(f"Error: File not found at {json_file_path}")
except json.JSONDecodeError:
    print("Error: Could not decode the JSON data. It might not be a valid JSON file.")
except Exception as e:
    print(f"An unexpected error occurred: {e}")
