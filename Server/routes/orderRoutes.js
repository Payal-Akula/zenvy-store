const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/products");
const BestDeals = require("../models/BestDeals");
const PDFDocument = require('pdfkit');
const sgMail = require('@sendgrid/mail');
const NewArrival = require("../models/NewArrival"); 
const Fashion = require("../models/Fashion");
const Furniture = require("../models/Furniture");
const HealthBeauty = require("../models/HealthBeauty");
const SmartphoneTablet = require("../models/SmartphoneTablet");
const Electronics = require("../models/Electronics");
const Jewelry = require("../models/Jewelry");

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API);

console.log("📧 Order Email Service Initialized with SendGrid");
console.log("SendGrid API Key:", process.env.SENDGRID_API ? "✅ Set" : "❌ Not Set");
console.log("From Email:", process.env.EMAIL ? "✅ Set" : "❌ Not Set");

// ========== EMAIL FUNCTIONS with SendGrid ==========

// Function to send order confirmation email
const sendOrderEmail = async (email, orderData) => {
  const { orderId, user, paymentMethod, amount, items } = orderData;

  const itemsHtml = items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
    </tr>
  `).join('');

  const msg = {
    to: email,
    from: process.env.EMAIL,
    subject: `Zenvy Order Confirmed 🎉 | ${orderId}`,
    html: `
      <table width="100%" bgcolor="#f6f6f6">
        <tr><td align="center">
          <table width="600" bgcolor="#ffffff" style="border-radius:10px; overflow:hidden;">
            <tr><td align="center" bgcolor="#e12727" style="padding:15px;">
              <h2 style="color:#fff; margin:0;">ZENVY</h2>
            </td></tr>
            <tr><td style="padding:20px; font-family:Arial;">
              <h2 style="color:#e12727;">🎉 Order Confirmed!</h2>
              <p>Hi <b>${user.name}</b>,</p>
              <p>Your order has been placed successfully 🚀</p>
              <table width="100%" bgcolor="#fafafa" cellpadding="10">
                <tr><td><b>Order ID:</b> ${orderId}</td></tr>
                <tr><td><b>Payment Method:</b> ${paymentMethod}</td></tr>
                <tr><td><b>Amount:</b> ₹${amount}</td></tr>
                <tr><td><b>Address:</b> ${user.address}</td></tr>
              </table>
              <h3 style="margin-top:20px;">🛍️ Order Items</h3>
              <table width="100%" style="border-collapse: collapse;">
                <thead>
                  <tr style="background:#f0f0f0;">
                    <th style="padding: 8px; text-align: left;">Product</th>
                    <th style="padding: 8px; text-align: center;">Qty</th>
                    <th style="padding: 8px; text-align: right;">Price</th>
                    <th style="padding: 8px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                  <tr style="border-top: 2px solid #eee;">
                    <td colspan="3" style="padding: 10px; text-align: right;"><b>Grand Total:</b></td>
                    <td style="padding: 10px; text-align: right;"><b>₹${amount}</b></td>
                  </tr>
                </tfoot>
              </table>
              <div style="text-align:center; margin-top:20px;">
                <a href="https://zenvy-store.onrender.com/orders" style="background:#e12727; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block;">
                  📦 View My Orders
                </a>
              </div>
              <p style="margin-top:20px;">Thanks for shopping with <b>Zenvy</b> ❤️</p>
            </td>
            </tr>
            <tr><td align="center" bgcolor="#111" style="color:#aaa; padding:10px; font-size:12px;">
              © 2026 Zenvy
            </td>
          </table>
        </td>
      </table>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log(`✅ Order confirmation email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send order email to ${email}:`, error.message);
    return false;
  }
};

