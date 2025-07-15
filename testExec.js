const { execFile } = require('child_process');
execFile('bin/yt-dlp.exe', ['--version'], (error, stdout, stderr) => {
  if (error) {
    console.error('Exec error:', error);
    return;
  }
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
});