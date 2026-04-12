---
pageClass: lang-rust
layout: home

hero:
  name: "Code Universe: Rust"
  text: "Safety without limits"
  tagline: "Master Rust in a more didactic and simple way."
  image: 
    src: /Rust-Portada.png
    alt: "Code Universe Rust"
  actions:
    - theme: brand
      text: Start Journey
      link: 
    - theme: alt
      text: View Ecosystem
      link: 
---

<section class="cu-main-container">

<h2 class="cu-title">The Programmer's Arsenal</h2>

<div class="cu-grid">

<article class="cu-feature-card">
<header class="cu-card-icon">🦀</header>
<div class="cu-card-content">
<h3>Ownership</h3>
<p>Understand the heart of Rust: memory management without a garbage collector.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🛡️</header>
<div class="cu-card-content">
<h3>Safety</h3>
<p>Learn how the compiler prevents segmentation faults before they even happen.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">⚙️</header>
<div class="cu-card-content">
<h3>Concurrency</h3>
<p>Master parallelism without the fear of data races.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">📦</header>
<div class="cu-card-content">
<h3>Cargo & Crates</h3>
<p>Manage dependencies and build projects like a professional.</p>
</div>
</article>

</div>

</section>

<footer class="cu-main-footer">
<p>Forged with <span class="cu-flame">🔥</span> by <strong>Fabrizio</strong></p>
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