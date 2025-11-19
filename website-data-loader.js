// OPTIMIZED Website Data Loader - Performance Enhanced Version
// Reduced auto-refresh for public website, local image fallbacks

class WebsiteDataLoader {
  
  // Track intervals for cleanup
  static intervals = [];
  
  // Safe HTML escape function
  static escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Safe element creation with textContent
  static createSafeElement(tag, className, html) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (html) element.innerHTML = html; // Only use for trusted HTML structures
    return element;
  }

  // Load and display news on website
  static async loadNews() {
    try {
      // Check if DatabaseManager exists
      if (typeof DatabaseManager === 'undefined' || !DatabaseManager.getNews) {
        console.warn('DatabaseManager not available for loading news');
        return;
      }

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
            const safeTitle = this.escapeHtml(news.title);
            const safeContent = this.escapeHtml(news.content);
            const safeShortContent = this.escapeHtml(shortContent);
            const safeImageUrl = news.featured_image_url ? this.escapeHtml(news.featured_image_url) : '';
            const date = new Date(news.date || news.created_at);
            const formattedDate = date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : 'Date not available';
            
            // Use template literals but with escaped content
            newsCard.innerHTML = `
              ${safeImageUrl ? `<img src="${safeImageUrl}" alt="${safeTitle}" class="news-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'">` : '<img src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="News" class="news-img" loading="lazy">'}
              <div class="news-content">
                <div class="news-date">${formattedDate}</div>
                <h3 class="news-title">${safeTitle}</h3>
                <div class="news-text">
                  <p class="news-excerpt" id="excerpt-${index}">${safeShortContent}${isLong ? '...' : ''}</p>
                  ${isLong ? `<p class="news-full" id="full-${index}" style="display: none;">${safeContent}</p>` : ''}
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
      if (typeof DatabaseManager === 'undefined' || !DatabaseManager.getPrograms) {
        console.warn('DatabaseManager not available for loading programs');
        return;
      }

      const result = await DatabaseManager.getPrograms();
      
      if (result.success && result.data.length > 0) {
        const programsContainer = document.querySelector('.programs-grid') || document.querySelector('#programs-section');
        
        if (programsContainer) {
          programsContainer.innerHTML = '';
          
          result.data.forEach(program => {
            const programCard = this.createSafeElement('div', 'program-card');
            const safeLevel = this.escapeHtml(program.level);
            const safeDescription = this.escapeHtml(program.description);
            const safeSubjects = this.escapeHtml(program.subjects);
            const safeDuration = this.escapeHtml(program.duration || 'N/A');
            
            programCard.innerHTML = `
              <div class="program-content">
                <h3><ion-icon name="school"></ion-icon> ${safeLevel.toUpperCase()}</h3>
                <p>${safeDescription}</p>
                <p><strong>Subjects:</strong> ${safeSubjects}</p>
                <p><strong>Duration:</strong> ${safeDuration}</p>
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
      if (typeof DatabaseManager === 'undefined' || !DatabaseManager.getTestimonials) {
        console.warn('DatabaseManager not available for loading testimonials');
        return;
      }

      const result = await DatabaseManager.getTestimonials();
      
      if (result.success && result.data.length > 0) {
        const testimonialsSlides = document.querySelector('.testimonial-slides');
        const testimonialsNav = document.querySelector('.testimonial-nav');
        
        if (testimonialsSlides && testimonialsNav) {
          // Clear existing content safely
          testimonialsSlides.innerHTML = '';
          testimonialsNav.innerHTML = '';
          
          result.data.forEach((testimonial, index) => {
            const slide = this.createSafeElement('div', 'testimonial-slide');
            const safeName = this.escapeHtml(testimonial.name);
            const safeRole = this.escapeHtml(testimonial.role);
            const safeText = this.escapeHtml(testimonial.testimonial_text);
            const safePhotoUrl = testimonial.photo_url ? this.escapeHtml(testimonial.photo_url) : '';
            
            slide.innerHTML = `
              <div class="testimonial-content">
                <img src="${safePhotoUrl || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=60'}" alt="${safeName}" class="testimonial-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=60'">
                <div class="testimonial-name">${safeName}</div>
                <div class="testimonial-role">${safeRole}</div>
                <p class="testimonial-text">"${safeText}"</p>
              </div>
            `;
            testimonialsSlides.appendChild(slide);
            
            const dot = this.createSafeElement('div', `testimonial-dot ${index === 0 ? 'active' : ''}`);
            dot.dataset.slide = index.toString();
            testimonialsNav.appendChild(dot);
          });
          
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
    
    // Clear any existing interval
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
    
    let currentTestimonial = 0;
    const totalTestimonials = testimonialsSlides.children.length;
    
    if (totalTestimonials === 0) return;
    
    const updateTestimonialDots = () => {
      document.querySelectorAll('.testimonial-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
      });
    };
    
    const goToTestimonial = (index) => {
      currentTestimonial = index;
      testimonialsSlides.style.transform = `translateX(-${currentTestimonial * 100}%)`;
      updateTestimonialDots();
    };
    
    const nextTestimonial = () => {
      currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
      goToTestimonial(currentTestimonial);
    };
    
    const startTestimonialAutoSlide = () => {
      this.testimonialInterval = setInterval(nextTestimonial, 6000);
    };
    
    const stopTestimonialAutoSlide = () => {
      clearInterval(this.testimonialInterval);
    };
    
    // Initialize first slide
    goToTestimonial(0);
    startTestimonialAutoSlide();
    
    // Remove existing event listeners by cloning
    const newNav = testimonialsNav.cloneNode(true);
    testimonialsNav.parentNode.replaceChild(newNav, testimonialsNav);
    
    newNav.addEventListener('click', (e) => {
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
      
      if (typeof DatabaseManager === 'undefined' || !DatabaseManager.getSliderImages) {
        throw new Error('DatabaseManager not available');
      }

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
    
    // Use more reliable image paths
    const localImages = [
      'images/slider1.jpg',
      'images/slider2.jpg', 
      'images/slider3.jpg',
      'images/slider4.jpg',
      'images/slider5.jpg'
    ];
    
    // Fallback to placeholder if local images don't exist
    window.images = localImages;
    
    this.initializeImageSlider();
    console.log('✅ Local slider images loaded');
  }
  
  // Initialize image slider functionality
  static initializeImageSlider() {
    console.log('🎠 Initializing image slider...');
    
    if (!window.images || window.images.length === 0) {
      console.log('⚠️ No images available for slider');
      this.setDefaultSliderContent();
      return;
    }
    
    // Check if slider functions exist before calling
    if (typeof window.initializeSlider === 'function') {
      window.initializeSlider();
    } else {
      console.warn('initializeSlider function not found');
    }
    
    if (typeof window.createDots === 'function') {
      window.createDots();
    }
    
    if (typeof window.updateSlider === 'function') {
      window.updateSlider();
    }
    
    if (typeof window.startSliderAfterLoad === 'function') {
      window.startSliderAfterLoad();
    } else {
      // Start slider anyway if function doesn't exist
      this.startBasicSlider();
    }
    
    console.log(`✅ Image slider initialized with ${window.images.length} images`);
  }

  // Basic slider fallback
  static startBasicSlider() {
    if (!window.sliderInterval) {
      window.sliderInterval = setInterval(() => {
        if (typeof window.nextSlide === 'function') {
          window.nextSlide();
        }
      }, 5000);
    }
  }

  // Set default slider content when no images
  static setDefaultSliderContent() {
    const sliderContainer = document.querySelector('.slider-container') || 
                           document.querySelector('.image-slider');
    
    if (sliderContainer) {
      sliderContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 400px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">
          <div style="text-align: center;">
            <ion-icon name="images-outline" style="font-size: 48px; margin-bottom: 20px;"></ion-icon>
            <p>School Images Coming Soon</p>
          </div>
        </div>
      `;
    }
  }

  // Load website settings and update header/footer
  static async loadWebsiteSettings() {
    try {
      if (typeof DatabaseManager === 'undefined' || !DatabaseManager.getSettings) {
        console.warn('DatabaseManager not available for loading settings');
        return;
      }

      const result = await DatabaseManager.getSettings();
      
      if (result.success && result.data) {
        const settings = result.data;
        
        // Update document title safely
        if (settings.school_name && 
            settings.school_name.trim() !== '' && 
            settings.school_name.toLowerCase() !== 'test school' &&
            settings.school_name.toLowerCase() !== 'test school name') {
          document.title = this.escapeHtml(settings.school_name);
        } else {
          document.title = 'Hayatul Islamic School';
        }
        
        // Update school name elements
        const schoolNameElements = document.querySelectorAll('.school-name, .logo-text, h1');
        schoolNameElements.forEach(el => {
          if (el.textContent.includes('Hayatul') || el.textContent.includes('School')) {
            el.textContent = settings.school_name || 'Hayatul Islamic Secondary School';
          }
        });
        
        // Update phone elements
        const phoneElements = document.querySelectorAll('a[href*="tel:"], .phone-number');
        phoneElements.forEach(el => {
          if (settings.phone_number) {
            if (el.tagName === 'A') {
              el.href = `tel:${settings.phone_number}`;
            }
            el.textContent = settings.phone_number;
          }
        });
        
        // Update email elements
        const emailElements = document.querySelectorAll('a[href*="mailto:"], .email');
        emailElements.forEach(el => {
          if (settings.contact_email) {
            if (el.tagName === 'A') {
              el.href = `mailto:${settings.contact_email}`;
            }
            el.textContent = settings.contact_email;
          }
        });
        
        // Update WhatsApp links
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
      
      const studentLifeGallery = document.querySelector('.student-life-gallery');
      
      if (!studentLifeGallery) {
        console.error('❌ Student life gallery element not found');
        return;
      }
      
      // Check DatabaseManager availability
      if (typeof DatabaseManager === 'undefined' || !DatabaseManager.getStudentLifeImages) {
        this.showStudentLifeEmptyState(studentLifeGallery);
        return;
      }

      const imagesResult = await DatabaseManager.getStudentLifeImages();
      
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
          imgElement.alt = this.escapeHtml(image.title);
          imgElement.className = 'student-life-img';
          imgElement.title = this.escapeHtml(image.description || image.title);
          imgElement.loading = 'lazy';
          imgElement.style.cssText = `
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
            transition: transform 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          `;
          
          // Add error handling for images
          imgElement.addEventListener('error', () => {
            imgElement.src = 'https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60';
          });
          
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
        this.showStudentLifeEmptyState(studentLifeGallery);
      }
      
      // Load activities if DatabaseManager available
      if (DatabaseManager.getStudentLifeActivities) {
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
                .map(activity => `<li>${this.escapeHtml(activity)}</li>`)
                .join('');
            }
          });
        }
      }
      
    } catch (error) {
      console.error('❌ Error loading student life:', error);
      const studentLifeGallery = document.querySelector('.student-life-gallery');
      if (studentLifeGallery) {
        this.showStudentLifeEmptyState(studentLifeGallery);
      }
    }
  }

  // Show empty state for student life
  static showStudentLifeEmptyState(container) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">
        <ion-icon name="images-outline" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></ion-icon>
        <h3 style="margin-bottom: 10px; color: #999;">No Student Life Images Yet</h3>
        <p style="margin-bottom: 20px;">Student life images will appear here once they are added through the admin panel.</p>
        <small style="opacity: 0.7;">Check back soon for exciting glimpses of our school life!</small>
      </div>
    `;
  }

  // Clear all intervals
  static clearIntervals() {
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals = [];
    
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
    
    if (window.sliderInterval) {
      clearInterval(window.sliderInterval);
    }
  }

  // OPTIMIZED: Initialize with smart refresh intervals
  static async initializeWebsiteData() {
    console.log('Initializing optimized website data loading...');
    
    // Clear any existing intervals first
    this.clearIntervals();
    
    try {
      // Load all data once
      await Promise.allSettled([
        this.loadNews(),
        this.loadPrograms(),
        this.loadTestimonials(),
        this.loadStudentLife(),
        this.loadSliderImages(),
        this.loadWebsiteSettings()
      ]);
      
      // OPTIMIZED: Different refresh rates for admin vs public
      const isAdminPage = window.location.pathname.includes('admin') || 
                         window.location.pathname.includes('login') ||
                         window.location.pathname.includes('dashboard');
      
      if (isAdminPage) {
        console.log('Admin page detected - using frequent updates');
        // Admin pages: frequent updates
        const adminInterval = setInterval(() => {
          this.loadNews();
          this.loadPrograms();
          this.loadTestimonials();
          this.loadStudentLife();
          this.loadSliderImages();
          this.loadWebsiteSettings();
        }, 2 * 60 * 1000); // Every 2 minutes for admin
        this.intervals.push(adminInterval);
      } else {
        console.log('Public page detected - using optimized updates');
        // Public pages: less frequent updates
        const newsInterval = setInterval(() => {
          this.loadNews(); // Only news updates frequently
        }, 10 * 60 * 1000); // Every 10 minutes for public
        this.intervals.push(newsInterval);
        
        // Other content updates less frequently
        const otherContentInterval = setInterval(() => {
          this.loadPrograms();
          this.loadTestimonials();
          this.loadWebsiteSettings();
        }, 30 * 60 * 1000); // Every 30 minutes
        this.intervals.push(otherContentInterval);
      }
    } catch (error) {
      console.error('Error during website data initialization:', error);
    }
  }

  // OPTIMIZED: Minimal real-time updates for public
  static setupRealTimeUpdates() {
    try {
      if (typeof DatabaseManager === 'undefined') {
        console.log('DatabaseManager not available for real-time updates');
        return;
      }

      const isAdminPage = window.location.pathname.includes('admin') || 
                         window.location.pathname.includes('login') ||
                         window.location.pathname.includes('dashboard');
      
      if (isAdminPage) {
        // Full real-time for admin
        if (DatabaseManager.subscribeToNews) {
          DatabaseManager.subscribeToNews((payload) => {
            console.log('News updated, reloading...');
            this.loadNews();
          });
        }

        if (DatabaseManager.subscribeToApplications) {
          DatabaseManager.subscribeToApplications((payload) => {
            console.log('Applications updated');
          });
        }
        
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
  
  if (excerpt && full && btn) {
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
}

// Log successful class definition
console.log('OPTIMIZED WebsiteDataLoader class loaded successfully');

// OPTIMIZED: Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Optimized website data loader initializing...');
  
  // Reduced timeout for faster loading
  const initTimeout = setTimeout(() => {
    if (window.DatabaseManager && typeof DatabaseManager.getNews === 'function') {
      console.log('DatabaseManager found, loading dynamic content...');
      WebsiteDataLoader.initializeWebsiteData();
      WebsiteDataLoader.setupRealTimeUpdates();
    } else {
      console.log('DatabaseManager not available, using static content');
      // Initialize basic functionality even without DatabaseManager
      WebsiteDataLoader.loadLocalSliderImages();
    }
  }, 1000);

  // Clean up timeout on page unload
  window.addEventListener('beforeunload', () => {
    clearTimeout(initTimeout);
    WebsiteDataLoader.clearIntervals();
  });
});

// Export for use in other files
window.WebsiteDataLoader = WebsiteDataLoader;
window.toggleReadMore = toggleReadMore;
