import requests
import base64

# Endpoint for your Flask server
url = "http://ec2-3-14-27-78.us-east-2.compute.amazonaws.com:5000/uploads"

# Load image and encode as base64 string
with open("me.jpeg", "rb") as image_file:
    image_bytes = image_file.read()
    image_b64 = base64.b64encode(image_bytes).decode('utf-8')

# Send the image as JSON
headers = {"Content-Type": "application/json"}
payload = {"image_data": image_b64}
response = requests.post(url, json=payload, headers=headers)

# Print the server's response
print("Status Code:", response.status_code)
print("Response:", response.text)
