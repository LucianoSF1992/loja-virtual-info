const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/loja-virtual-info', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const products = [
  {
    name: 'Notebook Gamer ASUS ROG Strix G15',
    description: 'Notebook gamer de alto desempenho com Intel Core i7-10750H, 16GB RAM DDR4, placa de vídeo NVIDIA GeForce RTX 3060 6GB, SSD 512GB NVMe, tela 15.6" Full HD 144Hz. Perfeito para gaming e trabalhos pesados.',
    price: 5999.00,
    originalPrice: 6999.00,
    discount: 14,
    category: 'Notebooks',
    brand: 'ASUS',
    specifications: {
      processor: 'Intel Core i7-10750H (6 núcleos, 12 threads, até 5.0GHz)',
      memory: '16GB DDR4 3200MHz (expansível até 32GB)',
      storage: '512GB NVMe SSD + slot para expansão',
      graphics: 'NVIDIA GeForce RTX 3060 6GB GDDR6',
      display: '15.6" Full HD 1920x1080 144Hz IPS',
      connectivity: ['Wi-Fi 6', 'Bluetooth 5.1', 'Ethernet Gigabit'],
      ports: ['3x USB 3.2', '1x USB-C', 'HDMI 2.0b', 'Mini DisplayPort', '3.5mm audio'],
      dimensions: '35.5 x 25.6 x 2.49 cm',
      weight: '2.3 kg',
      warranty: '12 meses de garantia'
    },
    images: [
      { url: '/images/notebook-asus-1.jpg', alt: 'Notebook ASUS ROG Strix G15 - Vista frontal' },
      { url: '/images/notebook-asus-2.jpg', alt: 'Notebook ASUS ROG Strix G15 - Teclado RGB' },
      { url: '/images/notebook-asus-3.jpg', alt: 'Notebook ASUS ROG Strix G15 - Laterais' }
    ],
    stock: 15,
    sku: 'NB-ASUS-G15-001',
    tags: ['gaming', 'notebook', 'rtx3060', 'i7', '144hz'],
    featured: true
  },
  {
    name: 'Mouse Logitech G502 HERO',
    description: 'Mouse gamer profissional com sensor HERO 25K de alta precisão, 11 botões programáveis, peso ajustável, iluminação RGB Lightsync. Design ergonômico para uso prolongado.',
    price: 299.00,
    originalPrice: 399.00,
    discount: 25,
    category: 'Periféricos',
    brand: 'Logitech',
    specifications: {
      processor: 'Sensor óptico HERO 25K',
      memory: '11 botões programáveis',
      storage: 'Ajustável (5x 3.6g)',
      graphics: 'Iluminação RGB Lightsync',
      display: 'Resolução 100 - 25.600 DPI',
      connectivity: ['USB 2.0', 'Tecnologia LIGHTSPEED'],
      ports: ['USB-C para carregamento (versão wireless)'],
      dimensions: '13.2 x 7.5 x 4.0 cm',
      weight: '121g (sem pesos)',
      warranty: '24 meses de garantia'
    },
    images: [
      { url: '/images/mouse-g502-1.jpg', alt: 'Mouse Logitech G502 HERO' },
      { url: '/images/mouse-g502-2.jpg', alt: 'Mouse G502 - Botões laterais' },
      { url: '/images/mouse-g502-3.jpg', alt: 'Mouse G502 - Iluminação RGB' }
    ],
    stock: 50,
    sku: 'MOU-LOG-G502-001',
    tags: ['gaming', 'mouse', 'logitech', 'rgb', 'programavel'],
    featured: true
  },
  {
    name: 'Teclado Mecânico Corsair K95 RGB',
    description: 'Teclado mecânico premium com switches Cherry MX Speed, retroiluminação RGB por tecla, 6 teclas macro dedicadas, reposição de pulso em alumínio. Ideal para gaming e produtividade.',
    price: 899.00,
    originalPrice: 1199.00,
    discount: 25,
    category: 'Periféricos',
    brand: 'Corsair',
    specifications: {
      processor: 'Switches Cherry MX Speed (prateado)',
      memory: '8MB de perfis de hardware',
      storage: 'Full-size com teclado numérico',
      graphics: 'RGB per-key backlighting',
      display: 'Layout ABNT2 completo',
      connectivity: ['USB 3.0 ou USB 3.1 Type-A'],
      ports: ['Pass-through USB 3.0', 'Conector para fone de ouvido'],
      dimensions: '46.5 x 17.1 x 3.6 cm',
      weight: '1.32 kg',
      warranty: '24 meses de garantia'
    },
    images: [
      { url: '/images/teclado-k95-1.jpg', alt: 'Teclado Corsair K95 RGB' },
      { url: '/images/teclado-k95-2.jpg', alt: 'Teclado K95 - Teclas macro' },
      { url: '/images/teclado-k95-3.jpg', alt: 'Teclado K95 - Iluminação RGB' }
    ],
    stock: 25,
    sku: 'TEC-COR-K95-001',
    tags: ['gaming', 'teclado', 'corsair', 'mecanico', 'rgb', 'macro'],
    featured: true
  },
  {
    name: 'Monitor Gamer Samsung Odyssey G5',
    description: 'Monitor gamer curvo de 27 polegadas com resolução 2K (2560x1440), taxa de atualização de 165Hz, tempo de resposta de 1ms, tecnologia FreeSync Premium. Experiência imersiva para gaming.',
    price: 1899.00,
    originalPrice: 2299.00,
    discount: 17,
    category: 'Monitores',
    brand: 'Samsung',
    specifications: {
      processor: 'Painel VA curvo',
      memory: 'Taxa de atualização 165Hz',
      storage: 'Resolução 2560x1440 (QHD)',
      graphics: 'FreeSync Premium, HDR10',
      display: '27" curvo 1000R',
      connectivity: ['DisplayPort 1.4', 'HDMI 2.0', '3.5mm audio'],
      ports: ['1x DisplayPort', '1x HDMI 2.0'],
      dimensions: '61.5 x 45.5 x 27.2 cm (com suporte)',
      weight: '5.2 kg',
      warranty: '12 meses de garantia'
    },
    images: [
      { url: '/images/monitor-g5-1.jpg', alt: 'Monitor Samsung Odyssey G5' },
      { url: '/images/monitor-g5-2.jpg', alt: 'Monitor G5 - Vista traseira' },
      { url: '/images/monitor-g5-3.jpg', alt: 'Monitor G5 - Conectividade' }
    ],
    stock: 20,
    sku: 'MON-SAM-G5-001',
    tags: ['gaming', 'monitor', 'samsung', '165hz', '2k', 'curvo'],
    featured: true
  },
  {
    name: 'Placa de Vídeo RTX 4060 Ti',
    description: 'Placa de vídeo NVIDIA GeForce RTX 4060 Ti com 8GB GDDR6, suporte para Ray Tracing e DLSS 3. Desempenho excepcional para gaming 1080p e 1440p.',
    price: 2499.00,
    originalPrice: 2999.00,
    discount: 17,
    category: 'Hardware',
    brand: 'NVIDIA',
    specifications: {
      processor: 'NVIDIA GeForce RTX 4060 Ti',
      memory: '8GB GDDR6 128-bit',
      storage: 'Ray Tracing 3ª geração, DLSS 3',
      graphics: 'CUDA Cores: 4352',
      display: 'Clock base: 2310 MHz, Boost: 2535 MHz',
      connectivity: ['3x DisplayPort 1.4a', '1x HDMI 2.1'],
      ports: ['DisplayPort 1.4a', 'HDMI 2.1'],
      dimensions: '24.4 x 11.2 x 4.0 cm',
      weight: '1.2 kg',
      warranty: '36 meses de garantia'
    },
    images: [
      { url: '/images/rtx4060ti-1.jpg', alt: 'RTX 4060 Ti - Vista frontal' },
      { url: '/images/rtx4060ti-2.jpg', alt: 'RTX 4060 Ti - Conectores' },
      { url: '/images/rtx4060ti-3.jpg', alt: 'RTX 4060 Ti - Cooler' }
    ],
    stock: 30,
    sku: 'GPU-RTX-4060TI-001',
    tags: ['gaming', 'rtx', 'nvidia', 'dlss', 'raytracing', '8gb'],
    featured: true
  },
  {
    name: 'SSD Kingston NV2 1TB',
    description: 'SSD NVMe PCIe 4.0 de 1TB com velocidades de leitura até 3500MB/s e gravação até 2100MB/s. Ideal para sistema operacional e jogos.',
    price: 399.00,
    originalPrice: 499.00,
    discount: 20,
    category: 'Armazenamento',
    brand: 'Kingston',
    specifications: {
      processor: 'Controlador NVMe PCIe 4.0 x4',
      memory: '1TB TLC NAND',
      storage: 'Leitura: 3500MB/s, Gravação: 2100MB/s',
      graphics: 'M.2 2280 form factor',
      display: 'MTBF: 1.5 milhões de horas',
      connectivity: ['PCIe 4.0 x4 NVMe 1.4'],
      ports: ['M.2 2280 M-key'],
      dimensions: '80 x 22 x 2.1 mm',
      weight: '7g',
      warranty: '36 meses ou 320TBW'
    },
    images: [
      { url: '/images/ssd-kingston-1.jpg', alt: 'SSD Kingston NV2 1TB' },
      { url: '/images/ssd-kingston-2.jpg', alt: 'SSD NV2 - Vista lateral' },
      { url: '/images/ssd-kingston-3.jpg', alt: 'SSD NV2 - Conector M.2' }
    ],
    stock: 100,
    sku: 'SSD-KST-NV2-1TB-001',
    tags: ['ssd', 'nvme', 'kingston', '1tb', 'pcie4', 'storage'],
    featured: false
  },
  {
    name: 'Memória RAM Corsair Vengeance 16GB',
    description: 'Kit de memória RAM DDR4 16GB (2x8GB) 3200MHz com iluminação RGB dinâmica. Perfeita para gaming e multitasking.',
    price: 449.00,
    originalPrice: 549.00,
    discount: 18,
    category: 'Hardware',
    brand: 'Corsair',
    specifications: {
      processor: 'DDR4 3200MHz (PC4-25600)',
      memory: '16GB (2x8GB) dual channel',
      storage: 'CL16 latency, 1.35V',
      graphics: 'RGB LED ilumination',
      display: 'XMP 2.0 support',
      connectivity: ['DDR4 DIMM 288-pin'],
      ports: ['Standard DDR4 DIMM'],
      dimensions: '13.3 x 0.7 x 4.4 cm (per module)',
      weight: '120g (per module)',
      warranty: 'Lifetime warranty'
    },
    images: [
      { url: '/images/ram-corsair-1.jpg', alt: 'Corsair Vengeance RGB 16GB' },
      { url: '/images/ram-corsair-2.jpg', alt: 'RAM RGB - Iluminação' },
      { url: '/images/ram-corsair-3.jpg', alt: 'RAM - Vista superior' }
    ],
    stock: 75,
    sku: 'RAM-COR-VEN-16GB-001',
    tags: ['ram', 'corsair', 'ddr4', 'rgb', '16gb', '3200mhz'],
    featured: false
  },
  {
    name: 'Processador Intel Core i5-13400F',
    description: 'Processador Intel Core i5-13400F de 10 núcleos (6P+4E) com clock de até 4.6GHz. Excelente custo-benefício para gaming e produtividade.',
    price: 1299.00,
    originalPrice: 1599.00,
    discount: 19,
    category: 'Hardware',
    brand: 'Intel',
    specifications: {
      processor: 'Intel Core i5-13400F (10 núcleos, 16 threads)',
      memory: 'Cache 20MB Intel Smart Cache',
      storage: 'Clock base: 2.5GHz (P-cores), 4.6GHz max turbo',
      graphics: 'Sem GPU integrada (requer placa de vídeo)',
      display: 'Socket LGA 1700',
      connectivity: ['DDR4-3200, DDR5-4800 support'],
      ports: ['PCIe 5.0 e 4.0 support'],
      dimensions: '37.5mm x 37.5mm',
      weight: 'N/A',
      warranty: '36 meses de garantia'
    },
    images: [
      { url: '/images/cpu-i5-13400f-1.jpg', alt: 'Intel Core i5-13400F' },
      { url: '/images/cpu-i5-13400f-2.jpg', alt: 'Processador - Vista superior' },
      { url: '/images/cpu-i5-13400f-3.jpg', alt: 'Processador - Socket LGA 1700' }
    ],
    stock: 40,
    sku: 'CPU-INT-I5-13400F-001',
    tags: ['cpu', 'intel', 'i5', '10-cores', 'gaming', 'productivity'],
    featured: false
  },
  {
    name: 'Fonte Corsair RM750x',
    description: 'Fonte de alimentação modular de 750W com certificação 80+ Gold, operação silenciosa e totalmente modular. Ideal para builds de alto desempenho.',
    price: 599.00,
    originalPrice: 749.00,
    discount: 20,
    category: 'Hardware',
    brand: 'Corsair',
    specifications: {
      processor: '750W de potência contínua',
      memory: 'Certificação 80+ Gold',
      storage: 'Eficiência até 90%',
      graphics: 'Ventilador de 135mm com controle de velocidade',
      display: 'Modular: totalmente modular',
      connectivity: ['1x ATX 24-pin', '2x EPS 8-pin', '4x PCIe 8-pin', '10x SATA', '4x PATA'],
      ports: ['Todos os cabos necessários incluídos'],
      dimensions: '16.0 x 15.0 x 8.6 cm',
      weight: '1.9 kg',
      warranty: '120 meses de garantia'
    },
    images: [
      { url: '/images/psu-corsair-1.jpg', alt: 'Fonte Corsair RM750x' },
      { url: '/images/psu-corsair-2.jpg', alt: 'Fonte modular - Cabos' },
      { url: '/images/psu-corsair-3.jpg', alt: 'Fonte - Ventilador silencioso' }
    ],
    stock: 35,
    sku: 'PSU-COR-RM750X-001',
    tags: ['fonte', 'corsair', '750w', 'gold', 'modular', 'silenciosa'],
    featured: false
  },
  {
    name: 'Headset Gamer HyperX Cloud II',
    description: 'Headset gamer com som surround 7.1 virtual, drivers de 53mm, microfone removível com cancelamento de ruído, conforto superior para longas sessões de gaming.',
    price: 349.00,
    originalPrice: 449.00,
    discount: 22,
    category: 'Periféricos',
    brand: 'HyperX',
    specifications: {
      processor: 'Drivers dinâmicos de 53mm com ímãs de neodímio',
      memory: 'Frequência de resposta: 15Hz - 25.000Hz',
      storage: 'Impedância: 60 ohms',
      graphics: 'Som surround 7.1 virtual',
      display: 'Microfone condensador unidirecional',
      connectivity: ['USB e 3.5mm (4-pole)'],
      ports: ['USB para som surround', '3.5mm para dispositivos móveis'],
      dimensions: 'Auricular: 9.8 x 8.5 x 4.9 cm',
      weight: '320g (com microfone)',
      warranty: '24 meses de garantia'
    },
    images: [
      { url: '/images/headset-hyperx-1.jpg', alt: 'Headset HyperX Cloud II' },
      { url: '/images/headset-hyperx-2.jpg', alt: 'Headset - Microfone removível' },
      { url: '/images/headset-hyperx-3.jpg', alt: 'Headset - Almofadas de espuma' }
    ],
    stock: 60,
    sku: 'HS-HYP-CLD2-001',
    tags: ['headset', 'hyperx', 'gaming', '7.1', 'surround', 'microfone'],
    featured: false
  }
];

async function seedDatabase() {
  try {
    // Limpar produtos existentes
    await Product.deleteMany({});
    console.log('Produtos existentes removidos');

    // Inserir novos produtos
    await Product.insertMany(products);
    console.log(`${products.length} produtos inseridos com sucesso`);

    // Mostrar resumo
    console.log('\nResumo dos produtos:');
    products.forEach(product => {
      console.log(`- ${product.name}: R$ ${product.price.toFixed(2)} (${product.stock} unidades)`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Erro ao popular banco de dados:', error);
    process.exit(1);
  }
}

// Executar seed
seedDatabase();
