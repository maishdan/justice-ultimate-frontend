import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../ui/tabs';
import { 
  FiDollarSign, 
  FiCreditCard, 
  FiClock, 
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiDownload,
  FiPlus,
  FiShield,
  FiTrendingUp,
  FiCalendar,
  FiMapPin
} from 'react-icons/fi';

export default function Payments() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('transactions');

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch transactions
        const { data: transactionsData } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch payment methods
        const { data: paymentMethodsData } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id);

        setTransactions(transactionsData || []);
        setPaymentMethods(paymentMethodsData || []);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const mockTransactions = [
    {
      id: '1',
      type: 'rental_payment',
      amount: 45000,
      currency: 'KES',
      status: 'completed',
      date: '2024-01-15',
      description: 'BMW X5 Rental - 3 days',
      payment_method: 'M-Pesa',
      reference: 'TXN-001234'
    },
    {
      id: '2',
      type: 'deposit',
      amount: 10000,
      currency: 'KES',
      status: 'completed',
      date: '2024-01-14',
      description: 'Security Deposit',
      payment_method: 'Credit Card',
      reference: 'TXN-001235'
    },
    {
      id: '3',
      type: 'refund',
      amount: -5000,
      currency: 'KES',
      status: 'pending',
      date: '2024-01-13',
      description: 'Partial Refund - Early Return',
      payment_method: 'M-Pesa',
      reference: 'TXN-001236'
    },
    {
      id: '4',
      type: 'service_fee',
      amount: 2500,
      currency: 'KES',
      status: 'completed',
      date: '2024-01-12',
      description: 'Late Return Fee',
      payment_method: 'Credit Card',
      reference: 'TXN-001237'
    },
    {
      id: '5',
      type: 'rental_payment',
      amount: 35000,
      currency: 'KES',
      status: 'failed',
      date: '2024-01-11',
      description: 'Mercedes S-Class Rental - 2 days',
      payment_method: 'M-Pesa',
      reference: 'TXN-001238'
    }
  ];

  const mockPaymentMethods = [
    {
      id: '1',
      type: 'mpesa',
      name: 'M-Pesa',
      number: '254722827458',
      is_default: true,
      status: 'active'
    },
    {
      id: '2',
      type: 'credit_card',
      name: 'Visa Card',
      number: '**** **** **** 1234',
      expiry: '12/25',
      is_default: false,
      status: 'active'
    },
    {
      id: '3',
      type: 'bank_transfer',
      name: 'Equity Bank',
      number: '1234567890',
      is_default: false,
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'rental_payment':
        return <FiDollarSign className="text-blue-500" />;
      case 'deposit':
        return <FiShield className="text-green-500" />;
      case 'refund':
        return <FiTrendingUp className="text-purple-500" />;
      case 'service_fee':
        return <FiAlertTriangle className="text-orange-500" />;
      default:
        return <FiDollarSign className="text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    const sign = amount >= 0 ? '+' : '';
    return `${sign}${currency} ${Math.abs(amount).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment information...</p>
        </div>
      </div>
    );
  }

  const totalSpent = mockTransactions
    .filter(t => t.status === 'completed' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = mockTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments & Billing</h1>
          <p className="text-gray-600">Manage your transactions and payment methods</p>
        </div>
        <div className="flex gap-4">
          <Button>
            <FiPlus className="mr-2" />
            Add Payment Method
          </Button>
          <Button variant="outline">
            <FiDownload className="mr-2" />
            Export Statement
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-green-600">KES {totalSpent.toLocaleString()}</p>
              </div>
              <FiDollarSign className="text-green-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-yellow-600">KES {pendingAmount.toLocaleString()}</p>
              </div>
              <FiClock className="text-yellow-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">{mockTransactions.length}</p>
              </div>
              <FiCreditCard className="text-blue-500 text-xl" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Payment Methods</p>
                <p className="text-2xl font-bold text-purple-600">{mockPaymentMethods.length}</p>
              </div>
              <FiShield className="text-purple-500 text-xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Transaction</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Payment Method</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(transaction.type)}
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-gray-500">{transaction.reference}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${
                            transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {formatAmount(transaction.amount, transaction.currency)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {transaction.payment_method}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <FiDownload className="w-4 h-4" />
                            </Button>
                            {transaction.status === 'failed' && (
                              <Button size="sm" variant="outline">
                                <FiAlertTriangle className="w-4 h-4" />
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

        {/* Payment Methods Tab */}
        <TabsContent value="methods" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPaymentMethods.map((method) => (
              <Card key={method.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {method.type === 'mpesa' && (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">M</span>
                        </div>
                      )}
                      {method.type === 'credit_card' && (
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <FiCreditCard className="text-white" />
                        </div>
                      )}
                      {method.type === 'bank_transfer' && (
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <FiShield className="text-white" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.number}</p>
                      </div>
                    </div>
                    {method.is_default && (
                      <Badge className="bg-green-100 text-green-800">Default</Badge>
                    )}
                  </div>

                  {method.expiry && (
                    <p className="text-sm text-gray-600 mb-4">Expires: {method.expiry}</p>
                  )}

                  <div className="flex gap-2">
                    {!method.is_default && (
                      <Button size="sm" className="flex-1">
                        Set as Default
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <FiDownload className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <FiXCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Add New Payment Method Card */}
            <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiPlus className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="font-semibold mb-2">Add Payment Method</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add a new payment method for faster checkout
                  </p>
                  <Button>
                    <FiPlus className="mr-2" />
                    Add New
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
