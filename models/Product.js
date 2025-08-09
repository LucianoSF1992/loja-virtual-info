const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória']
  },
  price: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Categoria é obrigatória'],
    enum: ['Computadores', 'Notebooks', 'Periféricos', 'Hardware', 'Redes', 'Armazenamento', 'Monitores', 'Gaming', 'Software', 'Acessórios']
  },
  brand: {
    type: String,
    required: [true, 'Marca é obrigatória']
  },
  specifications: {
    processor: String,
    memory: String,
    storage: String,
    graphics: String,
    display: String,
    connectivity: [String],
    ports: [String],
    dimensions: String,
    weight: String,
    warranty: String
  },
  images: [{
    url: String,
    alt: String
  }],
  stock: {
    type: Number,
    required: [true, 'Estoque é obrigatório'],
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    required: [true, 'SKU é obrigatório'],
    unique: true
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate discount price
productSchema.methods.getDiscountPrice = function() {
  return this.price * (1 - this.discount / 100);
};

// Update updatedAt field
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);