// Send status update email (SHIPPED/DELIVERED)
const sendStatusUpdateEmail = async (email, order, status) => {
  let subject = "";
  let message = "";
  let color = "";
  let buttonText = "";
  
  if (status === "SHIPPED") {
    subject = "🚚 Your Zenvy Order Has Been Shipped!";
    message = "Great news! Your order is on its way and will reach you within 2-3 days.";
    color = "#ff9800";
    buttonText = "Track Your Order";
  } else if (status === "DELIVERED") {
    subject = "📦 Your Zenvy Order Has Been Delivered!";
    message = "Your order has been successfully delivered. We hope you love your purchase!";
    color = "#4caf50";
    buttonText = "Write a Review";
  }
  
  const msg = {
    to: email,
    from: process.env.EMAIL,
    subject: subject,
    html: `
      <table width="100%" bgcolor="#f6f6f6">
        <tr><td align="center">
          <table width="600" bgcolor="#ffffff" style="border-radius:10px; overflow:hidden;">
            <tr><td align="center" bgcolor="#e12727" style="padding:15px;">
              <h2 style="color:#fff; margin:0;">ZENVY</h2>
            </td>
            </tr>
            <tr><td style="padding:20px; font-family:Arial;">
              <h2 style="color:${color};">${status === "SHIPPED" ? "🚚 Order Shipped!" : "📦 Order Delivered!"}</h2>
              <p>Hi <b>${order.userDetails?.name || "Customer"}</b>,</p>
              <p>${message}</p>
              <table width="100%" bgcolor="#fafafa" cellpadding="10" style="margin-top:10px; border-radius:8px;">
                <tr><td><b>Order ID:</b> ${order._id}</td></tr>
                <tr><td><b>Status:</b> ${status}</td></tr>
                <tr><td><b>Amount:</b> ₹${order.amount}</td></tr>
              </table>
              <div style="text-align:center; margin-top:20px;">
                <a href="https://zenvy-store.onrender.com/track/${order._id}" 
                   style="background:${color}; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px; display:inline-block;">
                  ${buttonText}
                </a>
              </div>
              <p style="margin-top:20px;">Thank you for shopping with <b>Zenvy</b>! ❤️</p>
            </td>
            </tr>
            <tr><td align="center" bgcolor="#111" style="color:#aaa; padding:10px; font-size:12px;">
              © 2026 Zenvy
            </td>
          </table>
        </td>
      </table>
    `
  };
  
  try {
    await sgMail.send(msg);
    console.log(`✅ Status update email sent to: ${email} for status: ${status}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send status email to ${email}:`, error.message);
    return false;
  }
};

// ========== AUTO STATUS UPDATE FUNCTION ==========

const updateOrderStatuses = async () => {
  try {
    const now = new Date();
    
    // 1. Update ORDERS from PLACED to SHIPPED (after 48 hours = 2 days)
    const placedOrders = await Order.find({ 
      status: "PLACED",
      "timeline.status": "ORDER PLACED"
    });
    
    for (const order of placedOrders) {
      const placedDate = order.timeline.find(t => t.status === "ORDER PLACED")?.date;
      if (placedDate) {
        const hoursSincePlaced = (now - new Date(placedDate)) / (1000 * 60 * 60);
        
        if (hoursSincePlaced >= 48) {
          order.status = "SHIPPED";
          order.timeline.push({ status: "SHIPPED", date: now });
          await order.save();
          console.log(`✅ Order ${order._id} updated to SHIPPED`);
          
          if (order.userDetails?.email) {
            await sendStatusUpdateEmail(order.userDetails.email, order, "SHIPPED");
          }
        }
      }
    }
    
    // 2. Update ORDERS from SHIPPED to DELIVERED (after 120 hours = 5 days)
    const shippedOrders = await Order.find({ 
      status: "SHIPPED",
      "timeline.status": "SHIPPED"
    });
    
    for (const order of shippedOrders) {
      const shippedDate = order.timeline.find(t => t.status === "SHIPPED")?.date;
      if (shippedDate) {
        const hoursSinceShipped = (now - new Date(shippedDate)) / (1000 * 60 * 60);
        
        if (hoursSinceShipped >= 120) {
          order.status = "DELIVERED";
          order.timeline.push({ status: "DELIVERED", date: now });
          await order.save();
          console.log(`✅ Order ${order._id} updated to DELIVERED`);
          
          if (order.userDetails?.email) {
            await sendStatusUpdateEmail(order.userDetails.email, order, "DELIVERED");
          }
        }
      }
    }
    
  } catch (err) {
    console.error("Error updating order statuses:", err);
  }
};

