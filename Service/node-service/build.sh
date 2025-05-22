#!/usr/bin/env bash
# build.sh

# Install Node.js dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt

# (Optional) Show Puppeteer's bundled Chromium version
node -e "console.log('Chromium path:', require('puppeteer').executablePath())"
