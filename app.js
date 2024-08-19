const express = require('express');
const connection = require('./db');
const bodyParser = require('body-parser')
const app = express();

app.use(express.json()); // Middleware untuk menangani body request dalam format JSON

// Route untuk Create (POST)
app.post('/barang', (req, res) => {
    const { name, description } = req.body;
    const query = 'INSERT INTO barang (name, description) VALUES (?, ?)';
    
    // Menggunakan placeholder ? untuk mencegah SQL Injection
    connection.query(query, [name, description], (err, results) => {
      if (err) {
        console.error('Error saat memasukkan data: ', err);
        return res.status(500).send(err);
      }
      res.status(201).json({ id: results.insertId, name, description });
    });
  });
  

// Route untuk Read (GET semua data)
app.get('/barang', (req, res) => {
  connection.query('SELECT * FROM barang', (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Route untuk Read (GET berdasarkan ID)
app.get('/barang/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM barang WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send('Item not found');
    }
    res.json(results[0]);
  });
});

// Route untuk Update (PUT)
app.put('/barang/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const query = 'UPDATE barang SET name = ?, description = ? WHERE id = ?';
  connection.query(query, [name, description, id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Item not found');
    }
    res.json({ message: 'Item updated successfully' });
  });
});

// Route untuk Delete (DELETE)
app.delete('/barang/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM barang WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Item not found');
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
