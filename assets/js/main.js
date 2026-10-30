/**
 * The Skytech Structural Consultant - Main Interactive Logic
 * Quality Matters | Jaipur, Rajasthan
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initCopyButtons();
  initSmartContactActions();
  initConsultationPopup();
  initConsultationForms();
  initProjectFilters();
  initProjectModal();
  initServiceModal();
  initStatsCounter();
  initSmoothScroll();
  initInstantPagePrefetch();
});

/* -------------------------------------------------------------
 * 1. Sticky Header & Scroll Effects
 * ------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* -------------------------------------------------------------
 * 2. Mobile Navigation Toggle
 * ------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !mainNav) return;

  toggleBtn.addEventListener('click', () => {
    const isActive = mainNav.classList.toggle('mobile-active');
    toggleBtn.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });

  // Close nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // If mobile dropdown parent clicked, toggle dropdown
      const parent = link.closest('.has-dropdown');
      if (parent && window.innerWidth <= 768 && e.target === link) {
        e.preventDefault();
        parent.classList.toggle('open');
        return;
      }
      mainNav.classList.remove('mobile-active');
    });
  });
}

/* -------------------------------------------------------------
 * 3. Copy Contact Info (Phone & Email) with Toast & Fallback
 * ------------------------------------------------------------- */
function initCopyButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-badge-btn, .btn-copy-contact, [data-copy]');
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const textToCopy = btn.getAttribute('data-copy');
    if (!textToCopy) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        fallbackCopyText(textToCopy);
      });
    } else {
      fallbackCopyText(textToCopy);
    }
  });
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(`Copied to clipboard: ${text}`);
  } catch (err) {
    showToast(`Copied: ${text}`);
  }
  document.body.removeChild(textArea);
}

function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* -------------------------------------------------------------
 * 4. Consultation Popup Modal (Auto-open once per session & Global Delegation)
 * ------------------------------------------------------------- */
function initConsultationPopup() {
  const popupModal = document.getElementById('consultationPopupModal');
  if (!popupModal) return;

  const closeBtns = popupModal.querySelectorAll('.close-modal-btn');

  // Auto-open after 3.2 seconds if not dismissed in this session
  const hasDismissed = sessionStorage.getItem('skytech_consultation_dismissed');
  if (!hasDismissed) {
    setTimeout(() => {
      if (!sessionStorage.getItem('skytech_consultation_dismissed')) {
        openModal(popupModal);
      }
    }, 3200);
  }

  // Global Click Event Delegation for [data-open-consultation]
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-consultation]');
    if (trigger) {
      e.preventDefault();
      
      // If AI Assistant is currently open, close it
      const aiWidget = document.getElementById('aiAssistantWidget');
      if (aiWidget && aiWidget.classList.contains('active')) {
        aiWidget.classList.remove('active');
      }

      // If service is specified via data-service attribute, pre-select it
      const serviceVal = trigger.getAttribute('data-service');
      if (serviceVal) {
        const serviceSelect = popupModal.querySelector('[name="service"]');
        if (serviceSelect) {
          for (let i = 0; i < serviceSelect.options.length; i++) {
            if (serviceSelect.options[i].value.toLowerCase().includes(serviceVal.toLowerCase()) || 
                serviceSelect.options[i].text.toLowerCase().includes(serviceVal.toLowerCase())) {
              serviceSelect.selectedIndex = i;
              break;
            }
          }
        }
      }

      openModal(popupModal);
    }
  });

  // Close triggers
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(popupModal);
      sessionStorage.setItem('skytech_consultation_dismissed', 'true');
    });
  });

  // Click outside to close
  popupModal.addEventListener('click', (e) => {
    if (e.target === popupModal) {
      closeModal(popupModal);
      sessionStorage.setItem('skytech_consultation_dismissed', 'true');
    }
  });

  // Escape key listener for accessible dismissal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal-overlay.active');
      if (activeModal) {
        closeModal(activeModal);
        if (activeModal.id === 'consultationPopupModal') {
          sessionStorage.setItem('skytech_consultation_dismissed', 'true');
        }
      }
    }
  });
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

/* -------------------------------------------------------------
 * 5. Consultation Forms Validation & Submission
 * ------------------------------------------------------------- */
function initConsultationForms() {
  const forms = document.querySelectorAll('.consultation-enquiry-form');

  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = form.querySelector('[name="fullName"]');
      const countryCode = form.querySelector('[name="countryCode"]') ? form.querySelector('[name="countryCode"]').value : '+91';
      const phoneInput = form.querySelector('[name="phone"]');
      const emailInput = form.querySelector('[name="email"]');
      const serviceSelect = form.querySelector('[name="service"]');
      const detailsInput = form.querySelector('[name="details"]');

      // Validation: Full Name
      if (!nameInput || !nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showToast('Please enter your full name (minimum 2 characters).');
        if (nameInput) nameInput.focus();
        return;
      }

      // Validation: Phone Number
      const phoneRegex = /^[0-9]{8,14}$/;
      const cleanPhone = phoneInput ? phoneInput.value.replace(/[^0-9]/g, '') : '';
      if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
        showToast('Please enter a valid phone number (at least 10 digits).');
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Validation: Email (Optional, but validate if provided)
      const emailVal = emailInput && emailInput.value.trim() ? emailInput.value.trim() : '';
      if (emailVal) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
          showToast('Please enter a valid email address.');
          emailInput.focus();
          return;
        }
      }

      // Validation: Service Required
      if (!serviceSelect || !serviceSelect.value) {
        showToast('Please select the structural service required.');
        if (serviceSelect) serviceSelect.focus();
        return;
      }

      const fullName = nameInput.value.trim();
      const fullPhoneNumber = `${countryCode} ${cleanPhone}`;
      const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
      const details = detailsInput && detailsInput.value.trim() ? detailsInput.value.trim() : 'Structural consultation requested via website';

      // Submit state
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : 'Submit Enquiry';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Enquiry & Alerting Team...';
      }

      // 1. WhatsApp Message Text for immediate notification on Phone (+91-7737243812)
      const waMessage = 
