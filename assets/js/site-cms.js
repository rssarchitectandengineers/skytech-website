/**
 * The Skytech - Dynamic Site CMS & Modular Page Builder Runtime
 * Enables drag & drop section reordering, real-time visual customizer, and cloud sync via Supabase.
 * Zero-dependency, ultra-lightweight, 100% Mobile & Desktop friendly.
 */

const SUPABASE_STORAGE_CONFIG_URL = 'https://fzfdddlkclluqpiyjrtx.supabase.co/storage/v1/object/public/skytech-media/site-cms-config.json';

export const DEFAULT_SITE_CMS_CONFIG = {
  version: 1,
  updatedAt: new Date().toISOString(),
  business: {
    primaryPhone: '+91-7737243812',
    phoneRaw: '917737243812',
    email: 'skytechjpr@gmail.com',
    whatsapp: '917737243812',
    address: 'Near Metro Pillar 75, Mansarovar / Gopalpura Bypass, Jaipur, Rajasthan 302020',
    experienceYears: '15+',
    projectsCount: '500+',
    steelSavings: '15-25%'
  },
  announcement: {
    enabled: false,
    text: '⚡ Free Structural Drawing Vetting & Steel Optimization Audit for Jaipur Projects',
    linkText: 'Claim Free Audit →',
    linkUrl: 'contact.html'
  },
  seo: {
    metaTitle: 'The Skytech Structural Consultant Jaipur | RCC, PEB & Value Engineering',
    metaDesc: 'Premier Structural Engineering Consultants in Jaipur, Rajasthan. Specializing in IS 456 RCC design, PEB industrial sheds, structural audits, and 15-25% steel cost savings.'
  },
  hero: {
    tagline: 'Leading Structural Engineering Consultants in Jaipur',
    headline: 'Engineering Excellence & Proven 15-25% Steel Optimization',
    description: 'Licensed Chartered Structural Engineers delivering IS-compliant RCC frames, high-span PEB industrial structures, and drawing value re-engineering across Rajasthan.',
    primaryBtnText: 'Get Free Drawing Audit',
    primaryBtnUrl: 'contact.html',
    secondaryBtnText: 'Explore Projects',
    secondaryBtnUrl: 'projects.html'
  },
  stats: [
    { id: 'stat-exp', number: '15+', label: 'Years Experience' },
    { id: 'stat-projects', number: '500+', label: 'Projects Delivered' },
    { id: 'stat-savings', number: '15-25%', label: 'Steel Tonnage Saved' },
    { id: 'stat-compliance', number: '100%', label: 'IS Code Compliance' }
  ],
  // Default homepage section order and visibility
  sectionOrder: [
    { id: 'hero', name: 'Hero 3D Showcase Banner', icon: '🖼️', visible: true },
    { id: 'seo-overview', name: 'SEO Overview & Services Strip', icon: '⚡', visible: true },
    { id: 'hero-stats', name: 'Key Achievements & Stats Counters', icon: '📊', visible: true },
    { id: 'about', name: 'About The Skytech & Leadership', icon: '🏛️', visible: true },
    { id: 'services', name: 'Core Engineering Expertise Grid', icon: '🛠️', visible: true },
    { id: 'projects', name: 'Featured Projects Showcase', icon: '🏗️', visible: true },
    { id: 'why-choose-us', name: 'Why Choose The Skytech & Workflow', icon: '⭐', visible: true },
    { id: 'blog', name: 'Technical Engineering Blog Feed', icon: '✍️', visible: true },
    { id: 'faq', name: 'Frequently Asked Questions (FAQ)', icon: '❓', visible: true }
  ]
};

/**
 * Hydrates the DOM based on CMS Configuration
 */
