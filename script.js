// script.js - place in same folder as index.html and style.css

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Admin Login Modal
  const adminLoginBtn = document.getElementById('adminLoginBtn');
  const adminLoginModal = document.getElementById('adminLoginModal');
  const adminModalClose = document.querySelector('.admin-modal-close');
  const adminModalOverlay = document.querySelector('.admin-modal-overlay');
  const adminLoginForm = document.getElementById('adminLoginForm');

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      adminLoginModal.classList.add('active');
      adminLoginModal.setAttribute('aria-hidden', 'false');
    });
  }

  function closeAdminModal() {
    adminLoginModal.classList.remove('active');
    adminLoginModal.setAttribute('aria-hidden', 'true');
  }

  adminModalClose.addEventListener('click', closeAdminModal);
  adminModalOverlay.addEventListener('click', closeAdminModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminLoginModal.classList.contains('active')) {
      closeAdminModal();
    }
  });

  // Admin Login Handler (backend auth)
  adminLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('adminUser').value.trim();
    const password = document.getElementById('adminPass').value.trim();

    if (!username || !password) {
      alert('Enter admin username and password.');
      return;
    }

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(response => response.json().then(data => ({ status: response.status, body: data })))
      .then(({ status, body }) => {
        if (status !== 200 || !body.token) {
          throw new Error(body.message || 'Login failed');
        }
        sessionStorage.setItem('adminLoggedIn', 'true');
        sessionStorage.setItem('adminUser', body.username || username);
        sessionStorage.setItem('authToken', body.token);
        window.location.href = 'admin.html';
      })
      .catch((error) => {
        console.error('Admin login error', error);
        alert('Invalid admin credentials or server error.');
      });
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (event) => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
      }
      if (link.hash) {
        event.preventDefault();
        const target = document.querySelector(link.hash);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (hash && hash.startsWith('#') && hash.length > 1) {
        const target = document.querySelector(hash);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Artist cards data and modal component
  const artists = [
    {
      id: 'artist1',
      name: 'Priya',
      title: 'Lead Bridal Mehndi Artist',
      bio: 'Priya is a leading bridal mehndi artist with over 5 years of experience. She specializes in heavy traditional bridal designs and royal Rajasthani patterns.',
      experience: '5+ Years | 1000+ Events',
      styles: ['Bridal', 'Arabic', 'Party', 'Kids'],
      image: 'https://via.placeholder.com/450x320?text=Priya',
      whatsappText: 'Hi%20Priya!%20I%20want%20to%20book%20you%20for%20mehndi'
    },
    {
      id: 'artist2',
      name: 'Simran',
      title: 'Arabic & Party Mehndi Artist',
      bio: 'Simran focuses on modern Arabic and party wear designs, perfect for young brides and festive occasions.',
      experience: '4+ Years | 600+ Events',
      styles: ['Arabic', 'Party', 'Kids'],
      image: 'https://via.placeholder.com/450x320?text=Simran',
      whatsappText: 'Hi%20Simran!%20I%20want%20to%20book%20you%20for%20Arabic%20Mehndi'
    },
    {
      id: 'artist3',
      name: 'Anjali',
      title: 'Youth & Kids Mehndi Designer',
      bio: 'Anjali blends cute and creative motifs for kids and casual parties, and can handle high-volume deadlines with calm precision.',
      experience: '3+ Years | 350+ Events',
      styles: ['Kids', 'Party', 'Minimal'],
      image: 'https://via.placeholder.com/450x320?text=Anjali',
      whatsappText: 'Hi%20Anjali!%20I%20want%20to%20book%20you%20for%20kids%20mehndi'
    },
    {
      id: 'artist4',
      name: 'Riya',
      title: 'Contemporary Bridal & Festive Mehndi',
      bio: 'Riya offers graceful, elegant patterns with detailed finishing. She is known for subtle luxury style and consistent dark stains.',
      experience: '5+ Years | 800+ Events',
      styles: ['Bridal', 'Party', 'Arabic'],
      image: 'https://via.placeholder.com/450x320?text=Riya',
      whatsappText: 'Hi%20Riya!%20I%20want%20to%20book%20you%20for%20bridal%20mehndi'
    }
  ];

  const artistsGrid = document.getElementById('artistsGrid');
  const artistModal = document.getElementById('artistModal');
  const artistModalOverlay = document.getElementById('artistModalOverlay');
  const artistModalClose = document.getElementById('artistModalClose');
  const artistModalImage = document.getElementById('artistModalImage');
  const artistModalName = document.getElementById('artistModalName');
  const artistModalTitle = document.getElementById('artistModalTitle');
  const artistModalBio = document.getElementById('artistModalBio');
  const artistModalExperience = document.getElementById('artistModalExperience');
  const artistModalStyles = document.getElementById('artistModalStyles');
  const artistModalWhatsapp = document.getElementById('artistModalWhatsapp');

  function renderArtists() {
    if (!artistsGrid) return;
    artistsGrid.innerHTML = artists.map(artist => {
      return `
        <article class="artist-card" data-id="${artist.id}">
          <img src="${artist.image}" alt="${artist.name} Mehndi Artist" />
          <div class="artist-info">
            <h4>${artist.name} <span class="artist-stars"><i class="ri-star-fill"></i> 4.9</span></h4>
            <p class="tagline"><i class="ri-hand-heart-line"></i> ${artist.title}</p>
            <p class="badge"><i class="ri-calendar-line"></i> ${artist.experience}</p>
          </div>
        </article>
      `;
    }).join('');

    artistsGrid.querySelectorAll('.artist-card').forEach(card => {
      card.addEventListener('click', () => {
        const artistId = card.dataset.id;
        const selected = artists.find(a => a.id === artistId);
        if (selected) {
          openArtistModal(selected);
        }
      });
    });
  }

  function openArtistModal(artist) {
    if (!artist) return;
    artistModalImage.src = artist.image;
    artistModalImage.alt = `${artist.name} Mehndi Artist`;
    artistModalName.textContent = artist.name;
    artistModalTitle.textContent = artist.title;
    artistModalBio.textContent = artist.bio;
    artistModalExperience.textContent = `Experience: ${artist.experience}`;
    artistModalStyles.innerHTML = artist.styles.map(style => `<span class="style-tag">${style}</span>`).join('');
    artistModalWhatsapp.href = `https://wa.me/918699358629?text=${artist.whatsappText}`;
    artistModal.classList.add('active');
    artistModal.setAttribute('aria-hidden', 'false');
  }

  function closeArtistModal() {
    artistModal.classList.remove('active');
    artistModal.setAttribute('aria-hidden', 'true');
  }

  artistModalClose.addEventListener('click', closeArtistModal);
  artistModalOverlay.addEventListener('click', closeArtistModal);

  // close on click outside modal content (blur behavior)
  artistModal.addEventListener('click', (e) => {
    if (e.target === artistModal) {
      closeArtistModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && artistModal.classList.contains('active')) {
      closeArtistModal();
    }
  });

  renderArtists();

  const themeToggle = document.getElementById('themeToggle');
  const adminThemeToggle = document.getElementById('adminThemeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const rootElement = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      rootElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
      if (themeIcon) themeIcon.className = 'ri-sun-line';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to light mode');
      if (adminThemeToggle) adminThemeToggle.textContent = '☀️ Light';
    } else {
      rootElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
      if (themeIcon) themeIcon.className = 'ri-moon-line';
      if (themeToggle) themeToggle.setAttribute('aria-label', 'Switch to dark mode');
      if (adminThemeToggle) adminThemeToggle.textContent = '🌙 Dark';
    }
  }

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  [themeToggle, adminThemeToggle].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const current = rootElement.getAttribute('data-theme') || 'light';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  });

  // Loading spinner helper
  window.createMehndiLoader = () => {
    const outer = document.createElement('div');
    outer.className = 'loader';
    const inner = document.createElement('div');
    inner.className = 'loader-inner';
    outer.appendChild(inner);
    return outer;
  };

  // Gallery tabs... (rest of existing code continues after this snippet)

  // Gallery tabs

  const categoryBtns = document.querySelectorAll('.category-btn');
  const grids = document.querySelectorAll('.image-grid');

  function setActiveGallery(id) {
    categoryBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.target === id));
    grids.forEach(grid => grid.classList.toggle('active', grid.id === id));
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setActiveGallery(btn.dataset.target);
    });
  });

  setActiveGallery('bridal-grid');

  // Booking form logic
  const bookingForm = document.getElementById('bookingForm');
  const category = document.getElementById('category');
  const type = document.getElementById('type');
  const groupDetails = document.getElementById('groupDetails');
  const groupSize = document.getElementById('groupSize');
  const occasion = document.getElementById('occasion');
  const totalAmountSpan = document.getElementById('totalAmount');

  const prices = {
    Bridal: { Full: 5000, Half: 3500 },
    Arabic: { Full: 4000, Half: 2800 },
    Kids: { Full: 1500, Half: 1000 },
    Party: { Full: 2500, Half: 1800 },
    Group: { Full: 2000, Half: 1400 },
  };

  function updateGroupFields() {
    if (category.value === 'Group') {
      groupDetails.classList.remove('hidden');
      groupSize.required = true;
      occasion.required = true;
    } else {
      groupDetails.classList.add('hidden');
      groupSize.required = false;
      occasion.required = false;
      groupSize.value = '';
      occasion.value = '';
    }
    calculateTotal();
  }

  function calculateTotal() {
    const cat = category.value;
    const typ = type.value;

    if (!cat || !typ) {
      totalAmountSpan.textContent = '₹0';
      return;
    }

    if (cat === 'Group') {
      const count = groupSize.value;
      if (!count) {
        totalAmountSpan.textContent = '₹0';
        return;
      }
      const base = prices.Group[typ] || 0;
      let total;
      if (count === '1-4') total = base * 4;
      else if (count === '5-9') total = base * 7;
      else if (count === '10-12') total = base * 11;
      else if (count === '13+') total = 'Enquiry';
      totalAmountSpan.textContent = total === 'Enquiry' ? 'Enquiry' : `₹${total}`;
      return;
    }

    const value = prices[cat] && prices[cat][typ];
    if (!value) { totalAmountSpan.textContent = '₹0'; return; }
    totalAmountSpan.textContent = `₹${value}`;
  }

  function setError(element, message) {
    const wrapper = element.closest('.form-row') || element.parentElement;
    wrapper.classList.add('error');
    const msg = wrapper.querySelector('.error-message');
    if (msg) msg.textContent = message;
  }

  function clearError(element) {
    const wrapper = element.closest('.form-row') || element.parentElement;
    wrapper.classList.remove('error');
    const msg = wrapper.querySelector('.error-message');
    if (msg) msg.textContent = '';
  }

  function validateField(field) {
    let valid = true;
    if (field.required && !field.value.trim()) {
      setError(field, 'This field is required.');
      valid = false;
    } else if (field.type === 'email' && field.value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value)) { setError(field, 'Enter a valid email.'); valid = false; }
      else clearError(field);
    } else if (field.id === 'phone' && field.value) {
      const phonePattern = /^[0-9]{10}$/;
      if (!phonePattern.test(field.value)) { setError(field, 'Enter a 10-digit phone number.'); valid = false; }
      else clearError(field);
    } else {
      clearError(field);
    }
    return valid;
  }

  const fields = ['fullName', 'phone', 'email', 'location', 'date', 'time', 'category', 'type'];
  fields.forEach(id => {
    const element = document.getElementById(id);
    if (!element) return;
    element.addEventListener('blur', () => validateField(element));
    element.addEventListener('input', () => { validateField(element); calculateTotal(); });
  });

  [category, type, groupSize].forEach(el => {
    if (!el) return;
    el.addEventListener('change', () => { updateGroupFields(); calculateTotal(); });
  });

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let formValid = true;

    fields.forEach(id => {
      const element = document.getElementById(id);
      if (element && !validateField(element)) formValid = false;
    });

    if (category.value === 'Group') {
      if (!validateField(groupSize)) formValid = false;
      if (!validateField(occasion)) formValid = false;
    }

    const totalText = totalAmountSpan.textContent;
    if (!formValid || !totalText || totalText === '₹0') {
      alert('Please complete all required fields and choose a valid service to calculate the price.');
      return;
    }

    const messageParts = [
      `Hello Priya,`,
      `I would like to book a Mehndi appointment.`,
      `Name: ${document.getElementById('fullName').value.trim()}`,
      `Phone: ${document.getElementById('phone').value.trim()}`,
      `Email: ${document.getElementById('email').value.trim()}`,
      `Location: ${document.getElementById('location').value.trim()}`,
      `Preferred Date: ${document.getElementById('date').value}`,
      `Preferred Time: ${document.getElementById('time').value}`,
      `Category: ${category.value}`,
      `Type: ${type.value}`,
      (category.value === 'Group') ? `Group Size: ${groupSize.value}` : null,
      (category.value === 'Group') ? `Occasion: ${occasion.value}` : null,
      `Total Estimate: ${totalText}`,
    ].filter(Boolean);

    const fullMessage = encodeURIComponent(messageParts.join('\n'));
    const waUrl = `https://wa.me/918699358629?text=${fullMessage}`;

    const bookingData = {
      fullName: document.getElementById('fullName').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      email: document.getElementById('email').value.trim(),
      location: document.getElementById('location').value.trim(),
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      category: category.value,
      type: type.value,
      groupSize: category.value === 'Group' ? groupSize.value : null,
      occasion: category.value === 'Group' ? occasion.value : null,
      totalAmount: totalText,
      status: 'Pending',
      timestamp: new Date().toISOString(),
      id: 'BK-' + Date.now()
    };

    fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookingData)
    })
      .then(response => response.json())
      .then((result) => {
        if (!result.bookingId) {
          throw new Error(result.message || 'Unable to save booking');
        }

        alert('Booking saved! Redirecting to WhatsApp...');
        window.open(waUrl, '_blank');
        bookingForm.reset();
        totalAmountSpan.textContent = '₹0';
        updateGroupFields();
      })
      .catch((error) => {
        console.error('Booking save failed', error);
        alert('Failed to save booking on server. Please try again later.');
      });
  });

  updateGroupFields();
  calculateTotal();
});
