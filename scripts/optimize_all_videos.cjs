const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const videoDir = path.resolve(__dirname, '../assets/video');
console.log('Optimizing all videos in:', videoDir);

// Docker script to optimize every MP4 with faststart
const dockerCmd = `docker run --rm -v "${videoDir}:/video" alpine:latest sh -c "apk add --no-cache ffmpeg > /dev/null 2>&1 && for f in /video/*.mp4; do echo Processing \\$f; ffmpeg -y -i \\"\\$f\\" -c copy -movflags +faststart \\"\\$f.tmp.mp4\\" > /dev/null 2>&1 && mv \\"\\$f.tmp.mp4\\" \\"\\$f\\"; done && echo ALL_DONE"`;

console.log('Running ffmpeg faststart batch across all videos...');
const output = execSync(dockerCmd, { stdio: 'inherit' });
console.log('✅ Video faststart batch complete!');
