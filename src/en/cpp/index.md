---
pageClass: lang-cpp
layout: home

hero:
  name: "Code Universe: C++"
  text: "Power without limits"
  tagline: "High-performance software engineering within everyone's reach."
  image: 
    src: /icons/cpp-icon.svg
    alt: "Code Universe C++"
  actions:
    - theme: brand
      text: Start Journey
      link: 
    - theme: alt
      text: View Ecosystem
      link: 
---

<section class="cu-main-container">

<h2 class="cu-title">The Engine of the Digital World</h2>

<div class="cu-grid">

<article class="cu-feature-card">
<header class="cu-card-icon">🚀</header>
<div class="cu-card-content">
<h3>Performance</h3>
<p>Master the language that powers game engines and low-latency critical systems.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🧠</header>
<div class="cu-card-content">
<h3>Modern C++</h3>
<p>Leverage C++20/23 features: Ranges, Concepts, and Modules for clean, robust code.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🛠️</header>
<div class="cu-card-content">
<h3>Total Control</h3>
<p>Precise memory and resource management through RAII and smart pointers.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🧩</header>
<div class="cu-card-content">
<h3>Abstraction</h3>
<p>Create complex systems with templates and polymorphism without sacrificing a single CPU cycle.</p>
</div>
</article>

</div>

</section>

<footer class="cu-main-footer">
<p>Forged with <span class="cu-energy">⚡</span> by <strong>Fabrizio</strong></p>
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