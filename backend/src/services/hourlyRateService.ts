interface HourlyRateData {
  jobTitle: string;
  locationState: string;
  companyRevenueRange?: string;
  experienceYears?: number;
}

export interface HourlyRateResult {
  calculatedHourlyValue: number;
  dataSource: string;
  confidenceLevel: 'high' | 'medium' | 'low';
  methodology: string;
}

const hourlyRateDatabase: any = {
  "Real Estate Agent": {
    national_average: 41,
    by_location: {
      "California": 52,
      "New York": 51,
      "Massachusetts": 50,
      "Washington": 49,
      "Colorado": 46,
      "Texas": 43,
      "Florida": 42,
      "Illinois": 44,
      "Pennsylvania": 40,
      "default": 41
    },
    by_experience: {
      "0-2 years": 33,
      "3-5 years": 41,
      "5-10 years": 55,
      "10+ years": 70
    },
    source: "BLS_2024, ZipRecruiter_2024"
  },
  "CEO": {
    by_company_revenue: {
      "<$1M": 70,
      "$1M-$5M": 100,
      "$5M-$25M": 150,
      "$25M-$50M": 200,
      "$50M+": 250
    },
    source: "Kruze_Consulting_2025, SalaryCube_2024"
  },
  "Founder": {
    by_company_revenue: {
      "<$1M": 70,
      "$1M-$5M": 100,
      "$5M-$25M": 150,
      "$25M+": 200
    },
    source: "Kruze_Consulting_2025"
  },
  "Marketing Manager": {
    national_average: 45,
    by_location: {
      "California": 55,
      "New York": 52,
      "Massachusetts": 50,
      "Colorado": 48,
      "Texas": 44,
      "default": 45
    },
    source: "BLS_2024, PayScale_2024"
  },
  "Operations Manager": {
    national_average: 42,
    by_location: {
      "California": 50,
      "New York": 48,
      "Colorado": 45,
      "Texas": 43,
      "default": 42
    },
    source: "BLS_2024"
  },
  "Healthcare Administrator": {
    national_average: 48,
    by_location: {
      "California": 58,
      "New York": 55,
      "Massachusetts": 52,
      "Colorado": 51,
      "default": 48
    },
    source: "BLS_2024"
  },
  "Financial Advisor": {
    national_average: 55,
    by_location: {
      "California": 68,
      "New York": 65,
      "Massachusetts": 62,
      "Colorado": 58,
      "default": 55
    },
    source: "BLS_2024, PayScale_2024"
  },
  "Attorney": {
    national_average: 120,
    by_location: {
      "California": 145,
      "New York": 150,
      "Massachusetts": 135,
      "Colorado": 125,
      "default": 120
    },
    source: "BLS_2024"
  },
  "Consultant": {
    national_average: 85,
    by_location: {
      "California": 100,
      "New York": 95,
      "Massachusetts": 92,
      "Colorado": 88,
      "default": 85
    },
    source: "PayScale_2024"
  },
  "Business Owner": {
    by_company_revenue: {
      "<$500K": 50,
      "$500K-$1M": 65,
      "$1M-$5M": 90,
      "$5M-$10M": 120,
      "$10M+": 150
    },
    source: "SalaryCube_2024, PayScale_2024"
  },
  "Coach": {
    national_average: 65,
    by_location: {
      "California": 80,
      "New York": 75,
      "Colorado": 68,
      "default": 65
    },
    source: "PayScale_2024"
  },
  "default": {
    national_average: 50,
    source: "Conservative_Estimate_2024"
  }
};

function getExperienceBracket(years: number): string {
  if (years <= 2) return "0-2 years";
  if (years <= 5) return "3-5 years";
  if (years <= 10) return "5-10 years";
  return "10+ years";
}

export function calculateHourlyRate(data: HourlyRateData): HourlyRateResult {
  const { jobTitle, locationState, companyRevenueRange, experienceYears } = data;

  let calculatedRate = 50;
  let dataSource = "Conservative_Estimate_2024";
  let confidenceLevel: 'high' | 'medium' | 'low' = "low";

  const jobData = hourlyRateDatabase[jobTitle] || hourlyRateDatabase["default"];

  if (["CEO", "Founder", "Business Owner"].includes(jobTitle)) {
    if (companyRevenueRange && jobData.by_company_revenue) {
      calculatedRate = jobData.by_company_revenue[companyRevenueRange] || jobData.by_company_revenue["<$1M"];
      dataSource = jobData.source;
      confidenceLevel = "high";
    }
  } else {
    let baseRate = jobData.national_average || 50;

    if (jobData.by_location && locationState) {
      baseRate = jobData.by_location[locationState] || jobData.by_location["default"] || baseRate;
    }

    if (jobData.by_experience && experienceYears !== undefined) {
      const expBracket = getExperienceBracket(experienceYears);
      baseRate = jobData.by_experience[expBracket] || baseRate;
    }

    calculatedRate = baseRate;
    dataSource = jobData.source;
    confidenceLevel = jobData !== hourlyRateDatabase["default"] ? "high" : "medium";
  }

  calculatedRate = Math.round(calculatedRate / 5) * 5;

  return {
    calculatedHourlyValue: calculatedRate,
    dataSource,
    confidenceLevel,
    methodology: `Based on ${dataSource} for ${jobTitle} in ${locationState || 'United States'}`
  };
}
