const nodemailer = require("nodemailer");

exports.confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { user, paymentMethod } = req.body;

    // 🔥 SEND EMAIL
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
   from: `"Zenvy" <${process.env.EMAIL}>`,
    to: email,
    subject: `Zenvy Order Confirmed 🎉 | ${orderId}`,

    html: `
<table width="100%" bgcolor="#f6f6f6" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center">

      <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border-radius:10px; overflow:hidden;">

        <!-- HEADER -->
        <tr>
          <td align="center" bgcolor="#e12727" style="padding:15px;">
            <img src="https://i.imgur.com/6X4ZQZC.png" height="40" />
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:20px; font-family:Arial, sans-serif;">

            <h2>🎉 Order Confirmed</h2>

            <p>Hi <b>${user.name}</b>,</p>
            <p>Your order has been placed successfully 🚀</p>

            <!-- ORDER DETAILS -->
            <table width="100%" bgcolor="#fafafa" cellpadding="10" style="margin-top:10px;">
              <tr><td><b>Order ID:</b> ${orderId}</td></tr>
              <tr><td><b>Payment:</b> ${paymentMethod}</td></tr>
              <tr><td><b>Address:</b> ${user.address}</td></tr>
            </table>

            <!-- TRACKING -->
            <h3 style="margin-top:20px;">📦 Tracking</h3>

            <table width="100%" cellpadding="10" style="text-align:center;">
              <tr>
                <td>
                  <div style="width:25px;height:25px;background:#28a745;border-radius:50%;margin:auto;"></div>
                  <small>Placed</small>
                </td>
                <td>
                  <div style="width:25px;height:25px;background:#ccc;border-radius:50%;margin:auto;"></div>
                  <small>Packed</small>
                </td>
                <td>
                  <div style="width:25px;height:25px;background:#ccc;border-radius:50%;margin:auto;"></div>
                  <small>Shipped</small>
                </td>
                <td>
                  <div style="width:25px;height:25px;background:#ccc;border-radius:50%;margin:auto;"></div>
                  <small>Out</small>
                </td>
                <td>
                  <div style="width:25px;height:25px;background:#ccc;border-radius:50%;margin:auto;"></div>
                  <small>Delivered</small>
                </td>
              </tr>
            </table>

            <!-- BUTTON -->
            <table width="100%" cellpadding="20">
              <tr>
                <td align="center">
                  <a href="http://localhost:3000/order/${orderId}"
                     style="background:#e12727; color:#ffffff; padding:12px 25px; text-decoration:none; border-radius:5px; display:inline-block;">
                     Track Order
                  </a>
                </td>
              </tr>
            </table>

            <p>Thanks for shopping with <b>Zenvy</b> ❤️</p>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td align="center" bgcolor="#111" style="color:#aaa; padding:10px; font-size:12px;">
            © 2026 Zenvy
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
`,
});

    res.json({ message: "Order confirmed & email sent" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error confirming order" });
  }
};