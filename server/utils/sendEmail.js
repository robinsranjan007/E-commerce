import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
})

export const sendOrderConfirmationEmail = async (email, order) => {
  try {
    await transporter.sendMail({
      from: '"E-Commerce" <noreply@ecommerce.com>',
      to: email,
      subject: 'Order Confirmation',
      html: `
        <h1>Order Confirmed! 🎉</h1>
        <p>Your order has been placed successfully!</p>
        <h3>Order Details:</h3>
        <p>Order ID: ${order._id}</p>
        <p>Total: $${order.totalPrice}</p>
        <p>Status: ${order.status}</p>
      `
    })
    console.log('Email sent successfully')
  } catch (error) {
    console.log('Email error:', error)
  }
}