// Start auto status update service
const startAutoStatusUpdate = () => {
  setInterval(async () => {
    console.log(`[${new Date().toISOString()}] 🔄 Running auto status update check...`);
    await updateOrderStatuses();
  }, 6 * 60 * 60 * 1000);
  
  console.log("✅ Auto order status update service started (checks every 6 hours)");
  
  setTimeout(async () => {
    await updateOrderStatuses();
  }, 5000);
};

// ========== API ENDPOINTS ==========

// ✅ CREATE ORDER - FIXED to accept items from frontend
router.post("/create", async (req, res) => {
  try {
    const { userId, paymentMethod, items: frontendItems, amount: frontendAmount } = req.body;

    console.log("📦 Create order request:", { userId, paymentMethod, itemsCount: frontendItems?.length });

    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    let items = frontendItems;
    let amount = frontendAmount;

    // If frontend didn't send items, fetch from cart
    if (!items || items.length === 0) {
      const cart = await Cart.findOne({ userId });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart empty" });
      }

      items = await Promise.all(cart.items.map(async (item) => {
        let product = await Product.findById(item.productId);
        let source = "products";
        
        if (!product) {
          product = await BestDeals.findById(item.productId);
          source = "bestdeals";
        }
        if (!product) {
          product = await NewArrival.findById(item.productId);
          source = "newarrivals";
        }
        if (!product) {
          product = await Fashion.findById(item.productId);
          source = "fashion";
        }
        if (!product) {
          product = await Furniture.findById(item.productId);
          source = "furniture";
        }
        if (!product) {
          product = await HealthBeauty.findById(item.productId);
          source = "healthbeauty";
        }
        if (!product) {
          product = await SmartphoneTablet.findById(item.productId);
          source = "smartphonetablet";
        }
        if (!product) {
          product = await Electronics.findById(item.productId);
          source = "electronics";
        }
        if (!product) {
          product = await Jewelry.findById(item.productId);
          source = "jewelry";
        }
        
        const imageUrl = product?.thumbnail || product?.images?.[0] || "/default-image.jpg";
        
        return {
          productId: item.productId,
          title: product?.title || "Product",
          price: product?.price || 0,
          quantity: item.quantity,
          image: imageUrl,
          source: source
        };
      }));

      amount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to order" });
    }

    const order = await Order.create({
      userId,
      items,
      amount,
      paymentMethod: paymentMethod || "UPI",
      timeline: [{ status: "ORDER CREATED", date: new Date() }]
    });

    // Clear cart after order creation
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    console.log("✅ Order created:", order._id);

    res.json({ orderId: order._id, message: "Order created successfully" });

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Order failed", error: err.message });
  }
});

// ✅ CONFIRM ORDER (with email)
router.post("/confirm/:id", async (req, res) => {
  try {
    const { user, paymentMethod } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "PLACED";
    order.paymentMethod = paymentMethod;
    order.userDetails = user;

    order.timeline.push(
      { status: "PAYMENT SUCCESS", date: new Date() },
      { status: "ORDER PLACED", date: new Date() }
    );

    await order.save();

    // Send email confirmation using SendGrid
    try {
      await sendOrderEmail(user.email, {
        orderId: order._id,
        user: user,
        paymentMethod: paymentMethod,
        amount: order.amount,
        items: order.items
      });
      console.log("✅ Email sent to:", user.email);
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError);
    }

    res.json({ message: "Order confirmed", emailSent: true });

  } catch (err) {
    console.error("Confirm error:", err);
    res.status(500).json({ message: "Confirm failed" });
  }
});

