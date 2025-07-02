#!/bin/bash

# This script creates a copy of the Swiftful Starter Project Web with a new name
# Usage: ./rename_project.sh NewProjectName

# Check if a new project name is provided
if [ -z "$1" ]; then
    echo "Usage: $0 NewProjectName"
    echo "Example: $0 MyAwesomeApp"
    exit 1
fi

# Variables
OLD_NAME="swiftful-starter-project-web"
OLD_TITLE="Swiftful Starter Project"
NEW_NAME=$(echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/ /-/g')  # Convert to lowercase and replace spaces with hyphens
NEW_TITLE="$1"
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
NEW_PROJECT_DIR="$PARENT_DIR/$NEW_NAME"

# Check if the new directory already exists
if [ -d "$NEW_PROJECT_DIR" ]; then
    echo "Error: Directory $NEW_PROJECT_DIR already exists!"
    echo "Please choose a different project name or remove the existing directory."
    exit 1
fi

echo "Creating new project: $NEW_TITLE"
echo "Project directory: $NEW_PROJECT_DIR"
echo "----------------------------------------"

# Create new project directory by copying current project
echo "Copying project files..."
rsync -av --exclude='.git' \
         --exclude='node_modules' \
         --exclude='.next' \
         --exclude='out' \
         --exclude='.env.local' \
         --exclude='.DS_Store' \
         --exclude='*.log' \
         "$SCRIPT_DIR/" "$NEW_PROJECT_DIR/"

# Change to new project directory
cd "$NEW_PROJECT_DIR"

# Update package.json
echo "Updating package.json..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/\"name\": \"$OLD_NAME\"/\"name\": \"$NEW_NAME\"/" package.json
else
    # Linux
    sed -i "s/\"name\": \"$OLD_NAME\"/\"name\": \"$NEW_NAME\"/" package.json
fi

# Update app metadata in layout.tsx
echo "Updating app metadata..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/title: '$OLD_TITLE'/title: '$NEW_TITLE'/" src/app/layout.tsx
    sed -i '' "s/Swiftful Starter Project/$NEW_TITLE/g" src/app/layout.tsx
else
    # Linux
    sed -i "s/title: '$OLD_TITLE'/title: '$NEW_TITLE'/" src/app/layout.tsx
    sed -i "s/Swiftful Starter Project/$NEW_TITLE/g" src/app/layout.tsx
fi

# Update CLAUDE.md
echo "Updating CLAUDE.md..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/$OLD_NAME/$NEW_NAME/g" CLAUDE.md
    sed -i '' "s/$OLD_TITLE/$NEW_TITLE/g" CLAUDE.md
else
    # Linux
    sed -i "s/$OLD_NAME/$NEW_NAME/g" CLAUDE.md
    sed -i "s/$OLD_TITLE/$NEW_TITLE/g" CLAUDE.md
fi

# Create a new README.md
echo "Creating README.md..."
cat > README.md << EOF
# $NEW_TITLE

A modern web application built with Next.js, TypeScript, and Firebase.

## Getting Started

1. Clone this repository
2. Copy \`.env.local.example\` to \`.env.local\` and add your Firebase and OpenAI API keys
3. Install dependencies: \`npm install\`
4. Run the development server: \`npm run dev\`
5. Open [http://localhost:3000](http://localhost:3000)

## Features

- Next.js 15 with App Router
- TypeScript with strict mode
- Firebase Authentication & Firestore
- OpenAI Integration (GPT & Reasoning models)
- Shadcn/UI Component Library
- Tailwind CSS with custom themes
- User authentication with Google SSO
- Protected routes and user profiles

## Documentation

See \`CLAUDE.md\` for detailed project documentation and development guidelines.
EOF

# Initialize new git repository
echo "Initializing new git repository..."
git init
git add .
git commit -m "Initial commit - $NEW_TITLE"

# Install dependencies
echo "----------------------------------------"
echo "Project created successfully!"
echo ""
echo "Next steps:"
echo "1. cd $NEW_PROJECT_DIR"
echo "2. Copy .env.local.example to .env.local and add your API keys"
echo "3. npm install"
echo "4. npm run dev"
echo ""
echo "Your new project is ready at: $NEW_PROJECT_DIR"