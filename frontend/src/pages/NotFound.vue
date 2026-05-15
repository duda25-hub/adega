<template>
  <div class="not-found">
    <div class="not-found-content">
      <span class="not-found-icon">🍷</span>
      <h1 class="not-found-title">404</h1>
      <h2 class="not-found-subtitle">Página Não Encontrada</h2>
      <p class="not-found-text">
        Parece que esta garrafa está vazia. A página que você procura não existe ou foi movida.
      </p>
      <router-link to="/" class="btn btn-primary btn-lg">
        Voltar para Início
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-black) 0%, var(--color-gray) 100%);
  text-align: center;
  padding: var(--space-xl);
}

.not-found-content {
  max-width: 500px;
}

.not-found-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: var(--space-lg);
  opacity: 0.8;
}

.not-found-title {
  font-family: var(--font-display);
  font-size: 6rem;
  font-weight: 700;
  color: var(--color-wine);
  line-height: 1;
  margin-bottom: var(--space-md);
}

.not-found-subtitle {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin-bottom: var(--space-md);
}

.not-found-text {
  color: var(--text-muted);
  margin-bottom: var(--space-2xl);
  line-height: 1.7;
}
</style>
