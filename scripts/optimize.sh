#!/bin/sh
apk add --no-cache ffmpeg > /dev/null 2>&1
echo "FFmpeg ready. Processing videos with -f mp4 and +faststart..."

for f in /video/*.mp4; do
  [ -f "$f" ] || continue
  filename=$(basename "$f")
  case "$filename" in
    *.tmp.mp4|*-faststart.mp4) continue ;;
  esac
  echo "Optimizing $filename..."
  ffmpeg -y -i "$f" -c copy -movflags +faststart -f mp4 "/video/${filename}.tmp.mp4" > /dev/null 2>&1
  if [ -f "/video/${filename}.tmp.mp4" ]; then
    mv "/video/${filename}.tmp.mp4" "$f"
    echo "SUCCESS: $filename"
  else
    echo "FAILED: $filename"
  fi
done

echo "ALL_VIDEOS_OPTIMIZED_COMPLETE"