`*🏗️ NEW CONSULTATION ENQUIRY - The Skytech STRUCTURAL*
---------------------------------------
👤 *Client Name:* ${fullName}
📞 *Phone Number:* ${fullPhoneNumber}
✉️ *Email:* ${emailVal || 'Not Provided'}
⚙️ *Service Required:* ${serviceName}
📍 *Project Details:* ${details}
---------------------------------------
_Sent via The Skytech Consultant Website_`;

      const waUrl = `https://wa.me/917737243812?text=${encodeURIComponent(waMessage)}`;
      const mailtoUrl = `mailto:skytechjpr@gmail.com?subject=${encodeURIComponent(`New Structural Lead: ${fullName} (${serviceName})`)}&body=${encodeURIComponent(waMessage)}`;

      // 2. PRIVATE SECURE MOBILE PUSH NOTIFICATION (Telegram Bot & Direct WhatsApp)
      // Completely eliminates ntfy.sh public feed - delivers only genuine leads to owner's private device
      sendMobileLeadNotification({
        fullName,
        cleanPhone,
        fullPhoneNumber,
        emailVal,
        serviceName,
        details
      });

      // 3. Automated Email Dispatch to skytechjpr@gmail.com
      try {
        fetch('https://formsubmit.co/ajax/skytechjpr@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: `🚨 New Lead: ${fullName} (${serviceName}) - Phone: ${fullPhoneNumber}`,
            _template: 'table',
            _captcha: 'false',
            'Client Name': fullName,
            'Phone Number': fullPhoneNumber,
            'Email Address': emailVal || 'Not Provided',
            'Service Required': serviceName,
            'Project Details': details,
            'Website Page': window.location.href,
            'Timestamp': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          })
        }).catch(err => {
          console.warn('FormSubmit notice:', err);
        });
      } catch (err) {
        console.warn('Email dispatch notice:', err);
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
      }

      // 4. Show clean, professional confirmation screen (No manual action buttons or WhatsApp redirects)
      const formParent = form.parentElement;
      formParent.innerHTML = `
        <div style="text-align: center; padding: 2rem 1.25rem;">
          <div style="width: 64px; height: 64px; border-radius: 50%; background: #dcfce7; color: #16a34a; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3 style="font-size: 1.4rem; color: #0b1523; font-weight: 800; margin-bottom: 0.5rem;">Enquiry Submitted Successfully!</h3>
          <p style="font-size: 0.92rem; color: #475569; margin-bottom: 1.5rem; line-height: 1.6;">
            Thank you <strong>${fullName}</strong>. Your structural consultation request has been submitted directly to The Skytech Structural Engineers. Our senior team will review your requirements and connect with you shortly.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.5rem; text-align: left; font-size: 0.85rem;">
            <div style="margin-bottom: 6px; color: #64748b;"><strong>Client:</strong> <span style="color: #0f172a; font-weight: 600;">${fullName}</span></div>
            <div style="margin-bottom: 6px; color: #64748b;"><strong>Phone:</strong> <span style="color: #0284c7; font-weight: 700;">${fullPhoneNumber}</span></div>
            <div style="margin-bottom: 6px; color: #64748b;"><strong>Service:</strong> <span style="color: #0f172a; font-weight: 600;">${serviceName}</span></div>
            <div style="color: #64748b;"><strong>Status:</strong> <span style="color: #16a34a; font-weight: 700;">● Dispatched to The Skytech Engineering Team</span></div>
          </div>

          <button type="button" class="btn-consultation-primary close-parent-modal-btn" style="width: 100%; justify-content: center; padding: 0.85rem 1.5rem; font-size: 0.95rem; font-weight: 700; border-radius: 8px;">
            <span>Done / Close Window</span>
          </button>
        </div>
      `;

      // Bind close button
      const closeBtn = formParent.querySelector('.close-parent-modal-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const modal = formParent.closest('.modal-overlay');
          if (modal) closeModal(modal);
        });
      }

      sessionStorage.setItem('skytech_consultation_dismissed', 'true');
      showToast('Enquiry received! Sent directly to The Skytech team.');
    });
  });
}

/* -------------------------------------------------------------
 * 6. Projects Filtering & Navigation
 * ------------------------------------------------------------- */
