# Release Notes
5.6.25

## Initial Release - Multicard Scanning MVP

### Overview
Implemented basic multicard scanning functionality.

### Technical Summary
- Mobile frontend uses OpenCV to detect rectangles (cards).
- Captured image is sent to a Flask server running on AWS EC2.
- Flask server uses a PyTorch CNN model to predict card identities.
- Server returns Scryfall IDs to the client.
- Client fetches card images from Scryfall using these IDs.

### Next Steps
- Move prediction trigger to a backend Lambda function decoupled from the Flask server and host our model & server on Sagemaker/serverless.
