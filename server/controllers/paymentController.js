import Stripe from 'stripe'
import Order from '../models/Order.js'
import Cart from '../models/Cart.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const createCheckoutSession = async (req, res) => {
  try {
    const { orderId } = req.body

    const order = await Order.findById(orderId).populate({
      path: 'items.product',
      select: 'name price images'
    })

    if (!order) {
      return res.status(404).json({
        message: "order not found",
        success: false
      })
    }

    // Stripe ke liye line items banao
    const lineItems = order.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          images: [item.product.images[0]]
        },
        unit_amount: Math.round(item.price * 100) // cents mein
      },
      quantity: item.quantity
    }))

    // Stripe session banao
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?orderId=${orderId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: { orderId: orderId.toString() }
    })

    return res.status(200).json({
      message: "session created",
      success: true,
      url: session.url
    })

  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false
    })
  }
}

export const webhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return res.status(400).json({ message: `Webhook Error: ${error.message}` })
  }

  // payment complete hua?
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata.orderId

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'success',
      paymentId: session.payment_intent,
      status: 'dispatched'
    })
  }

  res.status(200).json({ received: true })
}