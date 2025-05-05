# 📦 Flask ML Model Deployment on AWS EC2

This guide walks through deploying a Flask + PyTorch model on an AWS EC2 instance using Git and a virtual environment.

---

## ⚙️ EC2 Setup

### 1. **Launch an EC2 Instance**

- **AMI**: Amazon Linux 2023 (or Amazon Linux 2)
- **Instance type**: `t2.medium` (recommended for PyTorch)
- **Storage**: At least 16 GB
- **Security Group**:
  - ✅ Port 22 (SSH) → Your IP
  - ✅ Port 5000 (Custom TCP) → Anywhere (`0.0.0.0/0`)

---

## 🔐 2. **SSH into the EC2 Instance**

```bash
ssh -i ~/path/to/your-key.pem ec2-user@<EC2_PUBLIC_DNS>
```

---

## 🧰 3. **Initial Server Setup**

```bash
sudo yum update -y
sudo yum install -y git python3
python3 -m ensurepip --upgrade
pip3 install --upgrade pip
pip3 install virtualenv
```

---

## 📥 4. **Clone Your Repo**

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git model
cd model/server
```

---

## 🧪 5. **Set Up Virtual Environment**

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## 🚀 6. **Run the Flask Server**

Ensure `main.py` contains:

```python
app.run(host="0.0.0.0", port=5000)
```

Then run:

```bash
nohup python3 main.py > output.log 2>&1 &
```

---

## ✅ Helpful Commands

### 🔎 Check if Flask is Running

```bash
ps aux | grep main.py
```

Look for a line like:
```
python3 main.py
```

---

### 📖 View Logs

```bash
tail -f output.log
```
> Press `Ctrl + C` to exit log view

---

### ❌ Stop the Flask Server

```bash
pkill -f main.py
```
> Or use `kill <PID>` from `ps aux | grep main.py`

---

### 🔁 Restart the Server

```bash
source venv/bin/activate
nohup python3 main.py > output.log 2>&1 &
```

---

## 🌐 Test the Endpoint

From your **local machine**:

```bash
curl http://<EC2_PUBLIC_DNS>:5000/
```

To send an image to the `/uploads` endpoint:

```bash
curl -X POST http://<EC2_PUBLIC_DNS>:5000/uploads \
     --header "Content-Type: application/octet-stream" \
     --data-binary "@image.jpg"
```

---
