import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

const USER_ID = "john_doe_17091999";
const EMAIL = "john@xyz.com";
const ROLL_NUMBER = "ABCD123";

app.get('/api/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.post('/api/bfhl', (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({ is_success: false, error: "Invalid data format" });
    }

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    const highestLowercase = alphabets
      .filter(char => char.length === 1 && char === char.toLowerCase())
      .sort((a, b) => b.localeCompare(a))[0] || [];

    let fileValid = false;
    let fileMimeType = "";
    let fileSizeKb = 0;

    if (file_b64) {
      try {
        const buffer = Buffer.from(file_b64, 'base64');
        fileValid = true;
        fileMimeType = getFileMimeType(buffer);
        fileSizeKb = Math.round(buffer.length / 1024);
      } catch (error) {
        console.error("File processing error:", error);
      }
    }

    res.status(200).json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercase ? [highestLowercase] : [],
      file_valid: fileValid,
      ...(fileValid && {
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKb.toString()
      })
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ is_success: false, error: "Internal server error" });
  }
});

function getFileMimeType(buffer) {
  const signature = buffer.toString('hex', 0, 4);
  switch (signature) {
    case '89504e47':
      return 'image/png';
    case '25504446':
      return 'application/pdf';
    default:
      return 'application/octet-stream';
  }
}

export default app;