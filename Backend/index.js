import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const checkEnvVariables = (req, res, next) => {
  if (!process.env.CASHFREE_CLIENT_ID || !process.env.CASHFREE_CLIENT_SECRET) {
    return res.status(500).json({
      error: "Server configuration error: Missing Cashfree credentials"
    });
  }
  next();
};


app.post("/api/createOrder", checkEnvVariables, async (req, res) => {
  try {
    const { order_amount, order_currency, customer_details } = req.body;


    if (!order_amount || !order_currency || !customer_details) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    // Generate unique order ID
    const orderId = "order_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);

    // Make request to Cashfree API with updated format
    const response = await fetch("https://sandbox.cashfree.com/pg/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01", // Updated API version
        "x-client-id": process.env.CASHFREE_CLIENT_ID,
        "x-client-secret": process.env.CASHFREE_CLIENT_SECRET
      },
      body: JSON.stringify({
        order_id: orderId,
        order_amount,
        order_currency,
        customer_details,
        order_meta: {
          // Updated return URL format - removed order_token
          return_url: `${req.headers.origin || 'http://localhost:5173'}/payment-status?order_id=${orderId}`,
          notify_url: process.env.CASHFREE_WEBHOOK_URL
        }
      }),
    });

    // Parse response
    const data = await response.json();
    
    // Log for debugging
    console.log("Cashfree API Response:", JSON.stringify(data, null, 2));
    
    // Check for errors
    if (!response.ok || data.code) {
      console.error("Cashfree API Error:", data);
      return res.status(400).json({
        error: data.message || "Error from payment gateway",
        details: data
      });
    }

    // Check if we got a payment session ID
    if (!data.payment_session_id) {
      return res.status(400).json({
        error: "Failed to generate payment session",
        details: data
      });
    }

    res.json({
      orderId: orderId,
      paymentSessionId: data.payment_session_id, 
      cfOrderId: data.cf_order_id,
      status: data.order_status,
      paymentLink: data.payment_link 
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      error: "Failed to create order",
      message: error.message
    });
  }
});

// Status endpoint to help with debugging
app.get("/api/status", (req, res) => {
  res.json({
    status: "Server is running",
    env: {
      hasClientId: !!process.env.CASHFREE_CLIENT_ID,
      hasClientSecret: !!process.env.CASHFREE_CLIENT_SECRET,
      apiVersion: "2023-08-01"
    }
  });
});


app.post("/api/webhook/cashfree", express.json(), async (req, res) => {
  try {

    console.log("Received Cashfree webhook:", JSON.stringify(req.body, null, 2));
    
    const eventData = req.body.data || {};
    const orderId = eventData.order?.order_id || eventData.order_id;
    const eventType = req.body.type;
    
    console.log(`Processing ${eventType} event for order ${orderId}`);
    
    // Handle different event types based on new webhook format
    switch (eventType) {
      case "PAYMENT_SUCCESS_WEBHOOK":
        console.log(`Payment successful for order ${orderId}`);
        // Handle successful payment
        break;
        
      case "PAYMENT_FAILED_WEBHOOK":
        console.log(`Payment failed for order ${orderId}`);
        // Handle failed payment
        break;
        
      case "PAYMENT_USER_DROPPED_WEBHOOK":
        console.log(`User dropped payment for order ${orderId}`);
        // Handle user dropping payment
        break;
        
      default:
        console.log(`Received ${eventType} event for order ${orderId}`);
    }
    
    // Always acknowledge receipt with a 200 response
    res.status(200).json({ status: "ok" });
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    // Still return a 200 response to acknowledge receipt
    res.status(200).json({ status: "ok" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📝 API Version: 2023-08-01`);
});