import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const imagesDir = path.resolve('assets/images');
const files = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));

console.log(`Found ${files.length} images to optimize in ${imagesDir}...`);

for (const file of files) {
  const filePath = path.join(imagesDir, file);
  const baseName = path.parse(file).name;
  const inputBuffer = fs.readFileSync(filePath);
  const originalSizeKb = (inputBuffer.length / 1024).toFixed(1);

  const metadata = await sharp(inputBuffer).metadata();
  console.log(`Processing ${file} (${metadata.width}x${metadata.height}, ${originalSizeKb} KB)...`);

  // Target max dimensions based on component use
  let maxWidth = 1600;
  if (file.includes('hero')) {
    maxWidth = 1600;
  } else if (file.includes('about')) {
    maxWidth = 1200;
  } else if (file.includes('consultation')) {
    maxWidth = 800;
  } else if (file.includes('project')) {
    maxWidth = 900;
  }

  // Create WebP version
  const webpBuffer = await sharp(inputBuffer)
    .resize({ width: Math.min(metadata.width, maxWidth), withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toBuffer();

  const webpPath = path.join(imagesDir, `${baseName}.webp`);
  fs.writeFileSync(webpPath, webpBuffer);

  // Create compressed progressive JPEG
  const jpgBuffer = await sharp(inputBuffer)
    .resize({ width: Math.min(metadata.width, maxWidth), withoutEnlargement: true })
    .jpeg({ quality: 80, progressive: true, mozjpeg: true })
    .toBuffer();

  // Write to temporary file first, then replace
  const tempPath = path.join(imagesDir, `${file}.tmp`);
  fs.writeFileSync(tempPath, jpgBuffer);
  fs.copyFileSync(tempPath, filePath);
  fs.unlinkSync(tempPath);

  const newJpgSizeKb = (jpgBuffer.length / 1024).toFixed(1);
  const newWebpSizeKb = (webpBuffer.length / 1024).toFixed(1);

  console.log(`  ✓ ${file}: ${originalSizeKb} KB -> JPG ${newJpgSizeKb} KB (-${(100 - (newJpgSizeKb/originalSizeKb*100)).toFixed(0)}%), WebP ${newWebpSizeKb} KB (-${(100 - (newWebpSizeKb/originalSizeKb*100)).toFixed(0)}%)`);
}

console.log('\nAll images successfully optimized!');
