const express = require('express');
const app = express();
const port = 1245;
const redis = require('redis');
const { promisify } = require('util');

// Create Redis client
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Helper functions
async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
  const stock = await getAsync(`item.${itemId}`);
  return stock ? parseInt(stock, 10) : null;
}

// Routes
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: "Product not found" });
  }

  const currentStock = await getCurrentReservedStockById(itemId) || product.initialAvailableQuantity;
  res.json({
    ...product,
    currentQuantity: currentStock
  });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: "Product not found" });
  }

  const currentStock = await getCurrentReservedStockById(itemId) || product.initialAvailableQuantity;
  if (currentStock <= 0) {
    return res.json({ status: "Not enough stock available", itemId });
  }

  await reserveStockById(itemId, currentStock - 1);
  res.json({ status: "Reservation confirmed", itemId });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});