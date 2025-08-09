const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product', 'name price images stock');

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar carrinho' });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Dados inválidos' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Estoque insuficiente' });
    }

    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      cart = new Cart({ user: req.user.userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }

    cart.calculateTotal();
    await cart.save();

    cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product', 'name price images stock');

    res.json({
      message: 'Produto adicionado ao carrinho',
      cart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao adicionar produto ao carrinho' });
  }
});

// Update item quantity
router.put('/update/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Quantidade inválida' });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado' });
    }

    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    // Check stock
    const product = await Product.findById(cart.items[itemIndex].product);
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Estoque insuficiente' });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.calculateTotal();
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product', 'name price images stock');

    res.json({
      message: 'Quantidade atualizada',
      cart: updatedCart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar quantidade' });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado' });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );

    cart.calculateTotal();
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product', 'name price images stock');

    res.json({
      message: 'Item removido do carrinho',
      cart: updatedCart
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover item do carrinho' });
  }
});

// Clear cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Carrinho não encontrado' });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({ message: 'Carrinho limpo com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao limpar carrinho' });
  }
});

module.exports = router;
