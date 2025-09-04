import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Image from '../../../components/AppImage';
import { toast } from 'react-hot-toast';

import dataService from '../../../services/DataService';
import CertificateGenerationModal from './CertificateGenerationModal';

const CertificateManager = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [certificates, setCertificates] = useState([]);
  const [users, setUsers] = useState([]);
  const [isGenerationModalOpen, setIsGenerationModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'expired', label: 'Expired' },
    { value: 'expiring_soon', label: 'Expiring Soon' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'it', label: 'Information Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'operations', label: 'Operations' }
  ];

  // Load certificate and user data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const certificatesData = dataService.getCertificates();
      const usersData = dataService.getUsers();
      
      // Enrich certificates with user data
      const enrichedCertificates = certificatesData.map(cert => {
        const user = usersData.find(u => u.id === cert.recipientId);
        return {
          ...cert,
          employeeName: cert.recipientName || user?.name || 'Unknown',
          employeeId: user?.id || 'Unknown',
          department: user?.department || 'Unknown',
          avatar: user?.avatar || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 50) + 1}.jpg`,
          issueDate: cert.issueDate,
          expiryDate: cert.expiryDate,
          status: determineStatus(cert),
          verificationUrl: cert.verificationUrl || `${window.location.origin}/verify/${cert.verificationCode}`,
          score: cert.completionScore || 95
        };
      });
      
      setCertificates(enrichedCertificates);
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load certificate data');
    } finally {
      setLoading(false);
    }
  };

  const determineStatus = (certificate) => {
    if (certificate.status === 'revoked') return 'revoked';
    
    const now = new Date();
    const expiryDate = new Date(certificate.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 30) return 'expiring_soon';
    return 'active';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success border-success/20';
      case 'expired': return 'bg-error/10 text-error border-error/20';
      case 'expiring_soon': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'CheckCircle';
      case 'expired': return 'XCircle';
      case 'expiring_soon': return 'AlertTriangle';
      default: return 'Circle';
    }
  };

  const filteredCertificates = certificates?.filter(cert => {
    const matchesSearch = cert?.employeeName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         cert?.courseName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         cert?.employeeId?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cert?.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || cert?.department?.toLowerCase() === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleDownloadCertificate = async (certificate) => {
    try {
      const { generateCertificatePDF } = await import('../../../utils/certificateGenerator');
      
      // Create certificate data for PDF generation
      const certificateData = {
        id: certificate.id,
        recipientName: certificate.employeeName,
        courseName: certificate.courseName,
        completionDate: certificate.issueDate,
        expiryDate: certificate.expiryDate,
        verificationCode: certificate.verificationCode,
        issuer: certificate.issuer || 'OfficeOps Platform',
        completionScore: certificate.score
      };
      
      await generateCertificatePDF(certificateData);
      toast.success('Certificate downloaded successfully!');
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const handleVerifyCertificate = (certificate) => {
    window.open(certificate?.verificationUrl, '_blank');
  };

  const handleRevokeCertificate = async (certificate) => {
    if (!window.confirm(`Are you sure you want to revoke the certificate for ${certificate.employeeName}?`)) {
      return;
    }
    
    try {
      const reason = prompt('Please provide a reason for revocation:');
      if (!reason) return;
      
      dataService.revokeCertificate(certificate.id, reason);
      toast.success('Certificate revoked successfully!');
      loadData(); // Reload data
    } catch (error) {
      console.error('Error revoking certificate:', error);
      toast.error('Failed to revoke certificate');
    }
  };

  const handleRenewCertificate = async (certificate) => {
    try {
      // Calculate new expiry date (1 year from now)
      const newExpiryDate = new Date();
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
      
      dataService.renewCertificate(certificate.id, newExpiryDate.toISOString());
      toast.success('Certificate renewed successfully!');
      loadData(); // Reload data
    } catch (error) {
      console.error('Error renewing certificate:', error);
      toast.error('Failed to renew certificate');
    }
  };

  const handleGenerateCertificate = () => {
    setIsGenerationModalOpen(true);
  };

  const handleGenerationSuccess = () => {
    toast.success('Certificates generated successfully!');
    loadData(); // Reload data
    setIsGenerationModalOpen(false);
  };

  const handleExportAll = () => {
    try {
      const csvContent = generateCSVReport();
      downloadCSV(csvContent, 'certificates_report.csv');
      toast.success('Certificate report exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export certificate data');
    }
  };

  const generateCSVReport = () => {
    const headers = ['Certificate ID', 'Employee Name', 'Course Name', 'Issue Date', 'Expiry Date', 'Status', 'Score'];
    const rows = certificates.map(cert => [
      cert.id,
      cert.employeeName,
      cert.courseName,
      formatDate(cert.issueDate),
      formatDate(cert.expiryDate),
      cert.status,
      `${cert.score}%`
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Certificate Management</h2>
          <p className="text-sm text-muted-foreground">Manage and track employee certificates</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            iconName="Download" 
            iconPosition="left"
            onClick={handleExportAll}
          >
            Export All
          </Button>
          <Button 
            variant="default" 
            iconName="Plus" 
            iconPosition="left"
            onClick={handleGenerateCertificate}
          >
            Generate Certificate
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search by employee name, course, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
          <Select
            options={departmentOptions}
            value={departmentFilter}
            onChange={setDepartmentFilter}
            placeholder="Filter by department"
          />
        </div>
      </div>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Certificates</p>
              <p className="text-2xl font-bold text-foreground">{certificates?.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Icon name="Award" size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-success">
                {certificates?.filter(c => c?.status === 'active')?.length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expiring Soon</p>
              <p className="text-2xl font-bold text-warning">
                {certificates?.filter(c => c?.status === 'expiring_soon')?.length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Icon name="AlertTriangle" size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Expired</p>
              <p className="text-2xl font-bold text-error">
                {certificates?.filter(c => c?.status === 'expired')?.length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <Icon name="XCircle" size={24} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>
      {/* Certificates Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="text-left p-4 font-medium text-foreground">Employee</th>
                <th className="text-left p-4 font-medium text-foreground">Course</th>
                <th className="text-left p-4 font-medium text-foreground">Issue Date</th>
                <th className="text-left p-4 font-medium text-foreground">Expiry Date</th>
                <th className="text-left p-4 font-medium text-foreground">Status</th>
                <th className="text-left p-4 font-medium text-foreground">Score</th>
                <th className="text-left p-4 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCertificates?.map((certificate) => (
                <tr key={certificate?.id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src={certificate?.avatar}
                        alt={certificate?.employeeName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-foreground">{certificate?.employeeName}</p>
                        <p className="text-sm text-muted-foreground">{certificate?.employeeId} • {certificate?.department}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-foreground">{certificate?.courseName}</p>
                    <p className="text-sm text-muted-foreground">ID: {certificate?.id}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-foreground">{formatDate(certificate?.issueDate)}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-foreground">{formatDate(certificate?.expiryDate)}</p>
                    {certificate?.status === 'expiring_soon' && (
                      <p className="text-sm text-warning">
                        {getDaysUntilExpiry(certificate?.expiryDate)} days left
                      </p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(certificate?.status)}`}>
                      <Icon name={getStatusIcon(certificate?.status)} size={12} className="mr-1" />
                      {certificate?.status?.replace('_', ' ')?.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-foreground">{certificate?.score}%</span>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${certificate?.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadCertificate(certificate)}
                        iconName="Download"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleVerifyCertificate(certificate)}
                        iconName="ExternalLink"
                      />
                      {certificate?.status === 'expired' || certificate?.status === 'expiring_soon' ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRenewCertificate(certificate)}
                          iconName="RefreshCw"
                          className="text-success hover:text-success"
                        />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevokeCertificate(certificate)}
                          iconName="Ban"
                          className="text-error hover:text-error"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCertificates?.length === 0 && (
          <div className="text-center py-12">
            <Icon name="Award" size={48} className="text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No certificates found matching your criteria</p>
          </div>
        )}
      </div>
      
      {/* Certificate Generation Modal */}
      {isGenerationModalOpen && (
        <CertificateGenerationModal
          isOpen={isGenerationModalOpen}
          onClose={() => setIsGenerationModalOpen(false)}
          onSuccess={handleGenerationSuccess}
        />
      )}
    </div>
  );
};

export default CertificateManager;
