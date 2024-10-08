// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://kashyapmistry2021:ws7Gqbfgy3*hQZ5@db1cluster1.skf8r.mongodb.net/?retryWrites=true&w=majority&appName=DB1Cluster1')
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.log('Error connecting to MongoDB:', err));

const userSchema = new mongoose.Schema({
username: String,
password: String,
balance: Number,
transactions: Array,
});

const User = mongoose.model('User', userSchema);

app.post('/login', async (req, res) => {
const { username, password } = req.body;
const user = await User.findOne({ username, password });
if (user) {
    res.json({ message: 'Login successful', balance: user.balance, transactions: user.transactions });
} else {
    res.status(401).json({ message: 'Login failed' });
}
});

app.listen(10000, () => {
console.log('Server running on port 5000');
});

