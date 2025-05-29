import csv
import json # Still needed for JSONDecodeError if you want to be robust
import os
import ast # New import for literal_eval

def extract_png_uris_from_csv_ast(input_csv_path, output_csv_path):
    """
    Reads a CSV file with 'id' and 'image_uris' columns,
    attempts to parse 'image_uris' using ast.literal_eval (for Python dict-like strings),
    extracts the 'png' attribute, and saves 'id' and the 'png' URI to a new CSV file.
    """
    extracted_data = []
    processed_count = 0
    skipped_count = 0

    if not os.path.exists(input_csv_path):
        print(f"Error: Input CSV file not found at '{input_csv_path}'")
        return

    try:
        with open(input_csv_path, 'r', newline='', encoding='utf-8') as infile:
            reader = csv.DictReader(infile)

            print(f"DEBUG: Headers found in input CSV: {reader.fieldnames}")
            if 'id' not in reader.fieldnames or 'image_uris' not in reader.fieldnames:
                print(f"Error: Input CSV must contain 'id' and 'image_uris' columns.")
                print(f"Please ensure exact spelling and case matching. Found: {reader.fieldnames}")
                return

            line_num = 1
            for row in reader:
                line_num += 1
                card_id = row.get('id')
                image_uris_str = row.get('image_uris')
                png_uri = None

                if card_id is None:
                    print(f"DEBUG: Skipping row {line_num}: 'id' column is missing or empty.")
                    skipped_count += 1
                    continue

                if image_uris_str is None or image_uris_str.strip() == '':
                    print(f"DEBUG: Skipping row {line_num} (ID: {card_id}): 'image_uris' column is empty or missing.")
                    skipped_count += 1
                    continue

                try:
                    # Attempt to parse using ast.literal_eval
                    image_uris_dict = ast.literal_eval(image_uris_str)

                    if isinstance(image_uris_dict, dict):
                        png_uri = image_uris_dict.get('png')

                        if png_uri is None:
                            print(f"DEBUG: Skipping row {line_num} (ID: {card_id}): 'png' attribute not found in parsed dictionary: {image_uris_dict}")
                            skipped_count += 1
                            continue
                    else:
                        print(f"DEBUG: Skipping row {line_num} (ID: {card_id}): 'image_uris' content was not a dictionary after parsing. Value: '{image_uris_str}'.")
                        skipped_count += 1
                        continue

                except (ValueError, SyntaxError) as e:
                    print(f"DEBUG: Skipping row {line_num} (ID: {card_id}): Could not parse 'image_uris' with ast.literal_eval. Error: {e}. Value: '{image_uris_str}'.")
                    skipped_count += 1
                    continue
                except Exception as e:
                    print(f"DEBUG: Skipping row {line_num} (ID: {card_id}): An unexpected error occurred during parsing: {e}. Value: '{image_uris_str}'.")
                    skipped_count += 1
                    continue

                extracted_data.append({'id': card_id, 'png_uri': png_uri})
                processed_count += 1

        if not extracted_data:
            print("\nRESULT: No valid 'id' and 'png' URI pairs were extracted.")
        else:
            with open(output_csv_path, 'w', newline='', encoding='utf-8') as outfile:
                fieldnames = ['id', 'png_uri']
                writer = csv.DictWriter(outfile, fieldnames=fieldnames)

                writer.writeheader()
                writer.writerows(extracted_data)

            print(f"\nRESULT: Successfully extracted data to '{output_csv_path}'.")

        print(f"Summary: Processed {processed_count} entries. Skipped {skipped_count} entries.")

    except Exception as e:
        print(f"An unexpected error occurred during file processing: {e}")

if __name__ == "__main__":
    input_csv_path_ast = "englishIDImages.csv"
    output_csv_path_ast = "english-png.csv"
    extract_png_uris_from_csv_ast(input_csv_path_ast, output_csv_path_ast)