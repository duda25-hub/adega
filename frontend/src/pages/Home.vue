<template>
  <div class="home">
    <!-- Hero Banner -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
      
      <span class="hero-subtitle">Seu Novo Ponto Favorito 💯</span>

<h1 class="hero-title">
  Bebidas Premium<br/>
  com <span class="highlight">Estilo e Sabor</span>
</h1>

<p class="hero-description">
  Dos clássicos aos combos, tudo para transformar qualquer ocasião.
</p>
        <div class="hero-actions">
  <router-link to="/produtos" class="btn btn-primary btn-lg">
    Ver Bebidas
  </router-link>

  <router-link to="/produtos?categoria=combos" class="btn btn-secondary btn-lg">
    Ver Combos
  </router-link>
        </div>
      </div>
      <div class="hero-scroll">
        <span>Role para explorar</span>
        <div class="scroll-indicator">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- Categorias -->
    <section class="section categories-section">
      <div class="container">
        <h2 class="section-title">Nossas Categorias</h2>
        <div class="categories-grid">
          <router-link
            v-for="category in categories"
            :key="category.id"
            :to="`/produtos?categoria=${category.slug}`"
            class="category-card"
          >
            <div class="category-icon">{{ category.icon }}</div>
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-count">{{ category.count }} produtos</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Produtos em Destaque -->
    <section class="section featured-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Produtos em Destaque</h2>
          <router-link to="/produtos" class="section-link">
            Ver Todos
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
        <div v-if="loading" class="products-skeleton">
          <div v-for="n in 4" :key="n" class="skeleton-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text short"></div>
          </div>
        </div>
        <div v-else class="products-grid">
          <ProductCard
            v-for="product in featuredProducts"
            :key="product._id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- Harmonização -->
    <section class="section harmony-section">
      <div class="container">
        <div class="harmony-content">
          <div class="harmony-text">
            <span class="harmony-label">Harmonização Perfeita</span>
            <h2 class="harmony-title">
              Vinho & Queijo:<br/>
              Uma Combinação<br/>
              <span class="highlight">Inesquecível</span>
            </h2>
            <p class="harmony-description">
              Nossos especialistas selecionaram as melhores combinações de vinhos e queijos
              para criar experiências gastronômicas memoráveis. Explore nossos kits de harmonização.
            </p>
            <router-link to="/produtos?categoria=kits" class="btn btn-gold btn-lg">
              Explorar Harmonizações
            </router-link>
          </div>
          <div class="harmony-image">
            <div class="harmony-image-wrapper">
              <span class="harmony-placeholder">🍷🧀</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Depoimentos -->
    <section class="section testimonials-section">
      <div class="container">
        <h2 class="section-title">O que dizem nossos clientes</h2>
        <div class="testimonials-grid">
          <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-card">
            <div class="testimonial-stars">
              <span v-for="n in 5" :key="n" class="star" :class="{ 'filled': n <= testimonial.rating }">★</span>
            </div>
            <p class="testimonial-text">"{{ testimonial.text }}"</p>
            <div class="testimonial-author">
              <div class="author-avatar">{{ testimonial.name.charAt(0) }}</div>
              <div class="author-info">
                <span class="author-name">{{ testimonial.name }}</span>
                <span class="author-role">{{ testimonial.role }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="section newsletter-section">
      <div class="container">
        <div class="newsletter-content">
          <div class="newsletter-text">
            <h2 class="newsletter-title">Fique por dentro das novidades</h2>
            <p class="newsletter-description">
              Cadastre-se para receber ofertas exclusivas, lançamentos e dicas de harmonização.
            </p>
          </div>
          <form @submit.prevent="subscribe" class="newsletter-form-home">
            <input
              v-model="email"
              type="email"
              placeholder="Digite seu e-mail"
              class="newsletter-input-home"
              required
            />
            <button type="submit" class="btn btn-primary btn-lg">
              Cadastrar
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useProductsStore } from '../stores/products'
import { useUIStore } from '../stores/ui'
import ProductCard from '../components/ProductCard.vue'

const productsStore = useProductsStore()
const uiStore = useUIStore()

const loading = ref(true)
const email = ref('')

const featuredProducts = ref([])

const categories = [
  { id: 1, name: 'Vinhos', slug: 'vinhos', icon: '🍷', count: 120 },
  { id: 2, name: 'Cervejas Artesanais', slug: 'cervejas', icon: '🍺', count: 85 },
  { id: 3, name: 'Queijos Especiais', slug: 'queijos', icon: '🧀', count: 45 },
  { id: 4, name: 'Destilados Premium', slug: 'destilados', icon: '🥃', count: 60 },
  { id: 5, name: 'Kits Gourmet', slug: 'kits', icon: '🎁', count: 25 },
  { id: 6, name: 'Drinks & Coquetéis', slug: 'drinks', icon: '🍸', count: 40 }
]

const testimonials = [
  {
    id: 1,
    name: 'Carlos Mendes',
    role: 'Sommelier',
    rating: 5,
    text: 'A seleção de vinhos é impecável. Encontrei rótulos raros que não achei em lugar nenhum. A entrega foi rápida e bem embalada.'
  },
  {
    id: 2,
    name: 'Ana Paula Silva',
    role: 'Chef de Cozinha',
    rating: 5,
    text: 'Os kits de harmonização são perfeitos para meus jantares. Qualidade excepcional em todos os produtos. Super recomendo!'
  },
  {
    id: 3,
    name: 'Ricardo Oliveira',
    role: 'Entusiasta de Cervejas',
    rating: 4,
    text: 'Variedade incrível de cervejas artesanais. Descobri marcas fantásticas que não conhecia. Atendimento excelente.'
  }
]

