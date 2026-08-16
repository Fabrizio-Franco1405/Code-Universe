---
pageClass: lang-rust
layout: home

hero:
  name: "Code Universe: Rust"
  text: "Seguridad sin límites"
  tagline: "Domina Rust de una forma más didáctica y sencilla."
  image: 
    src: /icons/rust-icon.svg
    alt: "Code Universe Rust"
  actions:
    - theme: brand
      text: Iniciar Travesía
      link: /es/rs/guia/0_introduccion/01_Vision_General
    - theme: alt
      text: Ver Ecosistema
      link: 
---

<section class="cu-main-container">

<h2 class="cu-title">El Arsenal del Programador</h2>

<div class="cu-grid">

<article class="cu-feature-card">
<header class="cu-card-icon">🦀</header>
<div class="cu-card-content">
<h3>Ownership</h3>
<p>Entiende el corazón de Rust: la gestión de memoria sin recolector de basura.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🛡️</header>
<div class="cu-card-content">
<h3>Seguridad</h3>
<p>Aprende cómo el compilador evita errores de segmentación antes de que ocurran.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">⚙️</header>
<div class="cu-card-content">
<h3>Concurrencia</h3>
<p>Domina el paralelismo sin miedo a las condiciones de carrera.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">📦</header>
<div class="cu-card-content">
<h3>Cargo & Crates</h3>
<p>Gestiona dependencias y construye proyectos como un profesional.</p>
</div>
</article>

</div>

</section>

<footer class="cu-main-footer">
<p>Forjado con <span class="cu-flame">🔥</span> por <strong>Fabrizio</strong></p>
<small class="cu-badge">Rust Edition 2026</small>
</footer>

<style scoped>

.cu-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  border: none !important;
  background: linear-gradient(to right, #f06431, #ce412b);
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
  border-color: #f06431;
  box-shadow: 0 12px 30px rgba(240, 100, 49, 0.12);
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

.cu-flame {
  display: inline-block;
  animation: flicker 1.5s infinite alternate;
}

@keyframes flicker {
  0% { filter: drop-shadow(0 0 2px #f06431); transform: scale(1); }
  100% { filter: drop-shadow(0 0 8px #ff8c00); transform: scale(1.2); }
}

</style>