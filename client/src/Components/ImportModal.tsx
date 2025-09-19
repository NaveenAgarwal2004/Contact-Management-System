import React, { useState, useRef } from 'react';
import { Contact } from '../types/Contact';
import { X, Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (contacts: Contact[]) => void;
}

interface ImportStep {
  id: number;
  title: string;
  description: string;
}

interface ParsedData {
  headers: string[];
  rows: string[][];
  preview: string[][];
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps: ImportStep[] = [
    { id: 1, title: 'Upload File', description: 'Choose a CSV file to import' },
    { id: 2, title: 'Map Fields', description: 'Match CSV columns to contact fields' },
    { id: 3, title: 'Review', description: 'Preview and confirm import' },
    { id: 4, title: 'Complete', description: 'Import completed successfully' }
  ];

  const contactFields = [
    { key: 'firstName', label: 'First Name', required: true },
    { key: 'lastName', label: 'Last Name', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'phone', label: 'Phone', required: false },
    { key: 'company', label: 'Company', required: false },
    { key: 'position', label: 'Position', required: false },
    { key: 'address', label: 'Address', required: false },
    { key: 'notes', label: 'Notes', required: false },
    { key: 'tags', label: 'Tags (separated by semicolons)', required: false }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setFile(selectedFile);
    setError(null);
    parseCSV(selectedFile);
  };

