// Risk Register Template Generator
// Generates downloadable templates for risk register in Excel and CSV formats

export const generateRiskRegisterTemplate = (format = 'csv') => {
  const headers = [
    'Risk ID',
    'Risk Title',
    'Risk Description',
    'Risk Category',
    'Risk Owner',
    'Department',
    'Likelihood (1-5)',
    'Impact (1-5)',
    'Risk Score',
    'Risk Level',
    'Current Controls',
    'Control Effectiveness',
    'Treatment Plan',
    'Treatment Owner',
    'Treatment Due Date',
    'Residual Likelihood (1-5)',
    'Residual Impact (1-5)',
    'Residual Risk Score',
    'Residual Risk Level',
    'Status',
    'Next Review Date',
    'Comments'
  ];

  const sampleData = [
    {
      'Risk ID': 'RISK-001',
      'Risk Title': 'Data Breach',
      'Risk Description': 'Potential unauthorized access to sensitive customer data',
      'Risk Category': 'Information Security',
      'Risk Owner': 'IT Security Manager',
      'Department': 'Information Technology',
      'Likelihood (1-5)': '3',
      'Impact (1-5)': '5',
      'Risk Score': '15',
      'Risk Level': 'High',
      'Current Controls': 'Firewall, access controls, encryption',
      'Control Effectiveness': 'Moderate',
      'Treatment Plan': 'Implement additional monitoring and staff training',
      'Treatment Owner': 'IT Security Team',
      'Treatment Due Date': '2024-12-31',
      'Residual Likelihood (1-5)': '2',
      'Residual Impact (1-5)': '4',
      'Residual Risk Score': '8',
      'Residual Risk Level': 'Medium',
      'Status': 'Active',
      'Next Review Date': '2024-06-30',
      'Comments': 'Regular monitoring required'
    },
    {
      'Risk ID': 'RISK-002',
      'Risk Title': 'Service Disruption',
      'Risk Description': 'System downtime affecting business operations',
      'Risk Category': 'Operational',
      'Risk Owner': 'Operations Manager',
      'Department': 'Operations',
      'Likelihood (1-5)': '2',
      'Impact (1-5)': '4',
      'Risk Score': '8',
      'Risk Level': 'Medium',
      'Current Controls': 'Backup systems, maintenance schedules',
      'Control Effectiveness': 'Good',
      'Treatment Plan': 'Implement redundant systems',
      'Treatment Owner': 'Infrastructure Team',
      'Treatment Due Date': '2024-09-30',
      'Residual Likelihood (1-5)': '1',
      'Residual Impact (1-5)': '3',
      'Residual Risk Score': '3',
      'Residual Risk Level': 'Low',
      'Status': 'Active',
      'Next Review Date': '2024-03-31',
      'Comments': 'Monitor system performance'
    }
  ];

  if (format === 'csv') {
    return generateCSVTemplate(headers, sampleData);
  } else if (format === 'excel') {
    return generateExcelTemplate(headers, sampleData);
  }
};

const generateCSVTemplate = (headers, sampleData) => {
  const csvContent = [
    headers.join(','),
    ...sampleData.map(row => 
      headers.map(header => {
        const value = row[header] || '';
        // Escape commas and quotes in CSV
        return value.includes(',') || value.includes('"') 
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `risk-register-template-${new Date().toISOString().split('T')[0]}.csv`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return csvContent;
};

const generateExcelTemplate = (headers, sampleData) => {
  // Simple Excel XML format
  const xmlContent = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 
<Worksheet ss:Name="Risk Register Template">
  <Table>
    <Row>
      ${headers.map(header => `<Cell><Data ss:Type="String">${header}</Data></Cell>`).join('')}
    </Row>
    ${sampleData.map(row => 
      `<Row>
        ${headers.map(header => {
          const value = row[header] || '';
          const isNumber = !isNaN(value) && value !== '';
          return `<Cell><Data ss:Type="${isNumber ? 'Number' : 'String'}">${value}</Data></Cell>`;
        }).join('')}
      </Row>`
    ).join('')}
  </Table>
</Worksheet>
</Workbook>`;

  // Create blob and download
  const blob = new Blob([xmlContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `risk-register-template-${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return xmlContent;
};

// Validation function for uploaded risk register files
export const validateRiskRegisterFile = (file) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  const allowedExtensions = ['.csv', '.xls', '.xlsx'];

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only CSV and Excel files are allowed.');
  }

  // Check file extension
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension. Only .csv, .xls, and .xlsx files are allowed.');
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 10MB.');
  }

  return true;
};

// Parse CSV content
export const parseCSVContent = (csvContent) => {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) {
    throw new Error('File appears to be empty.');
  }

  const headers = lines[0].split(',').map(header => header.replace(/"/g, '').trim());
  const requiredHeaders = ['Risk ID', 'Risk Title', 'Risk Description', 'Risk Category'];
  
  // Check if required headers are present
  const missingHeaders = requiredHeaders.filter(required => 
    !headers.some(header => header.toLowerCase().includes(required.toLowerCase()))
  );

  if (missingHeaders.length > 0) {
    throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
  }

  const data = lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.replace(/"/g, '').trim());
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    return record;
  });

  return { headers, data };
};

// Generate instructions for risk register template
export const getRiskRegisterInstructions = () => {
  return {
    title: "Risk Register Template Instructions",
    sections: [
      {
        title: "Getting Started",
        content: [
          "Download the template in CSV or Excel format",
          "Fill in your organization's risk data",
          "Upload the completed file to import risks"
        ]
      },
      {
        title: "Required Fields",
        content: [
          "Risk ID: Unique identifier for each risk",
          "Risk Title: Short descriptive name",
          "Risk Description: Detailed explanation of the risk",
          "Risk Category: Classification (e.g., Financial, Operational, Strategic)"
        ]
      },
      {
        title: "Risk Scoring",
        content: [
          "Likelihood: Scale of 1-5 (1=Very Low, 5=Very High)",
          "Impact: Scale of 1-5 (1=Insignificant, 5=Catastrophic)",
          "Risk Score: Automatically calculated (Likelihood × Impact)",
          "Risk Level: Low (1-6), Medium (7-12), High (13-20), Critical (21-25)"
        ]
      },
      {
        title: "File Requirements",
        content: [
          "Supported formats: CSV (.csv), Excel (.xls, .xlsx)",
          "Maximum file size: 10MB",
          "Ensure all required columns are present",
          "Use the provided template for best results"
        ]
      }
    ]
  };
};
