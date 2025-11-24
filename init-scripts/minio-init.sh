#!/bin/sh

# Ждем запуска MinIO
echo "Waiting for MinIO to be ready..."
until mc alias set slicehub http://minio:9000 minioadmin minioadmin > /dev/null 2>&1; do
  echo "MinIO is not ready yet. Retrying in 2 seconds..."
  sleep 2
done

echo "MinIO is ready. Configuring..."

# Создаем бакеты
echo "Creating buckets..."
mc mb slicehub/slicehub-models --ignore-existing
mc mb slicehub/slicehub-previews --ignore-existing
mc mb slicehub/slicehub-avatars --ignore-existing
mc mb slicehub/slicehub-attachments --ignore-existing

# Устанавливаем публичную политику для чтения (опционально)
echo "Setting bucket policies..."
mc anonymous set download slicehub/slicehub-previews
mc anonymous set download slicehub/slicehub-avatars

echo "MinIO initialization complete!"

