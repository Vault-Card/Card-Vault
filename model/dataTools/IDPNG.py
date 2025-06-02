import pandas as pd

def transform_png_uri(input_csv_path, output_csv_path):
    """
    Reads a CSV file, transforms the 'png_uri' column based on the 'ID' column,
    and saves the modified data to a new CSV file.

    Args:
        input_csv_path (str): The path to the input CSV file.
        output_csv_path (str): The path where the modified CSV file will be saved.
    """
    try:
        # Read the CSV file into a pandas DataFrame
        df = pd.read_csv(input_csv_path)

        # Check if 'ID' and 'png_uri' columns exist
        if 'id' not in df.columns:
            print(f"Error: 'id' column not found in {input_csv_path}")
            return
        if 'png_uri' not in df.columns:
            print(f"Error: 'png_uri' column not found in {input_csv_path}")
            return

        # Apply the transformation: change png_uri to ID.png
        # Ensure 'ID' column is treated as string to avoid issues with non-string IDs
        df['png_uri'] = df['id'].astype(str) + '.png'

        # Save the modified DataFrame to a new CSV file
        df.to_csv(output_csv_path, index=False)
        print(f"Successfully transformed '{input_csv_path}' and saved to '{output_csv_path}'")

    except FileNotFoundError:
        print(f"Error: Input file not found at '{input_csv_path}'")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# Now run the transformation on the dummy file
transform_png_uri('english-png.csv', 'english-png-only.csv')