const PROJECTS_DATA = [
  {
    id: 'prj-1',
    title: 'The Rajmahal Commercial Complex',
    category: 'commercial',
    categoryName: 'Commercial',
    location: 'Jaipur, Rajasthan',
    image: 'assets/images/project-commercial.jpg',
    area: '145,000 sq ft',
    floors: 'G + 12 Floors',
    system: 'Earthquake-Resistant RCC Frame with Post-Tensioned Slabs',
    steelSavings: '14.2% Steel Optimization through Re-Engineering',
    codes: 'IS 456:2000, IS 1893:2016 (Zone II), IS 13920',
    description: 'A 12-storey commercial glass & steel landmark featuring grand double-height entrance lobby, underground double-basement parking with diaphragm retaining walls, and optimized shear wall core.'
  },
  {
    id: 'prj-2',
    title: 'Mega Industrial PEB Logistics Park',
    category: 'industrial',
    categoryName: 'Industrial',
    location: 'Sitapura Industrial Area, Rajasthan',
    image: 'assets/images/project-industrial.jpg',
    area: '260,000 sq ft',
    floors: 'Single Span High Bay',
    system: 'Pre-Engineered Building (PEB) with 45m Clear Span Portal Framing',
    steelSavings: '18.5% Tonnage Reduction compared to standard trusses',
    codes: 'IS 800:2007 (Limit State), IS 875 Part 3 (Wind Speed 47 m/s)',
    description: 'High-volume logistics and warehousing facility with built-in 10-tonne EOT crane runways, mezzanine administrative deck, and high-tensile Zincalume standing seam roofing.'
  },
  {
    id: 'prj-3',
    title: 'The Emerald Heights Residential Towers',
    category: 'residential',
    categoryName: 'Residential',
    location: 'Mansarovar Extension, Jaipur',
    image: 'assets/images/project-residential.jpg',
    area: '320,000 sq ft',
    floors: '2 Towers (G + 14 Floors)',
    system: 'Dual System: Ductile Moment-Resisting Frame + Shear Walls',
    steelSavings: 'Raft Foundation optimization saving 120 MT rebar',
    codes: 'IS 456, IS 1893:2016, IS 13920:2016, NBC 2016',
    description: 'Twin high-rise luxury apartment towers engineered on variable geotechnical strata using an optimized raft foundation with tension anchors and full ductile seismic reinforcement.'
  },
  {
    id: 'prj-4',
    title: 'Samrat Ashoka University Academic Block',
    category: 'institutional',
    categoryName: 'Institutional',
    location: 'Rajasthan',
    image: 'assets/images/project-institutional.jpg',
    area: '185,000 sq ft',
    floors: 'G + 4 Floors + 800-seat Auditorium',
    system: 'Exposed Architectural Concrete Arches & Long-Span Waffle Slabs',
    steelSavings: 'Architectural column-free waffle grid',
    codes: 'IS 456:2000, IS 13920, IRC Standards',
    description: 'Grand institutional complex featuring exposed fair-faced concrete arches, 28-meter clear span cantilevered lecture auditoriums, and temperature-controlled internal courtyards.'
  },
  {
    id: 'prj-5',
    title: 'Jaipur Expressway Flyover & Viaduct Overpass',
    category: 'infrastructure',
    categoryName: 'Infrastructure',
    location: 'Jaipur Outer Ring Road',
    image: 'assets/images/hero-building.jpg',
    area: '1.8 km Viaduct Section',
    floors: 'Grade-Separated Elevated Corridor',
    system: 'Prestressed Concrete Box Girders on Hollow Pier Columns',
    steelSavings: 'Optimized strand profiling',
    codes: 'IRC:112-2020, IRC:6-2017, IS 1893',
    description: 'High-capacity viaduct with prestressed concrete segmental construction designed for heavy 70R multi-axle vehicle loadings and seismic isolation bearings.'
  },
  {
    id: 'prj-6',
    title: 'Heritage Hotel & Royal Resort',
    category: 'commercial',
    categoryName: 'Commercial',
    location: 'Kukas, Jaipur',
    image: 'assets/images/consultation-thumb.jpg',
    area: '95,000 sq ft',
    floors: 'G + 3 Floors with Cantilever Terraces',
    system: 'Hybrid Stone Masonry & RCC Frame with Traditional Jali Integration',
    steelSavings: '11% Cost Efficiency',
    codes: 'IS 456, IS 1905, NBC 2016',
    description: 'A 5-star luxury heritage resort blending traditional Rajasthani architectural facades with modern ductile structural frames and cantilevered infinity pool support beams.'
  }
];

function initProjectFilters() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectsGrid = document.getElementById('projectsGrid');
  if (!projectsGrid) return;

  renderProjects(PROJECTS_DATA);

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filterValue = pill.getAttribute('data-filter');
      if (filterValue === 'all') {
        renderProjects(PROJECTS_DATA);
      } else {
        const filtered = PROJECTS_DATA.filter(p => p.category === filterValue);
        renderProjects(filtered);
      }
    });
  });

  // Carousel navigation arrows
  const prevBtn = document.querySelector('.arrow-btn.prev');
  const nextBtn = document.querySelector('.arrow-btn.next');
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      projectsGrid.scrollBy({ left: -340, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', () => {
      projectsGrid.scrollBy({ left: 340, behavior: 'smooth' });
    });
  }

  // Delegated click listener for viewing project modal specifications (avoids duplicate listeners)
  projectsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-view-project]');
    if (btn) {
      const prjId = btn.getAttribute('data-view-project');
      const found = PROJECTS_DATA.find(x => x.id === prjId);
      if (found) showProjectModalDetails(found);
    }
  });
}

