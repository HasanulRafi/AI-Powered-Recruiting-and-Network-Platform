// Type definitions
export interface SalaryBenchmark {
  min: number;
  max: number;
  median: number;
  marketTrend: 'up' | 'down' | 'stable';
  industryComparison: number;
}

export interface InterviewAnalysis {
  score: number;
  feedback: string[];
  improvements: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  icon: string;
  unlockedAt?: string;
}

// Enhanced AI responses and processing
export const generateJobDescription = (jobTitle: string, requirements: string[]): string => {
  const templates = [
    `We are seeking an exceptional ${jobTitle} to join our dynamic team. The ideal candidate will have demonstrated expertise in ${requirements.join(', ')}. This role offers an exciting opportunity to work on cutting-edge projects and make a significant impact on our organization's success.

Key Responsibilities:
• Lead and contribute to complex technical projects
• Collaborate with cross-functional teams to deliver high-quality solutions
• Mentor junior team members and share knowledge
• Stay current with industry trends and best practices

What We're Looking For:
${requirements.map(req => `• ${req}`).join('\n')}

We offer competitive compensation, excellent benefits, and opportunities for professional growth.`,

    `Join our innovative team as a ${jobTitle}. We're looking for a passionate professional with experience in ${requirements.join(', ')}. You'll be working on challenging problems and contributing to groundbreaking solutions.

Your Role:
• Drive technical excellence and innovation
• Participate in architectural decisions
• Implement best practices and standards
• Contribute to team success through collaboration

Required Qualifications:
${requirements.map(req => `• ${req}`).join('\n')}

We provide a supportive environment for professional development and work-life balance.`,

    `Outstanding opportunity for a talented ${jobTitle} to join our forward-thinking team. If you're skilled in ${requirements.join(', ')}, we want to hear from you. Help us shape the future of technology and make a lasting impact.

What You'll Do:
• Design and implement innovative solutions
• Collaborate with stakeholders across the organization
• Drive continuous improvement initiatives
• Contribute to technical strategy

Requirements:
${requirements.map(req => `• ${req}`).join('\n')}

We offer an inclusive workplace culture and opportunities for advancement.`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

export const matchJobToCandidate = (job: any, candidateSkills: string[]): number => {
  if (!job.requirements || !candidateSkills) return 0;
  
  const normalizedJobReqs = job.requirements.map((req: string) => req.toLowerCase());
  const normalizedSkills = candidateSkills.map(skill => skill.toLowerCase());
  
  let totalScore = 0;
  let matches = 0;
  let bonusPoints = 0;

  for (const req of normalizedJobReqs) {
    for (const skill of normalizedSkills) {
      if (req.includes(skill) || skill.includes(req)) {
        const matchScore = req === skill ? 1 : 0.5;
        totalScore += matchScore;
        matches++;
        break;
      }
    }
  }

  if (job.experience_level && candidateSkills.length > 5) {
    bonusPoints += 10;
  }

  const techKeywords = ['react', 'node', 'python', 'java', 'aws', 'azure', 'docker'];
  for (const skill of normalizedSkills) {
    if (techKeywords.includes(skill)) {
      bonusPoints += 5;
    }
  }

  const baseScore = (totalScore / normalizedJobReqs.length) * 100;
  const finalScore = Math.min(100, baseScore + bonusPoints);
  
  return Math.round(finalScore);
};

export const suggestSkills = (currentSkills: string[], jobTitle: string): string[] => {
  const skillSuggestions: Record<string, string[]> = {
    'developer': [
      'React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Git', 'REST APIs', 'GraphQL',
      'CI/CD', 'Microservices', 'System Design', 'Test-Driven Development',
      'Agile Methodologies', 'Cloud Architecture', 'Database Design'
    ],
    'designer': [
      'Figma', 'Adobe XD', 'UI/UX', 'Prototyping', 'User Research', 'Design Systems',
      'Wireframing', 'Visual Design', 'Interaction Design', 'User Testing',
      'Accessibility', 'Design Thinking', 'Motion Design'
    ],
    'manager': [
      'Agile', 'Scrum', 'Team Leadership', 'Strategic Planning', 'Stakeholder Management',
      'Risk Management', 'Budget Planning', 'Performance Management',
      'Change Management', 'Project Management', 'OKRs', 'Resource Planning'
    ]
  };

  const title = jobTitle.toLowerCase();
  let suggestions: string[] = [];
  
  Object.entries(skillSuggestions).forEach(([key, skills]) => {
    if (title.includes(key)) {
      suggestions = [...suggestions, ...skills.filter(skill => !currentSkills.includes(skill))];
    }
  });

  const generalSkills = [
    'Communication',
    'Problem Solving',
    'Collaboration',
    'Time Management',
    'Critical Thinking'
  ];
  suggestions = [...suggestions, ...generalSkills.filter(skill => !currentSkills.includes(skill))];

  return Array.from(new Set(suggestions))
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
};

export const generateCoverLetter = (jobTitle: string, company: string, experience: any[]): string => {
  const recentExperience = experience[0];
  const totalYears = experience.reduce((acc, exp) => {
    const start = new Date(exp.startDate);
    const end = exp.endDate ? new Date(exp.endDate) : new Date();
    return acc + (end.getFullYear() - start.getFullYear());
  }, 0);

  const templates = [
    `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${company}. With ${totalYears} years of relevant experience, including my current role as ${recentExperience?.title} at ${recentExperience?.company}, I am confident in my ability to make significant contributions to your team.

Throughout my career, I have developed expertise in ${recentExperience?.description}. My experience aligns perfectly with the requirements of this role, and I am particularly drawn to ${company}'s commitment to innovation and excellence in the industry.

Thank you for considering my application. I look forward to discussing how I can contribute to ${company}'s continued success.

Best regards`,

    `Dear ${company} Hiring Team,

I am thrilled to apply for the ${jobTitle} position at ${company}. As a seasoned professional with ${totalYears} years of experience in the field, currently serving as ${recentExperience?.title} at ${recentExperience?.company}, I am eager to bring my expertise to your organization.

What particularly excites me about this opportunity is ${company}'s reputation for innovation and commitment to excellence. My background in ${recentExperience?.description} aligns perfectly with the requirements of this role.

I look forward to discussing how my skills and experience can benefit ${company}.

Best regards`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
};

export const analyzeProfile = (profile: any): string[] => {
  const suggestions = [];
  
  if (!profile.headline || profile.headline.length < 10) {
    suggestions.push('Add a professional headline to increase profile visibility');
  }
  
  if (!profile.bio || profile.bio.length < 100) {
    suggestions.push('Expand your bio to better showcase your experience and career goals');
  }
  
  if (!profile.skills || profile.skills.length < 5) {
    suggestions.push('Add more relevant skills to improve job matching');
  }
  
  if (!profile.experience || profile.experience.length === 0) {
    suggestions.push('Add your work experience to demonstrate your professional journey');
  }

  return suggestions;
};

export const extractSkillsFromResume = async (text: string): Promise<string[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const skillCategories = {
    technical: [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Azure',
      'SQL', 'Git', 'Docker', 'Kubernetes', 'Machine Learning'
    ],
    soft: [
      'Leadership', 'Communication', 'Problem Solving', 'Team Collaboration',
      'Project Management', 'Time Management', 'Critical Thinking'
    ]
  };

  let extractedSkills: string[] = [];

  Object.values(skillCategories).forEach(categorySkills => {
    const found = categorySkills.filter(skill =>
      text.toLowerCase().includes(skill.toLowerCase())
    );
    extractedSkills = [...extractedSkills, ...found];
  });

  return Array.from(new Set(extractedSkills))
    .sort(() => Math.random() - 0.5)
    .slice(0, 12);
};

export const generateInterviewQuestions = (jobTitle: string, skills: string[]): string[] => {
  const questions = [
    `Can you describe a challenging project where you used ${skills[0]}?`,
    `How do you stay current with the latest developments in ${jobTitle}?`,
    `Tell me about a time you had to learn a new technology quickly.`,
    `How do you handle disagreements with team members?`,
    `What's your approach to debugging complex issues?`
  ];
  return questions;
};

export const analyzeMockInterviewResponse = (response: string): InterviewAnalysis => {
  const analysis: InterviewAnalysis = {
    score: Math.floor(Math.random() * 30) + 70, // Simulated score between 70-100
    feedback: [
      'Clear communication style',
      'Good use of specific examples',
      'Demonstrated problem-solving skills'
    ],
    improvements: [
      'Could provide more quantitative results',
      'Consider using the STAR method more explicitly'
    ]
  };
  return analysis;
};

export const getSalaryBenchmarks = (title: string, location: string, years: number): SalaryBenchmark => {
  const baseRange = {
    'developer': { min: 70000, max: 150000 },
    'designer': { min: 60000, max: 130000 },
    'manager': { min: 90000, max: 180000 }
  };

  const defaultRange = { min: 50000, max: 120000 };
  const range = Object.entries(baseRange).find(([key]) => 
    title.toLowerCase().includes(key)
  )?.[1] || defaultRange;

  const locationMultiplier = location.toLowerCase().includes('san francisco') ? 1.5 :
                           location.toLowerCase().includes('new york') ? 1.4 :
                           1.0;

  const experienceMultiplier = Math.min(1 + (years * 0.1), 2);

  return {
    min: Math.round(range.min * locationMultiplier * experienceMultiplier),
    max: Math.round(range.max * locationMultiplier * experienceMultiplier),
    median: Math.round((range.min + range.max) / 2 * locationMultiplier * experienceMultiplier),
    marketTrend: Math.random() > 0.5 ? 'up' : 'stable',
    industryComparison: Math.floor(Math.random() * 30) + 70
  };
};

export const checkAchievements = (profile: any): Achievement[] => {
  const achievements: Achievement[] = [];

  if (profile.skills?.length >= 5) {
    achievements.push({
      id: 'skill-collector',
      title: 'Skill Collector',
      description: 'Added 5 or more skills to your profile',
      points: 100,
      icon: 'award',
      unlockedAt: new Date().toISOString()
    });
  }

  if (profile.experience?.length >= 2) {
    achievements.push({
      id: 'experienced',
      title: 'Experienced Professional',
      description: 'Added multiple work experiences',
      points: 150,
      icon: 'briefcase',
      unlockedAt: new Date().toISOString()
    });
  }

  return achievements;
};

export const calculateLevel = (points: number): { level: number; title: string; progress: number } => {
  const levels = [
    { threshold: 0, title: 'Newcomer' },
    { threshold: 100, title: 'Rising Star' },
    { threshold: 300, title: 'Professional' },
    { threshold: 600, title: 'Expert' },
    { threshold: 1000, title: 'Master' }
  ];

  let level = 1;
  let currentTitle = levels[0].title;
  let progress = 0;

  for (let i = 1; i < levels.length; i++) {
    if (points >= levels[i].threshold) {
      level = i + 1;
      currentTitle = levels[i].title;
    } else {
      const prevThreshold = levels[i - 1].threshold;
      const nextThreshold = levels[i].threshold;
      progress = ((points - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
      break;
    }
  }

  return {
    level,
    title: currentTitle,
    progress: Math.min(100, Math.max(0, progress))
  };
};