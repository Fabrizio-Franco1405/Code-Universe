---
pageClass: lang-c
layout: home

hero:
  name: "Code Universe: C"
  text: "El origen de todo"
  tagline: "Domina el lenguaje que cimentó las bases de la informática moderna."
  image: 
    src: /icons/c-icon.svg
    alt: "Code Universe C"
  actions:
    - theme: brand
      text: Iniciar Travesía
      link: /es/c/guia/1_introduccion/01_Vision_General
    - theme: alt
      text: Ver Ecosistema
      link: 
---

<section class="cu-main-container">

<h2 class="cu-title">La Base de la Computación</h2>

<div class="cu-grid">

<article class="cu-feature-card">
<header class="cu-card-icon">🏗️</header>
<div class="cu-card-content">
<h3>Bajo Nivel</h3>
<p>Interactúa directamente con el hardware y comprende cómo funciona realmente la memoria.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">📍</header>
<div class="cu-card-content">
<h3>Punteros</h3>
<p>Domina la aritmética de punteros y la gestión manual de memoria con malloc y free.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">⚡</header>
<div class="cu-card-content">
<h3>Eficiencia Brutal</h3>
<p>Escribe código con el mínimo overhead posible, ideal para sistemas embebidos y kernels.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">📜</header>
<div class="cu-card-content">
<h3>Portabilidad</h3>
<p>El estándar ANSI C te permite llevar tus programas a casi cualquier arquitectura existente.</p>
</div>
</article>

</div>

</section>

<footer class="cu-main-footer">
<p>Forjado con <span class="cu-anvil">⚒️</span> por <strong>Fabrizio</strong></p>
<small class="cu-badge">C23 Standard Edition</small>
</footer>

<style scoped>

.cu-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  border: none !important;
  /* Gradiente Gris Acero / C-Blue */
  background: linear-gradient(to right, #394a59, #a8b9cc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Grid */
.cu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

/* Cards */
.cu-feature-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 32px;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
}

.cu-feature-card:hover {
  transform: translateY(-8px);
  /* Color de acento Gris Acero */
  border-color: #5c7e91;
  box-shadow: 0 12px 30px rgba(92, 126, 145, 0.15);
}

.cu-card-icon {
  font-size: 3rem;
}

.cu-card-content h3 {
  margin: 0 0 8px 0 !important;
  font-size: 1.25rem;
  color: var(--vp-c-text-1);
}

.cu-card-content p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

/* Footer */
.cu-main-footer {
  text-align: center;
  padding: 60px 24px;
  border-top: 1px solid var(--vp-c-divider);
}

/* Animación de yunque para C */
.cu-anvil {
  display: inline-block;
  animation: strike 1.5s infinite alternate;
}

@keyframes strike {
  0% { filter: drop-shadow(0 0 2px #394a59); transform: rotate(0deg); }
  100% { filter: drop-shadow(0 0 8px #a8b9cc); transform: rotate(-15deg); }
}

</style>