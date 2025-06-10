# Set the URL of your Flask server's upload endpoint
$url = "http://127.0.0.1:5000/uploads"  # Or your actual URL

# Specify the path to the image file you want to upload
$imagePath = "C:\dev\Card-Vault\model\server\testImages\s-l16005copy.jpg"  # Replace with the actual path to your image file

# Check if the image file exists
if (-not (Test-Path $imagePath)) {
    Write-Error "Image file not found at: $imagePath"
    exit  # Stop execution if the file doesn't exist
}

# Read the image file as bytes
$imageBytes = [IO.File]::ReadAllBytes($imagePath)

# Convert the byte array to a Base64 encoded string
$base64String = [Convert]::ToBase64String($imageBytes)

# Create the JSON payload with the Base64 string
$body = @{
    "image_data" = $base64String
} | ConvertTo-Json

# Set the headers. Content-Type should now be application/json.
$headers = @{
    "Content-Type" = "application/json"
}

# Send the POST request with the JSON body
try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Body $body -Headers $headers -ErrorAction Stop
    # If the server returns a 201 Created, the following will be executed
    Write-Host "Image uploaded successfully!"
    Write-Host "Response:" ($response | ConvertTo-Json -Depth 4) #pretty print
}
catch {
    # This block will execute if Invoke-RestMethod throws an error (e.g., non-2xx status code)
    Write-Error "Error uploading image: $($_.Exception.Message)"
    # Output the full response if available. This can be helpful for debugging server-side issues.
    if ($_.Exception.Response) {
        Write-Host "Server Response:" ($_.Exception.Response.Content | ConvertTo-Json -Depth 4)
    }
}