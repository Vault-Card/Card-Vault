import csv

def find_difference_and_write_csv(master_csv, subset_csv, output_csv):
    """
    Finds the entries in the master CSV file that are not present in the subset CSV file
    based on the 'id' column, and writes the differing entries to a new CSV file.

    Args:
        master_csv (str): Path to the master CSV file.
        subset_csv (str): Path to the subset CSV file.
        output_csv (str): Path to the output CSV file where the difference will be written.
    """
    master_data = {}
    subset_data = {}

    try:
        # Read the master CSV file into a dictionary, using 'id' as the key.
        with open(master_csv, 'r', encoding='utf-8') as master_file:
            reader = csv.DictReader(master_file)
            if not reader.fieldnames or 'id' not in reader.fieldnames or 'png_uri' not in reader.fieldnames:
                print(f"Error: 'id' or 'png_uri' column not found in master CSV file: {master_csv}")
                return
            for row in reader:
                master_data[row['id']] = row['png_uri']

        # Read the subset CSV file into a dictionary, using 'id' as the key.
        with open(subset_csv, 'r', encoding='utf-8') as subset_file:
            reader = csv.DictReader(subset_file)
            if not reader.fieldnames or 'id' not in reader.fieldnames or 'png_uri' not in reader.fieldnames:
                print(f"Error: 'id' or 'png_uri' column not found in subset CSV file: {subset_csv}")
                return
            for row in reader:
                subset_data[row['id']] = row['png_uri']
    except FileNotFoundError as e:
        print(f"Error: File not found: {e}")
        return
    except Exception as e:
        print(f"An error occurred while reading CSV files: {e}")
        return

    # Find the difference: entries in master_data but not in subset_data.
    difference_data = {
        k: v for k, v in master_data.items() if k not in subset_data
    }

    # Write the difference to a new CSV file.
    if difference_data:
        try:
            with open(output_csv, 'w', newline='', encoding='utf-8') as output_file:
                writer = csv.writer(output_file)
                writer.writerow(['id', 'png_uri'])  # Write the header row.
                for image_id, png_uri in difference_data.items():
                    writer.writerow([image_id, png_uri])
            print(f"Successfully wrote the difference to '{output_csv}'")
        except Exception as e:
            print(f"An error occurred while writing to the output CSV file: {e}")
    else:
        print("No difference found between the master and subset CSV files.")



if __name__ == "__main__":
    master_csv_file = "test.csv"  # csv of wanted training data
    subset_csv_file = "trainingArchive.csv"  # csv of archived training data
    output_csv_file = "filteredTrainingData.csv"  # csv of filtered training data

    # Create dummy CSV files for testing
    # create_dummy_csv(master_csv_file, [('id1', 'image1.png'), ('id2', 'image2.png'), ('id3', 'image3.png')])
    # create_dummy_csv(subset_csv_file, [('id1', 'image1.png'), ('id3', 'image3.png')])
    find_difference_and_write_csv(master_csv_file, subset_csv_file, output_csv_file)

def create_dummy_csv(filename, data):
    """Creates a dummy CSV file for testing."""
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['id', 'png_uri'])  # header
        writer.writerows(data)
