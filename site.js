const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
const isActive = (...files) => files.includes(page) ? ' active' : '';

const headerTarget = document.querySelector('[data-site-header]');
if (headerTarget) {
  headerTarget.innerHTML = `
    <div class="announcement">
      <span>Food pantry every Saturday, 10 AM–12 PM</span>
      <span aria-hidden="true">•</span>
      <span>837 Craft Road</span>
      <a href="food-pantry.html">Get involved →</a>
    </div>
    <header class="site-header">
      <a class="brand site-logo-link" href="index.html" aria-label="Whitehaven Kulliye — Memphis Dawah Association home">
        <img class="brand-logo header-logo" src="assets/brand/logo-color-web.png" alt="Whitehaven Kulliye — Memphis Dawah Association">
      </a>
      <button class="menu-toggle" aria-expanded="false" aria-controls="nav">
        <span></span><span></span><span></span><b class="sr-only">Menu</b>
      </button>
      <nav id="nav" aria-label="Main navigation">
        <div class="nav-group${isActive('about.html','volunteer.html','community-partners.html')}">
          <a href="about.html">About</a><button aria-label="Show About links" aria-expanded="false"><span aria-hidden="true"></span></button>
          <div class="nav-submenu"><a href="about.html">Our story & objectives</a><a href="volunteer.html">Volunteer</a><a href="community-partners.html">Community partners</a><a href="contact.html">Contact</a></div>
        </div>
        <div class="nav-group${isActive('campus.html','property-projects.html','green-mosque.html','prayer-schedule.html')}">
          <a href="campus.html">Properties</a><button aria-label="Show Properties links" aria-expanded="false"><span aria-hidden="true"></span></button>
          <div class="nav-submenu"><a href="campus.html">Our two properties</a><a href="prayer-schedule.html">Prayer schedule</a><a href="property-projects.html">Property projects</a><a href="green-mosque.html">A green mosque</a></div>
        </div>
        <div class="nav-group${isActive('education.html','religious-material.html','math-tutoring.html','calendar.html')}">
          <a href="education.html">Education</a><button aria-label="Show Education links" aria-expanded="false"><span aria-hidden="true"></span></button>
          <div class="nav-submenu"><a href="education.html">Education hub</a><a href="religious-material.html">Religious materials</a><a href="math-tutoring.html">Math tutoring</a><a href="calendar.html">Hijri / Gregorian calendar</a></div>
        </div>
        <div class="nav-group${isActive('services.html','programs.html','food-pantry.html','microgrant.html','suq.html','legal-resources.html','health-and-fitness.html')}">
          <a href="services.html">Services</a><button aria-label="Show Services links" aria-expanded="false"><span aria-hidden="true"></span></button>
          <div class="nav-submenu"><a href="services.html">All services</a><a href="food-pantry.html">Food pantry</a><a href="microgrant.html">Microgrant Program</a><a href="programs.html">Program portfolio</a><a href="suq.html">The Suq</a><a href="legal-resources.html">Legal resources</a><a href="health-and-fitness.html">Health & fitness</a></div>
        </div>
        <div class="nav-group${isActive('media.html','faith-media.html','outreach.html','audio.html','videos.html','statements.html','news.html','source-archive.html')}">
          <a href="media.html">Media</a><button aria-label="Show Media links" aria-expanded="false"><span aria-hidden="true"></span></button>
          <div class="nav-submenu"><a href="media.html">Media hub</a><a href="outreach.html">Outreach</a><a href="audio.html">Audio</a><a href="videos.html">Videos</a><a href="statements.html">Statements</a><a href="news.html">News & articles</a></div>
        </div>
        <a href="events.html" class="nav-direct${isActive('events.html','past-events.html')}">Events</a>
        <a href="contact.html" class="nav-direct${isActive('contact.html')}">Contact</a>
        <a class="button button-small donate-nav" href="donate.html">Donate</a>
      </nav>
    </header>
    <div class="theme-picker" role="group" aria-label="Choose website colors">
      <span>Colors</span>
      <button class="theme-dot forest" data-theme-choice="forest" aria-label="Forest green, burgundy, and cream theme" title="Forest green"></button>
      <button class="theme-dot ocean" data-theme-choice="ocean" aria-label="Ocean teal and amber theme" title="Ocean teal"></button>
      <button class="theme-dot burgundy" data-theme-choice="burgundy" aria-label="Burgundy and cream theme" title="Burgundy"></button>
    </div>`;
}

const footerTarget = document.querySelector('[data-site-footer]');
if (footerTarget) {
  footerTarget.innerHTML = `
    <footer>
      <div class="footer-top">
        <a class="brand inverse footer-logo-link" href="index.html"><img class="brand-logo footer-logo" src="assets/brand/logo-cream-web.png" alt="Whitehaven Kulliye — Memphis Dawah Association"></a>
        <div><p>Our properties</p><address>Prayer Hall<br>3379 Millbranch Road<br><br>Othmaniyah Campus<br>837 Craft Road<br>Memphis, TN 38116</address></div>
        <div><p>Explore</p><a href="services.html">Community services</a><a href="microgrant.html">Microgrant Program</a><a href="education.html">Education</a><a href="prayer-schedule.html">Prayer schedule</a><a href="news.html">News & statements</a><a href="media.html">Media library</a><a href="source-archive.html">Complete source archive</a></div>
        <div><p>Get involved</p><a href="events.html">Events</a><a href="past-events.html">Past events</a><a href="volunteer.html">Volunteer</a><a href="donate.html">Donate</a><a href="contact.html">Contact</a><a href="sitemap.html">Sitemap</a></div>
      </div>
      <div class="footer-bottom"><span>© <b id="year"></b> Memphis Dawah Association</span><span>501(c)(3) nonprofit · Faith · Education · Local service</span></div>
    </footer>`;
}

if (!document.body.classList.contains('donate-page')) {
  document.body.insertAdjacentHTML('beforeend', `
    <aside class="support-dock" aria-label="Support Memphis Dawah Association">
      <div><small>Keep local worship, education & service running</small><strong>Support MDA</strong></div>
      <a class="dock-cash" href="https://cash.app/$MDAKulliye2022">Cash App</a>
      <a class="dock-donate" href="donate.html">Donate now →</a>
    </aside>`);
}
