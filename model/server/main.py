import os
import uuid
import logging
from io import BytesIO
from PIL import Image
import subprocess
import json
import base64
from flask import Flask, request, Response

app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Set the upload folder.  This is configurable.
UPLOAD_FOLDER = 'uploads'
# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Function to generate a unique filename.  This avoids collisions.
def generate_filename(original_filename=""):
    """
    Generates a unique filename using UUID.  Optionally preserves the extension
    from the original filename, if provided.

    Args:
        original_filename (str, optional): The original filename. Defaults to "".

    Returns:
        str: A unique filename.
    """
    base_name = str(uuid.uuid4())
    if original_filename:
        _, file_extension = os.path.splitext(original_filename)
        return base_name + file_extension
    return base_name

def validate_image(image_bytes):
    """
    Validates if the provided bytes represent a valid image.  Uses PIL to attempt
    to open the image.  Handles common image format errors.

    Args:
        image_bytes (bytes): The image data in bytes.

    Returns:
        bool: True if the image is valid, False otherwise.
    """
    try:
        # Use BytesIO to treat the byte data as a file
        img = Image.open(BytesIO(image_bytes))
        # Attempt to load the image data to further validate it.
        img.load()
        return True
    except (OSError, IOError) as e:
        logging.error(f"Invalid image data: {e}")
        return False
    except Exception as e:
        logging.error(f"Error validating image: {e}")
        return False

@app.route('/uploads', methods=['POST'])
def upload_image():
    """
    Handles PUT requests to upload images.  The image data should be in the
    request body as raw bytes.  Validates the image data, saves it to the
    server's filesystem, and returns a JSON response with the filename.
    """
    if request.method == 'POST':
        # Check if data is present in the request
        if not request.is_json:
            logging.error("Request should be JSON")
            return Response("Request should be JSON", status=400)

        data = request.get_json()
        image_base64 = data.get('image_data')

        # Check if 'image_data' is present in the JSON
        if not image_base64:
            logging.error("No 'image_data' field found in the JSON")
            return Response("No 'image_data' provided in JSON", status=400)

        try:
            # Decode the Base64 string to bytes
            image_data = base64.b64decode(image_base64)
        except base64.binascii.Error as e:
            logging.error(f"Error decoding Base64 string: {e}")
            return Response("Invalid Base64 encoded data", status=400)

        # Validate the image data.  Reject non-image data.
        if not validate_image(image_data):
            return Response("Invalid image data", status=400)
        try:
            # Generate a unique filename for the image
            filename = generate_filename()
            filepath = os.path.join(UPLOAD_FOLDER, filename)

            # Write the image data to a file
            with open(filepath, 'wb') as f:
                f.write(image_data)

            logging.info(f"Image saved successfully to {filepath}")
            # Construct the URL.  This is important for the client to know where the image is.
            try:
                # Construct the absolute path to agent.py
                agent_path = os.path.abspath('agent.py')
                logging.info(f"Agent script path: {agent_path}")  # Debugging
                # Use subprocess.run for better control and error handling
                result = subprocess.run(
                    ['python', agent_path, filepath],  # Use the absolute path
                    check=True,  # Raise an exception for non-zero exit codes
                    capture_output=True,  # Capture stdout and stderr
                    text=True,  # Return stdout and stderr as strings
                )
                logging.info(f"Agent executed successfully. Output:\n{result.stdout}")
                # You can now use result.stdout to get information from the agent
                #  For example, the agent could return a JSON string with processing results.
                file_url = f"/uploads/{filename}"
                try:
                    os.remove(filepath)
                    logging.info(f"Deleted uploaded image: {filepath}")
                except Exception as e:
                    logging.error(f"Error deleting uploaded image: {e}")
                agent_response = json.loads(result.stdout)
                if agent_response["status"] == "success":
                    return {
                        "message": "Image uploaded and processed successfully",
                        "filename": filename,
                        "id": agent_response["id"]  # Use the ID from the agent
                    }, 201
                else:
                    logging.error(f"Agent reported error: {agent_response['message']}")
                    return Response(agent_response["message"], 500)

            except subprocess.CalledProcessError as e:
                logging.error(f"Agent execution failed: {e}")
                logging.error(f"Agent stderr:\n{e.stderr}")  # Log the error output from the agent
                return Response(f"Agent execution failed: {e.stderr}", status=500)
            except FileNotFoundError:
                logging.error("agent.py not found.  Make sure it's in the same directory.")
                return Response("Agent script not found", status=500)

        except Exception as e:
            logging.error(f"Error saving image: {e}")
            return Response(f"Error saving image: {e}", status=500)
    else:
        return Response("Invalid method.  Use POST", status=405)

#  Flask security notes:
#  * This is a basic example and does not include any authentication or authorization.
#  * In a production environment, you should add appropriate security measures.
#  * Consider using a library like Flask-Security or similar.
#  * Ensure that the upload folder is not directly accessible from the web.  Use a separate
#    mechanism (e.g., a dedicated route or a different server) to serve the uploaded files.
#  * The provided URL is a *relative* URL.  You'll need to prepend your server's base URL
#    on the client-side to construct the full URL.

if __name__ == '__main__':
    #  Run the Flask development server.  For production, use a proper WSGI server (e.g., gunicorn).
    app.run(debug=True, host='0.0.0.0', port=5000)
