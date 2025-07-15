import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { 
  FiFileText, 
  FiDownload, 
  FiEye, 
  FiUpload,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiShield,
  FiUser
} from 'react-icons/fi';
import { AiFillCar } from 'react-icons/ai';

export default function DocumentsLegal() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [contracts, setContracts] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState('documents');

  useEffect(() => {
    // Mock documents data
    const mockDocuments = [
      {
        id: '1',
        name: 'Driver\'s License',
        type: 'identification',
        status: 'verified',
        uploadDate: '2024-01-10',
        expiryDate: '2029-01-10',
        fileSize: '2.3 MB',
        isRequired: true
      },
      {
        id: '2',
        name: 'National ID',
        type: 'identification',
        status: 'verified',
        uploadDate: '2024-01-10',
        expiryDate: '2030-05-15',
        fileSize: '1.8 MB',
        isRequired: true
      },
      {
        id: '3',
        name: 'Proof of Address',
        type: 'residence',
        status: 'pending',
        uploadDate: '2024-01-12',
        expiryDate: null,
        fileSize: '1.2 MB',
        isRequired: true
      },
      {
        id: '4',
        name: 'Employment Letter',
        type: 'employment',
        status: 'verified',
        uploadDate: '2024-01-08',
        expiryDate: null,
        fileSize: '3.1 MB',
        isRequired: false
      },
      {
        id: '5',
        name: 'Bank Statement',
        type: 'financial',
        status: 'expired',
        uploadDate: '2023-12-01',
        expiryDate: '2024-01-01',
        fileSize: '4.5 MB',
        isRequired: false
      }
    ];

    const mockContracts = [
      {
        id: '1',
        contractNumber: 'CON-2024-001',
        vehicle: 'BMW X5',
        startDate: '2024-01-15',
        endDate: '2024-01-18',
        status: 'active',
        totalAmount: 135000,
        signedDate: '2024-01-14',
        type: 'rental'
      },
      {
        id: '2',
        contractNumber: 'CON-2024-002',
        vehicle: 'Mercedes S-Class',
        startDate: '2024-01-20',
        endDate: '2024-01-22',
        status: 'pending',
        totalAmount: 70000,
        signedDate: null,
        type: 'rental'
      },
      {
        id: '3',
        contractNumber: 'CON-2023-015',
        vehicle: 'Toyota Land Cruiser',
        startDate: '2023-12-20',
        endDate: '2023-12-25',
        status: 'completed',
        totalAmount: 250000,
        signedDate: '2023-12-19',
        type: 'rental'
      }
    ];

    setDocuments(mockDocuments);
    setContracts(mockContracts);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'identification':
        return <FiUser className="text-blue-500" />;
      case 'residence':
        return <FiShield className="text-green-500" />;
      case 'employment':
        return <FiFileText className="text-purple-500" />;
      case 'financial':
        return <FiShield className="text-orange-500" />;
      case 'rental':
        return <AiFillCar className="text-red-500" />;
      default:
        return <FiFileText className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isDocumentExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Documents & Legal</h1>
          <p className="text-gray-600">Manage your documents, contracts, and legal information</p>
        </div>
        <div className="flex gap-4">
          <Button>
            <FiUpload className="mr-2" />
            Upload Document
          </Button>
          <Button variant="outline">
            <FiDownload className="mr-2" />
            Download All
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold">{documents.length}</p>
              </div>
              <FiFileText className="text-blue-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {documents.filter(d => d.status === 'verified').length}
                </p>
              </div>
              <FiCheckCircle className="text-green-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {documents.filter(d => d.status === 'pending').length}
                </p>
              </div>
              <FiClock className="text-yellow-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Contracts</p>
                <p className="text-2xl font-bold text-purple-600">
                  {contracts.filter(c => c.status === 'active').length}
                </p>
              </div>
              <AiFillCar className="text-purple-500 text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs>
        <TabsList>
          <TabsTrigger label="Documents" selected={selectedTab === 'documents'} onClick={() => setSelectedTab('documents')} />
          <TabsTrigger label="Contracts" selected={selectedTab === 'contracts'} onClick={() => setSelectedTab('contracts')} />
        </TabsList>
        {selectedTab === 'documents' && (
          <TabsContent>
            {/* Documents Tab Content */}
            <Card>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Document</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Upload Date</th>
                        <th className="text-left py-3 px-4">Expiry Date</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              {getTypeIcon(doc.type)}
                              <div>
                                <p className="font-medium">{doc.name}</p>
                                <p className="text-sm text-gray-500">{doc.fileSize}</p>
                                {doc.isRequired && (
                                  <Badge variant="outline" className="text-xs">Required</Badge>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600 capitalize">
                            {doc.type.replace('_', ' ')}
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(doc.status)}>
                              {doc.status}
                            </Badge>
                            {isDocumentExpired(doc.expiryDate) && (
                              <Badge className="bg-red-100 text-red-800 ml-2">Expired</Badge>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {formatDate(doc.uploadDate)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {doc.expiryDate ? formatDate(doc.expiryDate) : 'N/A'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <FiEye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <FiDownload className="w-4 h-4" />
                              </Button>
                              {doc.status === 'pending' && (
                                <Button size="sm" variant="outline">
                                  <FiUpload className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        {selectedTab === 'contracts' && (
          <TabsContent>
            {/* Contracts Tab Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contracts.map((contract) => (
                <Card key={contract.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{contract.vehicle}</h3>
                        <p className="text-sm text-gray-600">{contract.contractNumber}</p>
                      </div>
                      <Badge className={getStatusColor(contract.status)}>
                        {contract.status}
                      </Badge>
                    </div>

                    <div className="space-y-3 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Start Date:</span>
                        <span className="font-semibold">{formatDate(contract.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>End Date:</span>
                        <span className="font-semibold">{formatDate(contract.endDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-semibold text-green-600">
                          KES {contract.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      {contract.signedDate && (
                        <div className="flex justify-between">
                          <span>Signed Date:</span>
                          <span className="font-semibold">{formatDate(contract.signedDate)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <FiDownload className="mr-2" />
                        Download Contract
                      </Button>
                      <Button size="sm" variant="outline">
                        <FiEye className="mr-2" />
                        View Details
                      </Button>
                      {contract.status === 'pending' && (
                        <Button size="sm" variant="outline">
                          <FiCheckCircle className="mr-2" />
                          Sign Contract
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Legal Information */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Legal Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Terms of Service</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Read our terms of service and rental agreement policies.
                </p>
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-600">
                  <FiDownload className="mr-2" />
                  Download Terms
                </Button>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Privacy Policy</h3>
                <p className="text-sm text-green-700 mb-3">
                  Learn how we protect and handle your personal information.
                </p>
                <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                  <FiDownload className="mr-2" />
                  Download Policy
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">Insurance Information</h3>
                <p className="text-sm text-purple-700 mb-3">
                  View your insurance coverage and claim procedures.
                </p>
                <Button size="sm" variant="outline" className="text-purple-600 border-purple-600">
                  <FiDownload className="mr-2" />
                  View Insurance
                </Button>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Rental Agreement</h3>
                <p className="text-sm text-orange-700 mb-3">
                  Standard rental agreement terms and conditions.
                </p>
                <Button size="sm" variant="outline" className="text-orange-600 border-orange-600">
                  <FiDownload className="mr-2" />
                  Download Agreement
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}