export function applySiteCmsConfig(config) {
  if (!config) return;

  // 1. Reorder & Toggle Sections on Homepage
  const mainContent = document.querySelector('main');
  if (mainContent && Array.isArray(config.sectionOrder)) {
    config.sectionOrder.forEach(secItem => {
      let secEl = document.getElementById(secItem.id);
      if (!secEl && secItem.id === 'hero-stats') {
        secEl = document.querySelector('.hero-stats-section');
      }

      if (secEl && secEl.parentElement === mainContent) {
        // Toggle visibility
        secEl.style.display = secItem.visible === false ? 'none' : '';
        // Move to bottom of main to enforce configured order
        mainContent.appendChild(secEl);
      }
    });
  }

  // 2. Hydrate Global Business Contact Info
  if (config.business) {
    const { primaryPhone, phoneRaw, email, whatsapp, address } = config.business;

    // Update all tel: links
    if (primaryPhone || phoneRaw) {
      document.querySelectorAll('a[href^="tel:"]').forEach(el => {
        el.href = `tel:+${phoneRaw || primaryPhone.replace(/[^0-9]/g, '')}`;
        if (el.innerText.includes('7737243812') || el.innerText.includes('+91')) {
          el.innerText = primaryPhone;
        }
      });
    }

    // Update all WhatsApp links
    if (whatsapp) {
      const waNumber = whatsapp.replace(/[^0-9]/g, '');
      document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(el => {
        const url = new URL(el.href);
        const textParam = url.searchParams.get('text') || '';
        el.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(textParam || 'Hello Skytech Team, I need structural consultation.')}`;
      });
    }

    // Update all mailto: links
    if (email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
        el.href = `mailto:${email}`;
        if (el.innerText.includes('@')) {
          el.innerText = email;
        }
      });
    }
  }

  // 3. Hydrate Hero Section
  if (config.hero) {
    const heroTitle = document.querySelector('.hero-clean-title, .hero-slide-title');
    if (heroTitle && config.hero.headline) {
      heroTitle.innerText = config.hero.headline;
    }
    const heroDesc = document.querySelector('.hero-clean-desc, .hero-slide-desc');
    if (heroDesc && config.hero.description) {
      heroDesc.innerText = config.hero.description;
    }
    const heroTag = document.querySelector('.hero-badge, .hero-tagline');
    if (heroTag && config.hero.tagline) {
      heroTag.innerText = config.hero.tagline;
    }
  }

  // 4. Hydrate Stats Counters
  if (Array.isArray(config.stats)) {
    const statCards = document.querySelectorAll('.hero-stat-card');
    config.stats.forEach((st, idx) => {
      if (statCards[idx]) {
        const numEl = statCards[idx].querySelector('.hero-stat-number, .stat-number');
        if (numEl && st.number) numEl.innerText = st.number;
        const lblEl = statCards[idx].querySelector('.hero-stat-label, .stat-label');
        if (lblEl && st.label) lblEl.innerText = st.label;
      }
    });
  }

  // 5. Hydrate Top Announcement Bar
  if (config.announcement) {
    let barEl = document.getElementById('skytechAnnouncementBar');
    if (config.announcement.enabled) {
      if (!barEl) {
        barEl = document.createElement('div');
        barEl.id = 'skytechAnnouncementBar';
        barEl.style.cssText = 'background: linear-gradient(90deg, #0284c7, #0369a1); color: #ffffff; padding: 0.45rem 1rem; font-size: 0.85rem; text-align: center; font-weight: 600; position: relative; z-index: 10001; display: flex; align-items: center; justify-content: center; gap: 0.75rem; flex-wrap: wrap;';
        document.body.prepend(barEl);
      }
      barEl.style.display = 'flex';
      barEl.innerHTML = `
        <span>${config.announcement.text}</span>
        ${config.announcement.linkText ? `<a href="${config.announcement.linkUrl || 'contact.html'}" style="color: #fef08a; text-decoration: underline; font-weight: 700;">${config.announcement.linkText}</a>` : ''}
      `;
    } else if (barEl) {
      barEl.style.display = 'none';
    }
  }

  // 6. Hydrate SEO Meta Tags
  if (config.seo) {
    if (config.seo.metaTitle && document.location.pathname.endsWith('index.html') || document.location.pathname === '/') {
      document.title = config.seo.metaTitle;
    }
    if (config.seo.metaDesc) {
      const mDesc = document.querySelector('meta[name="description"]');
      if (mDesc) mDesc.setAttribute('content', config.seo.metaDesc);
    }
  }
}

/**
 * Initializes Site CMS runtime on any page
 */
export async function initSiteCms() {
  // 1. Instant Cached Load from localStorage (Zero Latency)
  let activeConfig = null;
  try {
    const cached = localStorage.getItem('skytech_site_cms_config');
    if (cached) {
      activeConfig = JSON.parse(cached);
      applySiteCmsConfig(activeConfig);
    }
  } catch (e) {
    console.warn('CMS localStorage notice:', e);
  }

  // 2. Fetch Latest Cloud Configuration from Supabase Storage (Async Sync)
  try {
    const res = await fetch(`${SUPABASE_STORAGE_CONFIG_URL}?v=${Date.now()}`);
    if (res.ok) {
      const cloudConfig = await res.json();
      if (cloudConfig && typeof cloudConfig === 'object') {
        localStorage.setItem('skytech_site_cms_config', JSON.stringify(cloudConfig));
        applySiteCmsConfig(cloudConfig);
      }
    }
  } catch (err) {
    // If offline or network issue, fallback is already rendered
    console.log('Site CMS cloud load notice (using fallback):', err.message);
  }

  // 3. Listen for Live Preview messages from the Admin Page Builder
  window.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKYTECH_CMS_PREVIEW_UPDATE') {
      applySiteCmsConfig(event.data.config);
    }
  });
}
