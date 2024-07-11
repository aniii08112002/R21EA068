const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Mock URLs for e-commerce APIs
const ecommerceAPIs = [
    'https://api.ecommerce1.com/products',
    'https://api.ecommerce2.com/products',
    'https://api.ecommerce3.com/products'
];

// Function to fetch product details from all e-commerce APIs
const fetchProductDetails = async () => {
    const productDetails = [];

    // Loop through each e-commerce API
    for (const api of ecommerceAPIs) {
        try {
            const response = await axios.get(api, { timeout: 500 });
            const products = response.data.products;
            productDetails.push(...products);
        } catch (error) {
            console.error(`Error fetching data from ${api}:`, error.message);
        }
    }

    return productDetails;
};

// Sort products by price (ascending order)
const sortProductsByPrice = (products) => {
    return products.sort((a, b) => a.price - b.price);
};

// Endpoint to get sorted product details
app.get('/products', async (req, res) => {
    try {
        const productDetails = await fetchProductDetails();
        const sortedProducts = sortProductsByPrice(productDetails);

        res.json(sortedProducts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error fetching product details');
    }
});

app.listen(port, () => {
    console.log(`E-commerce details microservice running on http://localhost:${port}`);
});
