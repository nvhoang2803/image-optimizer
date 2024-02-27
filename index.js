const sharp = require('sharp');
const fs = require('fs');

const optimizeImage = async (inputImagePath, outputImagePath) => {
  try {
    // Check the file size
    const stats = fs.statSync(inputImagePath);
    const fileSizeInBytes = stats.size;
    console.log(`Original file size: ${fileSizeInBytes} bytes`);

    // If the image size is below 500kB, no need to optimize
    if (fileSizeInBytes <= 500 * 1024) {
      console.log('The image is already below 500kB.');
      return;
    }

    // Estimate quality reduction needed to get under 500kB
    // This is a basic heuristic and might need adjustment depending on the image
    let quality = 98;
    const targetSize = 500 * 1000; // 500kB in bytes
    const qualityReductionStep = 2;
    let optimizedSize = fileSizeInBytes;

    // Loop to reduce quality and check size
    while (optimizedSize > targetSize && quality > 10) {
      const buffer = await sharp(inputImagePath)
        .jpeg({ quality }) // Adjust format and quality here
        .toBuffer();

      if (buffer.length < targetSize) {
        optimizedSize = buffer.length;
        break;
      }

      // Reduce quality for next iteration
      quality -= qualityReductionStep;
      console.log(`Trying quality ${quality}%`);
    }

    // Save the optimized image
    await sharp(inputImagePath)
      .jpeg({ quality }) // Ensure this matches the final selected quality
      .toFile(outputImagePath);

    console.log(`Optimized image saved at '${outputImagePath}' with quality ${quality}%. New size: ${optimizedSize} bytes.`);
  } catch (error) {
    console.error('Error optimizing the image:', error);
  }
};

// Example usage
const inputImagePath = './florian-schmid-orUKNZrXrN0-unsplash.jpg';
const outputImagePath = './optimized-image.jpg';

optimizeImage(inputImagePath, outputImagePath);
