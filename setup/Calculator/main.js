const express = require('express');
const axios = require('axios');

const app = express();
const port = 3001;

const windowSize = 10;
let windowPrevState = [];
let windowCurrState = [];

app.get('/numbers/:numberid', async (req, res) => {
    const numberId = req.params.numberid;

    try {
        const response = await axios.get(`https://test-server.com/numbers/${numberId}`, { timeout: 500 });
        const numbers = response.data.numbers;

        // Add new numbers to the current window, ensuring uniqueness
        numbers.forEach(num => {
            if (!windowCurrState.includes(num)) {
                windowCurrState.push(num);
            }
        });

        // Maintain window size
        if (windowCurrState.length > windowSize) {
            windowCurrState = windowCurrState.slice(windowCurrState.length - windowSize);
        }

        // Compute average
        const avg = windowCurrState.reduce((sum, num) => sum + num, 0) / windowCurrState.length;

        // Prepare response
        const responseData = {
            numbers: numbers,
            windowPrevState: windowPrevState,
            windowCurrState: windowCurrState,
            avg: avg.toFixed(2)
        };

        // Update previous state
        windowPrevState = [...windowCurrState];

        res.json(responseData);

    } catch (error) {
        console.error('Error fetching numbers:', error);
        res.status(500).send('Error fetching numbers');
    }
});

app.listen(port, () => {
    console.log(`Average Calculator microservice running on http://localhost:${port}`);
});
