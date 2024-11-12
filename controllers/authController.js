const db = require('../config/db');

exports.verifyPassword = (req, res) => {
    const { userId, password } = req.body;

    db.query(
        'SELECT password FROM users WHERE id = ?',
        [userId],
        (error, results) => {
            if (error) {
                return res.status(500).json({ success: false, message: "Error de servidor" });
            }
            
            if (results.length > 0 && results[0].password === password) {
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        }
    );
};
