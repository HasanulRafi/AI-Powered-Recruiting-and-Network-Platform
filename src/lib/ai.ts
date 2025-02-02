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

export interface JobRecommendation {
  title: string;
  company: string;
  description: string;
  matchScore: number;
  skills: string[];
  location: string;
  salary: string;
  url?: string;
  posted_date?: string;
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
  // Role-specific technical questions based on job title and skills
  const technicalQuestions = {
    'software': [
      `Can you explain how you would implement a scalable system using ${skills[0] || 'modern technologies'}?`,
      `What's your experience with ${skills[1] || 'software development'} and how have you used it in a challenging project?`,
      `How would you optimize a system that's experiencing ${skills[2] ? `performance issues with ${skills[2]}` : 'performance bottlenecks'}?`,
      `Describe your approach to testing and quality assurance when working with ${skills[3] || 'complex systems'}?`,
      `How do you stay updated with the latest developments in ${skills[4] || 'technology'} and implement them in your work?`
    ],
    'data': [
      `How would you handle a large dataset using ${skills[0] || 'data processing tools'}?`,
      `Explain your approach to data cleaning and preprocessing when working with ${skills[1] || 'raw data'}?`,
      `What metrics would you use to evaluate a ${skills[2] || 'machine learning'} model's performance?`,
      `How would you optimize a query that's performing slowly in ${skills[3] || 'a database'}?`,
      `Describe a data pipeline you've built using ${skills[4] || 'modern tools'}?`
    ],
    'frontend': [
      `How do you ensure responsive design when working with ${skills[0] || 'frontend frameworks'}?`,
      `What's your approach to state management in ${skills[1] || 'modern web applications'}?`,
      `How do you optimize performance in applications built with ${skills[2] || 'JavaScript frameworks'}?`,
      `Describe your experience with ${skills[3] || 'UI/UX design principles'}?`,
      `How do you handle cross-browser compatibility issues when using ${skills[4] || 'modern CSS features'}?`
    ]
  };

  // Behavioral questions tailored to experience level and role
  const behavioralQuestions = [
    'Tell me about a time when you had to learn a new technology quickly. What was your approach?',
    'Describe a situation where you had to work with a difficult team member. How did you handle it?',
    "Give an example of a project that didn't go as planned. What did you learn from it?",
    'How do you handle competing priorities and deadlines?',
    'Tell me about a time you had to explain a complex technical concept to a non-technical stakeholder.'
  ];

  // Leadership and project management questions
  const leadershipQuestions = [
    'How do you approach mentoring junior team members?',
    'Describe a situation where you had to lead a project without formal authority.',
    'How do you handle team conflicts and ensure project progress?',
    'Tell me about a time you had to make a difficult technical decision that impacted the team.',
    'How do you promote knowledge sharing and best practices within your team?'
  ];

  // Problem-solving scenarios
  const problemSolvingQuestions = [
    'How would you debug a production issue with limited information?',
    'Describe your approach to making architectural decisions when faced with uncertainty.',
    'How do you handle technical debt in a fast-paced environment?',
    'Tell me about a time you had to make a trade-off between perfect code and meeting deadlines.',
    'How do you approach learning new technologies while maintaining productivity?'
  ];

  // Select questions based on job title and skills
  let relevantQuestions: string[] = [];
  const normalizedTitle = jobTitle.toLowerCase();

  if (normalizedTitle.includes('software') || normalizedTitle.includes('developer') || normalizedTitle.includes('engineer')) {
    relevantQuestions = [...technicalQuestions.software];
  } else if (normalizedTitle.includes('data') || normalizedTitle.includes('analyst') || normalizedTitle.includes('scientist')) {
    relevantQuestions = [...technicalQuestions.data];
  } else if (normalizedTitle.includes('frontend') || normalizedTitle.includes('ui') || normalizedTitle.includes('web')) {
    relevantQuestions = [...technicalQuestions.frontend];
  }

  // Add behavioral questions based on experience level
  if (normalizedTitle.includes('senior') || normalizedTitle.includes('lead') || normalizedTitle.includes('architect')) {
    relevantQuestions = [...relevantQuestions, ...leadershipQuestions];
  }

  // Always include some behavioral and problem-solving questions
  relevantQuestions = [
    ...relevantQuestions,
    ...behavioralQuestions,
    ...problemSolvingQuestions
  ];

  // Randomly select questions but ensure a mix of different types
  return relevantQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .map(question => question.trim());
};

