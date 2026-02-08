#!/bin/bash
set -e

SERVER="ubuntu@117.50.221.245"
REMOTE_DIR="/home/ubuntu/page-factory"

echo "Deploying Page Factory..."

ssh $SERVER "mkdir -p $REMOTE_DIR"

rsync -avz --delete \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=projects_data \
  --exclude=projects \
  ./ $SERVER:$REMOTE_DIR/

echo "Building and starting on remote..."
ssh $SERVER "cd $REMOTE_DIR && docker compose up -d --build"

echo "Running database migrations..."
ssh $SERVER "cd $REMOTE_DIR && docker compose exec -T page-factory npx prisma migrate deploy" || echo "Migration may need manual run"

echo ""
echo "Deployed! Access: http://117.50.221.245:3080"
