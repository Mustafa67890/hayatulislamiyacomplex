// Supabase Configuration
// Replace these with your actual Supabase project credentials

const SUPABASE_URL = 'https://nyuvjnbfdtjlxufxhjbf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55dXZqbmJmZHRqbHh1ZnhoamJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2OTg3MDcsImV4cCI6MjA3ODI3NDcwN30.TisIPo0IKkPHccUgcfz6xW7g7KdDKJ8gWOKuwynRIJU';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database helper functions
class DatabaseManager {
  
  // Applications Management
  static async saveApplication(applicationData) {
    try {
      const { data, error } = await supabaseClient
        .from('applications')
        .insert([{
          ...applicationData,
          status: 'pending',
          submitted_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving application:', error);
      return { success: false, error: error.message };
    }
  }

  static async getApplications(status = null) {
    try {
      let query = supabaseClient.from('applications').select('*');
      
      if (status) {
        query = query.eq('status', status);
      }
      
      const { data, error } = await query.order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching applications:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateApplicationStatus(id, status, rejectionReason = null) {
    try {
      const updateData = {
        status,
        reviewed_at: new Date().toISOString()
      };
      
      if (rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }
      
      const { data, error } = await supabaseClient
        .from('applications')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating application:', error);
      return { success: false, error: error.message };
    }
  }

  // News Management
  static async saveNews(newsData) {
    try {
      const { data, error } = await supabaseClient
        .from('news')
        .insert([{
          ...newsData,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving news:', error);
      return { success: false, error: error.message };
    }
  }

  static async getNews(limit = null) {
    try {
      let query = supabaseClient.from('news').select('*').order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching news:', error);
      return { success: false, error: error.message };
    }
  }

  // School Information Management
  static async updateSchoolInfo(section, data) {
    try {
      const { data: result, error } = await supabaseClient
        .from('school_info')
        .upsert([{
          section,
          data: JSON.stringify(data),
          updated_at: new Date().toISOString()
        }], { onConflict: 'section' });
      
      if (error) throw error;
      return { success: true, data: result };
    } catch (error) {
      console.error('Error updating school info:', error);
      return { success: false, error: error.message };
    }
  }

  static async getSchoolInfo(section = null) {
    try {
      let query = supabaseClient.from('school_info').select('*');
      
      if (section) {
        query = query.eq('section', section);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Parse JSON data
      const parsedData = data.map(item => ({
        ...item,
        data: JSON.parse(item.data)
      }));
      
      return { success: true, data: parsedData };
    } catch (error) {
      console.error('Error fetching school info:', error);
      return { success: false, error: error.message };
    }
  }

  // Programs Management
  static async saveProgram(programData) {
    try {
      const { data, error } = await supabaseClient
        .from('programs')
        .upsert([{
          ...programData,
          updated_at: new Date().toISOString()
        }], { onConflict: 'level' });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving program:', error);
      return { success: false, error: error.message };
    }
  }

  static async getPrograms() {
    try {
      const { data, error } = await supabaseClient
        .from('programs')
        .select('*')
        .order('level');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching programs:', error);
      return { success: false, error: error.message };
    }
  }

  // Testimonials Management
  static async saveTestimonial(testimonialData) {
    try {
      const { data, error } = await supabaseClient
        .from('testimonials')
        .insert([{
          ...testimonialData,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving testimonial:', error);
      return { success: false, error: error.message };
    }
  }

  static async getTestimonials() {
    try {
      const { data, error } = await supabaseClient
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return { success: false, error: error.message };
    }
  }

  // Statistics Management
  static async updateStatistics(statsData) {
    try {
      const { data, error } = await supabaseClient
        .from('statistics')
        .upsert([{
          id: 1, // Single row for stats
          ...statsData,
          updated_at: new Date().toISOString()
        }], { onConflict: 'id' });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating statistics:', error);
      return { success: false, error: error.message };
    }
  }

  static async getStatistics() {
    try {
      const { data, error } = await supabaseClient
        .from('statistics')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      return { success: false, error: error.message };
    }
  }

  // Leadership Management
  static async saveLeadershipMember(memberData) {
    try {
      const { data, error } = await supabaseClient
        .from('leadership')
        .insert([{
          ...memberData,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving leadership member:', error);
      return { success: false, error: error.message };
    }
  }

  static async getLeadership() {
    try {
      const { data, error } = await supabaseClient
        .from('leadership')
        .select('*')
        .order('position_order');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching leadership:', error);
      return { success: false, error: error.message };
    }
  }

  // NECTA Results Management
  static async saveNectaResults(resultsData) {
    try {
      console.log('💾 Saving NECTA results:', resultsData);
      
      const { data, error } = await supabaseClient
        .from('necta_results')
        .insert([{
          ...resultsData,
          created_at: new Date().toISOString(),
          is_active: true
        }])
        .select();
      
      if (error) {
        console.error('❌ Error saving NECTA results:', error);
        throw error;
      }
      
      console.log('✅ NECTA results saved successfully:', data[0]);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('❌ Error saving NECTA results:', error);
      return { success: false, error: error.message };
    }
  }

  static async getNectaResults() {
    try {
      console.log('📋 Fetching NECTA results...');
      
      const { data, error } = await supabaseClient
        .from('necta_results')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: false })
        .order('exam_level', { ascending: true });
      
      if (error) {
        console.error('❌ Error fetching NECTA results:', error);
        throw error;
      }
      
      console.log('✅ NECTA results fetched successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Error fetching NECTA results:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteNectaResults(id) {
    try {
      console.log('🗑️ Deleting NECTA results:', id);
      
      const { error } = await supabaseClient
        .from('necta_results')
        .update({ is_active: false })
        .eq('id', id);
      
      if (error) {
        console.error('❌ Error deleting NECTA results:', error);
        throw error;
      }
      
      console.log('✅ NECTA results deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting NECTA results:', error);
      return { success: false, error: error.message };
    }
  }

  // File Upload Management
  static async uploadFile(file, folder = 'general') {
    try {
      console.log('📤 Starting file upload process...');
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
        folder: folder
      });
      
      // Validate file
      if (!file || file.size === 0) {
        throw new Error('Invalid file: File is empty or not selected');
      }
      
      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File too large: Maximum size is 10MB');
      }
      
      // Check if uploads bucket exists
      const { data: uploadsBucket } = await supabaseClient.storage.getBucket('uploads');
      
      if (!uploadsBucket) {
        console.log('🔧 Creating uploads bucket...');
        const { data: newBucket, error: createError } = await supabaseClient.storage.createBucket('uploads', {
          public: true,
          allowedMimeTypes: ['image/*'],
          fileSizeLimit: 10485760 // 10MB
        });
        
        if (createError) {
          console.log('⚠️ Bucket creation failed (might already exist):', createError.message);
        } else {
          console.log('✅ Uploads bucket created successfully');
        }
      }
      
      // Generate file path
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const filePath = `${folder}/${fileName}`;
      
      // Upload file
      console.log('📤 Uploading file to storage...');
      const { data, error } = await supabaseClient.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error('❌ Upload error:', error);
        throw new Error('Upload failed: ' + error.message);
      }
      
      console.log('✅ File uploaded successfully:', data);
      
      // Get public URL
      const { data: publicUrlData } = supabaseClient.storage
        .from('uploads')
        .getPublicUrl(filePath);
      
      console.log('🔗 Public URL generated:', publicUrlData.publicUrl);
      
      return { 
        success: true, 
        data: {
          path: data.path,
          publicUrl: publicUrlData.publicUrl,
          fileName: fileName
        }
      };
    } catch (error) {
      console.error('❌ File upload error:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteFile(filePath) {
    try {
      const { error } = await supabaseClient.storage
        .from('uploads')
        .remove([filePath]);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }
  }

  // Settings Management
  static async getSettings() {
    try {
      const { data, error } = await supabaseClient
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return { success: false, error: error.message };
    }
  }

  static async updateSettings(settingsData) {
    try {
      const { data, error } = await supabaseClient
        .from('settings')
        .update({
          ...settingsData,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating settings:', error);
      return { success: false, error: error.message };
    }
  }

  // Slider Images Management
  static async saveSliderImage(imageData) {
    try {
      const { data, error } = await supabaseClient
        .from('slider_images')
        .insert([{
          ...imageData,
          created_at: new Date().toISOString()
        }]);
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error saving slider image:', error);
      return { success: false, error: error.message };
    }
  }

  static async getSliderImages() {
    try {
      const { data, error } = await supabaseClient
        .from('slider_images')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching slider images:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteSliderImage(id) {
    try {
      const { error } = await supabaseClient
        .from('slider_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting slider image:', error);
      return { success: false, error: error.message };
    }
  }

  // Student Life Functions
  static async getStudentLifeImages() {
    try {
      console.log('🔍 Fetching student life images from database...');
      
      const { data, error } = await supabaseClient
        .from('student_life_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('❌ Database query error:', error);
        throw error;
      }
      
      console.log(`✅ Found ${data?.length || 0} student life images in database`);
      console.log('Student life images data:', data);
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('❌ Error fetching student life images:', error);
      return { success: false, error: error.message };
    }
  }

  static async saveStudentLifeImage(imageData) {
    try {
      console.log('🔗 Testing database connection...');
      
      // For RLS policy issues, try with service role key or disable RLS temporarily
      console.log('🔐 Attempting insert with current permissions...');
      console.log('📝 Preparing data for insertion:', imageData);
      
      // Prepare the data with all required fields
      const insertData = {
        title: imageData.title,
        description: imageData.description || '',
        image_url: imageData.image_url,
        category: imageData.category,
        display_order: imageData.display_order || 1,
        is_active: true,
        created_at: new Date().toISOString()
      };
      
      console.log('📝 Final insert data:', insertData);
      
      // Try direct insert first
      let { data, error } = await supabaseClient
        .from('student_life_images')
        .insert([insertData])
        .select();
      
      // If RLS error (42501), try alternative approach
      if (error && error.code === '42501') {
        console.log('🔐 RLS policy blocking insert, trying alternative approach...');
        
        // Try with upsert instead of insert
        const { data: upsertData, error: upsertError } = await supabaseClient
          .from('student_life_images')
          .upsert([insertData], { onConflict: 'id' })
          .select();
          
        if (upsertError) {
          console.error('❌ Upsert also failed:', upsertError);
          throw new Error(`Database access denied. Please check RLS policies. Error: ${upsertError.message} (Code: ${upsertError.code})`);
        }
        
        data = upsertData;
        error = null;
      }
      
      if (error) {
        console.error('❌ Insert error details:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error details:', error.details);
        
        if (error.code === '42501') {
          throw new Error(`Database access denied. RLS policy is blocking the insert. Please disable RLS for student_life_images table or add proper policies. (Code: ${error.code})`);
        }
        
        if (error.code === '23514') {
          throw new Error(`Invalid data: Check constraint violation. Please ensure category is one of: sports, cultural, academic, religious, boarding, general. (Code: ${error.code})`);
        }
        
        if (error.code === '23505') {
          throw new Error(`Duplicate entry: This record already exists in the database. (Code: ${error.code})`);
        }
        
        throw new Error(`Database insert failed: ${error.message} (Code: ${error.code})`);
      }
      
      if (!data || data.length === 0) {
        console.error('❌ No data returned from insert operation');
        throw new Error('Insert operation completed but no data was returned');
      }
      
      console.log('✅ Student life image inserted successfully:', data[0]);
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('❌ Error saving student life image:', error);
      return { success: false, error: error.message };
    }
  }

  static async getStudentLifeActivities() {
    try {
      const { data, error } = await supabaseClient
        .from('student_life_activities')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true })
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching student life activities:', error);
      return { success: false, error: error.message };
    }
  }

  static async saveStudentLifeActivity(activityData) {
    try {
      const { data, error } = await supabaseClient
        .from('student_life_activities')
        .insert([{
          ...activityData,
          created_at: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error saving student life activity:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteStudentLifeImage(id) {
    try {
      const { error } = await supabaseClient
        .from('student_life_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting student life image:', error);
      return { success: false, error: error.message };
    }
  }

  static async deleteStudentLifeActivity(id) {
    try {
      const { error } = await supabaseClient
        .from('student_life_activities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error deleting student life activity:', error);
      return { success: false, error: error.message };
    }
  }

  // Real-time subscriptions
  static subscribeToApplications(callback) {
    return supabaseClient
      .channel('applications')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'applications' }, 
        callback
      )
      .subscribe();
  }

  static subscribeToNews(callback) {
    return supabaseClient
      .channel('news')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'news' }, 
        callback
      )
      .subscribe();
  }
}

// Export for use in other files
window.DatabaseManager = DatabaseManager;
window.supabaseClient = supabaseClient;
