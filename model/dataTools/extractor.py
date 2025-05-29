import csv
import os

input_csv_file_path = "englishCards.csv"  # Assuming your input is now a CSV file
output_csv_file_path = "englishIDImages.csv" # Output CSV file

try:
    # Check if the input CSV file exists
    if not os.path.exists(input_csv_file_path):
        print(f"Error: Input CSV file not found at '{input_csv_file_path}'")
    else:
        all_cards_data = []
        with open(input_csv_file_path, 'r', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)
            for row in reader:
                all_cards_data.append(row)

        print(f"Successfully loaded CSV data. Number of cards: {len(all_cards_data)}")

        if all_cards_data:
            # Define the fieldnames for the output CSV
            fieldnames = ['id', 'image_uris']

            with open(output_csv_file_path, 'w', newline='', encoding='utf-8') as outfile:
                writer = csv.DictWriter(outfile, fieldnames=fieldnames)

                writer.writeheader() # Write the header row to the output CSV

                for card_data in all_cards_data:
                    # Extract 'id' and 'image_uris' from each row.
                    # .get() is used for safety, in case a row doesn't have these keys.
                    card_id = card_data.get('id')
                    image_uris = card_data.get('image_uris')

                    # If 'image_uris' is potentially a string representation of a dict/list
                    # from the CSV, you might need to evaluate it using json.loads()
                    # However, if it's already a simple URL string, this is fine.
                    # For example:
                    # if image_uris and isinstance(image_uris, str) and image_uris.strip().startswith('{'):
                    #     try:
                    #         image_uris = json.loads(image_uris).get('png') # or 'art_crop', etc.
                    #     except json.JSONDecodeError:
                    #         pass # Keep as is if not a valid JSON string

                    writer.writerow({'id': card_id, 'image_uris': image_uris})

            print(f"Successfully extracted 'id' and 'image_uris' to '{output_csv_file_path}'")
        else:
            print("No card data found in the input CSV file.")

except Exception as e:
    print(f"An unexpected error occurred: {e}")