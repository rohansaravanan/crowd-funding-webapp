// ============================================================
//  HOPEFUND — Campaign Data (INR — Indian Rupees ₹)
// ============================================================

const CAMPAIGNS = [
  {
    id: 1,
    title: "Clean Water for 10,000 Rural Families",
    org: "WaterFirst Foundation",
    category: "water",
    description: "Solar-powered wells providing clean, safe drinking water for 10,000+ families in rural Rajasthan facing a water crisis.",
    raised: 28400000,
    goal: 41500000,
    donors: 4219,
    daysLeft: 18,
    urgent: true,
    verified: true,
    location: "Rajasthan, India"
  },
  {
    id: 2,
    title: "Build 12 Digital Learning Labs in Rural Schools",
    org: "EduBridge Initiative",
    category: "education",
    description: "Equip 12 under-resourced rural schools with computers, internet, and trained teachers to unlock digital literacy for 3,600 students.",
    raised: 10600000,
    goal: 16600000,
    donors: 1847,
    daysLeft: 35,
    urgent: false,
    verified: true,
    location: "Kenya"
  },
  {
    id: 3,
    title: "Plant 1 Million Trees in the Amazon",
    org: "Green Earth Alliance",
    category: "environment",
    description: "Reforestation of 5,000 hectares of deforested Amazon land, protecting biodiversity and fighting climate change with local communities.",
    raised: 73900000,
    goal: 99600000,
    donors: 12480,
    daysLeft: 60,
    urgent: false,
    verified: true,
    location: "Amazon, Brazil"
  },
  {
    id: 4,
    title: "Mobile Health Clinics for Remote Villages",
    org: "HealthBridge NGO",
    category: "healthcare",
    description: "Deploy 8 fully equipped mobile health clinics to reach 50,000 patients in remote areas with no access to basic medical care.",
    raised: 5600000,
    goal: 12500000,
    donors: 933,
    daysLeft: 22,
    urgent: true,
    verified: true,
    location: "Sub-Saharan Africa"
  },
  {
    id: 5,
    title: "Emergency Flood Relief — Southeast Asia",
    org: "Disaster Aid International",
    category: "disaster",
    description: "Providing immediate food, shelter, and medical support to over 2,00,000 flood victims across Vietnam and Bangladesh.",
    raised: 42500000,
    goal: 49800000,
    donors: 8102,
    daysLeft: 7,
    urgent: true,
    verified: true,
    location: "Vietnam & Bangladesh"
  },
  {
    id: 6,
    title: "Feed 5,000 Children: School Nutrition Program",
    org: "Nourish Tomorrow",
    category: "hunger",
    description: "A daily nutritious meals program ensuring 5,000 children in impoverished communities never go to school on an empty stomach.",
    raised: 3700000,
    goal: 6600000,
    donors: 722,
    daysLeft: 45,
    urgent: false,
    verified: true,
    location: "Ethiopia"
  },
  {
    id: 7,
    title: "Rewild Scottish Highlands Meadows",
    org: "Wild Scotland Trust",
    category: "environment",
    description: "Restore 200 hectares of degraded Highland meadows for pollinators, birds, and native flora. Reversing decades of agricultural harm.",
    raised: 3200000,
    goal: 7500000,
    donors: 619,
    daysLeft: 80,
    urgent: false,
    verified: true,
    location: "Scotland, UK"
  },
  {
    id: 8,
    title: "Girls' Scholarship Fund — Central Asia",
    org: "Her Education Project",
    category: "education",
    description: "Full scholarships for 300 girls denied secondary education due to poverty and gender barriers in Tajikistan and Kyrgyzstan.",
    raised: 8200000,
    goal: 9960000,
    donors: 2341,
    daysLeft: 14,
    urgent: true,
    verified: true,
    location: "Tajikistan & Kyrgyzstan"
  },
  {
    id: 9,
    title: "Community Solar Power for 200 Homes",
    org: "SunRise Energy Co-op",
    category: "environment",
    description: "Install solar panels and battery storage for 200 low-income households, eliminating electricity bills and carbon emissions permanently.",
    raised: 14500000,
    goal: 23200000,
    donors: 2055,
    daysLeft: 28,
    urgent: false,
    verified: true,
    location: "Philippines"
  }
];

// ── INR Formatter ────────────────────────────────────────────
function formatINR(n) {
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(2).replace(/\.?0+$/, '') + ' Cr';
  if (n >= 100000)   return '₹' + (n / 100000).toFixed(1).replace(/\.0$/, '') + ' L';
  if (n >= 1000)     return '₹' + (n / 1000).toFixed(0) + 'K';
  return '₹' + n.toLocaleString('en-IN');
}

// ── LocalStorage: User-Created Campaigns ────────────────────
function getUserCampaigns() {
  try {
    return JSON.parse(localStorage.getItem('hopefund_campaigns') || '[]');
  } catch (e) {
    return [];
  }
}

function saveUserCampaign(campaign) {
  const existing = getUserCampaigns();
  existing.unshift(campaign); // newest first
  localStorage.setItem('hopefund_campaigns', JSON.stringify(existing));
}

function getAllCampaigns() {
  return [...getUserCampaigns(), ...CAMPAIGNS];
}
