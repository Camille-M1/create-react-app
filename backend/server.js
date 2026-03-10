const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// In-memory user store
let users = [];

// GET all users
app.get('/api/users', (req, res) => {
	res.json(users);
});

// GET user by uid
app.get('/api/users/:uid', (req, res) => {
	const user = users.find(u => u.uid === req.params.uid);
	if (user) return res.json(user);
	res.status(404).json({ error: 'User not found' });
});

// CREATE user
app.post('/api/users', (req, res) => {
	const { uid, displayName, email, role } = req.body;
	if (!uid || !email) return res.status(400).json({ error: 'uid and email required' });
	let user = users.find(u => u.uid === uid);
	if (user) {
		return res.status(409).json({ error: 'User already exists' });
	}
	user = { uid, displayName, email, role: role || 'team' };
	users.push(user);
	res.json(user);
});

// UPDATE user by uid
app.put('/api/users/:uid', (req, res) => {
	const { displayName, role } = req.body;
	const user = users.find(u => u.uid === req.params.uid);
	if (!user) return res.status(404).json({ error: 'User not found' });
	if (displayName) user.displayName = displayName;
	if (role) user.role = role;
	res.json(user);
});

// DELETE user by uid
app.delete('/api/users/:uid', (req, res) => {
	const idx = users.findIndex(u => u.uid === req.params.uid);
	if (idx === -1) return res.status(404).json({ error: 'User not found' });
	users.splice(idx, 1);
	res.json({ success: true });
});

app.listen(PORT, () => {
	console.log(`Backend server running on port ${PORT}`);
});