onMounted(async () => {
  try {
    await productsStore.fetchFeatured()
    featuredProducts.value = productsStore.featuredProducts
  } catch (err) {
    console.error('Erro ao carregar produtos:', err)
  } finally {
    loading.value = false
  }
})

const subscribe = () => {
  uiStore.showToast('Inscrição realizada com sucesso!', 'success')
  email.value = ''
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-black) 0%, var(--color-gray) 100%);
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="%238B0000" stroke-width="0.5" opacity="0.1"/></svg>');
  background-size: 200px;
  opacity: 0.5;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(13, 13, 13, 0.7), rgba(13, 13, 13, 0.9));
}

.hero-content {
  position: relative;
  text-align: center;
  max-width: 800px;
  padding: var(--space-xl);
  z-index: 2;
}

.hero-subtitle {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--color-wine-light);
  margin-bottom: var(--space-lg);
}

.hero-title {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--space-lg);
}

.hero-title .highlight {
  color: var(--color-wine-light);
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto var(--space-2xl);
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

.hero-scroll {
  position: absolute;
  bottom: var(--space-2xl);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  color: var(--text-muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: bounce 2s infinite;
}

.scroll-indicator {
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
  40% { transform: translateX(-50%) translateY(-10px); }
  60% { transform: translateX(-50%) translateY(-5px); }
}

/* Categorias */
.categories-section {
  background: var(--bg-secondary);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
}

.category-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
  text-align: center;
  transition: all var(--transition-normal);
  text-decoration: none;
}

.category-card:hover {
  border-color: var(--color-wine);
  transform: translateY(-4px);
  box-shadow: var(--shadow-wine);
}

.category-icon {
  font-size: 3rem;
  margin-bottom: var(--space-md);
}

.category-name {
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
}

.category-count {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Produtos em Destaque */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2xl);
}

.section-link {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  color: var(--color-wine-light);
  font-size: 0.9rem;
  font-weight: 500;
  transition: gap var(--transition-fast);
}

.section-link:hover {
  gap: var(--space-md);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-xl);
}

.products-skeleton {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-xl);
}

.skeleton-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.skeleton-image {
  aspect-ratio: 3/4;
  width: 100%;
}

.skeleton-text {
  height: 20px;
  margin: var(--space-md);
  width: 80%;
}

.skeleton-text.short {
  width: 50%;
}

/* Harmonização */
.harmony-section {
  background: var(--bg-secondary);
}

.harmony-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3xl);
  align-items: center;
}

.harmony-label {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--color-gold);
  margin-bottom: var(--space-lg);
}

.harmony-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: var(--space-lg);
}

.harmony-title .highlight {
  color: var(--color-wine-light);
}

.harmony-description {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: var(--space-xl);
  max-width: 500px;
}

.harmony-image-wrapper {
  aspect-ratio: 1;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6rem;
}

/* Depoimentos */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-xl);
}

.testimonial-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--space-2xl);
}

.testimonial-stars {
  display: flex;
  gap: var(--space-xs);
  margin-bottom: var(--space-lg);
}

.star {
  color: var(--color-gray-medium);
  font-size: 1.2rem;
}

.star.filled {
  color: var(--color-gold);
}

.testimonial-text {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: var(--space-xl);
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.author-avatar {
  width: 44px;
  height: 44px;
  background: var(--color-wine);
  color: var(--color-white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
}

.author-name {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
}

.author-role {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Newsletter */
.newsletter-section {
  background: var(--color-wine);
}

.newsletter-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2xl);
  max-width: 1000px;
  margin: 0 auto;
}

.newsletter-title {
  font-family: var(--font-display);
  font-size: 2rem;
  color: var(--color-white);
  margin-bottom: var(--space-sm);
}

.newsletter-description {
  color: rgba(245, 245, 245, 0.8);
  font-size: 1rem;
}

.newsletter-form-home {
  display: flex;
  gap: var(--space-sm);
  min-width: 400px;
}

.newsletter-input-home {
  flex: 1;
  padding: var(--space-md) var(--space-lg);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  color: var(--color-white);
  font-size: 0.95rem;
}

.newsletter-input-home::placeholder {
  color: rgba(245, 245, 245, 0.6);
}

.newsletter-input-home:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .products-grid,
  .products-skeleton {
    grid-template-columns: repeat(3, 1fr);
  }
  .harmony-content {
    grid-template-columns: 1fr;
  }
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  .categories-grid {
    grid-template-columns: 1fr;
  }
  .products-grid,
  .products-skeleton {
    grid-template-columns: repeat(2, 1fr);
  }
  .testimonials-grid {
    grid-template-columns: 1fr;
  }
  .newsletter-content {
    flex-direction: column;
    text-align: center;
  }
  .newsletter-form-home {
    min-width: 100%;
  }
  .harmony-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  .products-grid,
  .products-skeleton {
    grid-template-columns: 1fr;
  }
  .section-header {
    flex-direction: column;
    gap: var(--space-md);
    text-align: center;
  }
}
</style>
