set -e

echo "Running Prisma migrations..."
npx prisma migrate dev

echo "Starting development server..."
exec npm run dev
