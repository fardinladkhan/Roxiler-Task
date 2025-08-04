// backend/controllers/storeController.js
const db = require('../db/connect');

// Store Owner: Add a new store
exports.createStore = (req, res) => {
  const { name, email, address } = req.body;
  const owner_id = req.user?.id;

  if (!owner_id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!name || !address || !email) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query(
    'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
    [name, email, address, owner_id],
    (err, result) => {
      if (err) return res.status(500).json({ message: 'Store creation failed', error: err });

      res.status(201).json({ message: 'Store added successfully' });
    }
  );
};

// Store Owner: View ratings for their store
exports.getStoreRatings = (req, res) => {
  const owner_id = req.user?.id;

  if (!owner_id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const storeQuery = `
    SELECT s.id AS store_id, s.name AS store_name, s.address,
           ROUND(AVG(r.rating), 2) AS avg_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    WHERE s.owner_id = ?
    GROUP BY s.id
  `;

  db.query(storeQuery, [owner_id], (err, storeResults) => {
    if (err) return res.status(500).json({ message: 'Error fetching store info', error: err });

    const ratingsQuery = `
      SELECT r.store_id, u.name AS user_name, r.rating
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id IN (SELECT id FROM stores WHERE owner_id = ?)
    `;

    db.query(ratingsQuery, [owner_id], (err, ratingResults) => {
      if (err) return res.status(500).json({ message: 'Error fetching ratings', error: err });

      res.status(200).json({
        stores: storeResults,
        ratings: ratingResults
      });
    });
  });
};
