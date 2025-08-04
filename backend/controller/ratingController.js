const db = require('../db/connect');

exports.getAllStores = (req, res) => {
  const user_id = req.user?.id;

  const query = `
    SELECT 
      s.id AS store_id,
      s.name AS store_name,
      s.address,
      ROUND(AVG(r.rating), 2) AS avg_rating,
      (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id LIMIT 1) AS user_rating
    FROM stores s
    LEFT JOIN ratings r ON s.id = r.store_id
    GROUP BY s.id
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to get stores', error: err });
    res.status(200).json(results);
  });
};


exports.submitRating = (req, res) => {
  const user_id = req.user?.id;
  const { store_id, rating } = req.body;

  if (!user_id || !store_id || !rating) {
    return res.status(400).json({ message: 'All fields are required' });
  }


  db.query(
    'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?',
    [user_id, store_id],
    (err, results) => {
      if (err) return res.status(500).json({ message: 'Rating check failed', error: err });

      if (results.length > 0) {
        
        db.query(
          'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
          [rating, user_id, store_id],
          (err) => {
            if (err) return res.status(500).json({ message: 'Failed to update rating', error: err });
            res.status(200).json({ message: 'Rating updated successfully' });
          }
        );
      } else {
        // Insert new rating
        db.query(
          'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
          [user_id, store_id, rating],
          (err) => {
            if (err) return res.status(500).json({ message: 'Failed to submit rating', error: err });
            res.status(201).json({ message: 'Rating submitted successfully' });
          }
        );
      }
    }
  );
};
