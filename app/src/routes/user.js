app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

    db.query(sql, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding user', err });
        }
        res.status(201).json({ message: 'User added', result });
    });
});
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;

    db.query(sql, [username, password], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        res.status(200).json({ message: 'Login successful' });
    });
});
