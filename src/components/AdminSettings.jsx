import React, { useState, useEffect } from 'react';
import ProfilePictureUpload from './ProfilePictureUpload';
import './AdminSettings.css';

const AdminSettings = ({ currentUser, onSettingsUpdate }) => {
    const [settings, setSettings] = useState({
        applicationName: 'Office Operations Platform',
        bannerImageUrl: null,
        logoImageUrl: null
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        applicationName: ''
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/settings');
            if (!response.ok) {
                throw new Error('Failed to fetch settings');
            }
            const data = await response.json();
            setSettings(data);
            setFormData({
                applicationName: data.applicationName || ''
            });
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
        setSuccess('');
    };

    const updateApplicationName = async (e) => {
        e.preventDefault();
        
        if (!formData.applicationName.trim()) {
            setError('Application name cannot be empty');
            return;
        }

        try {
            setSaving(true);
            setError('');

            const response = await fetch('/api/admin/settings/app-name', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    applicationName: formData.applicationName.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update application name');
            }

            const updatedSettings = await response.json();
            setSettings(prev => ({
                ...prev,
                applicationName: updatedSettings.applicationName
            }));

            setSuccess('Application name updated successfully!');
            
            if (onSettingsUpdate) {
                onSettingsUpdate(updatedSettings);
            }

        } catch (err) {
            console.error('Error updating application name:', err);
            setError(err.message || 'Failed to update application name');
        } finally {
            setSaving(false);
        }
    };

    const handleBannerUpload = async (file) => {
        try {
            setSaving(true);
            setError('');

            const formData = new FormData();
            formData.append('banner', file);

            const response = await fetch('/api/admin/settings/banner', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload banner');
            }

            const updatedSettings = await response.json();
            setSettings(prev => ({
                ...prev,
                bannerImageUrl: updatedSettings.bannerImageUrl
            }));

            setSuccess('Banner updated successfully!');
            
            if (onSettingsUpdate) {
                onSettingsUpdate(updatedSettings);
            }

        } catch (err) {
            console.error('Error uploading banner:', err);
            setError(err.message || 'Failed to upload banner');
            throw err; // Re-throw to let the upload component handle it
        } finally {
            setSaving(false);
        }
    };

    const handleBannerRemove = async () => {
        try {
            setSaving(true);
            setError('');

            const response = await fetch('/api/admin/settings/banner', {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove banner');
            }

            setSettings(prev => ({
                ...prev,
                bannerImageUrl: null
            }));

            setSuccess('Banner removed successfully!');
            
            if (onSettingsUpdate) {
                onSettingsUpdate({ ...settings, bannerImageUrl: null });
            }

        } catch (err) {
            console.error('Error removing banner:', err);
            setError(err.message || 'Failed to remove banner');
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const handleLogoUpload = async (file) => {
        try {
            setSaving(true);
            setError('');

            const formData = new FormData();
            formData.append('logo', file);

            const response = await fetch('/api/admin/settings/logo', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to upload logo');
            }

            const updatedSettings = await response.json();
            setSettings(prev => ({
                ...prev,
                logoImageUrl: updatedSettings.logoImageUrl
            }));

            setSuccess('Logo updated successfully!');
            
            if (onSettingsUpdate) {
                onSettingsUpdate(updatedSettings);
            }

        } catch (err) {
            console.error('Error uploading logo:', err);
            setError(err.message || 'Failed to upload logo');
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const handleLogoRemove = async () => {
        try {
            setSaving(true);
            setError('');

            const response = await fetch('/api/admin/settings/logo', {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to remove logo');
            }

            setSettings(prev => ({
                ...prev,
                logoImageUrl: null
            }));

            setSuccess('Logo removed successfully!');
            
            if (onSettingsUpdate) {
                onSettingsUpdate({ ...settings, logoImageUrl: null });
            }

        } catch (err) {
            console.error('Error removing logo:', err);
            setError(err.message || 'Failed to remove logo');
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    if (loading) {
        return (
            <div className="admin-settings">
                <div className="loading-container">
                    <div className="spinner large"></div>
                    <p>Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-settings">
            <div className="settings-header">
                <h2>Application Settings</h2>
                <p>Manage your application's appearance and branding</p>
            </div>

            {error && (
                <div className="message error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    {error}
                    <button onClick={clearMessages} className="close-btn">×</button>
                </div>
            )}

            {success && (
                <div className="message success-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                    {success}
                    <button onClick={clearMessages} className="close-btn">×</button>
                </div>
            )}

            <div className="settings-sections">
                {/* Application Name Section */}
                <div className="settings-section">
                    <h3>Application Name</h3>
                    <p>Change the name that appears in your application header and title</p>
                    
                    <form onSubmit={updateApplicationName}>
                        <div className="form-group">
                            <label htmlFor="applicationName">Application Name</label>
                            <input
                                type="text"
                                id="applicationName"
                                name="applicationName"
                                value={formData.applicationName}
                                onChange={handleInputChange}
                                placeholder="Enter application name"
                                maxLength="100"
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={saving || !formData.applicationName.trim()}
                        >
                            {saving ? 'Updating...' : 'Update Name'}
                        </button>
                    </form>
                </div>

                {/* Banner Section */}
                <div className="settings-section">
                    <h3>Banner Image</h3>
                    <p>Upload a banner image that appears at the top of your application</p>
                    
                    <ProfilePictureUpload
                        currentImage={settings.bannerImageUrl}
                        onImageUpload={handleBannerUpload}
                        onImageRemove={handleBannerRemove}
                        maxSize={10 * 1024 * 1024} // 10MB for banners
                        disabled={saving}
                    />
                </div>

                {/* Logo Section */}
                <div className="settings-section">
                    <h3>Logo Image</h3>
                    <p>Upload a logo that represents your organization</p>
                    
                    <ProfilePictureUpload
                        currentImage={settings.logoImageUrl}
                        onImageUpload={handleLogoUpload}
                        onImageRemove={handleLogoRemove}
                        maxSize={5 * 1024 * 1024} // 5MB for logos
                        disabled={saving}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
