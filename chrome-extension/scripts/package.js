const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create scripts directory if it doesn't exist
if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts');
}

// Create output directory if it doesn't exist
const outputDir = path.resolve(__dirname, '../dist');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create a file to stream archive data to
const output = fs.createWriteStream(path.join(outputDir, 'jobsai-extension.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log(`Extension has been packaged successfully (${archive.pointer()} total bytes)`);
});

// Catch warnings
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

// Catch errors
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Append all contents from the dist directory (except the zip file itself)
archive.directory(path.join(outputDir), false, (data) => {
  // Don't include the zip file itself
  if (data.name.endsWith('.zip')) {
    return false;
  }
  return data;
});

// Finalize the archive (i.e. we are done appending files)
archive.finalize();