// ✅ GET USER ORDERS
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET SINGLE ORDER
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ MANUAL STATUS UPDATE (for testing/admin)
router.post("/update-status/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    const validStatuses = ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED", "Returned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    order.status = status;
    order.timeline.push({ status: status, date: new Date() });
    await order.save();
    
    if (order.userDetails?.email && (status === "SHIPPED" || status === "DELIVERED")) {
      await sendStatusUpdateEmail(order.userDetails.email, order, status);
    }
    
    res.json({ message: `Order status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ FORCE RUN STATUS UPDATE
router.post("/force-status-update", async (req, res) => {
  try {
    await updateOrderStatuses();
    res.json({ message: "Status update check completed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ DOWNLOAD INVOICE
router.get("/invoice/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice_${order._id}.pdf`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text('ZENVY INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Order ID: ${order._id}`, { align: 'center' });
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text('Customer Details:', { underline: true });
    doc.fontSize(10);
    if (order.userDetails) {
      doc.text(`Name: ${order.userDetails.name || 'N/A'}`);
      doc.text(`Email: ${order.userDetails.email || 'N/A'}`);
      doc.text(`Phone: ${order.userDetails.phone || 'N/A'}`);
      doc.text(`Address: ${order.userDetails.address || 'N/A'}`);
    } else {
      doc.text(`User ID: ${order.userId}`);
    }
    doc.moveDown();

    doc.fontSize(14).text('Order Items:', { underline: true });
    doc.fontSize(10);
    
    let yPosition = doc.y;
    const startX = 50;
    
    doc.text('Product', startX, yPosition);
    doc.text('Quantity', startX + 250, yPosition);
    doc.text('Price', startX + 350, yPosition);
    doc.text('Total', startX + 430, yPosition);
    
    yPosition += 20;
    doc.moveTo(startX, yPosition).lineTo(startX + 500, yPosition).stroke();
    yPosition += 10;
    
    order.items.forEach(item => {
      doc.text(item.title.substring(0, 30), startX, yPosition);
      doc.text(item.quantity.toString(), startX + 250, yPosition);
      doc.text(`₹${item.price}`, startX + 350, yPosition);
      doc.text(`₹${item.price * item.quantity}`, startX + 430, yPosition);
      yPosition += 20;
    });
    
    doc.moveTo(startX, yPosition).lineTo(startX + 500, yPosition).stroke();
    yPosition += 15;
    
    doc.fontSize(12).text(`Total Amount: ₹${order.amount}`, startX + 400, yPosition, { bold: true });
    doc.moveDown();
    
    doc.fontSize(14).text('Payment Details:', { underline: true });
    doc.fontSize(10);
    doc.text(`Payment Method: ${order.paymentMethod || 'Not specified'}`);
    doc.text(`Status: ${order.status || 'PENDING'}`);
    doc.text(`Payment Status: ${order.status === "DELIVERED" ? "Completed" : "Pending"}`);
    
    doc.end();

  } catch (err) {
    console.error("Invoice error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ RETURN ORDER
router.post("/return", async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const deliveredDate = order.timeline.find(t => t.status === "DELIVERED")?.date;
    if (deliveredDate) {
      const daysSinceDelivery = (new Date() - new Date(deliveredDate)) / (1000 * 60 * 60 * 24);
      if (daysSinceDelivery > 7) {
        return res.status(400).json({ message: "Return period has expired (7 days)" });
      }
    }

    order.status = "Returned";
    order.timeline.push(
      { status: "RETURN REQUESTED", date: new Date() },
      { status: `REASON: ${reason}`, date: new Date() }
    );

    await order.save();
    res.json({ message: "Return initiated successfully" });

  } catch (err) {
    console.error("Return error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ EXCHANGE ORDER
router.post("/exchange", async (req, res) => {
  try {
    const { orderId, reason } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const deliveredDate = order.timeline.find(t => t.status === "DELIVERED")?.date;
    if (deliveredDate) {
      const daysSinceDelivery = (new Date() - new Date(deliveredDate)) / (1000 * 60 * 60 * 24);
      if (daysSinceDelivery > 3) {
        return res.status(400).json({ message: "Exchange period has expired (3 days)" });
      }
    }

    order.status = "Exchange Requested";
    order.timeline.push(
      { status: "EXCHANGE REQUESTED", date: new Date() },
      { status: `REASON: ${reason}`, date: new Date() }
    );

    await order.save();
    res.json({ message: "Exchange requested successfully" });

  } catch (err) {
    console.error("Exchange error:", err);
    res.status(500).json({ message: err.message });
  }
});

// Start the auto status update service
startAutoStatusUpdate();

module.exports = router;