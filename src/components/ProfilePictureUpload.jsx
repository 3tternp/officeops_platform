import React, { useState, useRef } from 'react';
import './ProfilePictureUpload.css';

const ProfilePictureUpload = ({ 
    currentImage, 
    onImageUpload, 
    onImageRemove, 
    maxSize = 5 * 1024 * 1024, // 5MB default
    disabled = false 
}) => {
    const [preview, setPreview] = useState(currentImage);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];

    const validateFile = (file) => {
        const errors = [];

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            errors.push('Invalid file format. Only PNG, JPG, and JPEG files are allowed.');
        }

        // Check file extension (additional security)
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        if (!allowedExtensions.includes(fileExtension)) {
            errors.push('Invalid file extension. Only .png, .jpg, and .jpeg files are allowed.');
        }

        // Check file size
        if (file.size > maxSize) {
            const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
            errors.push(`File size must be less than ${maxSizeMB}MB.`);
        }

        // Check if file is actually an image (basic validation)
        if (!file.type.startsWith('image/')) {
            errors.push('Selected file is not a valid image.');
        }

        return errors;
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        setError('');

        if (!file) return;

        // Validate file
        const validationErrors = validateFile(file);
        if (validationErrors.length > 0) {
            setError(validationErrors.join(' '));
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        try {
            setUploading(true);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // Call upload handler
            if (onImageUpload) {
                await onImageUpload(file);
            }

        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload image. Please try again.');
            setPreview(currentImage); // Reset preview on error
        } finally {
            setUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = async () => {
        try {
            setUploading(true);
            if (onImageRemove) {
                await onImageRemove();
            }
            setPreview(null);
            setError('');
        } catch (err) {
            console.error('Remove error:', err);
            setError(err.message || 'Failed to remove image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const triggerFileSelect = () => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="profile-picture-upload">
            <div className="upload-container">
                <div className="image-preview" onClick={triggerFileSelect}>
                    {preview ? (
                        <img 
                            src={preview} 
                            alt="Profile preview" 
                            className="preview-image"
                        />
                    ) : (
                        <div className="placeholder">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span>Click to upload</span>
                        </div>
                    )}
                    
                    {uploading && (
                        <div className="upload-overlay">
                            <div className="spinner"></div>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    disabled={disabled || uploading}
                />

                <div className="upload-actions">
                    <button
                        type="button"
                        onClick={triggerFileSelect}
                        disabled={disabled || uploading}
                        className="btn btn-primary"
                    >
                        {uploading ? 'Uploading...' : (preview ? 'Change Picture' : 'Upload Picture')}
                    </button>
                    
                    {preview && (
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={disabled || uploading}
                            className="btn btn-secondary"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    {error}
                </div>
            )}

            <div className="upload-info">
                <small>
                    Supported formats: PNG, JPG, JPEG<br/>
                    Maximum size: {(maxSize / (1024 * 1024)).toFixed(1)}MB
                </small>
            </div>
        </div>
    );
};

export default ProfilePictureUpload;
