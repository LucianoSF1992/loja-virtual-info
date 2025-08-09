const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: 'Dados de envio e pagamento são obrigatórios' });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Carrinho vazio' });
    }

    // Check stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Estoque insuficiente para ${product.name}` 
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0]?.url || ''
    }));

    // Calculate prices
    const itemsPrice = cart.totalAmount;
    const shippingPrice = itemsPrice > 500 ? 0 : 20; // Free shipping for orders over R$500
    const totalPrice = itemsPrice + shippingPrice;

    // Create order
    const order = new Order({
      user: req.user.userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    });

    await order.save();

    // Update stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json({
      message: 'Pedido criado com sucesso',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar pedido' });
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .sort('-createdAt')
      .populate('items.product', 'name images');

    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar pedidos' });
  }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    }).populate('items.product', 'name images');

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar pedido' });
  }
});

// Update order status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { orderStatus, trackingCode } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        orderStatus,
        trackingCode,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    res.json({
      message: 'Status do pedido atualizado',
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar status' });
  }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.userId
    });

    if (!order) {
      return res.status(404).json({ message: 'Pedido não encontrado' });
    }

    if (order.orderStatus === 'delivered' || order.orderStatus === 'shipped') {
      return res.status(400).json({ message: 'Não é possível cancelar este pedido' });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    order.orderStatus = 'cancelled';
    order.paymentStatus = 'refunded';
    await order.save();

    res.json({ message: 'Pedido cancelado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cancelar pedido' });
  }
});

module.exports = router;
