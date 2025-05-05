#!/bin/bash
yum update -y
yum install -y python3 git
python3 -m pip install --upgrade pip
pip3 install virtualenv

# Download your model repo - this will clone into /home/ec2-user/model/
cd /home/ec2-user
git clone https://github.com/Vault-Card/Card-Vault.git model

# Enter the server directory and set up the environment
cd model/server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run Flask app on port 5000
nohup python3 main.py > output.log 2>&1 &
