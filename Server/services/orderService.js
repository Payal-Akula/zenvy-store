const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOrderEmail = async (email, order) => {
  const { orderId, user, paymentMethod } = order;

  return transporter.sendMail({
    from: `"Zenvy" <${process.env.EMAIL}>`,
    to: email,
    subject: `Zenvy Order Confirmed 🎉 | ${orderId}`,

    html: `
<table width="100%" bgcolor="#f6f6f6">
<tr><td align="center">

<table width="600" bgcolor="#ffffff" style="border-radius:10px; overflow:hidden;">
 
<tr>
<td align="center" bgcolor="#e12727" style="padding:15px;">
<img src="https://i.imgur.com/6X4ZQZC.png" height="40"/>
</td>
</tr>

<tr>
<td style="padding:20px; font-family:Arial;">

<h2>🎉 Order Confirmed</h2>

<p>Hi <b>${user.name}</b>,</p>
<p>Your order is successfully placed 🚀</p>

<table width="100%" bgcolor="#fafafa" cellpadding="10">
<tr><td><b>Order ID:</b> ${orderId}</td></tr>
<tr><td><b>Payment:</b> ${paymentMethod}</td></tr>
<tr><td><b>Address:</b> ${user.address}</td></tr>
</table>

<h3>📦 Tracking</h3>

<table width="100%" style="text-align:center;">
<tr>
<td>🟢<br/><small>Placed</small></td>
<td>⚪<br/><small>Packed</small></td>
<td>⚪<br/><small>Shipped</small></td>
<td>⚪<br/><small>Out</small></td>
<td>⚪<br/><small>Delivered</small></td>
</tr>
</table>

<div style="text-align:center; margin-top:20px;">
<a href="http://localhost:3000/order/${orderId}"
style="background:#e12727;color:#fff;padding:10px 20px;text-decoration:none;">
Track Order
</a>
</div>

</td>
</tr>

<tr>
<td align="center" bgcolor="#111" style="color:#aaa;padding:10px;">
© Zenvy
</td>
</tr>

</table>

</td></tr>
</table>
`
  });
};

module.exports = sendOrderEmail;