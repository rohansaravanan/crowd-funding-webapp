// ============================================================
//  HOPEFUND — Supabase Configuration
//  Replace SUPABASE_URL and SUPABASE_ANON_KEY with your values
// ============================================================

const SUPABASE_URL  = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Initialize Supabase client (loaded via CDN in HTML)
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── Fetch all user-created campaigns from Supabase ──────────
async function getSupabaseCampaigns() {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetch error:', error.message);
      return [];
    }
    // Map DB columns to our JS format
    return (data || []).map(row => ({
      id:          row.id,
      title:       row.title,
      org:         row.org,
      category:    row.category,
      description: row.description,
      raised:      Number(row.raised) || 0,
      goal:        Number(row.goal) || 0,
      donors:      Number(row.donors) || 0,
      daysLeft:    Number(row.days_left) || 30,
      urgent:      row.urgent || false,
      verified:    row.verified || false,
      location:    row.location || '',
      email:       row.email || '',
      userCreated: true
    }));
  } catch (e) {
    console.warn('Supabase connection failed:', e);
    return [];
  }
}

// ── Save a new campaign to Supabase ──────────────────────────
async function saveToSupabase(campaign) {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        id:          campaign.id,
        title:       campaign.title,
        org:         campaign.org,
        category:    campaign.category,
        description: campaign.description,
        raised:      campaign.raised || 0,
        goal:        campaign.goal,
        donors:      campaign.donors || 0,
        days_left:   campaign.daysLeft || 30,
        urgent:      campaign.urgent || false,
        verified:    campaign.verified || false,
        location:    campaign.location || '',
        email:       campaign.email || ''
      }]);

    if (error) {
      console.error('Supabase save error:', error.message);
      return false;
    }
    console.log('✅ Campaign saved to Supabase!');
    return true;
  } catch (e) {
    console.error('Supabase save failed:', e);
    return false;
  }
}
