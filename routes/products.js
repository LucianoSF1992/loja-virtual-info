const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      search,
      sort = '-createdAt'
    } = req.query;

    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
});

// Get featured products
router.get('/featured/all', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, featured: true })
      .limit(8)
      .sort('-createdAt');
    
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar produtos em destaque' });
  }
});

// Get categories
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar categorias' });
  }
});

// Get brands
router.get('/brands/all', async (req, res) => {
  try {
    const brands = await Product.distinct('brand');
    res.json(brands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar marcas' });
  }
});

// Admin routes - Create product
router.post('/', auth, [
  body('name').trim().isLength({ min: 1 }).withMessage('Nome é obrigatório'),
  body('description').trim().isLength({ min: 10 }).withMessage('Descrição deve ter pelo menos 10 caracteres'),
  body('price').isNumeric().withMessage('Preço deve ser um número'),
  body('category').isIn(['Computadores', 'Notebooks', 'Periféricos', 'Hardware', 'Redes', 'Armazenamento', 'Monitores', 'Gaming', 'Software', 'Acessórios']).withMessage('Categoria inválida'),
  body('brand').trim().isLength({ min: 1 }).withMessage('Marca é obrigatória'),
  body('stock').isInt({ min: 0 }).withMessage('Estoque deve ser um número inteiro positivo'),
  body('sku').trim().isLength({ min: 1 }).withMessage('SKU é obrigatório')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      message: 'Produto criado com sucesso',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
});

// Admin routes - Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({
      message: 'Produto atualizado com sucesso',
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
});

// Admin routes - Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto removido com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao remover produto' });
  }
});

module.exports = router;
