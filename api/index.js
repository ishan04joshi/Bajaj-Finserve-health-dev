const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/bfhl', (req, res) => {
    const { data, file_b64 } = req.body;
    
    // Logic to separate numbers, alphabets, and find the highest lowercase alphabet
    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    const lowercaseAlphabets = alphabets.filter(c => c === c.toLowerCase());
    const highestLowercaseAlphabet = lowercaseAlphabets.length > 0 ? [lowercaseAlphabets.sort().reverse()[0]] : [];
    
    // File validation logic
    let fileValid = false, fileType = "", fileSizeKB = 0;
    if (file_b64) {
        try {
            const fileBuffer = Buffer.from(file_b64, 'base64');
            fileType = "application/octet-stream";  // Add logic to detect MIME type
            fileSizeKB = fileBuffer.length / 1024;
            fileValid = true;
        } catch (error) {
            fileValid = false;
        }
    }
    
    // Construct response
    const response = {
        is_success: true,
        user_id: "your_name_ddmmyyyy",
        email: "your_email@domain.com",
        roll_number: "your_roll_number",
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet,
        file_valid: fileValid,
        file_mime_type: fileType,
        file_size_kb: fileSizeKB
    };
    
    res.json(response);
});

app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1 });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
