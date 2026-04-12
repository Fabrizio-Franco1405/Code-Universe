---
pageClass: lang-csharp
layout: home

hero:
  name: "Code Universe: C#"
  text: "Productividad y Robustez"
  tagline: "El estándar industrial para aplicaciones escalables y el desarrollo de videojuegos de alto nivel."
  image: 
    src: /assets/icons/csharp-icon.svg
    alt: "Code Universe C#"
  actions:
    - theme: brand
      text: Iniciar Travesía
      link: 
    - theme: alt
      text: Ver Ecosistema
      link: 
---

<section class="cu-main-container">

<h2 class="cu-title">La Columna del Desarrollo Moderno</h2>

<div class="cu-grid">

<article class="cu-feature-card">
<header class="cu-card-icon">⚡</header>
<div class="cu-card-content">
<h3>Rendimiento Managed</h3>
<p>Domina el JIT y el Garbage Collector para crear software de alto rendimiento sin los riesgos de la memoria manual.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🎮</header>
<div class="cu-card-content">
<h3>Desarrollo de Juegos</h3>
<p>El lenguaje rey en Unity. Crea experiencias interactivas y mundos virtuales con el poder de .NET.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🏗️</header>
<div class="cu-card-content">
<h3>Arquitectura de Nivel</h3>
<p>Inyección de dependencias, LINQ y Programación Asíncrona nativa para sistemas empresariales complejos.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🌍</header>
<div class="cu-card-content">
<h3>Multiplataforma</h3>
<p>Escribe una vez y despliega en Windows, Linux, macOS, iOS y Android gracias a .NET Core y MAUI.</p>
</div>
</article>

</div>

</section>

<footer class="cu-main-footer">
<p>Forjado con <span class="cu-energy">✨</span> por <strong>Fabrizio</strong></p>
<small class="cu-badge">.NET 8.0/9.0 Standard Edition</small>
</footer>

<style scoped>

.cu-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  border: none !important;
  /* Gradiente Púrpura C# */
  background: linear-gradient(to right, #a179dc, #68217a);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

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
  /* Color de acento Morado */
  border-color: #a179dc;
  box-shadow: 0 12px 30px rgba(161, 121, 220, 0.15);
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

.cu-main-footer {
  text-align: center;
  padding: 60px 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.cu-energy {
  display: inline-block;
  animation: pulse 1.5s infinite alternate;
}

@keyframes pulse {
  0% { filter: drop-shadow(0 0 2px #a179dc); transform: scale(1); }
  100% { filter: drop-shadow(0 0 8px #68217a); transform: scale(1.2); }
}

</style>