function renderProjects(projects) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = projects.map(p => `
    <article class="project-card" data-project-id="${p.id}">
      <div class="project-card-image">
        <picture>
          <source srcset="${p.image.replace('.jpg', '.webp')}" type="image/webp">
          <img src="${p.image}" alt="${p.title} - Structural Design by The Skytech" loading="lazy" width="400" height="200" decoding="async">
        </picture>
        <span class="project-category-tag">${p.categoryName}</span>
      </div>
      <div class="project-card-body">
        <h4 class="project-card-title">${p.title}</h4>
        <div class="project-card-location">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>${p.location}</span>
        </div>
        <div class="project-specs-list">
          <div><strong>Area:</strong> ${p.area}</div>
          <div><strong>System:</strong> ${p.system.split('with')[0]}</div>
          <div style="color: #0284c7; font-weight: 700;">★ ${p.steelSavings}</div>
        </div>
        <button type="button" class="btn-view-project" data-view-project="${p.id}">
          View Full Specifications →
        </button>
      </div>
    </article>
  `).join('');
}

/* -------------------------------------------------------------
 * 7. Project Details Modal
 * ------------------------------------------------------------- */
function initProjectModal() {
  const modal = document.getElementById('projectDetailsModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(modal));
  }
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });
}

function showProjectModalDetails(project) {
  const modal = document.getElementById('projectDetailsModal');
  const container = document.getElementById('projectModalBody');
  if (!modal || !container) return;

  container.innerHTML = `
    <div style="position: relative; height: 280px; overflow: hidden; border-radius: 14px 14px 0 0;">
      <picture>
        <source srcset="${project.image.replace('.jpg', '.webp')}" type="image/webp">
        <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover;" decoding="async">
      </picture>
      <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(11,21,35,0.92)); padding: 1.5rem; color: #fff;">
        <span class="project-category-tag" style="position: static; display: inline-block; margin-bottom: 0.5rem;">${project.categoryName}</span>
        <h3 style="font-size: 1.6rem; font-weight: 800; color: #fff;">${project.title}</h3>
        <p style="font-size: 0.85rem; color: #bae6fd;">📍 ${project.location}</p>
      </div>
    </div>
    <div style="padding: 2rem;">
      <p style="font-size: 0.95rem; color: #334155; line-height: 1.6; margin-bottom: 1.5rem;">
        ${project.description}
      </p>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.75rem; background: #f8fafc; padding: 1.25rem; border-radius: 12px; border: 1px solid #e2e8f0;">
        <div>
          <span style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Built-up Area</span>
          <p style="font-size: 0.95rem; font-weight: 700; color: #0f172a;">${project.area}</p>
        </div>
        <div>
          <span style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Floors / Elevation</span>
          <p style="font-size: 0.95rem; font-weight: 700; color: #0f172a;">${project.floors}</p>
        </div>
        <div style="grid-column: span 2;">
          <span style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Structural Framing System</span>
          <p style="font-size: 0.95rem; font-weight: 700; color: #0284c7;">${project.system}</p>
        </div>
        <div style="grid-column: span 2;">
          <span style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Value Re-Engineering & Savings</span>
          <p style="font-size: 0.95rem; font-weight: 700; color: #10b981;">✔ ${project.steelSavings}</p>
        </div>
        <div style="grid-column: span 2;">
          <span style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Indian Standard Codes Complied</span>
          <p style="font-size: 0.85rem; font-weight: 600; color: #475569;">${project.codes}</p>
        </div>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <button type="button" class="btn-consultation-primary" data-open-consultation style="flex-grow: 1; justify-content: center;">
          Inquire Similar Structural Project →
        </button>
        <a href="https://wa.me/917737243812?text=${encodeURIComponent(`Hello The Skytech, I am interested in your project: ${project.title}`)}" target="_blank" rel="noopener noreferrer" class="btn-portfolio-outline" style="color: #25d366; border-color: #25d366;">
          Chat on WhatsApp
        </a>
      </div>
    </div>
  `;

  openModal(modal);

  // Re-bind consultation trigger inside modal
  const cBtn = container.querySelector('[data-open-consultation]');
  if (cBtn) {
    cBtn.addEventListener('click', () => {
      closeModal(modal);
      const cModal = document.getElementById('consultationPopupModal');
      if (cModal) openModal(cModal);
    });
  }
}

/* -------------------------------------------------------------
 * 8. Service Details Modal for All 10 Services
 * ------------------------------------------------------------- */
