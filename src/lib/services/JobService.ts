import type { JobRecommendation } from '../ai';

export class JobService {
  private static instance: JobService;
  private jobs: JobRecommendation[];

  private constructor() {
    // Initialize with a diverse list of jobs including arts and creative fields
    this.jobs = [
      {
        title: "Graphic Designer",
        company: "Creative Studio X",
        description: "Looking for a talented Graphic Designer with a strong portfolio. Experience with Adobe Creative Suite and brand identity design required. Must be able to work on multiple projects and collaborate with clients.",
        location: "New York, NY",
        salary: "$55,000 - $85,000",
        skills: ["Adobe Photoshop", "Adobe Illustrator", "InDesign", "Brand Design", "Typography"],
        matchScore: 0,
        url: "https://www.creativestudiox.com/careers",
        posted_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Art Director",
        company: "Design Agency Co",
        description: "Art Director needed to lead creative projects and manage a team of designers. Strong portfolio and experience in campaign development required. Must have excellent communication skills.",
        location: "Los Angeles, CA",
        salary: "$80,000 - $120,000",
        skills: ["Creative Direction", "Team Leadership", "Campaign Design", "Visual Design", "Project Management"],
        matchScore: 0,
        url: "https://www.designagencyco.com/jobs",
        posted_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Content Creator",
        company: "Digital Arts Media",
        description: "Content Creator needed for developing engaging visual content. Experience with video editing and social media required. Knowledge of current digital trends essential.",
        location: "Remote",
        salary: "$45,000 - $75,000",
        skills: ["Video Editing", "Social Media", "Content Strategy", "Adobe Premiere", "Photography"],
        matchScore: 0,
        url: "https://www.digitalartsmed.com/careers",
        posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Museum Curator",
        company: "Metropolitan Art Gallery",
        description: "Curator needed to oversee art collections and exhibitions. Advanced degree in Art History or related field required. Experience in exhibition planning and collection management essential.",
        location: "Chicago, IL",
        salary: "$65,000 - $95,000",
        skills: ["Curation", "Art History", "Exhibition Planning", "Collection Management", "Research"],
        matchScore: 0,
        url: "https://www.metartgallery.com/jobs",
        posted_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Visual Artist",
        company: "Creative Collective",
        description: "Visual Artist needed for commissioned works and installations. Strong portfolio of previous work required. Must be able to work on multiple projects and meet deadlines.",
        location: "Miami, FL",
        salary: "Project-based",
        skills: ["Fine Arts", "Installation Art", "Mixed Media", "Project Planning", "Client Relations"],
        matchScore: 0,
        url: "https://www.creativecollective.com/opportunities",
        posted_date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Art Teacher",
        company: "Creative Learning Academy",
        description: "Art Teacher needed for K-12 students. Teaching certification and experience in various art mediums required. Must be passionate about art education and student development.",
        location: "Boston, MA",
        salary: "$50,000 - $70,000",
        skills: ["Art Education", "Curriculum Development", "Teaching", "Mixed Media", "Student Assessment"],
        matchScore: 0,
        url: "https://www.creativelearning.edu/careers",
        posted_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "UX/UI Designer",
        company: "Digital Experience Co",
        description: "UX/UI Designer needed with strong artistic background. Experience in user interface design and prototyping required. Knowledge of user research and testing preferred.",
        location: "San Francisco, CA",
        salary: "$90,000 - $130,000",
        skills: ["UI Design", "UX Design", "Figma", "User Research", "Prototyping"],
        matchScore: 0,
        url: "https://www.digitalexp.com/jobs",
        posted_date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Art Therapist",
        company: "Healing Arts Center",
        description: "Art Therapist needed to work with diverse client groups. Licensed art therapist with clinical experience required. Strong understanding of therapeutic techniques essential.",
        location: "Seattle, WA",
        salary: "$60,000 - $85,000",
        skills: ["Art Therapy", "Clinical Practice", "Counseling", "Patient Care", "Treatment Planning"],
        matchScore: 0,
        url: "https://www.healingarts.org/careers",
        posted_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Gallery Manager",
        company: "Contemporary Arts Space",
        description: "Gallery Manager needed to oversee daily operations and exhibitions. Experience in gallery management and artist relations required. Strong organizational and event planning skills essential.",
        location: "Portland, OR",
        salary: "$55,000 - $80,000",
        skills: ["Gallery Management", "Event Planning", "Artist Relations", "Sales", "Exhibition Design"],
        matchScore: 0,
        url: "https://www.contemporaryarts.org/jobs",
        posted_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Animation Artist",
        company: "Digital Animation Studios",
        description: "Animation Artist needed for 2D/3D projects. Strong portfolio showing animation skills required. Experience with industry-standard animation software preferred.",
        location: "Austin, TX",
        salary: "$65,000 - $95,000",
        skills: ["2D Animation", "3D Animation", "Character Design", "Storyboarding", "After Effects"],
        matchScore: 0,
        url: "https://www.digitalanimation.com/careers",
        posted_date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  public static getInstance(): JobService {
    if (!JobService.instance) {
      JobService.instance = new JobService();
    }
    return JobService.instance;
  }

  public async searchJobs(keywords: string[], location: string = ''): Promise<{ data: JobRecommendation[], error?: string }> {
    try {
      if (!keywords.length) {
        throw new Error('Please provide search keywords.');
      }

      // Score all jobs based on keywords
      const scoredJobs = this.jobs.map(job => ({
        ...job,
        matchScore: this.calculateMatchScore(job, keywords)
      }));

      // Filter by location if provided
      let filteredJobs = scoredJobs;
      if (location) {
        const normalizedLocation = location.toLowerCase();
        filteredJobs = scoredJobs.filter(job => 
          job.location.toLowerCase().includes(normalizedLocation) ||
          job.location.toLowerCase() === 'remote' ||
          (normalizedLocation === 'remote' && job.location.toLowerCase().includes('remote'))
        );
      }

      // Sort by match score and recency
      filteredJobs.sort((a, b) => {
        // If match scores are significantly different, sort by match score
        if (Math.abs(b.matchScore - a.matchScore) > 15) {
          return b.matchScore - a.matchScore;
        }
        // If match scores are similar, consider recency
        const dateA = a.posted_date ? new Date(a.posted_date) : new Date(0);
        const dateB = b.posted_date ? new Date(b.posted_date) : new Date(0);
        return dateB.getTime() - dateA.getTime();
      });

      if (filteredJobs.length === 0) {
        return {
          data: [],
          error: 'No matching jobs found. Try broadening your search terms or location.'
        };
      }

      return { data: filteredJobs.slice(0, 20) };

    } catch (error: any) {
      console.error('Error searching jobs:', error);
      return {
        data: [],
        error: error.message || 'Failed to search jobs. Please try again.'
      };
    }
  }

  private calculateMatchScore(job: JobRecommendation, keywords: string[]): number {
    let score = 0;
    const searchTerms = keywords.map(k => k.toLowerCase());
    
    // Score based on keyword matches in title (highest weight)
    searchTerms.forEach(term => {
      if (job.title.toLowerCase().includes(term)) {
        score += 40;
      }
    });

    // Score based on skill matches (high weight)
    job.skills.forEach(skill => {
      if (searchTerms.some(term => skill.toLowerCase().includes(term))) {
        score += 30;
      }
    });

    // Score based on keyword matches in description (medium weight)
    searchTerms.forEach(term => {
      if (job.description.toLowerCase().includes(term)) {
        score += 20;
      }
    });

    // Score based on company name matches (low weight)
    searchTerms.forEach(term => {
      if (job.company.toLowerCase().includes(term)) {
        score += 10;
      }
    });

    // Bonus points for exact matches and art-related terms
    const artRelatedTerms = ['art', 'creative', 'design', 'artist', 'visual', 'gallery', 'museum', 'curator', 'exhibition'];
    searchTerms.forEach(term => {
      // Exact title match
      if (job.title.toLowerCase() === term) {
        score += 25;
      }
      // Exact skill match
      if (job.skills.some(skill => skill.toLowerCase() === term)) {
        score += 20;
      }
      // Art-related term bonus
      if (artRelatedTerms.includes(term)) {
        score += 15;
      }
    });

    return Math.min(100, score);
  }
} 