  const parseCSV = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setError('CSV file must have at least a header row and one data row');
          setIsProcessing(false);
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const rows = lines.slice(1).map(line => 
          line.split(',').map(cell => cell.trim().replace(/"/g, ''))
        );

        setParsedData({
          headers,
          rows,
          preview: rows.slice(0, 5) // Show first 5 rows for preview
        });

        // Auto-map obvious fields
        const autoMapping: Record<string, string> = {};
        headers.forEach((header, index) => {
          const lowerHeader = header.toLowerCase();
          if (lowerHeader.includes('first') && lowerHeader.includes('name')) {
            autoMapping[index.toString()] = 'firstName';
          } else if (lowerHeader.includes('last') && lowerHeader.includes('name')) {
            autoMapping[index.toString()] = 'lastName';
          } else if (lowerHeader.includes('email')) {
            autoMapping[index.toString()] = 'email';
          } else if (lowerHeader.includes('phone')) {
            autoMapping[index.toString()] = 'phone';
          } else if (lowerHeader.includes('company')) {
            autoMapping[index.toString()] = 'company';
          } else if (lowerHeader.includes('position') || lowerHeader.includes('title')) {
            autoMapping[index.toString()] = 'position';
          } else if (lowerHeader.includes('address')) {
            autoMapping[index.toString()] = 'address';
          } else if (lowerHeader.includes('note')) {
            autoMapping[index.toString()] = 'notes';
          } else if (lowerHeader.includes('tag')) {
            autoMapping[index.toString()] = 'tags';
          }
        });

        setFieldMapping(autoMapping);
        setCurrentStep(2);
        setIsProcessing(false);
      } catch (err) {
        setError('Failed to parse CSV file. Please check the file format.');
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleFieldMappingChange = (csvIndex: string, contactField: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [csvIndex]: contactField
    }));
  };

  const validateMapping = (): string[] => {
    const errors: string[] = [];
    const requiredFields = contactFields.filter(f => f.required).map(f => f.key);
    const mappedFields = Object.values(fieldMapping);

    requiredFields.forEach(field => {
      if (!mappedFields.includes(field)) {
        const fieldLabel = contactFields.find(f => f.key === field)?.label || field;
        errors.push(`${fieldLabel} is required but not mapped`);
      }
    });

    return errors;
  };

  const handleReview = () => {
    const errors = validateMapping();
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }
    setCurrentStep(3);
    setError(null);
  };

  const handleImport = async () => {
    if (!parsedData) return;

    setIsProcessing(true);
    try {
      const contacts: Contact[] = parsedData.rows.map((row, index) => {
        const contact: any = {
          id: `imported-${Date.now()}-${index}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isFavorite: false,
          avatar: null,
          priority: 'medium',
          status: 'active'
        };

        // Map CSV data to contact fields
        Object.entries(fieldMapping).forEach(([csvIndex, contactField]) => {
          const value = row[parseInt(csvIndex)];
          if (value && value.trim()) {
            if (contactField === 'tags') {
              contact[contactField] = value.split(';').map(tag => tag.trim()).filter(tag => tag);
            } else {
              contact[contactField] = value.trim();
            }
          }
        });

        // Set default values for required fields if not provided
        if (!contact.firstName) contact.firstName = 'Unknown';
        if (!contact.lastName) contact.lastName = 'Contact';
        if (!contact.email) contact.email = `imported-${index}@example.com`;
        if (!contact.phone) contact.phone = '';
        if (!contact.company) contact.company = '';
        if (!contact.position) contact.position = '';
        if (!contact.address) contact.address = '';
        if (!contact.notes) contact.notes = '';
        if (!contact.tags) contact.tags = [];

        return contact as Contact;
      });

      onImport(contacts);
      setCurrentStep(4);
    } catch (err) {
      setError('Failed to import contacts. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadSampleCSV = () => {
    const sampleData = [
      ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Position', 'Address', 'Notes', 'Tags'],
      ['John', 'Doe', 'john.doe@example.com', '+1-555-0123', 'Apple Inc.', 'Software Engineer', '1 Apple Park, Cupertino, CA', 'Key contact for iOS development', 'client;tech;vip'],
      ['Jane', 'Smith', 'jane.smith@example.com', '+1-555-0124', 'Google LLC', 'Product Manager', '1600 Amphitheatre Pkwy, Mountain View, CA', 'Product strategy lead', 'partner;product'],
      ['Mike', 'Johnson', 'mike.johnson@example.com', '+1-555-0125', 'Microsoft Corp.', 'Designer', '1 Microsoft Way, Redmond, WA', 'UI/UX specialist', 'team;design']
    ];

    const csvContent = sampleData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_contacts.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const resetModal = () => {
    setCurrentStep(1);
    setFile(null);
    setParsedData(null);
    setFieldMapping({});
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Upload size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Import Contacts</h2>
              <p className="text-gray-600">Import contacts from a CSV file</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((step) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${
                  step.id === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : step.id < currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id < currentStep ? '✓' : step.id}
                </div>
                <div className="ml-3 text-sm">
                  <div className={`font-medium ${
                    step.id === currentStep ? 'text-blue-600' : 'text-gray-900'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-gray-500">{step.description}</div>
                </div>
                {step.id < steps.length && (
                  <div className={`h-px w-16 mx-4 ${
                    step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Step 1: Upload File */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors">
                  <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">Upload CSV File</h3>
                    <p className="text-gray-600">Choose a CSV file containing your contacts</p>
                  </div>
                  <div className="mt-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Select File
                    </button>
                  </div>
                  {file && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center space-x-3">
                      <FileText size={16} className="text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• First row should contain column headers</li>
                  <li>• Required fields: First Name, Last Name, Email</li>
                  <li>• Optional fields: Phone, Company, Position, Address, Notes, Tags</li>
                  <li>• Tags should be separated by semicolons (;)</li>
                </ul>
                <div className="mt-3">
                  <button
                    onClick={downloadSampleCSV}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Download size={16} />
                    <span>Download Sample CSV</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Map Fields */}
          {currentStep === 2 && parsedData && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Map CSV Columns to Contact Fields</h3>
                <p className="text-gray-600 mb-6">
                  Match each column from your CSV file to the appropriate contact field. Required fields are marked with *.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">CSV Columns</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {parsedData.headers.map((header, index) => (
                      <div key={index} className="p-3 bg-gray-100 rounded-lg">
                        <div className="font-medium text-sm text-gray-900">{header}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          Sample: {parsedData.preview[0]?.[index] || 'N/A'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Contact Fields</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {parsedData.headers.map((header, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="flex-1 text-sm font-medium text-gray-700">
                          {header}
                        </div>
                        <select
                          value={fieldMapping[index] || ''}
                          onChange={(e) => handleFieldMappingChange(index.toString(), e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Skip this column</option>
                          {contactFields.map((field) => (
                            <option key={field.key} value={field.key}>
                              {field.label} {field.required ? '*' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleReview}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Review Import
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {currentStep === 3 && parsedData && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Import</h3>
                <p className="text-gray-600">
                  Review the mapped data below. {parsedData.rows.length} contacts will be imported.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        {Object.values(fieldMapping).map((field) => {
                          const fieldInfo = contactFields.find(f => f.key === field);
                          return (
                            <th key={field} className="text-left text-xs font-medium text-gray-700 uppercase tracking-wider p-2">
                              {fieldInfo?.label || field}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {parsedData.preview.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-t border-gray-200">
                          {Object.entries(fieldMapping).map(([csvIndex, contactField]) => (
                            <td key={contactField} className="p-2 text-sm text-gray-900">
                              {row[parseInt(csvIndex)] || '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedData.rows.length > 5 && (
                  <div className="text-center mt-4 text-sm text-gray-600">
                    Showing first 5 rows. {parsedData.rows.length - 5} more rows will be imported.
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Mapping
                </button>
                <button
                  onClick={handleImport}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isProcessing && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>{isProcessing ? 'Importing...' : 'Import Contacts'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Import Complete!</h3>
                <p className="text-gray-600">
                  Successfully imported {parsedData?.rows.length || 0} contacts.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}

          {/* Processing Overlay */}
          {isProcessing && currentStep !== 4 && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span className="text-lg font-medium text-gray-900">Processing...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};