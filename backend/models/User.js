const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    university: { type: String },
    address: { type: String },
    role: { type: String, enum: ['donor', 'admin'], default: 'donor' },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

if (mongoose.connection.readyState === 1) {
    handleIndexes();
} else {
    mongoose.connection.once('connected', handleIndexes);
    mongoose.connection.once('connected', handleIndexes);
}

async function handleIndexes() {
    try {
        const usersCollection = mongoose.connection.db.collection('users');
        
        const indexes = await usersCollection.indexes();
        console.log('Current indexes on users collection:', indexes.map(idx => idx.name));
        
        const hasUsernameIndex = indexes.some(idx => idx.name === 'username_1');
        if (hasUsernameIndex) {
            try {
                await usersCollection.dropIndex('username_1');
                console.log('Successfully dropped username_1 index');
            } catch (indexError) {
                console.log('Error dropping index:', indexError.message);
            }
        }
    } catch (error) {
        console.error('Error managing indexes:', error);
    }
}

module.exports = User;