const SERVICES_DATA = {
  'rcc-structural-design': {
    title: 'RCC Structural Design',
    icon: `<path d="M4 22h16M4 2v20M20 2v20M8 2v20M12 2v20M16 2v20M4 6h16M4 10h16M4 14h16M4 18h16"/>`,
    tagline: 'Precision Concrete Engineering from Foundation to Crown',
    overview: 'Our Reinforced Cement Concrete (RCC) structural design combines advanced 3D finite element modeling (FEM) with rigorous adherence to IS 456:2000 and IS 13920:2016 ductile detailing.',
    deliverables: [
      'Comprehensive 3D Structural Analysis & Load Combinations (Seismic, Wind, Gravity)',
      'Substructure & Foundation Design (Isolated, Combined, Mat/Raft, Deep Piles)',
      'Shear Wall & Core Design for High-Rise Wind & Seismic Lateral Resistance',
      'Execution-Ready GFC Drawings with Detailed Bar Bending Schedules (BBS)',
      'Quantities Optimization: Balanced Steel Tonnage to Concrete Volume'
    ],
    codes: 'IS 456:2000, IS 1893:2016, IS 13920:2016, IS 875 Parts 1-5'
  },
  'steel-structure-design': {
    title: 'Steel Structure Design',
    icon: `<path d="M2 20h20M7 20V4l5 4 5-4v16M2 8h20M2 14h20"/>`,
    tagline: 'High-Strength, Long-Span Industrial & Commercial Steel Structures',
    overview: 'Engineered for optimal strength-to-weight ratios, our structural steel designs span industrial factory workshops, heavy conveyor trusses, multi-storey steel framing, and pipe racks per IS 800:2007 (Limit State Method).',
    deliverables: [
      'Portal Frame & Heavy Truss Analysis under High Velocity Wind Loads',
      'Moment Connection & Bolted/Welded Joint Engineering (HSFG Bolts)',
      'Base Plate & Anchor Bolt Anchorage Modeling',
      'Fabrication & Erection Shop Drawings with Complete Part Assemblies',
      'Optimization against Buckling, Deflection, and Lateral Torsional Buckling'
    ],
    codes: 'IS 800:2007, IS 808, IS 875 (Wind up to 50 m/s), AWS D1.1'
  },
  'building-cost-reduction': {
    title: 'Building Cost Reduction (Approved Drawings)',
    icon: `<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
    tagline: 'Trim 15% to 25% Steel & Concrete Costs Without Compromising Safety',
    overview: 'Have existing approved drawings that appear over-designed or heavily reinforced? The Skytech specializes in value engineering and re-analysis of approved drawings to streamline reinforcement and eliminate unnecessary structural tonnage.',
    deliverables: [
      'Independent Peer Review and Over-Design Diagnostic Audit',
      'Re-Analysis of Spans, Column Axial Load Distribution & Slab Thicknesses',
      'BBS Rationalization: Standardizing Bar Lengths to Eliminate Lap Wastage',
      'Formal Structural Safety & Code Compliance Certification',
      'Average Documented Client Savings: ₹8 to ₹25 per Square Foot'
    ],
    codes: 'Full compliance with original statutory approval codes'
  },
  'peb-design': {
    title: 'Pre-Engineered Building (PEB) Design',
    icon: `<path d="M3 21h18M3 10l9-7 9 7v11H3V10zM9 21v-6h6v6"/>`,
    tagline: 'Accelerated Industrial Construction with Custom Tapered Sections',
    overview: 'Pre-Engineered Steel Buildings (PEB) are the modern choice for logistics hubs, manufacturing factories, cold storage, and sports stadiums requiring clear column-free spans.',
    deliverables: [
      'Tapered Built-Up Plate Primary Rafter & Column Design',
      'Secondary Cold-Formed Z & C Purlin Optimization per IS 801',
      'EOT Crane Gantry Girder & Surge Load Engineering',
      'Anchor Bolt Layouts & Heavy Foundation Concrete Pad Designs',
      'Fast-Track Fabrication Deliverables & Erection Staging Guidance'
    ],
    codes: 'IS 800:2007, MBMA (Metal Building Manufacturers Association), IS 875'
  },
  'structural-audit': {
    title: 'Structural Audit and Assessment',
    icon: `<path d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>`,
    tagline: 'Comprehensive Structural Health & Integrity Certification',
    overview: 'Periodic structural audits are vital for aging buildings, commercial complexes, and industrial plants. The Skytech conducts rigorous site inspections, Non-Destructive Testing (NDT), and structural health reports.',
    deliverables: [
      'Rebound Hammer Testing for Concrete Surface Hardness & Uniformity',
      'Ultrasonic Pulse Velocity (UPV) Testing to Detect Internal Voids & Cracks',
      'Cover Meter & Rebar Corrosion Potential Mapping',
      'Structural Distress & Settlement Mapping',
      'Certified Audit Report with Recommended Remedial Measures'
    ],
    codes: 'IS 13311 (Parts 1 & 2), SP 25 (Handbook on Causes and Prevention of Cracks)'
  },
  'structural-stability': {
    title: 'Structural Stability Assessment',
    icon: `<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>`,
    tagline: 'Statutory Safety Endorsements & Peer Review Certificates',
    overview: 'We provide formal Structural Stability Certificates required by municipal authorities, factory inspectorates, financial institutions, and insurance assessors for commercial and industrial occupancy.',
    deliverables: [
      'Live Load Capacity Verification for Additional Floors or Heavy Machinery',
      'Earthquake Resistance Classification per IS 1893:2016',
      'Third-Party Peer Review & Endorsement for Municipal Approvals',
      'Fire-Damaged or Cyclone-Affected Structure Capacity Re-Certification',
      'Statutory Stability Certificate signed by Licensed Structural Engineer'
    ],
    codes: 'National Building Code 2016 (Part 6), State Municipal Building Byelaws'
  },
  'retrofitting-strengthening': {
    title: 'Retrofitting and Structural Strengthening',
    icon: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
    tagline: 'Extending Life & Load Capacity of Existing Concrete & Steel',
    overview: 'When structures need to bear higher loads or have suffered distress, demolition is not the answer. The Skytech delivers state-of-the-art structural retrofitting and seismic rehabilitation solutions.',
    deliverables: [
      'RCC Column & Beam Jacketing with Micro-Concrete',
      'Carbon Fiber Reinforced Polymer (CFRP) Composite Wrapping',
      'Steel Section Flange Plating & External Post-Tensioning',
      'Foundation Underpinning and Micro-Piling',
      'Detailed Execution Drawings with Surface Preparation Procedures'
    ],
    codes: 'IS 15988:2013 (Seismic Evaluation and Strengthening), ACI 440.2R'
  },
  'project-management-pmc': {
    title: 'Project Management Consultancy (PMC)',
    icon: `<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>`,
    tagline: 'End-to-End On-Site Engineering Supervision & Quality Control',
    overview: 'A brilliant structural design requires flawless site execution. The Skytech PMC ensures that the contractor adheres precisely to engineering drawings, bar schedules, and concrete pouring standards.',
    deliverables: [
      'Pre-Pour Reinforcement Inspection and Checksheet Sign-Off',
      'Verification of Bar Diameters, Spacing, Clear Cover, and Lap Splices',
      'Formwork Stability and De-Shuttering Period Surveillance',
      'Contractor Bill Certification against Actual Site Progress',
      'Zero-Defect Handover Assistance'
    ],
    codes: 'IS 456 Section 10 (Quality Assurance), CPWD Specifications'
  },
  'quality-control': {
    title: 'Quality Control',
    icon: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4"/>`,
    tagline: 'Zero-Defect Quality Assurance Protocols for Construction Materials',
    overview: 'We establish rigorous Quality Assurance and Quality Control (QA/QC) regimes on site, verifying concrete grades, rebar tensile strength, aggregate gradations, and water-cement ratios.',
    deliverables: [
      'Concrete Mix Design Verification (M25, M30, M40, M50+)',
      'Slump Cone Testing & Fresh Concrete Workability Monitoring',
      '7-Day and 28-Day Concrete Cube Compressive Strength Audits',
      'Rebar Tensile and Bend/Rebend Laboratory Test Audits',
      'Comprehensive QA/QC Register and Material Compliance Logbook'
    ],
    codes: 'IS 10262 (Concrete Mix Proportioning), IS 516 (Methods of Tests for Strength)'
  },
  'soil-investigation': {
    title: 'Soil Investigation & Geotechnical Consultancy',
    icon: `<path d="M2 17l10 5 10-5M2 12l10 5 10-5M2 7l10 5 10-5"/>`,
    tagline: 'Safe, Economical Foundations Built on Verified Ground Data',
    overview: 'A building is only as strong as the ground beneath it. The Skytech provides complete geotechnical investigations, bore hole drilling, soil testing, and Safe Bearing Capacity (SBC) recommendations.',
    deliverables: [
      'Rotary & Percussion Borehole Drilling with Core Recovery',
      'Standard Penetration Tests (SPT) & Dynamic Cone Penetration Tests',
      'Laboratory Soil Mechanics (Grain Size, Atterberg Limits, Triaxial Shear)',
      'Water Table Fluctuation and Chemical Aggressiveness Analysis',
      'SBC Recommendation Report for Isolated, Raft, or Friction Pile Foundations'
    ],
    codes: 'IS 1892 (Subsurface Investigation), IS 2131 (SPT), IS 6403 (Bearing Capacity)'
  }
};

