const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const mongoURL = 'mongodb://127.0.0.1:27017/crud';

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: String,
    age: Number
});

const User = mongoose.model('User', UserSchema);

// CREATE: Add a new user
app.post('/create-user', async (req, res) => {
    try {
        const userData = req.body;
        const user = new User({
            username: userData.username,
            email: userData.email,
            age: userData.age
        });
        await user.save();
        res.json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// READ: Get all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json({ users });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
});

// READ: Get a single user by ID
app.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to retrieve user' });
    }
});

// UPDATE: Update a user by ID
app.put('/update-user/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ updatedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE: Delete a user by ID
app.delete('/delete-user/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

app.listen(3001, () => {
    console.log("Running on port 127.0.0.1:3001");
});
