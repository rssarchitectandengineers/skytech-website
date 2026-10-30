/**
 * The Skytech AI Assistant - Structural Engineering Knowledge Base & Widget
 * Built with on-device expert rules & structural engineering query parser
 */

document.addEventListener('DOMContentLoaded', () => {
  initAIAssistant();
});

function initAIAssistant() {
  const triggerBtn = document.getElementById('openAiWidgetBtn');
  const widget = document.getElementById('aiAssistantWidget');
  const closeBtn = document.getElementById('closeAiWidgetBtn');
  const chatBody = document.getElementById('aiChatBody');
  const inputField = document.getElementById('aiChatInput');
  const sendBtn = document.getElementById('aiSendBtn');
  const quickChipsContainer = document.getElementById('aiQuickChips');

  if (!triggerBtn || !widget) return;

  // Toggle widget
  triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = widget.classList.toggle('active');
    if (isOpen && inputField) {
      setTimeout(() => inputField.focus(), 200);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      widget.classList.remove('active');
    });
  }

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target) && !triggerBtn.contains(e.target)) {
      widget.classList.remove('active');
    }
  });

  // Handle message sending
  const handleSend = () => {
    const query = inputField.value.trim();
    if (!query) return;

    appendMessage('user', query);
    inputField.value = '';

    // Show typing state
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const botResponse = generateAIResponse(query);
      appendMessage('bot', botResponse);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 650);
  };

  if (sendBtn) sendBtn.addEventListener('click', handleSend);
  if (inputField) {
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }

  // Quick Chips Handlers
  if (quickChipsContainer) {
    quickChipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.quick-chip');
      if (!chip) return;

      const question = chip.textContent.trim();
      inputField.value = question;
      handleSend();
    });
  }

  function appendMessage(sender, text) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    chatBody.appendChild(bubble);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.id = 'aiTypingBubble';
    typing.className = 'chat-bubble bot';
    typing.innerHTML = `<span style="display:inline-flex; gap: 4px; align-items:center;">
      <span style="width:5px; height:5px; background:#0284c7; border-radius:50%; animation: pulseRing 1s infinite alternate;"></span>
      <span style="width:5px; height:5px; background:#0284c7; border-radius:50%; animation: pulseRing 1s infinite alternate 0.2s;"></span>
      <span style="width:5px; height:5px; background:#0284c7; border-radius:50%; animation: pulseRing 1s infinite alternate 0.4s;"></span>
      <span style="font-size:0.75rem; color:#64748b; margin-left:4px;">Analyzing structural query...</span>
    </span>`;
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function removeTypingIndicator() {
    const typing = document.getElementById('aiTypingBubble');
    if (typing) typing.remove();
  }
}

/* -------------------------------------------------------------
 * Structural Engineering Knowledge Engine
 * ------------------------------------------------------------- */
