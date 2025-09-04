import React, { useState, useEffect } from 'react';
import { X, Upload, FileText } from 'lucide-react';

const EditDocumentModal = ({ isOpen, onClose, document, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    category: '',
    description: '',
    department: '',
    accessLevel: '',
    tags: '',
    content: '',
    reviewDate: '',
    complianceRequirement: false
  });
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (document) {
      setFormData({
        title: document.title || '',
        type: document.type || '',
        category: document.category || '',
        description: document.description || '',
        department: document.department || '',
        accessLevel: document.accessLevel || '',
        tags: document.tags?.join(', ') || '',
        content: document.content || '',
        reviewDate: document.reviewDate?.split('T')[0] || '',
        complianceRequirement: document.complianceRequirement || false
      });
    }
  }, [document]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.type) newErrors.type = 'Document type is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.accessLevel) newErrors.accessLevel = 'Access level is required';
    if (!formData.reviewDate) newErrors.reviewDate = 'Review date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const updatedDocument = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      file: file || document.file
    };

    onSave(updatedDocument);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      title: '',
      type: '',
      category: '',
      description: '',
      department: '',
      accessLevel: '',
      tags: '',
      content: '',
      reviewDate: '',
      complianceRequirement: false
    });
    setFile(null);
    setErrors({});
    onClose();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Document</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter document title"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className={`w-full p-2 border rounded-md ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select type</option>
                <option value="policy">Policy</option>
                <option value="procedure">Procedure</option>
                <option value="guideline">Guideline</option>
                <option value="manual">Manual</option>
                <option value="form">Form</option>
                <option value="template">Template</option>
              </select>
              {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className={`w-full p-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select category</option>
                <option value="iso-9001">ISO 9001</option>
                <option value="iso-14001">ISO 14001</option>
                <option value="iso-45001">ISO 45001</option>
                <option value="iso-27001">ISO 27001</option>
                <option value="gdpr">GDPR</option>
                <option value="hr">Human Resources</option>
                <option value="finance">Finance</option>
                <option value="operations">Operations</option>
                <option value="technical">Technical</option>
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className={`w-full p-2 border rounded-md ${errors.department ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select department</option>
                <option value="all">All Departments</option>
                <option value="hr">Human Resources</option>
                <option value="finance">Finance</option>
                <option value="it">IT</option>
                <option value="operations">Operations</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
              </select>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Access Level *
              </label>
              <select
                value={formData.accessLevel}
                onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}
                className={`w-full p-2 border rounded-md ${errors.accessLevel ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select access level</option>
                <option value="public">Public</option>
                <option value="internal">Internal</option>
                <option value="confidential">Confidential</option>
                <option value="restricted">Restricted</option>
              </select>
              {errors.accessLevel && <p className="text-red-500 text-xs mt-1">{errors.accessLevel}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Date *
              </label>
              <input
                type="date"
                value={formData.reviewDate}
                onChange={(e) => setFormData({...formData, reviewDate: e.target.value})}
                className={`w-full p-2 border rounded-md ${errors.reviewDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.reviewDate && <p className="text-red-500 text-xs mt-1">{errors.reviewDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter document description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter tags separated by commas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter document content"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Replace Document File
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="document-file-edit"
                accept=".pdf,.doc,.docx,.txt"
              />
              <label
                htmlFor="document-file-edit"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <Upload size={24} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {file ? file.name : document?.fileName || 'Click to upload new file (optional)'}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  PDF, DOC, DOCX, TXT up to 10MB
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="compliance-requirement-edit"
              checked={formData.complianceRequirement}
              onChange={(e) => setFormData({...formData, complianceRequirement: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="compliance-requirement-edit" className="text-sm text-gray-700">
              This document is required for compliance
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Update Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentModal;
