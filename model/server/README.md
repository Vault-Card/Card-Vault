# Server
A simple server to host the Machine Learning Agent on

## EC2 Address

`http://ec2-3-17-13-127.us-east-2.compute.amazonaws.com:5000/predict`

## Python Dependencies

`torch`

`torchvision`

`Pillow`

`requests`

`flask`

## To Run

`Set Desired IP and Port` - In the last block of code, insert your desired IP and port as parameters in the app.run call. 

`If on Windows` - py main.py

`If on Linux` - python3 main.py

## Requests

`POST` - /uploads - 64 base string (image file)

## Responses

`201` -

~~~

{
  "filename": "name assigned by server",
  "id": "card id predicted by model",
  "message": "Image processing output"
}

~~~

## To Retrain Model

1. Have CSV file ready with two 