export const analyzeMockInterviewResponse = (response: string): InterviewAnalysis => {
  // Keywords and phrases to look for
  const positiveIndicators = [
    'specific example',
    'result',
    'impact',
    'learned',
    'improved',
    'team',
    'success',
    'solved',
    'achieved',
    'collaborated'
  ];

  const improvementIndicators = [
    'maybe',
    'probably',
    'kind of',
    'sort of',
    'like',
    'um',
    'uh',
    'you know'
  ];

  const starMethodIndicators = {
    situation: ['when', 'while', 'during', 'at', 'in'],
    task: ['needed to', 'had to', 'responsible for', 'assigned to'],
    action: ['i', 'we', 'implemented', 'developed', 'created', 'led', 'managed'],
    result: ['resulted in', 'achieved', 'improved', 'increased', 'reduced', 'saved']
  };

  // Calculate scores
  const responseWords = response.toLowerCase().split(' ');
  let score = 0; // Start with 0 instead of 70
  let feedback: string[] = [];
  let improvements: string[] = [];

  // Base score based on response length
  if (response.length < 10) {
    score = 0;
    improvements.push('Response is too short. Please provide a complete answer.');
  } else if (response.length < 50) {
    score = 20;
    improvements.push('Response is very brief. Consider providing more details.');
  } else if (response.length < 100) {
    score = 40;
    improvements.push('Response could be more detailed.');
  } else if (response.length < 200) {
    score = 60;
  } else {
    score = 70;
    feedback.push('Good response length with detailed explanation');
  }

  // Check for positive indicators
  positiveIndicators.forEach(indicator => {
    if (response.toLowerCase().includes(indicator)) {
      score += 3;
      if (score > 100) score = 100;
    }
  });

  // Check for improvement indicators
  improvementIndicators.forEach(indicator => {
    if (response.toLowerCase().includes(indicator)) {
      score -= 2;
      if (score < 0) score = 0;
    }
  });

  // Analyze STAR method usage
  let starScore = 0;
  Object.entries(starMethodIndicators).forEach(([category, indicators]) => {
    const hasCategory = indicators.some(indicator => 
      response.toLowerCase().includes(indicator)
    );
    if (hasCategory) {
      starScore++;
      score += 5; // Bonus points for using STAR method
      if (score > 100) score = 100;
    }
  });

  // Generate feedback and improvements
  if (starScore >= 3) {
    feedback.push('Excellent use of the STAR method');
  } else {
    improvements.push('Consider structuring your response using the STAR method (Situation, Task, Action, Result)');
  }

  if (response.length > 200) {
    feedback.push('Provided detailed and comprehensive response');
  }

  if (positiveIndicators.some(indicator => response.toLowerCase().includes(indicator))) {
    feedback.push('Good use of specific examples and achievements');
  } else {
    improvements.push('Include specific examples and quantifiable results');
  }

  // Ensure at least one feedback and improvement point
  if (feedback.length === 0) {
    feedback.push('Clear communication style');
  }
  if (improvements.length === 0) {
    improvements.push('Consider adding more context to your responses');
  }

  return {
    score: Math.round(score),
    feedback,
    improvements
  };
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

export const generateJobRecommendations = async (skills: string[]): Promise<JobRecommendation[]> => {
  // Simulated job database
  const availableJobs: JobRecommendation[] = [
    {
      title: "Full Stack Developer",
      company: "TechCorp",
      description: "Looking for a skilled developer with experience in modern web technologies.",
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      location: "New York, NY",
      salary: "$100,000 - $150,000",
      matchScore: 0
    },
    {
      title: "Frontend Engineer",
      company: "WebSolutions",
      description: "Join our team to build beautiful and responsive web applications.",
      skills: ["React", "JavaScript", "CSS", "UI/UX"],
      location: "San Francisco, CA",
      salary: "$120,000 - $180,000",
      matchScore: 0
    },
    {
      title: "Backend Developer",
      company: "DataTech",
      description: "Build scalable backend services and APIs.",
      skills: ["Node.js", "Python", "SQL", "AWS"],
      location: "Austin, TX",
      salary: "$90,000 - $140,000",
      matchScore: 0
    },
    {
      title: "DevOps Engineer",
      company: "CloudSys",
      description: "Manage and improve our cloud infrastructure.",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      location: "Seattle, WA",
      salary: "$130,000 - $190,000",
      matchScore: 0
    },
    {
      title: "Machine Learning Engineer",
      company: "AI Solutions",
      description: "Develop and deploy machine learning models.",
      skills: ["Python", "Machine Learning", "TensorFlow", "Data Science"],
      location: "Boston, MA",
      salary: "$140,000 - $200,000",
      matchScore: 0
    }
  ];

  // Calculate match scores for each job
  const recommendedJobs = availableJobs.map(job => ({
    ...job,
    matchScore: matchJobToCandidate({ requirements: job.skills }, skills)
  }));

  // Sort by match score and return top matches
  return recommendedJobs
    .sort((a, b) => b.matchScore - a.matchScore)
    .filter(job => job.matchScore > 30)
    .slice(0, 3);
};