---
pageClass: lang-csharp
layout: home

hero:
  name: "Code Universe: C#"
  text: "Power and Productivity"
  tagline: "Industrial-grade software engineering for scalable applications and high-end game development."
  image: 
    src: /assets/icons/csharp-icon.svg
    alt: "Code Universe C#"
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
<header class="cu-card-icon">⚡</header>
<div class="cu-card-content">
<h3>Managed Performance</h3>
<p>Master the JIT and Garbage Collector to build high-performance software without manual memory risks.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🎮</header>
<div class="cu-card-content">
<h3>Game Development</h3>
<p>The leading language in Unity. Create interactive experiences and virtual worlds with the power of .NET.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🏗️</header>
<div class="cu-card-content">
<h3>Advanced Architecture</h3>
<p>Dependency Injection, LINQ, and native Async programming for complex enterprise systems.</p>
</div>
</article>

<article class="cu-feature-card">
<header class="cu-card-icon">🌍</header>
<div class="cu-card-content">
<h3>Cross-Platform</h3>
<p>Write once, deploy on Windows, Linux, macOS, iOS, and Android thanks to .NET Core and MAUI.</p>
</div>
</article>

</div>

</section>

<footer class="cu-main-footer">
<p>Forged with <span class="cu-energy">✨</span> by <strong>Fabrizio</strong></p>
<small class="cu-badge">.NET 8.0/9.0 Standard Edition</small>
</footer>

<style scoped>

.cu-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  border: none !important;
  /* C# Purple Gradient */
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
  /* Purple accent color */
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