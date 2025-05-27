import requests

# Endpoint for your Flask server
url = "http://ec2-3-14-27-78.us-east-2.compute.amazonaws.com:5000/uploads"

# Load image as raw bytes
with open("me.jpeg", "rb") as image_file:
    image_bytes = image_file.read()

# Send the image as raw binary data
headers = {"Content-Type": "application/octet-stream"}
response = requests.post(url, data=image_bytes, headers=headers)

# Print the server's response
print("Status Code:", response.status_code)
print("Response:", response.text)
