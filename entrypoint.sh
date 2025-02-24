#!/bin/sh
set -e

echo "🏃 Running project"

echo "Running database migrations..."
npx prisma migrate dev

echo "🔧 Development mode"

echo "Starting development server..."
exec npm run dev