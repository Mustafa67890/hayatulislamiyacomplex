// Website Data Loader - Fetches dynamic content from Supabase
// This file loads content from database and updates the website dynamically

class WebsiteDataLoader {
  
  // Load and display news on website
  static async loadNews() {
    try {
      const result = await DatabaseManager.getNews(3); // Get latest 3 news
      
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
              ${news.featured_image_url ? `<img src="${news.featured_image_url}" alt="${news.title}" class="news-img">` : '<img src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="News" class="news-img">'}
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
          // Only update if we have database data, otherwise keep existing content
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
        // Keep existing hardcoded content if no database data
        console.log('No programs in database, keeping existing content');
      }
    } catch (error) {
      console.error('Error loading programs:', error);
      // Keep existing content on error
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
          // Create slides from database data
          testimonialsSlides.innerHTML = result.data.map(testimonial => `
            <div class="testimonial-slide">
              <div class="testimonial-content">
                <img src="${testimonial.photo_url || 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=120&q=80'}" alt="${testimonial.name}" class="testimonial-img">
                <div class="testimonial-name">${testimonial.name}</div>
                <div class="testimonial-role">${testimonial.role}</div>
                <p class="testimonial-text">"${testimonial.testimonial_text}"</p>
              </div>
            </div>
          `).join('');
          
          // Create navigation dots
          testimonialsNav.innerHTML = result.data.map((_, index) => 
            `<div class="testimonial-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>`
          ).join('');
          
          // Reset slider position
          testimonialsSlides.style.transform = 'translateX(0%)';
          
          // Initialize testimonial slider functionality
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
    
    // Start auto slide
    startTestimonialAutoSlide();
    
    // Dot navigation
    testimonialsNav.addEventListener('click', (e) => {
      if (e.target.classList.contains('testimonial-dot')) {
        stopTestimonialAutoSlide();
        goToTestimonial(parseInt(e.target.dataset.slide));
        startTestimonialAutoSlide();
      }
    });
    
    // Pause on hover
    testimonialsSlides.addEventListener('mouseenter', stopTestimonialAutoSlide);
    testimonialsSlides.addEventListener('mouseleave', startTestimonialAutoSlide);
  }

  // Load and display school information
  static async loadSchoolInfo() {
    try {
      const result = await DatabaseManager.getSchoolInfo();
      
      if (result.success && result.data.length > 0) {
        result.data.forEach(info => {
          switch (info.section) {
            case 'about':
              this.updateAboutSection(info.data);
              break;
            case 'why_choose_us':
              this.updateWhyChooseUs(info.data);
              break;
            case 'student_life':
              this.updateStudentLife(info.data);
              break;
          }
        });
        
        console.log('School info loaded from database successfully');
      }
    } catch (error) {
      console.error('Error loading school info:', error);
    }
  }

  // Update about section
  static updateAboutSection(data) {
    const visionEl = document.querySelector('#school-vision');
    const missionEl = document.querySelector('#school-mission');
    const historyEl = document.querySelector('#school-history');
    
    if (visionEl && data.vision) visionEl.textContent = data.vision;
    if (missionEl && data.mission) missionEl.textContent = data.mission;
    if (historyEl && data.history) historyEl.textContent = data.history;
  }

