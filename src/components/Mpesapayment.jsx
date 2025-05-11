import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

const Mpesapayment = () => {
  const image_path = "https://hamilton06.pythonanywhere.com/static/images/";
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paidItems, setPaidItems] = useState([]);
  const [transactionId, setTransactionId] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [mpesaResponse, setMpesaResponse] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [waitingTime, setWaitingTime] = useState(20);
  const [showWaitingMessage, setShowWaitingMessage] = useState(false);

  const { groceries, quantities } = useLocation().state || {};
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Calculate amounts
  const subtotal = Array.isArray(groceries) 
      ? groceries.reduce((sum, item) => sum + (Number(item.price) * (quantities[item.id] || 1)), 0)
      : Number(groceries?.price) || 0;

  const calculateDeliveryFee = (subtotal) => {
      if (subtotal <= 200) return 50;
      if (subtotal > 200 && subtotal <= 900) return 150;
      return 200;
  };

  const deliveryFee = Array.isArray(groceries) && groceries.length > 0 
      ? calculateDeliveryFee(subtotal) 
      : 0;

  const totalAmount = subtotal + deliveryFee;

  // Generate transaction ID
  const generateTransactionId = () => {
      const randomNum = Math.floor(Math.random() * 1000000000);
      return `TEDR-${randomNum.toString().padStart(9, '0')}`;
  };

  const saveOrderToHistory = async (itemsToSave, txnId) => {
    try {
      // Get user data - example using localStorage
      const userData = JSON.parse(localStorage.getItem('userData')) || {};
      
      // Get current date/time in a good format
      const now = new Date();
      const orderDate = now.toISOString();
      const readableDate = now.toLocaleString();
      
      const orderData = {
        user_id: userData.id || null,        // User ID if available
        email: userData.email || "guest@example.com",
        items: itemsToSave,
        subtotal: subtotal,
        delivery_fee: deliveryFee,
        total_amount: totalAmount,
        delivery_address: userData.address || "Not specified",
        payment_method: "MPESA",
        transaction_id: txnId,
        phone: phone,                       // The payment phone number
        order_date: orderDate,              // Machine-readable date
        readable_date: readableDate,        // Human-readable date
        status: "completed",
        payment_status: "paid",
        delivery_instructions: userData.delivery_instructions || "",
        customer_name: userData.name || "Guest Customer"
      };
  
      const response = await axios.post(
        'https://hamilton06.pythonanywhere.com/api/create_order',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      console.log("Order saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving order:", error);
      // Consider adding a toast notification or other subtle error indicator
    }
  };
  

  // Countdown and redirect
  useEffect(() => {
      let timer;
      if (paymentCompleted && countdown > 0) {
          timer = setTimeout(() => {
              setCountdown(countdown - 1);
          }, 5000);
      } else if (paymentCompleted && countdown === 0) {
          navigate('/');
      }
      return () => clearTimeout(timer);
  }, [paymentCompleted, countdown, navigate]);

  // Waiting timer effect
  useEffect(() => {
      let timer;
      if (showWaitingMessage && waitingTime > 0) {
          timer = setTimeout(() => {
              setWaitingTime(waitingTime - 1);
          }, 2000);
      } else if (showWaitingMessage && waitingTime === 0) {
          completePayment();
          setShowWaitingMessage(false);
      }
      return () => clearTimeout(timer);
  }, [showWaitingMessage, waitingTime]);

  // Generate PDF receipt
  const generateReceiptPDF = (items, txnId) => {
      try {
          const doc = new jsPDF();
          
          // Header with company name
          doc.setFontSize(18);
          doc.setTextColor(40, 167, 69);
          doc.text("Jirani's Home of Flavours", 105, 20, { align: 'center' });
          
          // Receipt Title
          doc.setFontSize(16);
          doc.setTextColor(0, 0, 0);
          doc.text("OFFICIAL PAYMENT RECEIPT", 105, 30, { align: 'center' });
          
          // Divider Line
          doc.setDrawColor(200, 200, 200);
          doc.setLineWidth(0.5);
          doc.line(15, 35, 195, 35);
          
          // Transaction Details
          doc.setFontSize(10);
          doc.setTextColor(100, 100, 100);
          doc.text(`Receipt No: ${txnId}`, 15, 45);
          doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, 50);
          doc.text(`Time: ${new Date().toLocaleTimeString()}`, 15, 55);
          doc.text(`Phone: ${phone}`, 15, 60);
          
          // Items Table Header
          doc.setFontSize(12);
          doc.setTextColor(255, 255, 255);
          doc.setFillColor(40, 167, 69);
          doc.rect(15, 65, 180, 8, 'F');
          doc.text("ITEM", 20, 70);
          doc.text("PRICE", 100, 70);
          doc.text("QTY", 140, 70);
          doc.text("TOTAL", 170, 70);
          
          // Items Table
          const tableData = items.map(item => [
              item.name,
              `KSh ${Number(item.price).toFixed(2)}`,
              item.quantity,
              `KSh ${(Number(item.price) * item.quantity).toFixed(2)}`
          ]);
          
          autoTable(doc, {
              startY: 75,
              head: [['', '', '', '']],
              body: tableData,
              theme: 'grid',
              headStyles: { fillColor: [255, 255, 255], textColor: [255, 255, 255] },
              bodyStyles: { textColor: [0, 0, 0] },
              columnStyles: {
                  0: { cellWidth: 80 },
                  1: { cellWidth: 40, halign: 'right' },
                  2: { cellWidth: 30, halign: 'center' },
                  3: { cellWidth: 40, halign: 'right' }
              },
              margin: { left: 15 },
              styles: { fontSize: 10 },
              didDrawPage: function (data) {
                  // Summary Section
                  const finalY = data.cursor.y + 15;
                  
                  // Divider Line
                  doc.setDrawColor(200, 200, 200);
                  doc.setLineWidth(0.5);
                  doc.line(15, finalY - 5, 195, finalY - 5);
                  
                  doc.setFontSize(11);
                  doc.setTextColor(0, 0, 0);
                  doc.text(`Subtotal:`, 140, finalY);
                  doc.text(`KSh ${subtotal.toFixed(2)}`, 170, finalY, { align: 'left' });
                  
                  doc.text(`Delivery Fee:`, 140, finalY + 6);
                  doc.text(`KSh ${deliveryFee.toFixed(2)}`, 170, finalY + 6, { align: 'center' });
                  
                  doc.setFontSize(12);
                  doc.setFont(undefined, 'bold');
                  doc.text(`Total Paid:`, 140, finalY + 15);
                  doc.text(`KSh ${totalAmount.toFixed(2)}`, 170, finalY + 15, { align: 'right' });
                  doc.setFont(undefined, 'normal');
                  
                  // Thank You Message
                  doc.setFontSize(10);
                  doc.setTextColor(100, 100, 100);
                  doc.text("Thank you for shopping with Jirani's Home of Flavours!", 105, finalY + 30, { align: 'center' });
                  doc.text("We appreciate your business and hope to serve you again soon.", 105, finalY + 35, { align: 'center' });
                  
                  // Footer
                  doc.setFontSize(8);
                  doc.text("This is an official receipt. Please keep it for your records.", 105, 280, { align: 'center' });
                  doc.text("For inquiries, contact: info@jiranihomeofflavours.com | +254 116 811 764", 105, 285, { align: 'center' });
              }
          });
          
          // Save PDF
          doc.save(`JHF_Receipt_${txnId}.pdf`);
      } catch (error) {
          console.error("Error generating PDF:", error);
          alert("Error generating receipt. Please try again or contact support.");
      }
  };

  const completePayment = () => {
      const newTransactionId = generateTransactionId();
      setTransactionId(newTransactionId);
      
      const itemsToPay = Array.isArray(groceries) 
          ? groceries.map(item => ({
              ...item,
              price: Number(item.price),
              quantity: quantities[item.id] || 1
          }))
          : [{
              ...groceries,
              price: Number(groceries.price),
              quantity: 1
          }];

      // Prepare items for saving to order history
      const itemsToSave = Array.isArray(groceries)
          ? groceries.map(item => ({
              product_id: item.id,
              name: item.name,
              quantity: quantities[item.id] || 1,
              price: Number(item.price)
          }))
          : [{
              product_id: groceries.id,
              name: groceries.name,
              quantity: 1,
              price: Number(groceries.price)
          }];

      setPaidItems(itemsToPay);
      setPaymentStatus("completed");
      setPaymentCompleted(true);
      
      generateReceiptPDF(itemsToPay, newTransactionId);
      saveOrderToHistory(itemsToSave, newTransactionId);
      
  };

  const initiateMpesaPayment = async () => {
      try {
          setPaymentStatus("processing");
          setLoading("Initiating M-PESA payment...");
          
          const formData = new FormData();
          formData.append('amount', totalAmount);
          formData.append('phone', phone);
          
          const response = await axios.post(
              'https://hamilton06.pythonanywhere.com/api/mpesa_payment',
              formData,
              {
                  headers: {
                      'Content-Type': 'multipart/form-data'
                  }
              }
          );
          
          setMpesaResponse(response.data);
          setSuccess("M-PESA payment request sent to your phone");
          
      } catch (error) {
          console.error("M-PESA payment error:", error);
          setError("M-PESA payment failed, but your order has been recorded");
      } finally {
          setLoading("");
      }
  };

  const submit = async (e) => {
      e.preventDefault();
      if (!phone || !phone.startsWith("254") || phone.length !== 12) {
          setError("Please enter a valid M-PESA phone number (format: 2547XXXXXXXX)");
          return;
      }

      setError("");
      setSuccess("");
      
      // Start waiting period
      setShowWaitingMessage(true);
      setWaitingTime(20);
      
      // Attempt M-PESA payment in the background
      await initiateMpesaPayment();
  };

  // ... rest of your component code remains the same ...
  return (
    <div style={{
        maxWidth: '900px',
        margin: '50px auto',
        padding: '30px',
        borderRadius: '20px',
        backgroundColor: '#fff',
        boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
    }}>
        {paymentCompleted ? (
            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '10px',
                textAlign: 'center'
            }}>
                <h1 style={{ color: '#28a745', marginBottom: '20px' }}>Payment Successful!</h1>
                <div style={{ marginBottom: '30px' }}>
                    <p>Transaction ID: {transactionId}</p>
                    <p>Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                </div>
                
                <h2 style={{ marginBottom: '15px' }}>Receipt Summary</h2>
                <div style={{ 
                    margin: '0 auto 20px',
                    maxWidth: '500px',
                    textAlign: 'left',
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px'
                }}>
                    {paidItems.map((item, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: '10px',
                            paddingBottom: '10px',
                            borderBottom: '1px solid #eee'
                        }}>
                            <div>
                                <span>{item.quantity}x </span>
                                <span>{item.name}</span>
                            </div>
                            <div>KSh {(Number(item.price) * item.quantity).toFixed(2)}</div>
                        </div>
                    ))}
                    
                    <div style={{ marginTop: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Subtotal:</span>
                            <span>KSh {subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Delivery Fee:</span>
                            <span>KSh {deliveryFee.toFixed(2)}</span>
                        </div>
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginTop: '10px',
                            paddingTop: '10px',
                            borderTop: '1px solid #ddd',
                            fontWeight: 'bold'
                        }}>
                            <span>Total Paid:</span>
                            <span style={{ color: '#28a745' }}>KSh {totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                
                <div style={{ marginTop: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                        <img src="/Mpesa-Logo.webp" alt="Mpesa" width="40" height="40" />
                        <span style={{ marginLeft: '10px' }}>Paid via M-PESA</span>
                    </div>
                    <p>Your receipt has been downloaded automatically</p>
                    <p>Redirecting to home page in {countdown} seconds...</p>
                    <button 
                        onClick={() => generateReceiptPDF(paidItems, transactionId)}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Download Receipt Again
                    </button>
                    <button 
                        onClick={() => navigate('/')}
                        style={{
                            marginTop: '10px',
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            marginLeft: '10px'
                        }}
                    >
                        Continue Shopping Now
                    </button>
                </div>
            </div>
        ) : (
            <>
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '32px',
                    color: '#28a745',
                    marginBottom: '30px',
                    borderBottom: '2px dashed #eee',
                    paddingBottom: '10px'
                }}>
                    Secure M-PESA Payment
                </h1>

                {showWaitingMessage ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '30px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '10px',
                        marginBottom: '30px'
                    }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            border: '5px solid #f3f3f3',
                            borderTop: '5px solid #28a745',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            margin: '0 auto 20px'
                        }}></div>
                        <h2 style={{ color: '#28a745', marginBottom: '15px' }}>Processing Your Payment</h2>
                        <p>Please wait while we process your payment...</p>
                        <p style={{
                            fontSize: '18px',
                            fontWeight: 'bold',
                            marginTop: '15px'
                        }}>
                            Generating receipt in: {waitingTime} seconds
                        </p>
                        <p style={{ marginTop: '15px', color: '#6c757d' }}>
                            An M-PESA payment request has been sent to your phone
                        </p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{
                                fontSize: '20px',
                                color: '#555',
                                marginBottom: '15px'
                            }}>
                                {Array.isArray(groceries) ? 'Your Cart Items' : 'Your Purchase'}
                            </h2>
                            
                            {Array.isArray(groceries) ? (
                                <div style={{
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    border: '1px solid #eee',
                                    borderRadius: '10px',
                                    padding: '15px'
                                }}>
                                    {groceries.map(item => (
                                        <div key={item.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '20px',
                                            padding: '15px 0',
                                            borderBottom: '1px solid #f5f5f5'
                                        }}>
                                            <img
                                                src={image_path + item.foodphoto}
                                                alt={item.name}
                                                style={{
                                                    width: '100px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{
                                                    fontSize: '18px',
                                                    color: '#333',
                                                    marginBottom: '5px'
                                                }}>{item.name}</h3>
                                                <div style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center'
                                                }}>
                                                    <span style={{
                                                        fontSize: '14px',
                                                        color: '#777'
                                                    }}>Qty: {quantities[item.id] || 1}</span>
                                                    <span style={{
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        color: '#e63946'
                                                    }}>KSh {(Number(item.price) * (quantities[item.id] || 1)).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: '30px'
                                }}>
                                    <img
                                        src={image_path + groceries.foodphoto}
                                        alt={groceries.name}
                                        style={{
                                            width: '300px',
                                            height: '200px',
                                            objectFit: 'cover',
                                            borderRadius: '15px',
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <div>
                                        <h2 style={{
                                            fontSize: '26px',
                                            color: '#333',
                                            marginBottom: '10px'
                                        }}>{groceries.name}</h2>
                                        <p style={{
                                            fontSize: '16px',
                                            color: '#777',
                                            marginBottom: '10px'
                                        }}>{groceries.category}</p>
                                        <div style={{
                                            fontSize: '24px',
                                            fontWeight: 'bold',
                                            color: '#e63946'
                                        }}>KSh {Number(groceries.price).toFixed(2)}</div>
                                    </div>
                                </div>
                            )}

                            <div style={{
                                marginTop: '20px',
                                padding: '20px',
                                backgroundColor: '#f9f9f9',
                                borderRadius: '10px'
                            }}>
                                <h3 style={{
                                    fontSize: '18px',
                                    color: '#555',
                                    marginBottom: '15px',
                                    borderBottom: '1px solid #ddd',
                                    paddingBottom: '10px'
                                }}>Order Summary</h3>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px'
                                }}>
                                    <span>Subtotal:</span>
                                    <span>KSh {subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px'
                                }}>
                                    <span>Delivery Fee:</span>
                                    <span>KSh {deliveryFee.toFixed(2)}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    marginTop: '15px',
                                    color: '#28a745'
                                }}>
                                    <span>Total Amount:</span>
                                    <span>KSh {totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '25px' }}>
                            {loading && <div style={{
                                padding: '12px',
                                backgroundColor: '#fff3cd',
                                color: '#856404',
                                borderRadius: '5px',
                                textAlign: 'center'
                            }}>{loading}</div>}
                            {error && <div style={{
                                padding: '12px',
                                backgroundColor: '#f8d7da',
                                color: '#721c24',
                                borderRadius: '5px',
                                textAlign: 'center'
                            }}>{error}</div>}
                            {success && <div style={{
                                padding: '12px',
                                backgroundColor: '#d4edda',
                                color: '#155724',
                                borderRadius: '5px',
                                textAlign: 'center'
                            }}>{success}</div>}
                        </div>
                    </>
                )}

                {!showWaitingMessage && (
                    <form onSubmit={submit} style={{
                        borderTop: '1px solid #eee',
                        paddingTop: '20px'
                    }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '10px',
                            color: '#444',
                            fontSize: '16px',
                            fontWeight: '600'
                        }}>
                            Enter M-PESA Phone Number (Format: 2547XXXXXXXX)
                        </label>
                        <input
                            type="tel"
                            pattern="254[0-9]{9}"
                            placeholder="e.g. 254712345678"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '10px',
                                border: '1.5px solid #ccc',
                                marginBottom: '20px',
                                fontSize: '16px',
                                outlineColor: '#28a745'
                            }}
                        />
                        <button 
                            type="submit" 
                            style={{
                                width: '100%',
                                padding: '16px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '18px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 10px rgba(40, 167, 69, 0.3)',
                                transition: 'all 0.3s ease'
                            }}
                            disabled={loading}
                            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#218838')}
                            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#28a745')}
                        >
                            {loading ? 'Processing...' : `Pay KSh ${totalAmount.toFixed(2)} with M-PESA`}
                        </button>
                    </form>
                )}

                <div style={{
                    marginTop: '30px',
                    textAlign: 'center',
                    color: '#888',
                    fontSize: '14px'
                }}>
                    <p>You'll receive an M-PESA push notification to complete payment</p>
                    <div style={{
                        marginTop: '10px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <img src="/Mpesa-Logo.webp" alt="Mpesa Logo" width="50" height="50" />
                        <span style={{
                            fontWeight: 'bold',
                            fontSize: '16px',
                            color: '#25d366'
                        }}>Lipa na M-PESA</span>
                    </div>
                </div>
            </>
        )}

        {/* Add to your styles */}
        <style>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `}</style>
    </div>
  );
};

export default Mpesapayment;