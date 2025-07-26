#!/bin/bash

# Script to help set up GitHub repository for Verita AI

echo "=== Verita AI GitHub Setup ==="
echo ""
echo "This script will help you push your code to GitHub."
echo ""
echo "First, you need to create a new repository on GitHub:"
echo "1. Go to https://github.com/new"
echo "2. Name it 'verita-ai' (or your preferred name)"
echo "3. Set it to Public or Private as you prefer"
echo "4. DO NOT initialize with README, .gitignore, or license"
echo "5. Click 'Create repository'"
echo ""
echo "Press Enter when you've created the repository..."
read

echo ""
echo "Now, enter your GitHub username:"
read GITHUB_USERNAME

echo ""
echo "Enter your repository name (default: verita-ai):"
read REPO_NAME
REPO_NAME=${REPO_NAME:-verita-ai}

echo ""
echo "Choose connection method:"
echo "1) HTTPS (recommended for beginners)"
echo "2) SSH (requires SSH key setup)"
read -p "Enter choice (1 or 2): " CONNECTION_METHOD

if [ "$CONNECTION_METHOD" = "2" ]; then
    REMOTE_URL="git@github.com:${GITHUB_USERNAME}/${REPO_NAME}.git"
else
    REMOTE_URL="https://github.com/${GITHUB_USERNAME}/${REPO_NAME}.git"
fi

echo ""
echo "Adding remote repository..."
git remote add origin $REMOTE_URL

echo ""
echo "Remote added. Verifying..."
git remote -v

echo ""
echo "Pushing code to GitHub..."
git push -u origin main

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Your repository should now be available at:"
echo "https://github.com/${GITHUB_USERNAME}/${REPO_NAME}"
echo ""
echo "Next steps:"
echo "1. Add a GitHub Actions workflow for CI/CD"
echo "2. Set up environment secrets in GitHub"
echo "3. Configure deployment to your preferred hosting service"