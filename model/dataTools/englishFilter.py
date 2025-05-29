import json
import csv
import os

def filter_json_to_csv(json_filepath, output_csv_filepath):
    """
    Reads a JSON file, filters entries where 'lang' is 'en',
    and writes the filtered entries to a CSV file.

    Args:
        json_filepath (str): The path to the input JSON file.
        output_csv_filepath (str): The path for the output CSV file.
    """
    filtered_entries = []

    # 1. Check if the JSON file exists
    if not os.path.exists(json_filepath):
        print(f"Error: JSON file not found at '{json_filepath}'")
        return

    try:
        # 2. Read the JSON file
        with open(json_filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Ensure data is a list of dictionaries, or handle if it's a single dictionary
        if isinstance(data, dict):
            # If it's a single dictionary, wrap it in a list for consistent processing
            data = [data]
        elif not isinstance(data, list):
            print(f"Warning: JSON data is not a list or dictionary. Skipping processing.")
            return

        # 3. Iterate through the JSON entries and filter
        for entry in data:
            if isinstance(entry, dict) and entry.get('lang') == 'en':
                filtered_entries.append(entry)

        if not filtered_entries:
            print("No entries with 'lang': 'en' found in the JSON file.")
            return

        # Determine all unique headers (keys) from the filtered entries
        all_headers = set()
        for entry in filtered_entries:
            all_headers.update(entry.keys())
        # Convert to a list and sort for consistent column order
        headers = sorted(list(all_headers))

        # 4. Write the filtered entries to a CSV file
        with open(output_csv_filepath, 'w', newline='', encoding='utf-8') as csv_file:
            writer = csv.DictWriter(csv_file, fieldnames=headers)

            writer.writeheader() # Write the header row
            writer.writerows(filtered_entries) # Write all filtered data rows

        print(f"Successfully filtered entries and saved to '{output_csv_filepath}'")

    except json.JSONDecodeError:
        print(f"Error: Could not decode JSON from '{json_filepath}'. Please ensure it's a valid JSON file.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    my_json_file = "../../../../Users/kauer/OneDrive/Desktop/data/all-cards.json"
    my_output_csv = "englishCards.csv"
    filter_json_to_csv(my_json_file, my_output_csv)