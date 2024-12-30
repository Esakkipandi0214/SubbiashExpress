const express = require('express');
const router = express.Router();
const QRCode = require('qrcode'); // QR code library
const crypto = require('crypto'); // For generating random tokens

// Function to generate a random token
const generateToken = () => {
    return crypto.randomBytes(16).toString('hex'); // Generate a random token
};

// GET - Fetch all actions (using received token)
router.get('/', async (req, res) => {
    const { token } = req.query; // Retrieve token from query params

    try {
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify({ token })); // Use received token for QR code

        res.json({ message: 'Fetching actions', qrCode: qrCodeDataUrl, token }); // Send token along with QR code
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// POST - Create a new action (using received token)
router.post('/', async (req, res) => {
    const { token, body } = req; // Extract token and body from request

    try {
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify({ body, token })); // Use received token for QR code

        res.json({ message: 'Creating a new action', qrCode: qrCodeDataUrl, token }); // Send token along with QR code
    } catch (error) {
        console.error('Error creating data:', error);
        res.status(500).json({ error: 'Failed to create data' });
    }
});

// GET - Fetch a single action by ID (using received token)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { token } = req.query; // Extract token from query params

    try {
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const action = { id, name: `Action ${id}`, description: 'Description of the action' }; // Example data
        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify({ action, token })); // Use received token for QR code

        res.json({ message: `Fetching action with ID: ${id}`, qrCode: qrCodeDataUrl, token }); // Send token along with QR code
    } catch (error) {
        console.error('Error fetching action:', error);
        res.status(500).json({ error: 'Failed to fetch action' });
    }
});

// PUT - Update an action by ID (using received token)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { token, body } = req; // Extract token and body from request

    try {
        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify({ body, token })); // Use received token for QR code

        res.json({ message: `Updating action with ID: ${id}`, qrCode: qrCodeDataUrl, token }); // Send token along with QR code
    } catch (error) {
        console.error('Error updating action:', error);
        res.status(500).json({ error: 'Failed to update action' });
    }
});

// DELETE - Remove an action by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        res.json({ message: `Deleting action with ID: ${id}`, qrCode: null, token: null }); // Token not needed for delete
    } catch (error) {
        console.error('Error deleting action:', error);
        res.status(500).json({ error: 'Failed to delete action' });
    }
});

module.exports = router;
