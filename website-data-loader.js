// OPTIMIZED Website Data Loader - Performance Enhanced Version
// Reduced auto-refresh for public website, local image fallbacks

class WebsiteDataLoader {

  // Load and display news on website
  static async loadNews() {
    try {
      const result = await DatabaseManager.getNews(3);

      if (result.success && result.data.length > 0) {
        const newsContainer = document.querySelector('.news-grid');

        if (newsContainer) {
          newsContainer.innerHTML = '';

          result.data.forEach((news, index) => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            const shortContent = news.content.substring(0, 150);
            const isLong = news.content.length > 150;

            newsCard.innerHTML = `
              ${news.featured_image_url ? `<img src="${news.featured_image_url}" alt="${news.title}" class="news-img" loading="lazy">` : '<img src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="News" class="news-img" loading="lazy">'}
              <div class="news-content">
                <div class="news-date">${new Date(news.date || news.created_at).toLocaleDateString()}</div>
                <h3 class="news-title">${news.title}</h3>
                <div class="news-text">
                  <p class="news-excerpt" id="excerpt-${index}">${shortContent}${isLong ? '...' : ''}</p>
                  ${isLong ? `<p class="news-full" id="full-${index}" style="display: none;">${news.content}</p>` : ''}
                </div>
                ${isLong ? `
                  <button class="read-more-btn" onclick="toggleReadMore(${index})" id="btn-${index}">
                    Read More
                  </button>
                ` : ''}
              </div>
            `;
            newsContainer.appendChild(newsCard);
          });

          console.log('News loaded from database successfully');
        }
      }
    } catch (error) {
      console.error('Error loading news:', error);
    }
  }

  // Load and display programs
  static async loadPrograms() {
    try {
      const result = await DatabaseManager.getPrograms();

      if (result.success && result.data.length > 0) {
        const programsContainer = document.querySelector('.programs-grid') || document.querySelector('#programs-section');

        if (programsContainer) {
          programsContainer.innerHTML = '';

          result.data.forEach(program => {
            const programCard = document.createElement('div');
            programCard.className = 'program-card';
            programCard.innerHTML = `
              <div class="program-content">
                <h3><ion-icon name="school"></ion-icon> ${program.level.toUpperCase()}</h3>
                <p>${program.description}</p>
                <p><strong>Subjects:</strong> ${program.subjects}</p>
                <p><strong>Duration:</strong> ${program.duration || 'N/A'}</p>
              </div>
            `;
            programsContainer.appendChild(programCard);
          });

          console.log('Programs loaded from database successfully');
        }
      } else {
        console.log('No programs in database, keeping existing content');
      }
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  }

  // Load and display testimonials
  static async loadTestimonials() {
    try {
      const result = await DatabaseManager.getTestimonials();

      if (result.success && result.data.length > 0) {
        const testimonialsSlides = document.querySelector('.testimonial-slides');
        const testimonialsNav = document.querySelector('.testimonial-nav');

        if (testimonialsSlides && testimonialsNav) {
          testimonialsSlides.innerHTML = result.data.map(testimonial => `
            <div class="testimonial-slide">
              <div class="testimonial-content">
                <img src="${testimonial.photo_url || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=60'}" alt="${testimonial.name}" class="testimonial-img" loading="lazy">
                <div class="testimonial-name">${testimonial.name}</div>
                <div class="testimonial-role">${testimonial.role}</div>
                <p class="testimonial-text">"${testimonial.testimonial_text}"</p>
              </div>
            </div>
          `).join('');

          testimonialsNav.innerHTML = result.data.map((_, index) =>
            `<div class="testimonial-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>`
          ).join('');

          testimonialsSlides.style.transform = 'translateX(0%)';
          this.initializeTestimonialSlider();

          console.log('Testimonials loaded from database successfully');
        }
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
    }
  }

  // Initialize testimonial slider functionality
  static initializeTestimonialSlider() {
    const testimonialsSlides = document.querySelector('.testimonial-slides');
    const testimonialsNav = document.querySelector('.testimonial-nav');

    if (!testimonialsSlides || !testimonialsNav) return;

    let currentTestimonial = 0;
    let testimonialInterval;

    const totalTestimonials = testimonialsSlides.children.length;

    function updateTestimonialDots() {
      document.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
      });
    }

    function goToTestimonial(index) {
      currentTestimonial = index;
      testimonialsSlides.style.transform = `translateX(-${currentTestimonial * 100}%)`;
      updateTestimonialDots();
    }

    function nextTestimonial() {
      currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
      goToTestimonial(currentTestimonial);
    }

    function startTestimonialAutoSlide() {
      testimonialInterval = setInterval(nextTestimonial, 6000);
    }

    function stopTestimonialAutoSlide() {
      clearInterval(testimonialInterval);
    }

    startTestimonialAutoSlide();

    testimonialsNav.addEventListener('click', (e) => {
      if (e.target.classList.contains('testimonial-dot')) {
        stopTestimonialAutoSlide();
        goToTestimonial(parseInt(e.target.dataset.slide));
        startTestimonialAutoSlide();
      }
    });

    testimonialsSlides.addEventListener('mouseenter', stopTestimonialAutoSlide);
    testimonialsSlides.addEventListener('mouseleave', startTestimonialAutoSlide);
  }

  // Load slider images - OPTIMIZED with local fallbacks
  static async loadSliderImages() {
    try {
      console.log('🖼️ Loading slider images from database...');

      const result = await DatabaseManager.getSliderImages();

      if (result.success && result.data && result.data.length > 0) {
        console.log(`🎯 Found ${result.data.length} slider images in database`);
        window.images = result.data.map(image => image.image_url);
        this.initializeImageSlider();
        console.log('✅ Slider images loaded from database successfully');
      } else {
        console.log('🖼️ No slider images found in database, using local images');
        this.loadLocalSliderImages();
      }
    } catch (error) {
      console.error('❌ Error loading slider images:', error);
      console.log('🖼️ Loading local slider images as fallback');
      this.loadLocalSliderImages();
    }
  }

  // OPTIMIZED: Use local images instead of Unsplash
  static loadLocalSliderImages() {
    console.log('🖼️ Loading local slider images...');

    window.images = [
      'IMAGE SLIDER/slider1.jpg',
      'IMAGE SLIDER/slider2.jpg',
      'IMAGE SLIDER/slider3.jpg',
      'IMAGE SLIDER/slider4.jpg',
      'IMAGE SLIDER/slider5.jpg',
      'IMAGE SLIDER/slider6.jpg',
      'IMAGE SLIDER/slider7.jpg',
      'IMAGE SLIDER/slider8.jpg',
      'IMAGE SLIDER/slider9.jpg'
    ];

    this.initializeImageSlider();
    console.log('✅ Local slider images loaded');
  }

  // Initialize image slider functionality
  static initializeImageSlider() {
    console.log('🎠 Initializing image slider...');

    if (!window.images || window.images.length === 0) {
      console.log('⚠️ No images available for slider');
      return;
    }

    if (typeof window.initializeSlider === 'function') {
      window.initializeSlider();
    }

    if (typeof window.createDots === 'function') {
      window.createDots();
    }

    if (typeof window.updateSlider === 'function') {
      window.updateSlider();
    }

    if (typeof window.startSliderAfterLoad === 'function') {
      window.startSliderAfterLoad();
    }

    console.log(`✅ Image slider initialized with ${window.images.length} images`);
  }

  // Load website settings and update header/footer
  static async loadWebsiteSettings() {
    try {
      const result = await DatabaseManager.getSettings();

      if (result.success && result.data) {
        const settings = result.data;

        if (settings.school_name &&
          settings.school_name.trim() !== '' &&
          settings.school_name.toLowerCase() !== 'test school' &&
          settings.school_name.toLowerCase() !== 'test school name') {
          document.title = settings.school_name;
        } else {
          document.title = 'Hayatul Islamic School';
        }

        const schoolNameElements = document.querySelectorAll('.school-name, .logo-text, h1');
        schoolNameElements.forEach(el => {
          if (el.textContent.includes('Hayatul') || el.textContent.includes('School')) {
            el.textContent = settings.school_name || 'Hayatul Islamic Secondary School';
          }
        });

        const phoneElements = document.querySelectorAll('a[href*="tel:"], .phone-number');
        phoneElements.forEach(el => {
          if (settings.phone_number) {
            if (el.tagName === 'A') {
              el.href = `tel:${settings.phone_number}`;
            }
            el.textContent = settings.phone_number;
          }
        });

        const emailElements = document.querySelectorAll('a[href*="mailto:"], .email');
        emailElements.forEach(el => {
          if (settings.contact_email) {
            if (el.tagName === 'A') {
              el.href = `mailto:${settings.contact_email}`;
            }
            el.textContent = settings.contact_email;
          }
        });

        const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
        whatsappLinks.forEach(link => {
          if (settings.phone_number) {
            const cleanPhone = settings.phone_number.replace(/[^\d]/g, '');
            link.href = `https://wa.me/${cleanPhone}`;
          }
        });

        console.log('Website settings loaded and applied successfully');
      }
    } catch (error) {
      console.error('Error loading website settings:', error);
    }
  }

  // Load student life content - OPTIMIZED
  static async loadStudentLife() {
    try {
      console.log('🎓 Loading student life images from database...');

      const imagesResult = await DatabaseManager.getStudentLifeImages();
      const studentLifeGallery = document.querySelector('.student-life-gallery');

      if (!studentLifeGallery) {
        console.error('❌ Student life gallery element not found');
        return;
      }

      if (imagesResult.success && imagesResult.data && imagesResult.data.length > 0) {
        console.log(`🎯 Found ${imagesResult.data.length} student life images in database`);

        studentLifeGallery.innerHTML = '';

        const imagesByCategory = {};
        imagesResult.data.forEach(image => {
          if (!imagesByCategory[image.category]) {
            imagesByCategory[image.category] = [];
          }
          imagesByCategory[image.category].push(image);
        });

        const imagesToShow = Object.values(imagesByCategory).flat().slice(0, 6);

        imagesToShow.forEach((image, index) => {
          const imgElement = document.createElement('img');
          imgElement.src = image.image_url;
          imgElement.alt = image.title;
          imgElement.className = 'student-life-img';
          imgElement.title = image.description || image.title;
          imgElement.loading = 'lazy'; // OPTIMIZED: Lazy loading
          imgElement.style.cssText = `
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
            transition: transform 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          `;

          imgElement.addEventListener('mouseenter', () => {
            imgElement.style.transform = 'scale(1.05)';
            imgElement.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
          });
          imgElement.addEventListener('mouseleave', () => {
            imgElement.style.transform = 'scale(1)';
            imgElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          });

          studentLifeGallery.appendChild(imgElement);
        });

        console.log('✅ Student life images loaded from database successfully');
      } else {
        console.log('📝 No student life images found in database, showing empty state');

        studentLifeGallery.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">
            <ion-icon name="images-outline" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></ion-icon>
            <h3 style="margin-bottom: 10px; color: #999;">No Student Life Images Yet</h3>
            <p style="margin-bottom: 20px;">Student life images will appear here once they are added through the admin panel.</p>
            <small style="opacity: 0.7;">Check back soon for exciting glimpses of our school life!</small>
          </div>
        `;
      }

      const activitiesResult = await DatabaseManager.getStudentLifeActivities();

      if (activitiesResult.success && activitiesResult.data.length > 0) {
        const activitiesByCategory = {};
        activitiesResult.data.forEach(activity => {
          if (!activitiesByCategory[activity.category]) {
            activitiesByCategory[activity.category] = [];
          }
          activitiesByCategory[activity.category].push(activity.activity_name);
        });

        Object.keys(activitiesByCategory).forEach(category => {
          const listElement = document.querySelector(`#${category}-activities`);
          if (listElement) {
            listElement.innerHTML = activitiesByCategory[category]
              .map(activity => `<li>${activity}</li>`)
              .join('');
          }
        });
      }

    } catch (error) {
      console.error('❌ Error loading student life:', error);
    }
  }

  // Load NECTA Results
  static async loadNectaResults() {
    try {
      console.log('🏆 Loading NECTA results for website...');

      const resultsResult = await DatabaseManager.getNectaResults();

      if (resultsResult.success && resultsResult.data && resultsResult.data.length > 0) {
        console.log(`📊 Found ${resultsResult.data.length} NECTA results`);

        // Group results by exam level
        const resultsByLevel = {
          form2: [],
          form4: [],
          form6: []
        };

        resultsResult.data.forEach(result => {
          if (resultsByLevel[result.exam_level]) {
            resultsByLevel[result.exam_level].push(result);
          }
        });

        // Update each tab with results
        Object.keys(resultsByLevel).forEach(level => {
          const resultsContainer = document.getElementById(`${level}-results`);
          if (resultsContainer && resultsByLevel[level].length > 0) {
            resultsContainer.innerHTML = resultsByLevel[level].map(result => `
              <div class="result-card">
                <h4>${result.title}</h4>
                <div class="year">${result.year}</div>
                <div class="result-stats">
                  <div class="stat-item">
                    <span class="stat-number">${result.total_students}</span>
                    <div class="stat-label">Students</div>
                  </div>
                  ${result.pass_rate ? `
                    <div class="stat-item">
                      <span class="stat-number">${result.pass_rate}%</span>
                      <div class="stat-label">Pass Rate</div>
                    </div>
                  ` : ''}
                  ${result.div_1 > 0 ? `
                    <div class="stat-item">
                      <span class="stat-number">${result.div_1}</span>
                      <div class="stat-label">Div I</div>
                    </div>
                  ` : ''}
                  ${result.div_2 > 0 ? `
                    <div class="stat-item">
                      <span class="stat-number">${result.div_2}</span>
                      <div class="stat-label">Div II</div>
                    </div>
                  ` : ''}
                </div>
                ${result.notes ? `<p style="margin-top: 15px; color: #666; font-size: 0.9em;">${result.notes}</p>` : ''}
                <a href="${result.results_url}" target="_blank" class="view-results-btn">
                  <ion-icon name="open"></ion-icon>
                  View Official Results
                </a>
              </div>
            `).join('');

            console.log(`✅ Updated ${level} results with ${resultsByLevel[level].length} entries`);
          }
        });

        console.log('✅ NECTA results loaded successfully on website');
      } else {
        console.log('📝 No NECTA results found for website display');
      }
    } catch (error) {
      console.error('❌ Error loading NECTA results:', error);
    }
  }

  // Load leadership team
  static async loadLeadership() {
    try {
      const result = await DatabaseManager.getLeadership();

      if (result.success && result.data.length > 0) {
        // Create leadership slider with all members
        const leaderImg = document.getElementById('leader-img');
        const leaderName = document.getElementById('leader-name');
        const leaderSlogan = document.getElementById('leader-slogan');

        if (leaderImg && leaderName && leaderSlogan) {
          // Create slider with all leadership members
          let leaderIndex = 0;
          const leaders = result.data.map(member => ({
            image: member.photo_url || 'https://scontent.fdar3-1.fna.fbcdn.net/v/t39.30808-6/217007174_1989869067832820_554727872759498263_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=h03rnZRy5_IQ7kNvwGKWzEV&_nc_oc=AdmlVJ1BFfIbvZVhlxHVcTK6h0RJIYIr2IN5CH7rUY1GgDKXV96JMIikskoINOFJP-c&_nc_zt=23&_nc_ht=scontent.fdar3-1.fna&_nc_gid=1DjB9qK_GGjtXUUShY7uSw&oh=00_Afhh65-r8qANxWaSI-LIYeZUFqaRWURvhM4VUtlP0RZOeg&oe=6925514E',
            name: member.name,
            slogan: member.qualifications || `"${member.position} - Leading with Excellence"`
          }));

          function updateLeader() {
            if (leaders.length > 0) {
              leaderImg.src = leaders[leaderIndex].image;
              leaderName.textContent = leaders[leaderIndex].name;
              leaderSlogan.textContent = leaders[leaderIndex].slogan;
              leaderIndex = (leaderIndex + 1) % leaders.length;
            }
          }

          // Initialize slider
          updateLeader();

          // Clear any existing interval
          if (window.leadershipInterval) {
            clearInterval(window.leadershipInterval);
          }

          // Start new interval
          window.leadershipInterval = setInterval(updateLeader, 4000);
        }

        console.log('Leadership loaded from database successfully with slider functionality');
      } else {
        // Keep existing leadership slider if no database data
        console.log('No leadership data in database, keeping existing content');
      }
    } catch (error) {
      console.error('Error loading leadership:', error);
      // Keep existing content on error
    }
  }

  // OPTIMIZED: Initialize with smart refresh intervals
  static async initializeWebsiteData() {
    console.log('Initializing optimized website data loading...');

    // Load all data once
    await this.loadNews();
    await this.loadPrograms();
    await this.loadTestimonials();
    await this.loadStudentLife();
    await this.loadNectaResults();
    await this.loadSliderImages();
    await this.loadWebsiteSettings();

    // OPTIMIZED: Different refresh rates for admin vs public
    const isAdminPage = window.location.pathname.includes('admin') ||
      window.location.pathname.includes('login') ||
      window.location.pathname.includes('dashboard');

    if (isAdminPage) {
      console.log('Admin page detected - using frequent updates');
      // Admin pages: frequent updates
      setInterval(() => {
        this.loadNews();
        this.loadPrograms();
        this.loadTestimonials();
        this.loadStudentLife();
        this.loadSliderImages();
        this.loadWebsiteSettings();
      }, 2 * 60 * 1000); // Every 2 minutes for admin
    } else {
      console.log('Public page detected - using optimized updates');
      // Public pages: less frequent updates
      setInterval(() => {
        this.loadNews(); // Only news updates frequently
      }, 10 * 60 * 1000); // Every 10 minutes for public

      // Other content updates less frequently
      setInterval(() => {
        this.loadPrograms();
        this.loadTestimonials();
        this.loadWebsiteSettings();
      }, 30 * 60 * 1000); // Every 30 minutes
    }
  }

  // OPTIMIZED: Minimal real-time updates for public
  static setupRealTimeUpdates() {
    try {
      const isAdminPage = window.location.pathname.includes('admin') ||
        window.location.pathname.includes('login') ||
        window.location.pathname.includes('dashboard');

      if (isAdminPage) {
        // Full real-time for admin
        DatabaseManager.subscribeToNews((payload) => {
          console.log('News updated, reloading...');
          this.loadNews();
        });

        DatabaseManager.subscribeToApplications((payload) => {
          console.log('Applications updated');
        });

        console.log('Admin real-time updates enabled');
      } else {
        // Minimal real-time for public
        console.log('Public page - minimal real-time updates');
      }
    } catch (error) {
      console.log('Real-time subscriptions not available, using periodic updates');
    }
  }
}

// Toggle read more functionality for news
function toggleReadMore(index) {
  const excerpt = document.getElementById(`excerpt-${index}`);
  const full = document.getElementById(`full-${index}`);
  const btn = document.getElementById(`btn-${index}`);

  if (full.style.display === 'none') {
    excerpt.style.display = 'none';
    full.style.display = 'block';
    btn.textContent = 'Read Less';
  } else {
    excerpt.style.display = 'block';
    full.style.display = 'none';
    btn.textContent = 'Read More';
  }
}

// Log successful class definition
console.log('OPTIMIZED WebsiteDataLoader class loaded successfully');

// OPTIMIZED: Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('Optimized website data loader initializing...');

  setTimeout(() => {
    if (window.DatabaseManager) {
      console.log('DatabaseManager found, loading dynamic content...');
      WebsiteDataLoader.initializeWebsiteData();
      WebsiteDataLoader.setupRealTimeUpdates();
    } else {
      console.log('DatabaseManager not available, using static content');
    }
  }, 1500); // Reduced timeout for faster loading
});

// Export for use in other files
window.WebsiteDataLoader = WebsiteDataLoader;
window.toggleReadMore = toggleReadMore;