function generateAIResponse(query) {
  const q = query.toLowerCase();

  // 1. Cost Reduction / Steel Savings
  if (q.includes('cost') || q.includes('save') || q.includes('reduce') || q.includes('steel tonnage') || q.includes('econom')) {
    return `
      <strong>Building Cost Reduction through Value Engineering:</strong><br>
      The Skytech specializes in optimizing approved architectural and structural drawings. By re-evaluating structural spans, rationalizing bar bending schedules (BBS), and redistributing axial column loads according to IS 456 & IS 13920, we typically achieve:
      <ul style="margin: 6px 0 6px 18px; font-size: 0.8rem;">
        <li><strong>15% to 25% reduction</strong> in total steel tonnage.</li>
        <li>Substantial savings of ₹8 to ₹25 per square foot.</li>
        <li>100% preservation of structural safety and municipal compliance.</li>
      </ul>
      Would you like to send us your approved drawings for a free optimization assessment? Call <a href="tel:+917737243812" style="color:#0284c7; font-weight:700;">+91-7737243812</a> or connect via WhatsApp!
    `;
  }

  // 2. PEB / Industrial Warehouses
  if (q.includes('peb') || q.includes('pre-engineered') || q.includes('shed') || q.includes('warehouse') || q.includes('factory')) {
    return `
      <strong>Pre-Engineered Building (PEB) Solutions:</strong><br>
      We engineer custom PEB structures for factories, cold storage, and logistics hubs.
      <br><strong>Key Capabilities:</strong>
      <ul style="margin: 6px 0 6px 18px; font-size: 0.8rem;">
        <li>Column-free clear spans up to <strong>60+ meters</strong>.</li>
        <li>Tapered plate rafters & columns designed under <strong>IS 800:2007</strong>.</li>
        <li>Crane gantry integration (up to 30T EOT cranes).</li>
        <li>High-tensile cold-formed Z/C purlins (IS 801).</li>
      </ul>
      Typical fabrication & erection timelines are 30% faster than conventional steel.
    `;
  }

  // 3. Structural Audit & Stability Certificate
  if (q.includes('audit') || q.includes('stability') || q.includes('certificate') || q.includes('crack') || q.includes('old building') || q.includes('ndt')) {
    return `
      <strong>Structural Health Audit & Stability Certification:</strong><br>
      The Skytech provides certified structural stability assessments required for statutory approvals, bank loans, factory licensing, and school/hospital occupancy:
      <ul style="margin: 6px 0 6px 18px; font-size: 0.8rem;">
        <li><strong>Rebound Hammer & UPV Testing:</strong> In-situ concrete strength & integrity check.</li>
        <li><strong>Core Extraction:</strong> Laboratory compressive testing.</li>
        <li><strong>Rebar Corrosion Mapping:</strong> Half-cell potential tests.</li>
        <li><strong>Formal Certificate:</strong> Endorsed by our licensed structural engineers.</li>
      </ul>
      Call our Jaipur office at <a href="tel:+917737243812" style="color:#0284c7; font-weight:700;">+91-7737243812</a> to schedule a site inspection.
    `;
  }

  // 4. RCC Design
  if (q.includes('rcc') || q.includes('concrete') || q.includes('slab') || q.includes('beam') || q.includes('column') || q.includes('foundation') || q.includes('footing')) {
    return `
      <strong>Reinforced Concrete (RCC) Design Excellence:</strong><br>
      The Skytech provides complete RCC structural engineering for residential, commercial, and high-rise towers:
      <ul style="margin: 6px 0 6px 18px; font-size: 0.8rem;">
        <li>3D finite element analysis for gravity, wind, and seismic loads (IS 1893:2016).</li>
        <li>Isolated footings, combined pads, strap beams, and heavy raft foundations.</li>
        <li>Ductile seismic detailing strictly compliant with <strong>IS 13920:2016</strong>.</li>
        <li>Complete GFC (Good For Construction) drawings and bar bending schedules.</li>
      </ul>
    `;
  }

  // 5. Retrofitting
  if (q.includes('retrofit') || q.includes('strengthen') || q.includes('carbon fiber') || q.includes('cfrp') || q.includes('jacketing')) {
    return `
      <strong>Retrofitting & Structural Strengthening:</strong><br>
      When an existing building needs to add extra floors or repair damaged members:
      <ul style="margin: 6px 0 6px 18px; font-size: 0.8rem;">
        <li><strong>RCC Column Jacketing:</strong> Increasing cross-section with high-strength micro-concrete.</li>
        <li><strong>CFRP Wrapping:</strong> Carbon Fiber Reinforced Polymer composites for shear and flexural boost.</li>
        <li><strong>Steel Beam Flange Enhancement:</strong> External post-tensioning and channel stiffeners.</li>
      </ul>
      Preserve existing buildings without expensive demolition!
    `;
  }

  // 6. Soil / Geotechnical
  if (q.includes('soil') || q.includes('geotech') || q.includes('bearing capacity') || q.includes('sbc') || q.includes('borehole')) {
    return `
      <strong>Soil Investigation & Geotechnical Consultancy:</strong><br>
      Accurate soil testing is the foundation of structural safety:
      <ul style="margin: 6px 0 6px 18px; font-size: 0.8rem;">
        <li>Borehole drilling & Standard Penetration Test (SPT) per IS 2131.</li>
        <li>Safe Bearing Capacity (SBC) determination for shallow vs pile foundations.</li>
        <li>Groundwater table mapping & aggressive chemical testing.</li>
      </ul>
    `;
  }

  // 7. Contact, Location, Pricing
  if (q.includes('contact') || q.includes('phone') || q.includes('address') || q.includes('location') || q.includes('email') || q.includes('office') || q.includes('jaipur')) {
    return `
      <strong>The Skytech Structural Consultant - Contact Details:</strong><br>
      📍 <strong>Head Office:</strong> Jaipur, Rajasthan, India<br>
      📞 <strong>Phone:</strong> <a href="tel:+917737243812" style="color:#0284c7; font-weight:700;">+91-7737243812</a><br>
      ✉️ <strong>Email:</strong> <a href="mailto:skytechjpr@gmail.com" style="color:#0284c7; font-weight:700;">skytechjpr@gmail.com</a><br>
      💬 <strong>WhatsApp:</strong> <a href="https://wa.me/917737243812?text=Hello%20The%20Skytech%2C%20I%20would%20like%20to%20enquire%20about%20your%20structural%20consultancy%20services." target="_blank" rel="noopener noreferrer" style="color:#25d366; font-weight:700;">Chat Instantly on WhatsApp</a><br>
      ⏰ <strong>Office Hours:</strong> Mon - Sat: 9:00 AM - 7:30 PM
      <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;">
        <a href="tel:+917737243812" class="quick-chip" style="background:#0284c7; color:#fff; text-decoration:none; text-align:center; padding: 6px 12px; font-weight:700; border-radius: 6px;">
          📞 Call Now: +91-7737243812
        </a>
        <a href="https://wa.me/917737243812?text=Hello%20The%20Skytech%2C%20I%20would%20like%20to%20enquire%20about%20your%20structural%20consultancy%20services." target="_blank" rel="noopener noreferrer" class="quick-chip" style="background:#25d366; color:#fff; text-decoration:none; text-align:center; padding: 6px 12px; font-weight:700; border-radius: 6px;">
          💬 Chat on WhatsApp
        </a>
        <button type="button" class="quick-chip" data-open-consultation style="background:#0b1523; color:#fff; text-align:center; padding: 6px 12px; font-weight:700; border-radius: 6px; border:none; cursor:pointer;">
          📋 Open Free Consultation Form
        </button>
      </div>
    `;
  }

  // 8. General / Fallback
  return `
    Thank you for consulting <strong>The Skytech Structural Consultant</strong>!<br>
    We deliver structural design (RCC, Steel, PEB), building cost reduction (15-25% steel savings), stability audits, retrofitting, PMC, and geotechnical solutions across India.<br><br>
    How can we assist your project today?
    <div style="margin-top: 10px; display: flex; flex-direction: column; gap: 6px;">
      <button type="button" class="quick-chip" data-open-consultation style="background:#0284c7; color:#fff; text-align:center; padding: 6px 12px; font-weight:700; border-radius: 6px; border:none; cursor:pointer;">
        📋 Request Free Consultation
      </button>
      <a href="tel:+917737243812" class="quick-chip" style="background:#0b1523; color:#fff; text-decoration:none; text-align:center; padding: 6px 12px; font-weight:700; border-radius: 6px;">
        📞 Call Engineer: +91-7737243812
      </a>
      <a href="https://wa.me/917737243812?text=Hello%20The%20Skytech%2C%20I%20would%20like%20to%20enquire%20about%20your%20structural%20consultancy%20services." target="_blank" rel="noopener noreferrer" class="quick-chip" style="background:#25d366; color:#fff; text-decoration:none; text-align:center; padding: 6px 12px; font-weight:700; border-radius: 6px;">
        💬 Chat on WhatsApp
      </a>
    </div>
  `;
}
