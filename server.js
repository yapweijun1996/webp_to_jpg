const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Serve static files from the current directory
app.use(express.static(__dirname));

// Endpoint to handle file conversion
app.post('/convert', upload.array('files'), async (req, res) => {
    const timestamp = Date.now();
    const outputDir = path.join(__dirname, 'output', String(timestamp));
    fs.mkdirSync(outputDir, { recursive: true });

    const conversionPromises = req.files.map(file => {
        // Define output file path, replacing .webp with .jpg
        const outputFilePath = path.join(outputDir, file.originalname.replace(/\.webp$/, '.jpg'));

        return sharp(file.path)
            .toFile(outputFilePath)  // Convert and save as .jpg
            .then(() => {
                fs.unlinkSync(file.path); // Remove the original .webp file after conversion
            });
    });

    await Promise.all(conversionPromises);
    res.json({ timestamp });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
