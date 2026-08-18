---
pageClass: lang-asm
layout: home

hero:
  name: "Code Universe: ASM"
  text: "El metal al desnudo"
  tagline: "Domina el lenguaje más cercano a la máquina, instrucción por instrucción."
  image: 
    src: /icons/asm-icon.webp
    alt: "Code Universe ASM"
  actions:
    - theme: brand
      text: Iniciar Travesía
      link: /es/asm/guia/0_introduccion/01_Vision_General
    - theme: alt
      text: Ver Ecosistema
      link: 
---

<section class="cu-main-container">

<h2 class="cu-title">El Corazón del Hardware</h2>

<div class="cu-grid">

<article class="cu-feature-card">
<header class="cu-card-icon">🧠</header>
<div class="cu-card-content">
<h3>Hardware</h3>
<p>Entiende cómo piensa realmente la CPU: registros, memoria y direcciones.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">⚡</header>
<div class="cu-card-content">
<h3>Rendimiento</h3>
<p>Escribe el código más rápido posible, sin nada que se interponga en tu camino.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🔩</header>
<div class="cu-card-content">
<h3>Control Total</h3>
<p>Toca cada instrucción y cada bit: el ensamblador no oculta nada.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🔗</header>
<div class="cu-card-content">
<h3>Sistemas y ABI</h3>
<p>Conecta tu código con el sistema operativo y con C como un profesional.</p>
</div>
</article>

</div>

</section>

<footer class="cu-main-footer">
<p>Forjado con <span class="cu-chip">💠</span> por <strong>Fabrizio</strong></p>
<small class="cu-badge">Assembly x86-64 · 2026</small>
</footer>

<style scoped>

.cu-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  border: none !important;
  background: linear-gradient(to right, #9aa7b3, #5c6670);
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
  border-color: #9aa7b3;
  box-shadow: 0 12px 30px rgba(154, 167, 179, 0.12);
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

.cu-chip {
  display: inline-block;
  animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
  0% { filter: drop-shadow(0 0 2px #9aa7b3); transform: scale(1); }
  100% { filter: drop-shadow(0 0 8px #e8eef5); transform: scale(1.2); }
}

</style>