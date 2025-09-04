const path = require('path');

class AppSettings {
    constructor(data = {}) {
        this.id = data.id || 1; // Single settings record
        this.applicationName = data.applicationName || 'Office Operations Platform';
        this.bannerImage = data.bannerImage || null;
        this.logoImage = data.logoImage || null;
        this.updatedAt = data.updatedAt || new Date();
        this.updatedBy = data.updatedBy || null; // Admin user ID who made the change
    }

    // Update application name
    updateApplicationName(name, adminId) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            throw new Error('Application name cannot be empty.');
        }

        this.applicationName = name.trim();
        this.updatedBy = adminId;
        this.updatedAt = new Date();
        return this;
    }

    // Update banner image
    updateBannerImage(filename, adminId) {
        this._validateImageFile(filename);
        this.bannerImage = filename;
        this.updatedBy = adminId;
        this.updatedAt = new Date();
        return this;
    }

    // Update logo image
    updateLogoImage(filename, adminId) {
        this._validateImageFile(filename);
        this.logoImage = filename;
        this.updatedBy = adminId;
        this.updatedAt = new Date();
        return this;
    }

    // Private method to validate image files
    _validateImageFile(filename) {
        if (!filename) {
            throw new Error('Filename cannot be empty.');
        }

        const allowedExtensions = ['.png', '.jpg', '.jpeg'];
        const fileExtension = path.extname(filename).toLowerCase();
        
        if (!allowedExtensions.includes(fileExtension)) {
            throw new Error('Invalid file format. Only PNG, JPG, and JPEG files are allowed.');
        }

        return true;
    }

    // Get full banner image URL
    getBannerImageUrl() {
        return this.bannerImage ? `/uploads/admin/${this.bannerImage}` : null;
    }

    // Get full logo image URL
    getLogoImageUrl() {
        return this.logoImage ? `/uploads/admin/${this.logoImage}` : null;
    }

    // Get settings for client (safe object)
    toClientObject() {
        return {
            applicationName: this.applicationName,
            bannerImageUrl: this.getBannerImageUrl(),
            logoImageUrl: this.getLogoImageUrl(),
            updatedAt: this.updatedAt
        };
    }

    // Get full settings object for admin
    toAdminObject() {
        return {
            id: this.id,
            applicationName: this.applicationName,
            bannerImage: this.bannerImage,
            logoImage: this.logoImage,
            bannerImageUrl: this.getBannerImageUrl(),
            logoImageUrl: this.getLogoImageUrl(),
            updatedAt: this.updatedAt,
            updatedBy: this.updatedBy
        };
    }
}

module.exports = AppSettings;
