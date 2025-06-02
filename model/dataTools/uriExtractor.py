import pandas as pd
import json
import re  # Import the regular expression module

def extract_png_uri(input_csv, output_csv):
    try:
        df = pd.read_csv(input_csv)
    except FileNotFoundError:
        print(f"Error: Input file '{input_csv}' not found.")
        return

    def fix_json_string(json_string):
        # Try to replace single quotes with double quotes for keys and values
        fixed_string = json_string.replace("'", '"')
        # Remove any trailing commas within objects
        fixed_string = re.sub(r',\s*}', '}', fixed_string)
        fixed_string = re.sub(r',\s*]', ']', fixed_string)
        return fixed_string.strip() # Remove leading/trailing whitespace

    def get_png(image_uris_value):
        if isinstance(image_uris_value, str):
            cleaned_string = fix_json_string(image_uris_value)
            try:
                image_uris_dict = json.loads(cleaned_string)
                png_link = image_uris_dict.get('png')
                print(f"Processed (after fix): {cleaned_string}, PNG Link: {png_link}") # Debug print
                return png_link
            except json.JSONDecodeError as e:
                print(f"JSON Decode Error for (after fix): {cleaned_string}, Error: {e}") # Debug print
                return None
        else:
            print(f"Not a string: {image_uris_value}, Type: {type(image_uris_value)}") # Debug print
            return None

    df['png_uri'] = df['image_uris'].apply(get_png)
    df_output = df.drop(columns=['image_uris'])
    df_output.to_csv(output_csv, index=False)
    print(f"Successfully extracted PNG URIs and saved to '{output_csv}'")

if __name__ == "__main__":
    input_file = 'englishCards.csv'
    output_file = 'english-png.csv'
    extract_png_uri(input_file, output_file)