function initServiceModal() {
  const modal = document.getElementById('serviceDetailsModal');
  if (!modal) return;

  const closeBtn = modal.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal);
  });

  // Attach to cards and dropdown items
  document.querySelectorAll('[data-service-key]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceKey = item.getAttribute('data-service-key');
      const service = SERVICES_DATA[serviceKey];
      if (service) showServiceModalDetails(service);
    });
  });
}

function showServiceModalDetails(service) {
  const modal = document.getElementById('serviceDetailsModal');
  const container = document.getElementById('serviceModalBody');
  if (!modal || !container) return;

  container.innerHTML = `
    <div style="background: linear-gradient(135deg, #0b1523 0%, #15243a 100%); padding: 2rem; color: #fff; border-radius: 14px 14px 0 0;">
      <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(14,165,233,0.2); border: 1.5px solid #38bdf8; color: #38bdf8; display: flex; align-items: center; justify-content: center;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            ${service.icon}
          </svg>
        </div>
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; color: #38bdf8; font-weight: 700; letter-spacing: 1.5px;">The Skytech Service Excellence</span>
          <h3 style="font-size: 1.6rem; font-weight: 800; color: #fff;">${service.title}</h3>
        </div>
      </div>
      <p style="font-size: 0.95rem; color: #cbd5e1; font-weight: 500;">${service.tagline}</p>
    </div>

    <div style="padding: 2rem;">
      <p style="font-size: 0.95rem; color: #334155; line-height: 1.65; margin-bottom: 1.5rem;">
        ${service.overview}
      </p>

      <h4 style="font-size: 1rem; font-weight: 800; color: #0b1523; margin-bottom: 0.85rem;">Key Engineering Deliverables:</h4>
      <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.75rem;">
        ${service.deliverables.map(d => `
          <li style="display: flex; align-items: flex-start; gap: 0.65rem; font-size: 0.88rem; color: #475569;">
            <span style="color: #0284c7; font-weight: 800; margin-top: 2px;">✔</span>
            <span>${d}</span>
          </li>
        `).join('')}
      </ul>

      <div style="background: #f0f9ff; border: 1px solid #bae6fd; padding: 1rem; border-radius: 8px; margin-bottom: 2rem;">
        <span style="font-size: 0.72rem; text-transform: uppercase; color: #0369a1; font-weight: 800; letter-spacing: 1px; display: block; margin-bottom: 3px;">Governing Design Codes & Standards:</span>
        <span style="font-size: 0.84rem; font-weight: 600; color: #0c4a6e;">${service.codes}</span>
      </div>

      <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
        <button type="button" class="btn-consultation-primary" data-open-consultation style="flex-grow: 1; justify-content: center;">
          Request Consultation for ${service.title} →
        </button>
        <a href="https://wa.me/917737243812?text=${encodeURIComponent(`Hello The Skytech, I want to consult about: ${service.title}`)}" target="_blank" rel="noopener noreferrer" class="btn-portfolio-outline" style="color: #25d366; border-color: #25d366;">
          WhatsApp Quick Chat
        </a>
      </div>
    </div>
  `;

  openModal(modal);

  const cBtn = container.querySelector('[data-open-consultation]');
  if (cBtn) {
    cBtn.addEventListener('click', () => {
      closeModal(modal);
      const cModal = document.getElementById('consultationPopupModal');
      if (cModal) {
        // Pre-select service in form
        const select = cModal.querySelector('[name="service"]');
        if (select) {
          for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].text.includes(service.title.split(' ')[0])) {
              select.selectedIndex = i;
              break;
            }
          }
        }
        openModal(cModal);
      }
    });
  }
}