  // Update why choose us section
  static updateWhyChooseUs(data) {
    const whyChooseContainer = document.querySelector('#why-choose-us-list');
    
    if (whyChooseContainer && data.points) {
      whyChooseContainer.innerHTML = '';
      
      data.points.forEach(point => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<i class="fas fa-check"></i> ${point}`;
        whyChooseContainer.appendChild(listItem);
      });
    }
  }

  // Update student life section
  static updateStudentLife(data) {
    const sportsEl = document.querySelector('#sports-activities');
    const culturalEl = document.querySelector('#cultural-activities');
    const academicEl = document.querySelector('#academic-clubs');
    const religiousEl = document.querySelector('#religious-activities');
    
    if (sportsEl && data.sports) {
      sportsEl.innerHTML = data.sports.map(sport => `<li>${sport}</li>`).join('');
    }
    if (culturalEl && data.cultural) {
      culturalEl.innerHTML = data.cultural.map(activity => `<li>${activity}</li>`).join('');
    }
    if (academicEl && data.academic) {
      academicEl.innerHTML = data.academic.map(club => `<li>${club}</li>`).join('');
    }
    if (religiousEl && data.religious) {
      religiousEl.innerHTML = data.religious.map(activity => `<li>${activity}</li>`).join('');
    }
  }

  // Load and display statistics
  static async loadStatistics() {
    try {
      const result = await DatabaseManager.getStatistics();
      
      if (result.success && result.data) {
        const stats = result.data;
        
        // Update statistics counters using correct IDs from website
        const studentsEl = document.querySelector('#student-count');
        const staffEl = document.querySelector('#staff-count');
        const subjectsEl = document.querySelector('#subject-count');
        const awardsEl = document.querySelector('#achievement-count');
        
        if (studentsEl) studentsEl.textContent = stats.total_students || '1250';
        if (staffEl) staffEl.textContent = stats.teaching_staff || '75';
        if (subjectsEl) subjectsEl.textContent = stats.subjects_offered || '18';
        if (awardsEl) awardsEl.textContent = stats.awards_won || '42';
        
        // Update performance chart if it exists
        this.updatePerformanceChart(stats);
        
        console.log('Statistics loaded from database successfully');
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  // Update performance chart with database data
  static updatePerformanceChart(stats) {
    // This will update the Chart.js chart with real data
    if (window.performanceChart && stats) {
      const chartData = {
        labels: ['2020', '2021', '2022', '2023', '2024'],
        datasets: [{
          label: 'GPA Trend',
          data: [
            stats.gpa_2020 || 3.2,
            stats.gpa_2021 || 3.4,
            stats.gpa_2022 || 3.6,
            stats.gpa_2023 || 3.7,
            stats.gpa_2024 || 3.8
          ],
          borderColor: '#003366',
          backgroundColor: 'rgba(0, 51, 102, 0.1)',
          tension: 0.4,
          fill: true
        }]
      };
      
      window.performanceChart.data = chartData;
      window.performanceChart.update();
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
            image: member.photo_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
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
        
        // No grid cards needed - only slider functionality
        
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

  // Load slider images
  static async loadSliderImages() {
    try {
      console.log('🖼️ Loading slider images from database...');
      
      const result = await DatabaseManager.getSliderImages();
      
      if (result.success && result.data && result.data.length > 0) {
        console.log(`🎯 Found ${result.data.length} slider images in database`);
        
        // Set global images array for slider
        window.images = result.data.map(image => image.image_url);
        
        // Initialize slider with database images
        this.initializeImageSlider();
        
        console.log('✅ Slider images loaded from database successfully');
      } else {
        console.log('🖼️ No slider images found in database, using default images');
        this.loadDefaultSliderImages();
      }
    } catch (error) {
      console.error('❌ Error loading slider images:', error);
      console.log('🖼️ Loading default slider images as fallback');
      this.loadDefaultSliderImages();
    }
  }
  
  // Load default slider images when database is not available
  static loadDefaultSliderImages() {
    console.log('🖼️ Loading default slider images...');
    
    // Default school images
    window.images = [
      'https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
    ];
    
    // Initialize slider with default images
    this.initializeImageSlider();
    
    console.log('✅ Default slider images loaded');
  }
  
  // Initialize image slider functionality
  static initializeImageSlider() {
    console.log('🎠 Initializing image slider...');
    
    if (!window.images || window.images.length === 0) {
      console.log('⚠️ No images available for slider');
      return;
    }
    
    // Call the existing slider initialization functions if they exist
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
        
        // Update page title (only if it's not the default and not empty)
        if (settings.school_name && 
            settings.school_name.trim() !== '' && 
            settings.school_name.toLowerCase() !== 'test school' &&
            settings.school_name.toLowerCase() !== 'test school name') {
          document.title = settings.school_name;
        } else {
          // Keep the default title
          document.title = 'Hayatul Islamic School';
        }
        
        // Update school name in header
        const schoolNameElements = document.querySelectorAll('.school-name, .logo-text, h1');
        schoolNameElements.forEach(el => {
          if (el.textContent.includes('Hayatul') || el.textContent.includes('School')) {
            el.textContent = settings.school_name || 'Hayatul Islamic Secondary School';
          }
        });
        
        // Update contact information
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
        
        // Update WhatsApp link if phone number changed
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


  // Load student life content
  static async loadStudentLife() {
    try {
      console.log('🎓 Loading student life images from database...');
      
      // Load student life images
      const imagesResult = await DatabaseManager.getStudentLifeImages();
      
      console.log('Student life images result:', imagesResult);
      
      const studentLifeGallery = document.querySelector('.student-life-gallery');
      console.log('Student life gallery element found:', !!studentLifeGallery);
      
      if (!studentLifeGallery) {
        console.error('❌ Student life gallery element not found');
        return;
      }
      
      if (imagesResult.success && imagesResult.data && imagesResult.data.length > 0) {
        console.log(`🎯 Found ${imagesResult.data.length} student life images in database`);
        
        // Clear existing content (including loading placeholder)
        studentLifeGallery.innerHTML = '';
        
        // Group images by category and display
        const imagesByCategory = {};
        imagesResult.data.forEach(image => {
          if (!imagesByCategory[image.category]) {
            imagesByCategory[image.category] = [];
          }
          imagesByCategory[image.category].push(image);
        });
        
        console.log('Images by category:', imagesByCategory);
        
        // Display images from all categories
        const imagesToShow = Object.values(imagesByCategory).flat().slice(0, 6);
        console.log(`Displaying ${imagesToShow.length} student life images from database`);
        
        imagesToShow.forEach((image, index) => {
          const imgElement = document.createElement('img');
          imgElement.src = image.image_url;
          imgElement.alt = image.title;
          imgElement.className = 'student-life-img';
          imgElement.title = image.description || image.title;
          imgElement.style.cssText = `
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 10px;
            transition: transform 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          `;
          
          // Add hover effect
          imgElement.addEventListener('mouseenter', () => {
            imgElement.style.transform = 'scale(1.05)';
            imgElement.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
          });
          imgElement.addEventListener('mouseleave', () => {
            imgElement.style.transform = 'scale(1)';
            imgElement.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
          });
          
          studentLifeGallery.appendChild(imgElement);
          console.log(`Added database image ${index + 1}: ${image.title}`);
        });
        
        console.log('✅ Student life images loaded from database successfully');
      } else {
        console.log('📝 No student life images found in database, showing empty state');
        
        // Show empty state message
        studentLifeGallery.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #666;">
            <ion-icon name="images-outline" style="font-size: 64px; margin-bottom: 20px; opacity: 0.3;"></ion-icon>
            <h3 style="margin-bottom: 10px; color: #999;">No Student Life Images Yet</h3>
            <p style="margin-bottom: 20px;">Student life images will appear here once they are added through the admin panel.</p>
            <small style="opacity: 0.7;">Check back soon for exciting glimpses of our school life!</small>
          </div>
        `;
        
        console.log('📸 Showing empty state for student life images');
      }
      
      // Load student life activities
      const activitiesResult = await DatabaseManager.getStudentLifeActivities();
      
      if (activitiesResult.success && activitiesResult.data.length > 0) {
        const activitiesByCategory = {};
        activitiesResult.data.forEach(activity => {
          if (!activitiesByCategory[activity.category]) {
            activitiesByCategory[activity.category] = [];
          }
          activitiesByCategory[activity.category].push(activity.activity_name);
        });
        
        // Update activity lists
        Object.keys(activitiesByCategory).forEach(category => {
          const listElement = document.querySelector(`#${category}-activities`);
          if (listElement) {
            listElement.innerHTML = activitiesByCategory[category]
              .map(activity => `<li>${activity}</li>`)
              .join('');
          }
        });
      }
      
      console.log('Student life content loaded from database successfully');
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

  // Initialize all website data loading
  static async initializeWebsiteData() {
    console.log('Initializing website data loading...');
    
    // Load all data
    await this.loadNews();
    await this.loadPrograms();
    await this.loadTestimonials();
    await this.loadStudentLife();
    await this.loadNectaResults();
    await this.loadSliderImages();
    await this.loadLeadership();
    await this.loadStudentLife();
    await this.loadWebsiteSettings();
    
    // Set up periodic refresh (every 5 minutes)
    setInterval(() => {
      this.loadNews();
      this.loadPrograms();
      this.loadTestimonials();
      this.loadStatistics();
      this.loadSliderImages();
      this.loadLeadership();
      this.loadStudentLife();
      this.loadWebsiteSettings();
    }, 5 * 60 * 1000);
  }

  // Set up real-time subscriptions and periodic updates
  static setupRealTimeUpdates() {
    try {
      // Subscribe to news changes
      DatabaseManager.subscribeToNews((payload) => {
        console.log('News updated, reloading...');
        this.loadNews();
      });

      // Subscribe to application changes (for admin dashboard stats)
      DatabaseManager.subscribeToApplications((payload) => {
        console.log('Applications updated');
        // This could trigger dashboard updates if needed
      });
    } catch (error) {
      console.log('Real-time subscriptions not available, using periodic updates');
    }
    
    // Periodic refresh every 30 seconds to ensure content is up to date
    setInterval(() => {
      this.initializeWebsiteData();
    }, 30000);
    
    console.log('Real-time updates and periodic refresh setup complete');
  }
}

// Log successful class definition
console.log('WebsiteDataLoader class loaded successfully');

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Website data loader initializing...');
  
  // Wait a bit for Supabase to be ready
  setTimeout(() => {
    if (window.DatabaseManager) {
      console.log('DatabaseManager found, loading dynamic content...');
      WebsiteDataLoader.initializeWebsiteData();
      WebsiteDataLoader.setupRealTimeUpdates();
    } else {
      console.log('DatabaseManager not available, using static content');
      console.log('Available objects:', Object.keys(window).filter(key => key.includes('supabase') || key.includes('Database')));
    }
  }, 2000); // Increased timeout to ensure everything loads
});

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

// Export for use in other files
window.WebsiteDataLoader = WebsiteDataLoader;
window.toggleReadMore = toggleReadMore;
