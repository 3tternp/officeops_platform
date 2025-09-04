const bcrypt = require('bcrypt');
const path = require('path');

class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.email = data.email;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.profilePicture = data.profilePicture || null;
        this.passwordHash = data.passwordHash;
        this.role = data.role || 'user'; // 'user' or 'admin'
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    // Hash password before saving
    static async hashPassword(password) {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
    }

    // Verify password
    async verifyPassword(password) {
        return await bcrypt.compare(password, this.passwordHash);
    }

    // Update password
    async updatePassword(newPassword) {
        this.passwordHash = await User.hashPassword(newPassword);
        this.updatedAt = new Date();
        return this;
    }

    // Update profile picture
    updateProfilePicture(filename) {
        // Validate file extension
        const allowedExtensions = ['.png', '.jpg', '.jpeg'];
        const fileExtension = path.extname(filename).toLowerCase();
        
        if (!allowedExtensions.includes(fileExtension)) {
            throw new Error('Invalid file format. Only PNG, JPG, and JPEG files are allowed.');
        }

        this.profilePicture = filename;
        this.updatedAt = new Date();
        return this;
    }

    // Remove sensitive data for client response
    toSafeObject() {
        const safeUser = { ...this };
        delete safeUser.passwordHash;
        return safeUser;
    }

    // Check if user is admin
    isAdmin() {
        return this.role === 'admin';
    }

    // Update profile information
    updateProfile(profileData) {
        const allowedFields = ['firstName', 'lastName', 'email'];
        
        allowedFields.forEach(field => {
            if (profileData[field] !== undefined) {
                this[field] = profileData[field];
            }
        });

        this.updatedAt = new Date();
        return this;
    }
}

module.exports = User;
