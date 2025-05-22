#!/usr/bin/env bash
# build.sh

# Install system dependencies (including Chrome)
apt-get update -y
apt-get install -y \
  wget \
  gnupg \
  fonts-liberation \
  libappindicator3-1 \
  xdg-utils

# Install Google Chrome
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list
apt-get update -y
apt-get install -y google-chrome-stable

# Install Puppeteer dependencies (if using Node.js)
curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
apt-get install -y nodejs
npm install puppeteer@19.11.1

# Install Python dependencies (if applicable)
pip install -r requirements.txt

# Verify Chrome is installed
echo "Chrome version: $(google-chrome-stable --version)"