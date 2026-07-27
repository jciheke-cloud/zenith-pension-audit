const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Initialize SQLite Database
const db = new sqlite3.Database('./audit_state.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Create basic table for test/initialization
        db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Audit App Backend' });
});

// Mock telemetry endpoint for audit backend tests
app.get('/api/v1/audit/telemetry', (req, res) => {
    res.json({ status: 'live', data: [] });
});

app.listen(PORT, () => {
    console.log(`Audit Backend Server running on port ${PORT}`);
});
