// ============================================================
//  HOPEFUND — Main JavaScript (index.html) — INR Edition
// ============================================================

/* ── Navbar scroll effect ─────────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
    document.getElementById('scrollTopBtn').classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    document.getElementById('scrollTopBtn').classList.remove('visible');
  }
}, { passive: true });

/* ── Mobile nav ───────────────────────────────────────────── */
const menuToggle  = document.getElementById('menuToggle');
const mobileNav   = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileNavClose');

menuToggle.addEventListener('click', () => mobileNav.classList.add('open'));
mobileClose.addEventListener('click', closeMobileNav);
function closeMobileNav() { mobileNav.classList.remove('open'); }
mobileNav.addEventListener('click', e => { if (e.target === mobileNav) closeMobileNav(); });

/* ── Scroll Reveal ────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Impact Counter Animation ─────────────────────────────── */
function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 2200;
  const startTime = performance.now();
  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 4);
    const value    = Math.floor(eased * target);
    el.textContent = formatCount(value);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString('en-IN');
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ── Hero Stats Counter (INR) ─────────────────────────────── */
function animateHeroStat(id, target, prefix, suffix) {
  const el = document.getElementById(id);
  if (!el) return;
  const duration = 2000;
  const startTime = performance.now();
  const isDecimal = !Number.isInteger(target);
  const update = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const val      = eased * target;
    el.textContent = prefix + (isDecimal ? val.toFixed(1) : Math.floor(val).toLocaleString('en-IN')) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

setTimeout(() => {
  animateHeroStat('stat1', 2060, '₹', ' Cr+');   // ₹2,060 Cr total raised
  animateHeroStat('stat2', 12340, '', '+');         // 12,340 campaigns
  animateHeroStat('stat3', 42, '', ' Lakh+');       // 42 Lakh lives
}, 400);

/* ── Campaign Card Builder ────────────────────────────────── */
function indexImagePath(cat) {
  const map = {
    water:       'assets/images/campaign_water.png',
    education:   'assets/images/campaign_education.png',
    environment: 'assets/images/campaign_environment.png',
    healthcare:  'assets/images/campaign_healthcare.png',
    hunger:      'assets/images/campaign_education.png',
    disaster:    'assets/images/hero_banner.png',
    community:   'assets/images/about_team.png',
    animals:     'assets/images/campaign_environment.png',
  };
  return map[cat] || 'assets/images/hero_banner.png';
}

const CAT_LABELS = {
  water:'💧 Water', education:'📚 Education', environment:'🌿 Environment',
  healthcare:'🏥 Healthcare', hunger:'🍎 Hunger', disaster:'🆘 Disaster',
  community:'🤝 Community', animals:'🐾 Animals'
};

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function buildCampaignCard(c) {
  const pct    = Math.min(Math.round((c.raised / c.goal) * 100), 100);
  const imgSrc = indexImagePath(c.category);
  const isNew  = !!c.userCreated;

  return `
    <div class="campaign-card" data-cat="${c.category}" onclick="openDonateModal('${escapeHtml(c.title)}')" role="article" aria-label="${escapeHtml(c.title)}">
      <div class="card-img">
        <img src="${imgSrc}" alt="${escapeHtml(c.title)}" loading="lazy" />
        <span class="card-category cat-${c.category}">${CAT_LABELS[c.category] || c.category}</span>
        ${isNew ? '<span class="card-urgency" style="background:rgba(30,180,100,.85);">🆕 New</span>' : (c.urgent ? '<span class="card-urgency">⚡ Urgent</span>' : '')}
      </div>
      <div class="card-body">
        <div class="card-meta">
          <span class="card-org">
            ${escapeHtml(c.org)}
            ${c.verified ? '<span class="verified-badge" title="Verified">✓</span>' : ''}
            ${isNew ? '<span style="color:hsl(142,60%,55%);font-size:.75rem;font-weight:700;"> · Just Added</span>' : ''}
          </span>
        </div>
        <h3>${escapeHtml(c.title)}</h3>
        <p>${escapeHtml(c.description)}</p>
        <div class="progress-wrap">
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width:${pct}%"></div>
          </div>
          <div class="progress-info">
            <span class="progress-raised">${formatINR(c.raised)}</span>
            <span class="progress-goal">of ${formatINR(c.goal)}</span>
            <span class="progress-pct">${pct}%</span>
          </div>
        </div>
        <div class="card-stats">
          <span class="card-stat"><span class="icon">❤️</span>${c.donors.toLocaleString('en-IN')} donors</span>
          <span class="card-stat"><span class="icon">⏰</span>${c.daysLeft} days left</span>
          <span class="card-stat"><span class="icon">📍</span>${escapeHtml(c.location)}</span>
        </div>
        <div class="card-action">
          <button class="btn btn-primary btn-sm" style="width:100%;justify-content:center;margin-top:12px;" id="donate-btn-${c.id}" onclick="event.stopPropagation();openDonateModal('${escapeHtml(c.title)}')">
            💚 Donate Now
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ── Render Campaigns ─────────────────────────────────────── */
let currentFilter = 'all';
const grid = document.getElementById('campaignsGrid');

async function renderCampaigns(filter) {
  filter = filter || currentFilter;
  const all      = await getAllCampaigns();
  const filtered = filter === 'all' ? all : all.filter(c => c.category === filter);
  const preview  = filtered.slice(0, 6);

  if (grid) {
    grid.innerHTML = preview.length
      ? preview.map(buildCampaignCard).join('')
      : '<p style="text-align:center;color:var(--text-muted);padding:40px 0;">No campaigns in this category yet.</p>';

    // Animate progress bars
    setTimeout(() => {
      grid.querySelectorAll('.progress-bar-fill').forEach(bar => {
        const w = bar.style.width;
        bar.style.width = '0';
        requestAnimationFrame(() => setTimeout(() => { bar.style.width = w; }, 50));
      });
    }, 100);
  }

  // Update "View All" count
  const countEl = document.getElementById('total-campaign-count');
  if (countEl) countEl.textContent = all.length;
}

renderCampaigns('all');

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderCampaigns(currentFilter);
  });
});

/* ── Re-render on BFCache restore & tab focus ────────────── */
window.addEventListener('pageshow', () => renderCampaigns());
window.addEventListener('focus', () => renderCampaigns());

// Re-render when localStorage changes (e.g. from create page)
window.addEventListener('storage', () => renderCampaigns());

/* ── Donate Modal ─────────────────────────────────────────── */
const modal = document.getElementById('donateModal');
let selectedAmt = 0;

function openDonateModal(campaignName) {
  document.getElementById('modal-campaign-name').textContent = 'Supporting: ' + campaignName;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Reset
  document.getElementById('custom-amount').value = '';
  document.getElementById('donor-name').value    = '';
  document.getElementById('donor-email').value   = '';
  document.getElementById('card-number').value   = '';
  document.getElementById('card-expiry').value   = '';
  document.getElementById('card-cvv').value      = '';
  document.querySelectorAll('.donation-amt-btn').forEach(b => b.classList.remove('selected'));
  selectedAmt = 0;
}

function closeDonateModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

modal.addEventListener('click', e => { if (e.target === modal) closeDonateModal(); });

function selectAmt(btn, amt) {
  document.querySelectorAll('.donation-amt-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedAmt = amt;
  document.getElementById('custom-amount').value = '';
}

function clearAmtBtns() {
  document.querySelectorAll('.donation-amt-btn').forEach(b => b.classList.remove('selected'));
  selectedAmt = 0;
}

function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 3) v = v.substring(0, 2) + '/' + v.substring(2);
  input.value = v;
}

function processDonation() {
  const amount = selectedAmt || parseInt(document.getElementById('custom-amount').value) || 0;
  const name   = document.getElementById('donor-name').value.trim();
  const email  = document.getElementById('donor-email').value.trim();
  const card   = document.getElementById('card-number').value.replace(/\s/g, '');

  if (!amount || amount < 1)              return showToast('Please select or enter a donation amount.', 'error', '⚠️');
  if (!name)                               return showToast('Please enter your name.', 'error', '⚠️');
  if (!email || !email.includes('@'))      return showToast('Please enter a valid email.', 'error', '⚠️');
  if (card.length < 12)                    return showToast('Please enter a valid card number.', 'error', '⚠️');

  const btn = document.getElementById('donate-submit-btn');
  btn.textContent = '⏳ Processing...';
  btn.disabled    = true;

  setTimeout(() => {
    btn.textContent = '💚 Complete Donation';
    btn.disabled    = false;
    closeDonateModal();
    showToast(`Thank you ${name}! Your ₹${amount.toLocaleString('en-IN')} donation is confirmed. 💚`, 'success', '✅');
  }, 2000);
}

/* ── Newsletter ───────────────────────────────────────────── */
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('newsletter-email').value;
  showToast(`You're subscribed with ${email}! 💌`, 'success', '📧');
  document.getElementById('newsletter-email').value = '';
}

/* ── Toast ────────────────────────────────────────────────── */
let toastTimeout;
function showToast(msg, type = 'success', icon = '✅') {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent  = msg;
  document.getElementById('toast-icon').textContent = icon;
  toast.className = `toast ${type} show`;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 4500);
}

/* ── Scroll to Top ────────────────────────────────────────── */
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

/* ── Keyboard ─────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeDonateModal(); closeMobileNav(); }
});
