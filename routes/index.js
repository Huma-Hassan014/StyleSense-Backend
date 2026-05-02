//this file contain all the routes 
const express = require('express');
const router = express.Router();

// 1. Import individual route files
const authRoutes = require('./authRoutes');
// const wardrobeRoutes = require('./wardrobeRoutes'); // You'll add this later

// 2. Assign prefixes to them
router.use('/auth', authRoutes);         // Result: /api/auth/...
// router.use('/wardrobe', wardrobeRoutes); // Result: /api/wardrobe/...

module.exports = router;