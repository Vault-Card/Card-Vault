import os
import csv

def create_image_list_csv(image_folder, csv_filename="image_list.csv"):
    """
    Goes through each image in the specified folder, extracts the id and png_uri,
    and writes them to a new CSV file.

    Args:
        image_folder (str): The path to the folder containing the images.
        csv_filename (str, optional): The name of the CSV file to create.
                                     Defaults to "image_list.csv".
    """
    image_data = []
    for filename in os.listdir(image_folder):
        if filename.endswith(".png"):
            image_id = os.path.splitext(filename)[0]
            png_uri = filename
            image_data.append({"id": image_id, "png_uri": png_uri})

    if image_data:
        with open(csv_filename, 'w', newline='') as csvfile:
            fieldnames = ['id', 'png_uri']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

            writer.writeheader()
            writer.writerows(image_data)
        print(f"Successfully created '{csv_filename}' with image information.")
    else:
        print(f"No PNG images found in the folder '{image_folder}'.")

if __name__ == "__main__":
    folder_name = "../downloaded_images"
    create_image_list_csv(folder_name)