// ============================================================
//  HOPEFUND — Supabase Configuration
// ============================================================

const SUPABASE_URL  = 'https://avqvckbplwsgymvhrvfc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cXZja2JwbHdzZ3ltdmhydmZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NTQ3MDMsImV4cCI6MjA4OTAzMDcwM30.0UjvyMyiMFGC-f3Px8AyiyF2KMQ0oaoKrw2fPWoXLxs';

// Initialize Supabase client
var _supabaseClient = null;
try {
  if (window.supabase && window.supabase.createClient) {
    _supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('✅ Supabase client initialized');
  } else {
    console.warn('⚠️ Supabase JS library not loaded');
  }
} catch(e) {
  console.warn('⚠️ Supabase init error:', e);
}

// ── Fetch all user-created campaigns from Supabase ──────────
window.getSupabaseCampaigns = async function() {
  if (!_supabaseClient) return [];
  try {
    var result = await _supabaseClient
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (result.error) {
      console.warn('Supabase fetch error:', result.error.message);
      return [];
    }
    return (result.data || []).map(function(row) {
      return {
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
      };
    });
  } catch (e) {
    console.warn('Supabase connection failed:', e);
    return [];
  }
};

// ── Save a new campaign to Supabase ──────────────────────────
window.saveToSupabase = async function(campaign) {
  if (!_supabaseClient) {
    console.warn('No Supabase client — falling back to localStorage');
    return false;
  }
  try {
    var result = await _supabaseClient
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

    if (result.error) {
      console.error('Supabase save error:', result.error.message);
      return false;
    }
    console.log('✅ Campaign saved to Supabase!');
    return true;
  } catch (e) {
    console.error('Supabase save failed:', e);
    return false;
  }
};

console.log('✅ Supabase functions registered:', typeof window.saveToSupabase, typeof window.getSupabaseCampaigns);

// ── Process a donation ──────────────────────────────────────
// Strategy: DELETE the old row, INSERT a new row with updated values.
// This works because we have INSERT + SELECT policies (no UPDATE needed).
window.processDonationInDB = async function(campaignId, amount, donorName, donorEmail) {
  if (!_supabaseClient) return false;
  try {
    // 1. Fetch current campaign
    var fetchResult = await _supabaseClient
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (fetchResult.error || !fetchResult.data) {
      console.warn('Campaign not in DB:', campaignId);
      return false;
    }

    var row = fetchResult.data;
    var newRaised = (Number(row.raised) || 0) + amount;
    var newDonors = (Number(row.donors) || 0) + 1;

    // 2. Delete old row
    var delResult = await _supabaseClient
      .from('campaigns')
      .delete()
      .eq('id', campaignId);

    // 3. Insert updated row (with new raised/donors)
    var insertResult = await _supabaseClient
      .from('campaigns')
      .insert([{
        id:          row.id,
        title:       row.title,
        org:         row.org,
        category:    row.category,
        description: row.description,
        raised:      newRaised,
        goal:        row.goal,
        donors:      newDonors,
        days_left:   row.days_left,
        urgent:      row.urgent,
        verified:    row.verified,
        location:    row.location,
        email:       row.email,
        created_at:  row.created_at
      }]);

    if (insertResult.error) {
      console.error('Donation re-insert error:', insertResult.error.message);
      return false;
    }

    console.log('✅ Donation of ₹' + amount + ' recorded! New total: ₹' + newRaised + ' (' + newDonors + ' donors)');
    return true;
  } catch (e) {
    console.error('Donation processing failed:', e);
    return false;
  }
};
