# Loja Virtual INFO - E-commerce de Produtos de Informática

## Descrição do Projeto

Loja Virtual INFO é uma plataforma de e-commerce completa desenvolvida em Node.js para venda de produtos de informática. O sistema oferece funcionalidades completas de compra online, incluindo catálogo de produtos, carrinho de compras, checkout seguro e múltiplas formas de pagamento.

## Funcionalidades

### ✅ Funcionalidades Implementadas

- **Catálogo de Produtos**: 10 produtos de informática com imagens, descrições e especificações
- **Sistema de Login/Cadastro**: Autenticação segura com JWT
- **Carrinho de Compras**: Adicionar/remover produtos, atualizar quantidades
- **Checkout Completo**: Endereço de entrega, resumo do pedido
- **Múltiplas Formas de Pagamento**:
  - Cartão de Crédito/Débito (via Stripe)
  - Pix
  - Boleto Bancário
- **Gestão de Pedidos**: Acompanhamento de status, histórico de compras
- **Administração**: CRUD de produtos e gestão de pedidos
- **Segurança**: Helmet, rate limiting, validação de dados

### 📋 Lista de Produtos

1. **Notebook Gamer ASUS ROG Strix G15**
   - Intel Core i7-10750H, 16GB RAM, RTX 3060, 512GB SSD
   - Preço: R$ 5.999,00

2. **Mouse Logitech G502 HERO**
   - Sensor HERO 25K, 11 botões programáveis, RGB
   - Preço: R$ 299,00

3. **Teclado Mecânico Corsair K95 RGB**
   - Switches Cherry MX Speed, RGB, macro keys
   - Preço: R$ 899,00

4. **Monitor Gamer Samsung Odyssey G5**
   - 27" 2K 165Hz, 1ms, FreeSync Premium
   - Preço: R$ 1.899,00

5. **Placa de Vídeo RTX 4060 Ti**
   - 8GB GDDR6, Ray Tracing, DLSS 3
   - Preço: R$ 2.499,00

6. **SSD Kingston NV2 1TB**
   - NVMe PCIe 4.0, 3500MB/s leitura
   - Preço: R$ 399,00

7. **Memória RAM Corsair Vengeance 16GB**
   - DDR4 3200MHz, RGB, kit 2x8GB
   - Preço: R$ 449,00

8. **Processador Intel Core i5-13400F**
   - 10 núcleos (6P+4E), até 4.6GHz
   - Preço: R$ 1.299,00

9. **Fonte Corsair RM750x**
   - 750W 80+ Gold, modular, silenciosa
   - Preço: R$ 599,00

10. **Headset Gamer HyperX Cloud II**
    - 7.1 surround, memory foam, USB
    - Preço: R$ 349,00

## Tecnologias Utilizadas

### Backend
- **Node.js** v18+ - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação via tokens
- **Stripe** - Processamento de pagamentos
- **bcryptjs** - Hash de senhas
- **Helmet** - Segurança de headers
- **CORS** - Cross-origin resource sharing

### Segurança
- **Rate Limiting** - Limitação de requisições
- **Input Validation** - Validação de dados
- **HTTPS** - Comunicação segura
- **JWT** - Tokens de autenticação

## Instalação e Configuração

### Pré-requisitos
- Node.js v18 ou superior
- MongoDB v5 ou superior
- Conta Stripe (para pagamentos)

### Passos de Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/loja-virtual-info.git
   cd loja-virtual-info
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```
   MONGODB_URI=mongodb://localhost:27017/loja-virtual-info
   JWT_SECRET=sua-chave-secreta
   STRIPE_SECRET_KEY=sua-chave-stripe
   ```

4. **Inicie o servidor**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   - Backend: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

## Estrutura do Projeto

```
loja-virtual-info/
├── models/
│   ├── User.js          # Modelo de usuário
│   ├── Product.js       # Modelo de produto
│   ├── Cart.js          # Modelo de carrinho
│   └── Order.js         # Modelo de pedido
├── routes/
│   ├── auth.js          # Rotas de autenticação
│   ├── products.js      # Rotas de produtos
│   ├── cart.js          # Rotas do carrinho
│   ├── orders.js        # Rotas de pedidos
│   └── payment.js       # Rotas de pagamento
├── middleware/
│   └── auth.js          # Middleware de autenticação
├── server.js            # Servidor principal
├── package.json         # Dependências do projeto
└── README.md            # Documentação
```

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/profile` - Perfil do usuário
- `PUT /api/auth/profile` - Atualizar perfil

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Detalhes do produto
- `GET /api/products/featured/all` - Produtos em destaque

### Carrinho
- `GET /api/cart` - Ver carrinho
- `POST /api/cart/add` - Adicionar item
- `PUT /api/cart/update/:itemId` - Atualizar quantidade
- `DELETE /api/cart/remove/:itemId` - Remover item
- `DELETE /api/cart/clear` - Limpar carrinho

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders` - Listar pedidos
- `GET /api/orders/:id` - Detalhes do pedido
- `PUT /api/orders/:id/cancel` - Cancelar pedido

### Pagamento
- `POST /api/payment/process` - Processar pagamento
- `POST /api/payment/webhook` - Webhook de pagamentos

## Testes

### Executar testes
```bash
npm test
```

### Testes manuais
- Use ferramentas como Postman ou Insomnia para testar as APIs
- Teste todos os endpoints com diferentes cenários

## Deploy

### Produção
1. Configure variáveis de ambiente para produção
2. Use um serviçoI have created the backend structure for the Loja Virtual INFO e-commerce site using NodeJS with the following features:
- User authentication (register, login, profile)
- Product management (list, create, update, delete)
- Cart management (add, update, remove items)
- Order management (create, list, update status, cancel)
- Payment processing with Pix, credit/debit card (Stripe), and boleto

