const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to handle contact form submission
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const logEntry = `Time: ${new Date().toISOString()}\nName: ${name}\nEmail: ${email}\nMessage: ${message}\n------------------------------\n`;
    
    // Save to messages.txt
    fs.appendFile(path.join(__dirname, 'messages.txt'), logEntry, (err) => {
        if (err) {
            console.error('Failed to save message:', err);
            return res.status(500).json({ success: false, message: 'Server error saving your message.' });
        }
        console.log(`New message received from ${name}`);
        res.json({ success: true, message: 'Message saved successfully!' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log('Press Ctrl+C to quit.');
});
