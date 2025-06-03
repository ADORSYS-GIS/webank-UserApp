import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

// Polyfill for dirname in ES modules
const filename = fileURLToPath(import.meta.url);
const currentDir = dirname(filename);

// Use compression for better performance
app.use(compression());

// Middleware to parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from "dist"
app.use(express.static(path.resolve(currentDir, 'dist')));

// POST handler for Web Share Target API
app.post('/share-handler', (req, res) => {
  console.log('🔄 Received shared data:', req.body);

  // Optional: Save data somewhere or log it
  // Example: store in session or temp file for client retrieval

  // Redirect to a page that will display the shared content
  res.redirect(303, '/shared-content'); // change as needed
});

// Handle SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(currentDir, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});