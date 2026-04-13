---
pageClass: lang-main
layout: home

hero:
  name: "Code Universe"
  text: "The Knowledge Nexus"
  tagline: "A standardized technical documentation ecosystem for the programming elite."
  image:
    src: /img/astronauta.webp
    alt: "Code Universe Logo"
  actions:
    - theme: brand
      text: Start Exploring
      link: "#languages"
    - theme: alt
      text: View on GitHub
      link: https://github.com/Fabrizio-Franco1405/Code-Universe
---

<section id="languages" class="cu-main-container">

<h2 class="cu-title">Select a Galaxy</h2>

<div class="cu-grid">

<article class="cu-feature-card" onclick="window.location.href='/en/rs/'">
<header class="cu-card-icon">
  <img src="/icons/rust-icon.svg" alt="Rust" width="80" height="80">
</header>
<div class="cu-card-content">
<h3>Rust (Coming Soon)</h3>
<p>Guaranteed memory safety and cutting-edge performance for modern systems.</p>
</div>
</article>

<article class="cu-feature-card" onclick="window.location.href='/en/cpp/'">
<header class="cu-card-icon">
  <img src="/icons/cpp-icon.svg" alt="C++" width="80" height="80">
</header>
<div class="cu-card-content">
<h3>C++</h3>
<p>Limitless power and high-level abstractions for the world's most demanding software.</p>
</div>
</article>

<article class="cu-feature-card" onclick="window.location.href='/en/c/'">
<header class="cu-card-icon">
  <img src="/icons/c-icon.svg" alt="C" width="80" height="80">
</header>
<div class="cu-card-content">
<h3>C (Coming Soon)</h3>
<p>The foundational standard. Absolute control and raw efficiency from the source.</p>
</div>
</article>

<article class="cu-feature-card" onclick="window.location.href='/en/cs/'">
<header class="cu-card-icon">
  <img src="/icons/csharp-icon.svg" alt="C#" width="80" height="80">
</header>
<div class="cu-card-content">
<h3>C# (Coming Soon)</h3>
<p>Productivity and robustness with .NET for enterprise applications and game development.</p>
</div>
</article>

</div>

</section>

<footer class="cu-main-footer">
<p>Architecture designed with <span class="cu-core">💠</span> by <strong>Fabrizio</strong></p>
<small class="cu-badge">Code Universe Hub • 2026</small>
</footer>

<style scoped>

.cu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
}

/* --- 2. HOLOGRAPHIC TITLE AND COLORS --- */
.cu-title {
    text-align: center;
    font-size: 3rem;
    font-weight: 900;
    margin-bottom: 3.5rem;
    border: none !important;
    background: linear-gradient(to right, #ff007a, #8b5cf6, #00f0ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

/* --- 3. CARDS: TECHNICAL AND ADAPTIVE STANDARDIZATION --- */
.cu-feature-card {
    background: var(--vp-c-bg-soft); 
    border: 1px solid var(--vp-c-divider);
    
    border-radius: 8px;
    
    padding: 40px;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    display: flex;
    flex-direction: column;
    text-align: center;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}

.cu-feature-card:hover {
    transform: translateY(-8px);
    border-color: #8b5cf6; 
    box-shadow: 0 10px 30px rgba(139, 92, 246, 0.1);
}

.cu-card-icon {
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.cu-card-icon img {
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.1));
}

.cu-card-content h3 {
    color: var(--vp-c-text-1);
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 12px 0 !important;
}

.cu-card-content p {
    color: var(--vp-c-text-2);
    margin: 0;
    line-height: 1.6;
    font-size: 0.95rem;
}

/* --- 4. FOOTER --- */
.cu-main-footer {
    text-align: center;
    padding: 80px 24px;
    border-top: 1px solid var(--vp-c-divider);
    margin-top: 80px;
}

.cu-core {
  display: inline-block;
  animation: rotateCore 3s linear infinite;
}

@keyframes rotateCore {
  from { transform: rotate(0deg); filter: drop-shadow(0 0 2px #ff007a); }
  to { transform: rotate(360deg); filter: drop-shadow(0 0 10px #00f0ff); }
}

</style>