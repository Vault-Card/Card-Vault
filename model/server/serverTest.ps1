# Set the URL of your Flask server's upload endpoint
$url = "http://127.0.0.1:8080/uploads"  # Or your actual URL

# Specify the path to the image file you want to upload
$imagePath = "C:\Users\kauer\OneDrive\Desktop\Card-Vault\model\test.jpg"  # Replace with the actual path to your image file

# Check if the image file exists
if (-not (Test-Path $imagePath)) {
    Write-Error "Image file not found at: $imagePath"
    exit  # Stop execution if the file doesn't exist
}

# Read the image file as bytes
$imageBytes = [IO.File]::ReadAllBytes($imagePath)

# Set the headers.  Content-Type is crucial for the server to know it's an image.
$headers = @{
    "Content-Type" = "application/octet-stream" #  Generic binary data, or use image/jpeg, image/png, etc. if known.
}

# Send the PUT request with the image bytes in the body
try {
    $response = Invoke-RestMethod -Uri $url -Method Put -Body $imageBytes -Headers $headers -ErrorAction Stop
    # If the server returns a 201 Created, the following will be executed
    Write-Host "Image uploaded successfully!"
    Write-Host "Response:" ($response |ConvertTo-Json -Depth 4) #pretty print
}
catch {
    # This block will execute if Invoke-RestMethod throws an error (e.g., non-2xx status code)
    Write-Error "Error uploading image: $($_.Exception.Message)"
    # Output the full response if available.  This can be helpful for debugging server-side issues.
    if ($_.Exception.Response) {
        Write-Host "Server Response:" ($_.Exception.Response |ConvertTo-Json -Depth 4)
    }
}
