# 🍷 Adega Premium - E-commerce Completo

Sistema completo de e-commerce para adega premium, com design elegante, sofisticado e minimalista. Desenvolvido com Vue.js 3 no frontend e Node.js/Express no backend.

## ✨ Funcionalidades

### Cliente
- 🏠 **Landing Page** elegante com banner, categorias, produtos em destaque e depoimentos
- 🔍 **Busca inteligente** de produtos
- 🛒 **Carrinho de compras** com persistência no localStorage
- 💳 **Checkout** completo com múltiplas formas de pagamento
- 👤 **Perfil do usuário** com edição de dados, endereços e favoritos
- 📦 **Histórico de pedidos**
- ⭐ **Avaliações de produtos**
- 🎨 **Dark mode** refinado

### Administrador
- 📊 **Dashboard** com métricas e gráficos
- 📝 **CRUD de produtos** com upload de imagens
- 📂 **CRUD de categorias**
- 📦 **Gerenciamento de pedidos** com atualização de status
- 👥 **Gerenciamento de usuários**

## 🛠 Stack Tecnológica

### Frontend
- **Vue.js 3** com Composition API
- **Vite** como build tool
- **Vue Router** para navegação
- **Pinia** para gerenciamento de estado
- **CSS puro** (sem frameworks)
- **Axios** para requisições HTTP

### Backend
- **Node.js** com Express.js
- **MongoDB** com Mongoose
- **JWT** para autenticação
- **Bcryptjs** para criptografia de senhas
- **Helmet** e **Rate Limit** para segurança

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+
- MongoDB (local ou Atlas)
- Git

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/adega-premium.git
cd adega-premium
```

### 2. Configurar Backend
```bash
cd backend
npm install
```

Crie o arquivo `.env` baseado no `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/adega_premium
JWT_SECRET=sua_chave_secreta_aqui_muito_segura_e_longa
JWT_EXPIRE=7d
NODE_ENV=development
```

Popule o banco de dados:
```bash
npm run seed
```

Inicie o servidor:
```bash
npm run dev
```

### 3. Configurar Frontend
```bash
cd ../frontend
npm install
```

Crie o arquivo `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### 4. Acesse a aplicação
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Admin Panel**: http://localhost:3000/admin

## 🔑 Credenciais de Teste

| Tipo | E-mail | Senha |
|------|--------|-------|
| Admin | admin@adegapremium.com | admin123 |
| Cliente | cliente@teste.com | cliente123 |

## 📁 Estrutura do Projeto

```
adega-premium/
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── router/         # Configuração de rotas
│   │   ├── stores/         # Pinia stores
│   │   ├── services/       # API services
│   │   ├── assets/         # Imagens e fontes
│   │   └── styles/         # CSS global
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── server/
│   │   ├── controllers/    # Lógica dos controllers
│   │   ├── routes/         # Definição de rotas
│   │   ├── models/         # Schemas Mongoose
│   │   ├── middlewares/    # Auth, validação, erros
│   │   └── config/         # Configurações
│   ├── scripts/
│   │   └── seed.js         # Dados iniciais
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md
```

## 🎨 Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Preto Fosco | `#0D0D0D` | Background principal |
| Vermelho Vinho | `#8B0000` | Cor primária, botões |
| Vermelho Destaque | `#B22222` | Hover, destaques |
| Branco Suave | `#F5F5F5` | Texto principal |
| Cinza Escuro | `#1C1C1C` | Cards, seções |
| Dourado | `#C9A96E` | Preços, acentos |

## 🔒 Segurança

- Senhas criptografadas com bcrypt (salt 12 rounds)
- Tokens JWT com expiração configurável
- Rate limiting em todas as rotas API
- Helmet para headers de segurança
- CORS configurado
- Validação de dados com express-validator
- Proteção contra NoSQL injection

## 📱 Responsividade

O sistema é totalmente responsivo e funciona perfeitamente em:
- Desktop (1280px+)
- Tablet (768px - 1279px)
- Mobile (< 768px)

## 📝 API Endpoints

### Autenticação
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Perfil
- `PUT /api/auth/profile` - Atualizar perfil
- `PUT /api/auth/change-password` - Alterar senha

### Produtos
- `GET /api/products` - Listar produtos
- `GET /api/products/:id` - Detalhes
- `POST /api/products` - Criar (Admin)
- `PUT /api/products/:id` - Atualizar (Admin)
- `DELETE /api/products/:id` - Excluir (Admin)

### Pedidos
- `POST /api/orders` - Criar pedido
- `GET /api/orders/my-orders` - Meus pedidos
- `GET /api/orders` - Todos pedidos (Admin)
- `PUT /api/orders/:id/status` - Atualizar status (Admin)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

Desenvolvido com ❤️ para amantes de vinhos e boa gastronomia.
