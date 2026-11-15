// Sticky Header Scroll State
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Navigation Menu
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('open', open);
});
nav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    if (menu?.getAttribute('aria-expanded') === 'true') {
      menu.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    }
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    menu.click();
    menu.focus();
  }
});

// Use Case Tabs
const uses = {
  events: [
    'A guest that starts conversations.',
    'Explore a robot experience for your exhibition, celebration or brand event. Tell us about the audience and the moment you want to create.'
  ],
  schools: [
    'Turn curiosity into a closer look.',
    'Make room for questions, discovery and a planned introduction to humanoid robotics. We discuss the activities, supervision and setup with your school.'
  ],
  business: [
    'Make your next showcase different.',
    'Explore a distinctive presence for your launch, exhibition or business gathering. The interaction and programming are shaped around an agreed scope.'
  ]
};
const tabs = [...document.querySelectorAll('[data-use]')];
function activate(tab) {
  tabs.forEach(t => {
    t.setAttribute('aria-selected', String(t === tab));
    t.tabIndex = t === tab ? 0 : -1;
  });
  const p = document.querySelector('#use-panel');
  if (p && uses[tab.dataset.use]) {
    p.setAttribute('aria-labelledby', tab.id);
    p.style.opacity = '0';
    setTimeout(() => {
      p.querySelector('h3').textContent = uses[tab.dataset.use][0];
      p.querySelector('p').textContent = uses[tab.dataset.use][1];
      p.style.opacity = '1';
    }, 120);
  }
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activate(tab));
  tab.addEventListener('keydown', e => {
    let i = index;
    if (e.key === 'ArrowRight') i = (i + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') i = (i + tabs.length - 1) % tabs.length;
    else if (e.key === 'Home') i = 0;
    else if (e.key === 'End') i = tabs.length - 1;
    else return;
    e.preventDefault();
    activate(tabs[i]);
    tabs[i].focus();
  });
});

// Enquiry Form Builder
const form = document.querySelector('#enquiry-form');
if (form) {
  const params = new URLSearchParams(location.search);
  const robot = params.get('robot');
  if (['r1', 'g1', 'photobot'].includes(robot)) form.elements.robot.value = robot;
  const topic = params.get('topic');
  if (['rental', 'education', 'customization', 'general'].includes(topic)) form.elements.topic.value = topic;
  const result = document.querySelector('#brief-result'),
    text = document.querySelector('#brief-text'),
    status = document.querySelector('#copy-status');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const models = { r1: 'Unitree R1 Air', g1: 'Unitree G1 EDU U9', photobot: 'Humanoid Photo Booth Robot', unsure: 'Please help me choose' };
    const topics = { rental: 'Rental and pricing', education: 'Academic and Research Deployment', customization: 'Customization', general: 'General query' };
    text.value = [
      'Hello MACH Bots,',
      '',
      `I would like to discuss: ${topics[d.get('topic')]}`,
      `Robot: ${models[d.get('robot')]}`,
      `Occasion: ${d.get('occasion')}`,
      `Preferred date: ${d.get('date') || 'Not decided'}`,
      `City: ${String(d.get('city')).trim() || 'To be discussed'}`,
      '',
      String(d.get('message')).trim() || 'Please help me explore the options.',
      '',
      'Please let me know the possibilities, availability and pricing.'
    ].join('\n');
    const config = JSON.parse(document.querySelector('#business-config').textContent);
    if (config.email) {
      const a = document.querySelector('#email-brief');
      a.hidden = false;
      a.href = `mailto:${config.email}?subject=${encodeURIComponent('Robot rental enquiry')}&body=${encodeURIComponent(text.value)}`;
    }
    if (config.whatsapp) {
      const a = document.querySelector('#whatsapp-brief');
      a.hidden = false;
      a.href = `https://wa.me/${config.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text.value)}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    form.hidden = true;
    result.hidden = false;
    status.textContent = 'Your brief is ready to copy. It has not been sent.';
    document.querySelector('#brief-heading').focus();
  });
  document.querySelector('#edit-brief').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    form.querySelector('input').focus();
  });
  document.querySelector('#copy-brief').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text.value);
      status.textContent = 'Copied. Share your brief with the team when you’re ready.';
    } catch {
      text.focus();
      text.select();
      status.textContent = 'Select and copy the brief above using your device’s copy command.';
    }
  });
}

// Video Controls
document.querySelectorAll('video').forEach(v =>
  v.addEventListener('play', () =>
    document.querySelectorAll('video').forEach(other => {
      if (other !== v) other.pause();
    })
  )
);
