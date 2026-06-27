import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FileText, Printer, X, CheckCircle, Package, Truck, Gift } from 'lucide-react';

function Orders() {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Invoice Modal State
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/order/user-orders`, {}, {
        headers: { token }
      });
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach(order => {
          order.items.forEach(item => {
            // Store parent order details directly on each flattened item
            item['status'] = order.status;
            item['payment'] = order.payment;
            item['paymentMethod'] = order.paymentMethod;
            item['date'] = order.date;
            item['orderId'] = order._id;
            item['address'] = order.address;
            item['amount'] = order.amount;
            item['fullItems'] = order.items; // Store all sibling items in the same order
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Helper to map status to step index for visual timeline
  const getStatusStep = (status) => {
    switch (status) {
      case "Order Placed": return 0;
      case "Preparing": return 1;
      case "Shipped": return 2;
      case "Delivered": return 3;
      default: return 1; // Default middle step
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className='border-t pt-16 pb-20 min-h-[85vh]'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div className='mt-8'>
        {loading ? (
          <p className='text-gray-500'>Loading your fragrance orders...</p>
        ) : orderData.length === 0 ? (
          <div className='text-center py-10 bg-[#faf9f6] border rounded'>
            <p className='text-gray-500 font-medium'>You have not placed any orders yet.</p>
            <p className='text-xs text-gray-400 mt-1'>Explore our collection to find your signature scent!</p>
          </div>
        ) : (
          <div className='flex flex-col gap-6'>
            {orderData.map((item, index) => {
              const activeStep = getStatusStep(item.status);
              
              return (
                <div key={index} className='bg-white p-5 border rounded-lg shadow-sm hover:shadow transition-shadow duration-300 flex flex-col gap-4'>
                  {/* Top Row: Basic Info */}
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 gap-2'>
                    <div className='flex items-center gap-3'>
                      <span className='text-[10px] bg-gray-100 text-gray-600 font-semibold px-2 py-1 rounded'>
                        ID: {item.orderId}
                      </span>
                      <span className='text-[10px] text-gray-400'>
                        {new Date(item.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </span>
                    </div>
                    <button 
                      onClick={() => setSelectedInvoice(item)}
                      className='text-xs font-bold text-[#c5a880] hover:text-[#b09b70] flex items-center gap-1 self-start'
                    >
                      <FileText className='w-4 h-4' /> View Invoice Details
                    </button>
                  </div>

                  {/* Middle Row: Product details & Tracking timeline */}
                  <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
                    {/* Product Details */}
                    <div className='flex items-start gap-4 text-sm max-w-sm'>
                      <img src={item.image[0]} className='w-16 h-16 rounded border bg-[#faf9f6] object-contain flex-shrink-0' alt="" />
                      <div>
                        <p className='font-bold text-gray-900 leading-snug'>{item.name}</p>
                        <div className='flex items-center gap-4 mt-1.5 text-xs text-gray-500 font-semibold'>
                          <p>{currency}{item.price}</p>
                          <p>Qty: {item.quantity}</p>
                          <p className='px-1.5 py-0.5 border bg-slate-50 text-[10px] rounded'>{item.size}</p>
                        </div>
                        <p className='text-[10px] text-gray-400 mt-2'>Payment method: <span className='font-bold'>{item.paymentMethod}</span></p>
                      </div>
                    </div>

                    {/* Interactive Visual Tracking Timeline */}
                    <div className='flex-1 max-w-md flex flex-col gap-2.5'>
                      <div className='flex items-center gap-2'>
                        <span className={`w-2 h-2 rounded-full ${activeStep === 3 ? 'bg-green-500' : activeStep === 2 ? 'bg-blue-500' : 'bg-[#c5a880]'} animate-pulse`} />
                        <p className='text-xs font-bold uppercase tracking-wider text-gray-800'>Current Status: {item.status}</p>
                      </div>
                      
                      {/* CSS/Tailwind Timeline Track */}
                      <div className='relative flex items-center justify-between w-full mt-2 px-1'>
                        {/* Background line */}
                        <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-150 z-0'></div>
                        {/* Active line */}
                        <div 
                          className='absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#c5a880] z-0 transition-all duration-700 ease-out'
                          style={{ width: `${(activeStep / 3) * 100}%` }}
                        ></div>

                        {/* Timeline Nodes */}
                        {['Placed', 'Preparing', 'Shipped', 'Delivered'].map((step, idx) => {
                          const IconComponent = idx === 0 ? CheckCircle : idx === 1 ? Package : idx === 2 ? Truck : Gift;
                          
                          return (
                            <div key={idx} className='flex flex-col items-center z-10'>
                              <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-500 shadow-sm ${
                                idx <= activeStep 
                                  ? 'bg-[#c5a880] border-[#c5a880] text-white scale-110' 
                                  : 'bg-white border-gray-200 text-gray-300'
                              }`} title={step}>
                                <IconComponent className='w-3 h-3' />
                              </div>
                              <span className={`text-[8px] font-bold mt-1.5 uppercase tracking-widest ${
                                idx <= activeStep ? 'text-[#c5a880]' : 'text-gray-400'
                              }`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button 
                      onClick={fetchOrders} 
                      className='border border-gray-200 px-4 py-2 text-xs font-semibold rounded hover:bg-gray-50 transition-colors self-center lg:self-auto cursor-pointer'
                    >
                      Refresh status
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INVOICE MODAL OVERLAY */}
      {selectedInvoice && (
        <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in'>
          {/* Modal Container */}
          <div className='bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]'>
            {/* Header / Actions */}
            <div className='bg-gray-50 border-b p-4 flex justify-between items-center z-10 no-print'>
              <h3 className='font-bold text-xs text-gray-500 uppercase tracking-widest'>Invoice Explorer</h3>
              <div className='flex items-center gap-3'>
                <button 
                  onClick={handlePrint}
                  className='bg-black text-white px-4 py-2 rounded text-xs font-semibold hover:bg-gray-800 transition-all flex items-center gap-1.5 cursor-pointer'
                >
                  <Printer className='w-4 h-4' /> Print / Save PDF
                </button>
                <button 
                  onClick={() => setSelectedInvoice(null)}
                  className='p-1.5 rounded-full hover:bg-gray-200 transition-colors text-gray-400 hover:text-black cursor-pointer'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>
            </div>

            {/* Printable Invoice Area */}
            <div id="print-invoice-area" className='p-8 overflow-y-auto flex-1 text-gray-800 font-sans'>
              
              {/* CSS Print Rules overrides */}
              <style dangerouslySetInnerHTML={{__html: `
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #print-invoice-area, #print-invoice-area * {
                    visibility: visible;
                  }
                  #print-invoice-area {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 0;
                  }
                  .no-print {
                    display: none !important;
                  }
                }
              `}} />

              {/* Brand Banner */}
              <div className='text-center border-b-2 border-[#c5a880] pb-6 mb-6'>
                <h1 className='text-3xl font-bold tracking-[0.2em] text-gray-900 prata-regular uppercase'>L'ARÔME</h1>
                <p className='text-[10px] uppercase tracking-[0.3em] text-[#c5a880] mt-1 font-bold'>Luxury Parfums</p>
                <p className='text-[10px] text-gray-400 mt-2'>500 Luxury Way, Suite 100 • New Delhi, India • concierge@larome.com</p>
              </div>

              {/* Invoice Meta */}
              <div className='flex justify-between items-start gap-4 mb-6 text-xs leading-relaxed'>
                <div>
                  <h4 className='font-bold text-gray-500 uppercase tracking-wider mb-1'>Billed To:</h4>
                  <p className='font-bold text-gray-900 text-sm'>{selectedInvoice.address.firstName} {selectedInvoice.address.lastName}</p>
                  <p className='text-gray-500'>{selectedInvoice.address.street}</p>
                  <p className='text-gray-500'>{selectedInvoice.address.city}, {selectedInvoice.address.state} - {selectedInvoice.address.zipcode}</p>
                  <p className='text-gray-500'>Phone: {selectedInvoice.address.phone}</p>
                </div>
                <div className='text-right'>
                  <h4 className='font-bold text-gray-500 uppercase tracking-wider mb-1'>Receipt Info:</h4>
                  <p><strong>Order ID:</strong> {selectedInvoice.orderId}</p>
                  <p><strong>Date:</strong> {new Date(selectedInvoice.date).toLocaleDateString()}</p>
                  <p><strong>Method:</strong> {selectedInvoice.paymentMethod} ({selectedInvoice.payment ? 'Paid' : 'Pending'})</p>
                </div>
              </div>

              {/* Invoice Table */}
              <table className='w-full text-left text-xs border-collapse mb-6'>
                <thead>
                  <tr className='border-b bg-gray-50 text-gray-600 font-bold uppercase'>
                    <th className='p-2.5'>Perfume description</th>
                    <th className='p-2.5 text-center'>Size</th>
                    <th className='p-2.5 text-center'>Quantity</th>
                    <th className='p-2.5 text-right'>Unit Price</th>
                    <th className='p-2.5 text-right'>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.fullItems && selectedInvoice.fullItems.map((prod, i) => (
                    <tr key={i} className='border-b'>
                      <td className='p-2.5 font-semibold text-gray-900'>{prod.name}</td>
                      <td className='p-2.5 text-center text-gray-500'>{prod.size}</td>
                      <td className='p-2.5 text-center text-gray-500'>{prod.quantity}</td>
                      <td className='p-2.5 text-right text-gray-500'>{currency} {prod.price.toFixed(2)}</td>
                      <td className='p-2.5 text-right font-semibold text-gray-900'>{currency} {(prod.price * prod.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Breakdown */}
              <div className='flex justify-end'>
                <div className='w-64 text-xs flex flex-col gap-2'>
                  <div className='flex justify-between text-gray-500'>
                    <p>Subtotal</p>
                    <p>{currency} {(selectedInvoice.amount - 100).toFixed(2)}</p>
                  </div>
                  <div className='flex justify-between text-gray-500 border-b pb-2'>
                    <p>Shipping Cost</p>
                    <p>{currency} 100.00</p>
                  </div>
                  <div className='flex justify-between font-bold text-sm text-gray-900 pt-1'>
                    <p>Grand Total</p>
                    <p>{currency} {selectedInvoice.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Note Footer */}
              <div className='mt-12 pt-6 border-t text-center text-[10px] text-gray-400 leading-relaxed italic'>
                <p>All L'Arôme extraits are bottled under clean laboratory controls and hand-delivered in silk wrappers.</p>
                <p className='mt-1'>Thank you for your patronage. If you have inquiries, contact us at concierge@larome.com</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;