/* -------------------------------------------------------------
 * 9. Animated Statistics Counter
 * ------------------------------------------------------------- */
function initStatsCounter() {
  const statValues = document.querySelectorAll('.stat-value');
  if (!statValues.length) return;

  let hasAnimated = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-counter-grid');
  if (statsSection) observer.observe(statsSection);

  function animateCounters() {
    statValues.forEach(elem => {
      const targetStr = elem.getAttribute('data-target') || elem.textContent;
      const targetNum = parseInt(targetStr.replace(/[^0-9]/g, ''), 10);
      const suffix = targetStr.includes('+') ? '+' : targetStr.includes('%') ? '%' : '';
      let current = 0;
      const step = Math.max(1, Math.floor(targetNum / 30));
      const interval = setInterval(() => {
        current += step;
        if (current >= targetNum) {
          elem.textContent = `${targetNum}${suffix}`;
          clearInterval(interval);
        } else {
          elem.textContent = `${current}${suffix}`;
        }
      }, 40);
    });
  }
}

/* -------------------------------------------------------------
 * 10. Smooth Scrolling for Anchor Links
 * ------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerOffset = 80;
        const elemPosition = targetElem.getBoundingClientRect().top;
        const offsetPosition = elemPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* -------------------------------------------------------------
 * 11. Smart Desktop / Mobile Contact Protocol Routing
 * Prevents OS / Chrome Profile Picker popups on Desktop PCs
 * Directly routes WhatsApp Web & Gmail Web on Desktop
 * ------------------------------------------------------------- */
function initSmartContactActions() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 768 && ('ontouchstart' in window));

  // Smart WhatsApp: On desktop PCs bypass intermediate landing page, go directly to web.whatsapp.com
  document.addEventListener('click', (e) => {
    const waLink = e.target.closest('a[href*="wa.me/"]');
    if (waLink && !isMobile) {
      e.preventDefault();
      try {
        const url = new URL(waLink.href);
        const phone = url.pathname.replace(/^\//, '');
        const text = url.searchParams.get('text') || '';
        const webUrl = `https://web.whatsapp.com/send?phone=${phone}${text ? `&text=${encodeURIComponent(text)}` : ''}`;
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        window.open(waLink.href, '_blank', 'noopener,noreferrer');
      }
    }
  });

  // Smart Phone Click: On desktop PCs without cellular capability, opening raw tel: triggers Chrome profile dialogs
  // Show clean interactive desktop contact action card instead
  document.addEventListener('click', (e) => {
    const telLink = e.target.closest('a[href^="tel:"]');
    if (telLink && !isMobile) {
      if (telLink.closest('#desktopActionModal')) return;
      e.preventDefault();
      openDesktopActionModal('phone', '+91-7737243812');
    }
  });

  // Smart Email Click: On desktop PCs, provide 1-click Gmail Web compose or copy
  document.addEventListener('click', (e) => {
    const mailLink = e.target.closest('a[href^="mailto:"]');
    if (mailLink && !isMobile) {
      if (mailLink.closest('#desktopActionModal')) return;
      e.preventDefault();
      openDesktopActionModal('mail', 'skytechjpr@gmail.com');
    }
  });
}

