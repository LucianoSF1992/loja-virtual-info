const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Process payment
router.post('/process', auth, async (req, res) => {
  try {
    const { paymentMethod, paymentDetails } = req.body;

    if (!paymentMethod || !paymentDetails) {
      return res.status(400).json({ message: 'Dados de pagamento são obrigatórios' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Carrinho vazio' });
    }

    // Create order first
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0]?.url || ''
    }));

    const itemsPrice = cart.totalAmount;
    const shippingPrice = itemsPrice > 500 ? 0 : 20;
    const totalPrice = itemsPrice + shippingPrice;

    let order = new Order({
      user: req.user.userId,
      items: orderItems,
      shippingAddress: paymentDetails.shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      orderStatus: 'processing',
      paymentStatus: 'pending'
    });

    await order.save();

    // Process payment based on method
    let paymentResult;
    switch (paymentMethod) {
      case 'credit_card':
      case 'debit_card':
        paymentResult = await processCardPayment(order, paymentDetails);
        break;
      case 'pix':
        paymentResult = await processPixPayment(order);
        break;
      case 'boleto':
        paymentResult = await processBoletoPayment(order);
        break;
      default:
        return res.status(400).json({ message: 'Método de pagamento inválido' });
    }

    // Update order with payment details
    order.paymentDetails = paymentResult;
    order.paymentStatus = 'processing';
    await order.save();

    res.json({
      message: 'Pagamento processado com sucesso',
      order,
      paymentDetails: paymentResult
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao processar pagamento' });
  }
});

// Process card payment
async function processCardPayment(order, paymentDetails) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'brl',
      payment_method: paymentDetails.paymentMethodId,
      confirm: true,
      metadata: {
        orderId: order._id.toString(),
        userId: order.user.toString()
      }
    });

    return {
      transactionId: paymentIntent.id,
      cardBrand: paymentIntent.charges.data[0].payment_method_details.card.brand,
      last4Digits: paymentIntent.charges.data[0].payment_method_details.card.last4
    };
  } catch (error) {
    throw new Error('Erro ao processar pagamento com cartão');
  }
}

// Process PIX payment
async function processPixPayment(order) {
  try {
    const pixCode = `00020126580014BR.GOV.BCB.PIX0126${uuidv4()}5204000053039865404${Math.round(order.totalPrice * 100).toString().padStart(10, '0')}5802BR5925Loja Virtual INFO6009SAO PAULO62070503***6304${generateChecksum()}`;
    
    return {
      pixCode,
      transactionId: `PIX-${order._id}`
    };
  } catch (error) {
    throw new Error('Erro ao gerar código PIX');
  }
}

// Process Boleto payment
async function processBoletoPayment(order) {
  try {
    const boletoUrl = `https://loja-virtual-info.com/boleto/${order._id}`;
    const boletoCode = `${uuidv4().replace(/-/g, '').toUpperCase()}`;
    
    return {
      boletoUrl,
      boletoCode,
      transactionId: `BOLETO-${order._id}`
    };
  } catch (error) {
    throw new Error('Erro ao gerar boleto');
  }
}

// Webhook for payment updates
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await updateOrderPaymentStatus(paymentIntent.metadata.orderId, 'paid');
      break;
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      await updateOrderPaymentStatus(failedPayment.metadata.orderId, 'failed');
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Update order payment status
async function updateOrderPaymentStatus(orderId, status) {
  try {
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: status,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Erro ao atualizar status do pagamento:', error);
  }
}

// Generate checksum for PIX
function generateChecksum() {
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

module.exports = router;
