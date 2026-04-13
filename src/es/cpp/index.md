---
pageClass: lang-cpp
layout: home

hero:
  name: "Code Universe: C++"
  text: "Potencia sin límites"
  tagline: "Ingeniería de software de alto rendimiento al alcance de todos."
  image: 
    src: /icons/cpp-icon.svg
    alt: "Code Universe C++"
  actions:
    - theme: brand
      text: Iniciar Travesía
      link: /es/cpp/guia/1_introduccion/01_Vision_General
    - theme: alt
      text: Ver Ecosistema
      link: 
---

<section class="cu-main-container">

<h2 class="cu-title">El Motor del Mundo Digital</h2>

<div class="cu-grid">

<article class="cu-feature-card">
<header class="cu-card-icon">🚀</header>
<div class="cu-card-content">
<h3>Rendimiento</h3>
<p>Domina el lenguaje que impulsa los motores de juegos y sistemas críticos de baja latencia.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🧠</header>
<div class="cu-card-content">
<h3>C++ Moderno</h3>
<p>Aprovecha las bondades de C++20/23: Ranges, Conceptos y Módulos para un código limpio.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🛠️</header>
<div class="cu-card-content">
<h3>Control Total</h3>
<p>Gestión precisa de memoria y recursos mediante RAII y punteros inteligentes.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🧩</header>
<div class="cu-card-content">
<h3>Abstracción</h3>
<p>Crea sistemas complejos con plantillas y polimorfismo sin sacrificar ni un ciclo de CPU.</p>
</div>
</article>

</div>

</section>

<footer class="cu-main-footer">
<p>Forjado con <span class="cu-energy">⚡</span> por <strong>Fabrizio</strong></p>
<small class="cu-badge">C++23 Standard Edition</small>
</footer>

<style scoped>

.cu-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  border: none !important;
  /* Gradiente Azul C++ */
  background: linear-gradient(to right, #00599C, #004482);
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
  /* Color de acento Azul */
  border-color: #00599C;
  box-shadow: 0 12px 30px rgba(0, 89, 156, 0.15);
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

/* Animación de rayo para C++ */
.cu-energy {
  display: inline-block;
  animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
  0% { filter: drop-shadow(0 0 2px #00599C); transform: scale(1); }
  100% { filter: drop-shadow(0 0 8px #61dafb); transform: scale(1.2); }
}

</style>