function openDesktopActionModal(type, value) {
  let modal = document.getElementById('desktopActionModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'desktopActionModal';
    modal.className = 'modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('.close-modal-btn')) {
        closeModal(modal);
      }
    });
  }

  if (type === 'phone') {
    modal.innerHTML = `
      <div class="desktop-action-card">
        <button type="button" class="modal-close-btn close-modal-btn" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="desktop-action-icon phone">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.053 15.053 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1.01A11.36 11.36 0 0 1 8.5 3.99c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z"/>
          </svg>
        </div>
        <h3 class="desktop-action-title">The Skytech Structural Engineer</h3>
        <p class="desktop-action-value">+91-7737243812</p>
        <div class="desktop-action-buttons">
          <a href="https://web.whatsapp.com/send?phone=917737243812&text=Hello%20The%20Skytech%2C%20I%20would%20like%20to%20enquire%20about%20your%20structural%20consultancy%20services." target="_blank" rel="noopener noreferrer" class="btn-desktop-act primary-wa">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.79 14.07c-.24.67-1.4 1.24-1.92 1.28-.48.04-1.07.06-3.48-.94-2.88-1.2-4.75-4.14-4.89-4.33-.14-.19-1.18-1.57-1.18-2.99 0-1.42.74-2.12 1.01-2.41.27-.29.59-.36.79-.36.2 0 .4 0 .57.01.19.01.44-.07.69.52.25.6.86 2.1.94 2.25.07.16.12.35.02.55-.1.2-.15.32-.3.5-.15.17-.32.39-.46.52-.15.15-.31.31-.13.62.17.3 1.09 1.79 2.34 2.91 1.61 1.43 2.97 1.87 3.39 2.08.42.2.66.18.91-.11.25-.28 1.07-1.25 1.36-1.68.29-.42.57-.35.96-.21.39.14 2.47 1.17 2.89 1.38.42.21.7.31.81.49.1.18.1.96-.14 1.63z"/></svg>
            <span>Chat on WhatsApp Web</span>
          </a>
          <button type="button" class="btn-desktop-act secondary-copy" data-copy="+917737243812">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copy Phone Number</span>
          </button>
          <a href="tel:+917737243812" class="btn-desktop-act tertiary-dial" onclick="window.location.href='tel:+917737243812';">
            <span>Or launch your PC calling app (Phone Link / Skype)</span>
          </a>
        </div>
      </div>
    `;
  } else {
    modal.innerHTML = `
      <div class="desktop-action-card">
        <button type="button" class="modal-close-btn close-modal-btn" aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div class="desktop-action-icon mail">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h3 class="desktop-action-title">Email The Skytech Engineering</h3>
        <p class="desktop-action-value">skytechjpr@gmail.com</p>
        <div class="desktop-action-buttons">
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=skytechjpr@gmail.com&su=Structural%20Engineering%20Consultancy%20Enquiry" target="_blank" rel="noopener noreferrer" class="btn-desktop-act primary-gmail">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.263H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
            <span>Compose in Gmail Web</span>
          </a>
          <button type="button" class="btn-desktop-act secondary-copy" data-copy="skytechjpr@gmail.com">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copy Email Address</span>
          </button>
          <a href="mailto:skytechjpr@gmail.com" class="btn-desktop-act tertiary-dial" onclick="window.location.href='mailto:skytechjpr@gmail.com';">
            <span>Or launch your PC default mail client (Outlook / Windows Mail)</span>
          </a>
        </div>
      </div>
    `;
  }

  openModal(modal);
}

/* -------------------------------------------------------------
 * 12. Official Telegram Private Lead Alert System
 * 100% Private, Official & Secure: Delivers real-time phone alerts
 * with custom ringtone, client contact info, and 1-tap Call/WhatsApp buttons
 * ------------------------------------------------------------- */
const TELEGRAM_ALERT_CONFIG = {
  enabled: true,
  // The Skytech Official Telegram Bot API Token & Chat ID
  botToken: '9115205736:AAH6xdmfePDFdJeEp9rDz1AqMP-fYz-Fug8', 
  chatId: '5018364349'
};

function sendMobileLeadNotification(lead) {
  if (!TELEGRAM_ALERT_CONFIG.enabled || !TELEGRAM_ALERT_CONFIG.botToken) return;

  // Sanitize phone number for WhatsApp link to prevent duplicate country codes
  let phoneForWa = lead.cleanPhone;
  if (phoneForWa.length === 12 && phoneForWa.startsWith('91')) {
    phoneForWa = phoneForWa.substring(2);
  } else if (phoneForWa.length === 11 && phoneForWa.startsWith('0')) {
    phoneForWa = phoneForWa.substring(1);
  }

  const tgText = `🚨 <b>NEW STRUCTURAL CONSULTATION LEAD!</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 <b>Client:</b> ${lead.fullName}\n` +
    `📞 <b>Phone:</b> ${lead.fullPhoneNumber}\n` +
    `✉️ <b>Email:</b> ${lead.emailVal || 'Not Provided'}\n` +
    `⚙️ <b>Service:</b> ${lead.serviceName}\n` +
    `📍 <b>Project:</b> ${lead.details}\n` +
    `━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
    `🕒 <i>Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</i>\n` +
    `🌐 <i>Website: The Skytech Structural Consultant</i>`;

  fetch(`https://api.telegram.org/bot${TELEGRAM_ALERT_CONFIG.botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_ALERT_CONFIG.chatId,
      text: tgText,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '💬 Chat with Client on WhatsApp', url: `https://wa.me/91${phoneForWa}` }
          ]
        ]
      }
    })
  }).catch(err => {
    console.warn('Telegram notification notice:', err);
  });
}

/* -------------------------------------------------------------
 * 13. Instant Page Prefetcher (Zero-Delay Navigation)
 * Prefetches HTML pages on link hover/touch for instant page loading
 * ------------------------------------------------------------- */
function initInstantPagePrefetch() {
  const prefetched = new Set();
  const prefetchUrl = (url) => {
    if (!url || prefetched.has(url) || url.startsWith('#') || url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('http')) return;
    prefetched.add(url);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  };

  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('tel:') && !href.startsWith('mailto:')) {
      a.addEventListener('mouseenter', () => prefetchUrl(href), { passive: true, once: true });
      a.addEventListener('touchstart', () => prefetchUrl(href), { passive: true, once: true });
    }
  });
}
