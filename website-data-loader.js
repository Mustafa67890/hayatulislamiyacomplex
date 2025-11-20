// OPTIMIZED Website Data Loader - Performance Enhanced Version
// ALL images from database (Supabase) - No local storage except academic programs

class WebsiteDataLoader {
  
  // Track intervals for cleanup
  static intervals = [];
  
  // Safe HTML escape function - FIXED: Handle non-string values
  static escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    if (typeof unsafe !== 'string') return String(unsafe);
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
    if (html) element.innerHTML = html;
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
      
      if (result.success && result.data && result.data.length > 0) {
        const newsContainer = document.querySelector('.news-grid');
        
        if (newsContainer) {
          newsContainer.innerHTML = '';
          
          result.data.forEach((news, index) => {
            const newsCard = document.createElement('div');
            newsCard.className = 'news-card';
            
            const shortContent = news.content ? news.content.substring(0, 150) : '';
            const isLong = news.content && news.content.length > 150;
            const safeTitle = this.escapeHtml(news.title || 'No Title');
            const safeContent = this.escapeHtml(news.content || '');
            const safeShortContent = this.escapeHtml(shortContent);
            const safeImageUrl = news.featured_image_url ? this.escapeHtml(news.featured_image_url) : '';
            const date = new Date(news.date || news.created_at || Date.now());
            const formattedDate = date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : 'Date not available';
            
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
      } else {
        console.log('No news data available');
      }
    } catch (error) {
      console.error('Error loading news:', error);
    }
  }

  // Load and display programs - ONLY THIS USES LOCAL IMAGES
  static async loadPrograms() {
    try {
      const programsContainer = document.querySelector('.programs-grid') || document.querySelector('#programs-section');
      
      if (!programsContainer) {
        console.log('Programs container not found');
        return;
      }

      // Use local images for academic programs ONLY
      const localPrograms = [
        {
          level: 'Ordinary Level',
          description: 'Comprehensive secondary education program',
          subjects: 'Mathematics, English, Kiswahili, Science, Social Studies',
          duration: '4 Years',
          image: 'STUDENT/ordinary.png'
        },
        {
          level: 'Advanced Level',
          description: 'Advanced secondary education with specialization',
          subjects: 'PCB, PCM, CBG, HGK, EGM',
          duration: '2 Years',
          image: 'STUDENT/advance.png'
        }
      ];

      programsContainer.innerHTML = '';
      
      localPrograms.forEach(program => {
        const programCard = this.createSafeElement('div', 'program-card');
        const safeLevel = this.escapeHtml(program.level);
        const safeDescription = this.escapeHtml(program.description);
        const safeSubjects = this.escapeHtml(program.subjects);
        const safeDuration = this.escapeHtml(program.duration);
        
        programCard.innerHTML = `
          <div class="program-content">
            <img src="${program.image}" alt="${safeLevel}" class="program-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'">
            <h3><ion-icon name="school"></ion-icon> ${safeLevel.toUpperCase()}</h3>
            <p>${safeDescription}</p>
            <p><strong>Subjects:</strong> ${safeSubjects}</p>
            <p><strong>Duration:</strong> ${safeDuration}</p>
          </div>
        `;
        programsContainer.appendChild(programCard);
      });
      
      console.log('Programs loaded successfully with local images');
      
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  }

  // Load and display testimonials - ALL FROM DATABASE
  static async loadTestimonials() {
    try {
      if (typeof DatabaseManager === 'undefined' || !DatabaseManager.getTestimonials) {
        console.warn('DatabaseManager not available for loading testimonials');
        this.showTestimonialsEmptyState();
        return;
      }

      const result = await DatabaseManager.getTestimonials();
      
      if (result.success && result.data && result.data.length > 0) {
        const testimonialsSlides = document.querySelector('.testimonial-slides');
        const testimonialsNav = document.querySelector('.testimonial-nav');
        
        if (testimonialsSlides && testimonialsNav) {
          // Clear existing content safely
          testimonialsSlides.innerHTML = '';
          testimonialsNav.innerHTML = '';
          
          result.data.forEach((testimonial, index) => {
            const slide = this.createSafeElement('div', 'testimonial-slide');
            const safeName = this.escapeHtml(testimonial.name || 'Anonymous');
            const safeRole = this.escapeHtml(testimonial.role || 'Student');
            const safeText = this.escapeHtml(testimonial.testimonial_text || 'No testimonial text available');
            const safePhotoUrl = testimonial.photo_url ? this.escapeHtml(testimonial.photo_url) : '';
            
            slide.innerHTML = `
              <div class="testimonial-content">
                <img src="${safePhotoUrl}" alt="${safeName}" class="testimonial-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=60'">
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
      } else {
        console.log('No testimonials data available, showing empty state');
        this.showTestimonialsEmptyState();
      }
    } catch (error) {
      console.error('Error loading testimonials:', error);
      this.showTestimonialsEmptyState();
    }
  }

  // Show empty state for testimonials
  static showTestimonialsEmptyState() {
    const testimonialsSlides = document.querySelector('.testimonial-slides');
    const testimonialsNav = document.querySelector('.testimonial-nav');
    
    if (testimonialsSlides) {
      testimonialsSlides.innerHTML = `
        <div class="testimonial-slide">
          <div class="testimonial-content">
            <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=60" alt="Default" class="testimonial-img">
            <div class="testimonial-name">Coming Soon</div>
            <div class="testimonial-role">Testimonials</div>
            <p class="testimonial-text">"Student and parent testimonials will appear here once they are added."</p>
          </div>
        </div>
      `;
    }
    
    if (testimonialsNav) {
      testimonialsNav.innerHTML = '<div class="testimonial-dot active" data-slide="0"></div>';
    }
    
    this.initializeTestimonialSlider();
  }

  // Initialize testimonial slider functionality
  static initializeTestimonialSlider() {
    const testimonialsSlides = document.querySelector('.testimonial-slides');
    const testimonialsNav = document.querySelector('.testimonial-nav');
    
    if (!testimonialsSlides || !testimonialsNav) {
      console.log('Testimonial slider elements not found');
      return;
    }
    
    // Clear any existing interval
    if (this.testimonialInterval) {
      clearInterval(this.testimonialInterval);
    }
    
    let currentTestimonial = 0;
    const totalTestimonials = testimonialsSlides.children.length;
    
    if (totalTestimonials === 0) {
      console.log('No testimonial slides to initialize');
      return;
    }
    
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
      if (this.testimonialInterval) {
        clearInterval(this.testimonialInterval);
      }
    };
    
    // Initialize first slide
    goToTestimonial(0);
    startTestimonialAutoSlide();
    
    // Remove existing event listeners by cloning
    const newNav = testimonialsNav.cloneNode(true);
    if (testimonialsNav.parentNode) {
      testimonialsNav.parentNode.replaceChild(newNav, testimonialsNav);
    }
    
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

  // Load slider images - ALL FROM DATABASE
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
        console.log('🖼️ No slider images found in database, showing empty state');
        this.setDefaultSliderContent();
      }
    } catch (error) {
      console.error('❌ Error loading slider images:', error);
      this.setDefaultSliderContent();
    }
  }
  
  // Initialize image slider functionality
  static initializeImageSlider() {
    console.log('🎠 Initializing image slider...');
    
    if (!window.images || window.images.length === 0) {
      console.log('⚠️ No images available for slider');
      this.setDefaultSliderContent();
      return;
    }
    
    // Check if slider container exists
    const sliderContainer = document.querySelector('.slider-container') || document.querySelector('.image-slider');
    if (!sliderContainer) {
      console.log('Slider container not found');
      return;
    }
    
    // Initialize basic slider if no external functions exist
    if (typeof window.initializeSlider !== 'function') {
      console.log('Initializing basic image slider');
      this.initializeBasicImageSlider();
      return;
    }
    
    // Use existing slider functions if available
    try {
      if (typeof window.initializeSlider === 'function') window.initializeSlider();
      if (typeof window.createDots === 'function') window.createDots();
      if (typeof window.updateSlider === 'function') window.updateSlider();
      if (typeof window.startSliderAfterLoad === 'function') {
        window.startSliderAfterLoad();
      } else {
        this.startBasicSlider();
      }
    } catch (error) {
      console.error('Error using external slider functions:', error);
      this.initializeBasicImageSlider();
    }
    
    console.log(`✅ Image slider initialized with ${window.images.length} images`);
  }

  // Initialize basic image slider
  static initializeBasicImageSlider() {
    const sliderContainer = document.querySelector('.slider-container') || document.querySelector('.image-slider');
    if (!sliderContainer || !window.images || window.images.length === 0) {
      this.setDefaultSliderContent();
      return;
    }

    // Create basic slider structure
    sliderContainer.innerHTML = `
      <div class="slider-wrapper" style="position: relative; width: 100%; overflow: hidden; border-radius: 10px;">
        <div class="slides-container" style="display: flex; transition: transform 0.5s ease; width: 100%;">
          ${window.images.map((img, index) => `
            <div class="slide" style="min-width: 100%;">
              <img src="${img}" alt="School Image ${index + 1}" style="width: 100%; height: 500px; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1562813733-b31f71025d54?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'">
            </div>
          `).join('')}
        </div>
        <button class="slider-prev" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 15px; cursor: pointer; border-radius: 50%; font-size: 18px;">❮</button>
        <button class="slider-next" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 15px; cursor: pointer; border-radius: 50%; font-size: 18px;">❯</button>
        <div class="slider-dots" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px;">
          ${window.images.map((_, index) => `
            <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}" style="width: 12px; height: 12px; background: ${index === 0 ? '#fff' : 'rgba(255,255,255,0.5)'}; border-radius: 50%; cursor: pointer; transition: background 0.3s ease;"></span>
          `).join('')}
        </div>
      </div>
    `;

    // Add slider functionality
    this.setupBasicSliderFunctionality();
  }

  // Setup basic slider functionality
  static setupBasicSliderFunctionality() {
    const slidesContainer = document.querySelector('.slides-container');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    
    if (!slidesContainer || slides.length === 0) return;

    let currentSlide = 0;
    const totalSlides = slides.length;

    const updateSlider = () => {
      slidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, index) => {
        dot.style.background = index === currentSlide ? '#fff' : 'rgba(255,255,255,0.5)';
      });
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateSlider();
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
      updateSlider();
    };

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentSlide = parseInt(dot.dataset.index);
        updateSlider();
      });
    });

    // Auto-slide
    if (window.sliderInterval) {
      clearInterval(window.sliderInterval);
    }
    window.sliderInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseenter', () => {
        if (window.sliderInterval) {
          clearInterval(window.sliderInterval);
        }
      });

      sliderWrapper.addEventListener('mouseleave', () => {
        window.sliderInterval = setInterval(nextSlide, 5000);
      });
    }

    console.log('✅ Basic image slider initialized successfully');
  }

  // Set default slider content when no images
  static setDefaultSliderContent() {
    const sliderContainer = document.querySelector('.slider-container') || 
                           document.querySelector('.image-slider');
    
    if (sliderContainer) {
      sliderContainer.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 400px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; border-radius: 10px;">
          <div style="text-align: center;">
            <ion-icon name="images-outline" style="font-size: 48px; margin-bottom: 20px;"></ion-icon>
            <p>School Images Coming Soon</p>
            <small>Add slider images through admin panel</small>
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

  // Load student life content - NOW FROM DATABASE
  static async loadStudentLife() {
    try {
      console.log('🎓 Loading student life images from DATABASE...');
      
      const studentLifeGallery = document.querySelector('.student-life-gallery');
      
      if (!studentLifeGallery) {
        console.error('❌ Student life gallery element not found');
        return;
      }

      // Check DatabaseManager availability
      if (typeof DatabaseManager === 'undefined' || !DatabaseManager.getStudentLifeImages) {
        console.warn('DatabaseManager not available for loading student life');
        this.showStudentLifeEmptyState(studentLifeGallery);
        return;
      }

      const imagesResult = await DatabaseManager.getStudentLifeImages();
      
      if (imagesResult.success && imagesResult.data && imagesResult.data.length > 0) {
        console.log(`🎯 Found ${imagesResult.data.length} student life images in database`);
        
        studentLifeGallery.innerHTML = '';
        
        const imagesToShow = imagesResult.data.slice(0, 6);
        
        imagesToShow.forEach((image, index) => {
          const imgElement = document.createElement('img');
          imgElement.src = image.image_url;
          imgElement.alt = this.escapeHtml(image.title || 'Student Life');
          imgElement.className = 'student-life-img';
          imgElement.title = this.escapeHtml(image.description || image.title || 'Student Life');
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
            console.log(`Failed to load student life image from database: ${image.image_url}`);
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
        
        console.log('✅ Student life images loaded from DATABASE successfully');
      } else {
        console.log('📝 No student life images found in database, showing empty state');
        this.showStudentLifeEmptyState(studentLifeGallery);
      }
      
    } catch (error) {
      console.error('❌ Error loading student life from database:', error);
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

  // Load NECTA results - ALL FROM DATABASE
  static async loadNectaResults() {
    try {
      console.log('📊 Loading NECTA results from database...');
      
      if (typeof DatabaseManager === 'undefined' || !DatabaseManager.getNectaResults) {
        console.warn('DatabaseManager not available for loading NECTA results');
        this.showNectaEmptyState();
        return;
      }

      const result = await DatabaseManager.getNectaResults();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log(`🎯 Found ${result.data.length} NECTA results`);
        
        const resultsContainer = document.querySelector('.necta-results') || document.querySelector('#results-section');
        if (resultsContainer) {
          resultsContainer.innerHTML = result.data.map(item => {
            const year = this.escapeHtml(item.year || 'N/A');
            const division = this.escapeHtml(item.division || 'N/A');
            const schoolName = this.escapeHtml(item.school_name || 'Hayatul Islamic School');
            const percentage = this.escapeHtml(item.percentage || 'N/A');
            
            return `
              <div class="result-item" style="background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-bottom: 15px;">
                <h4 style="color: #2c5aa0; margin-bottom: 10px;">${year} Results</h4>
                <p><strong>Division:</strong> ${division}</p>
                <p><strong>School:</strong> ${schoolName}</p>
                <p><strong>Performance:</strong> ${percentage}%</p>
              </div>
            `;
          }).join('');
        }
      } else {
        console.log('No NECTA results found, showing empty state');
        this.showNectaEmptyState();
      }
    } catch (error) {
      console.error('Error loading NECTA results:', error);
      this.showNectaEmptyState();
    }
  }

  // Show empty state for NECTA results
  static showNectaEmptyState() {
    const resultsContainer = document.querySelector('.necta-results') || document.querySelector('#results-section');
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 10px;">
          <ion-icon name="trophy-outline" style="font-size: 48px; color: #6c757d; margin-bottom: 15px;"></ion-icon>
          <h4 style="color: #6c757d;">NECTA Results Coming Soon</h4>
          <p>National examination results will be displayed here once available.</p>
        </div>
      `;
    }
  }

  // Load school leadership - ALL FROM DATABASE (INCLUDING IMAGES)
  static async loadSchoolLeadership() {
    try {
      console.log('👥 Loading school leadership from database...');
      
      if (typeof DatabaseManager === 'undefined' || !DatabaseManager.getSchoolLeadership) {
        console.warn('DatabaseManager not available for loading school leadership');
        this.showLeadershipEmptyState();
        return;
      }

      const result = await DatabaseManager.getSchoolLeadership();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log(`🎯 Found ${result.data.length} leadership members`);
        
        const leadershipContainer = document.querySelector('.leadership-grid') || document.querySelector('#leadership-section');
        if (leadershipContainer) {
          leadershipContainer.innerHTML = result.data.map(member => {
            const name = this.escapeHtml(member.name || 'Staff Member');
            const position = this.escapeHtml(member.position || 'Position');
            const qualification = this.escapeHtml(member.qualification || '');
            const photoUrl = member.photo_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60';
            
            return `
              <div class="leader-card" style="background: white; border-radius: 10px; padding: 20px; text-align: center; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <img src="${photoUrl}" alt="${name}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 15px;" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=60'">
                <h4 style="color: #2c5aa0; margin-bottom: 5px;">${name}</h4>
                <p style="color: #666; font-weight: bold; margin-bottom: 5px;">${position}</p>
                ${qualification ? `<p style="color: #888; font-size: 0.9em;">${qualification}</p>` : ''}
              </div>
            `;
          }).join('');
        }
      } else {
        console.log('No school leadership data found, showing empty state');
        this.showLeadershipEmptyState();
      }
    } catch (error) {
      console.error('Error loading school leadership:', error);
      this.showLeadershipEmptyState();
    }
  }

  // Show empty state for leadership
  static showLeadershipEmptyState() {
    const leadershipContainer = document.querySelector('.leadership-grid') || document.querySelector('#leadership-section');
    if (leadershipContainer) {
      leadershipContainer.innerHTML = `
        <div style="text-align: center; padding: 40px; background: #f8f9fa; border-radius: 10px; grid-column: 1 / -1;">
          <ion-icon name="people-outline" style="font-size: 48px; color: #6c757d; margin-bottom: 15px;"></ion-icon>
          <h4 style="color: #6c757d;">School Leadership</h4>
          <p>Leadership information will be displayed here once available.</p>
        </div>
      `;
    }
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
      // Load all data once with proper error handling
      await Promise.allSettled([
        this.loadNews(),                    // FROM DATABASE
        this.loadPrograms(),               // LOCAL IMAGES ONLY (Academic programs)
        this.loadTestimonials(),           // FROM DATABASE
        this.loadStudentLife(),            // FROM DATABASE
        this.loadSliderImages(),           // FROM DATABASE
        this.loadWebsiteSettings(),        // FROM DATABASE
        this.loadNectaResults(),           // FROM DATABASE
        this.loadSchoolLeadership()        // FROM DATABASE
      ]);
      
      console.log('✅ All website data initialized successfully');
      
    } catch (error) {
      console.error('Error during website data initialization:', error);
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
      console.log('DatabaseManager found, loading ALL content from DATABASE...');
      WebsiteDataLoader.initializeWebsiteData();
    } else {
      console.log('DatabaseManager not available, using limited content');
      // Initialize basic functionality even without DatabaseManager
      WebsiteDataLoader.loadPrograms(); // Local academic programs only
      WebsiteDataLoader.setDefaultSliderContent(); // Default slider
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
