require('dotenv').config();

const connectDB = require('../server/config/database');
const Product = require('../server/models/Product');
const Category = require('../server/models/Category');
const User = require('../server/models/User');

/**
 * Script para popular o banco de dados
 * Execute: npm run seed
 */

// Função para gerar slug
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const categories = [
  { name: 'Whiskys', description: 'Whiskys nacionais e importados' },
  { name: 'Gins', description: 'Gins e bebidas especiais' },
  { name: 'Vodkas', description: 'Vodkas premium e sabores' },
  { name: 'Cervejas', description: 'Long necks, litrão e artesanais' },
  { name: 'Combos', description: 'Combos para festas e resenha' },
  { name: 'Drinks', description: 'Drinks prontos e especiais' },
  { name: 'Energéticos', description: 'Energéticos e mixers' },
  { name: 'Petiscos', description: 'Porções e acompanhamentos' }
];

const products = [
  {
    name: 'Whisky Jack Daniel’s Old No.7',
    description: 'Whisky clássico americano com sabor marcante e suave.',
    category: 'Whiskys',
    price: 189.90,
    stock: 25,
    images: ['https://images.unsplash.com/photo-1527281400683-aa938e8bb2b6?w=600'],
    alcoholContent: 40,
    featured: true,
    rating: 4.9,
    numReviews: 210
  },
  {
    name: 'Whisky Ballantine’s Finest',
    description: 'Whisky escocês equilibrado e perfeito para drinks.',
    category: 'Whiskys',
    price: 89.90,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600'],
    alcoholContent: 40,
    featured: true,
    rating: 4.7,
    numReviews: 180
  },
  {
    name: 'Gin Tropical Pink',
    description: 'Gin premium com toque cítrico e frutas vermelhas.',
    category: 'Gins',
    price: 119.90,
    stock: 30,
    images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600'],
    alcoholContent: 43,
    featured: true,
    rating: 4.8,
    numReviews: 134
  },
  {
    name: 'Gin London Dry',
    description: 'Gin clássico ideal para gin tônica e drinks.',
    category: 'Gins',
    price: 99.90,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1575650772417-e6b418b0d2bf?w=600'],
    alcoholContent: 41,
    featured: false,
    rating: 4.6,
    numReviews: 98
  },
  {
    name: 'Vodka Absolut',
    description: 'Vodka premium importada de sabor suave.',
    category: 'Vodkas',
    price: 79.90,
    stock: 45,
    images: ['https://images.unsplash.com/photo-1609951651556-5334e2706168?w=600'],
    alcoholContent: 40,
    featured: true,
    rating: 4.7,
    numReviews: 165
  },
  {
    name: 'Vodka Smirnoff Ice',
    description: 'Bebida ice refrescante pronta para beber.',
    category: 'Vodkas',
    price: 14.90,
    stock: 80,
    images: ['https://images.unsplash.com/photo-1582819509237-ded8c261f5f2?w=600'],
    alcoholContent: 5,
    featured: false,
    rating: 4.5,
    numReviews: 92
  },
  {
    name: 'Balde Heineken 6 Unidades',
    description: 'Balde com 6 long necks geladas.',
    category: 'Cervejas',
    price: 69.90,
    stock: 50,
    images: ['https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600'],
    alcoholContent: 5,
    featured: true,
    rating: 4.9,
    numReviews: 320
  },
  {
    name: 'Combo Whisky + Energético',
    description: 'Whisky 1L acompanhado de 4 energéticos.',
    category: 'Combos',
    price: 249.90,
    stock: 20,
    images: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600'],
    featured: true,
    rating: 5.0,
    numReviews: 250
  },
  {
    name: 'Combo Gin Tropical',
    description: 'Gin + energético + frutas para preparo.',
    category: 'Combos',
    price: 159.90,
    stock: 18,
    images: ['https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600'],
    featured: true,
    rating: 4.8,
    numReviews: 140
  },
  {
    name: 'Drink Moscow Mule',
    description: 'Drink pronto refrescante com espuma cremosa.',
    category: 'Drinks',
    price: 29.90,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600'],
    alcoholContent: 12,
    featured: true,
    rating: 4.7,
    numReviews: 112
  },
  {
    name: 'Drink Gin Tônica Premium',
    description: 'Gin tônica preparada com especiarias especiais.',
    category: 'Drinks',
    price: 34.90,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1563223771-375783ee91ad?w=600'],
    alcoholContent: 14,
    featured: false,
    rating: 4.6,
    numReviews: 90
  },
  {
    name: 'Red Bull Energy Drink',
    description: 'Energético tradicional gelado.',
    category: 'Energéticos',
    price: 14.90,
    stock: 100,
    images: ['https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600'],
    featured: true,
    rating: 4.8,
    numReviews: 210
  },
  {
    name: 'Monster Energy Mango',
    description: 'Energético sabor manga com alta energia.',
    category: 'Energéticos',
    price: 16.90,
    stock: 90,
    images: ['https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=600'],
    featured: false,
    rating: 4.7,
    numReviews: 160
  },
  {
    name: 'Batata Frita com Cheddar e Bacon',
    description: 'Porção crocante coberta com cheddar e bacon.',
    category: 'Petiscos',
    price: 39.90,
    stock: 35,
    images: ['https://images.unsplash.com/photo-1576107232684-1279f390859f?w=600'],
    featured: true,
    rating: 4.9,
    numReviews: 280
  },
  {
    name: 'Hambúrguer Artesanal Smash',
    description: 'Hambúrguer artesanal com queijo e molho especial.',
    category: 'Petiscos',
    price: 32.90,
    stock: 40,
    images: ['https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600'],
    featured: true,
    rating: 4.8,
    numReviews: 230
  }
];

const seedDatabase = async () => {
  try {

    await connectDB();

    // Limpar banco
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('Dados anteriores removidos.');

    // Gerar slugs
    const categoriesWithSlugs = categories.map(cat => ({
      ...cat,
      slug: generateSlug(cat.name)
    }));

    // Criar categorias
    const createdCategories = await Category.insertMany(categoriesWithSlugs);

    const categoryMap = {};

    createdCategories.forEach(category => {
      categoryMap[category.name] = category._id;
    });

    console.log(`${createdCategories.length} categorias criadas.`);

    // Ajustar categorias dos produtos
    const formattedProducts = products.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    // Criar produtos
    const createdProducts = await Product.insertMany(formattedProducts);

    console.log(`${createdProducts.length} produtos criados.`);

    // Criar admin
    await User.create({
      name: 'Administrador',
      email: 'admin@adega.com',
      password: 'admin123',
      role: 'admin'
    });

    console.log('Usuário admin criado.');

    // Criar usuário teste
    await User.create({
      name: 'Cliente Teste',
      email: 'cliente@teste.com',
      password: 'cliente123',
      role: 'user'
    });

    console.log('Usuário teste criado.');

    console.log('\n✅ Banco populado com sucesso!');
    console.log('\nCredenciais:');
    console.log('Admin: admin@adega.com / admin123');
    console.log('Cliente: cliente@teste.com / cliente123');

    process.exit(0);

  } catch (error) {

    console.error('❌ Erro ao popular banco:', error);

    process.exit(1);
  }
};

seedDatabase();