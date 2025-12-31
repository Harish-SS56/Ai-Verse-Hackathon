/**
 * MOCK API Service - No Backend Required
 * Simulates realistic AI responses for demo/recording
 */

const MOCK_MODE = true;
const mockProfiles: Record<string, any> = {};

// Simulate network delay
const mockDelay = (ms: number = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export interface UserProfile {
  user_id: string;
  email: string;
  full_name: string;
  career_level: string;
  skills: Skill[];
  education: Education[];
  career_interests: string[];
  target_roles: string[];
}

export interface Skill {
  name: string;
  category: string;
  proficiency_level: string;
}

export interface Education {
  degree: string;
  field_of_study: string;
  institution: string;
  graduation_year: number;
  grade?: string;
}

export interface ResumeParseResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface CareerAnalysisResponse {
  analysis: string;
  readiness_score: number;
  strengths: string[];
  areas_for_improvement: string[];
  recommended_actions: string[];
}

// Generate realistic AI analysis
const generateMockAnalysis = (profile: any): CareerAnalysisResponse => ({
  analysis: `Based on your comprehensive profile analysis powered by advanced AI, you demonstrate exceptional technical capabilities with a robust foundation in modern software development. Your expertise in ${profile.skills?.map((s: any) => s.name).join(', ')} positions you excellently for ${profile.target_roles?.join(' and ')} roles.

Your educational background in ${profile.education?.[0]?.field_of_study || 'Computer Science'} from ${profile.education?.[0]?.institution || 'University'} provides a strong theoretical foundation, complemented by practical skills. The strategic alignment of your career interests (${profile.career_interests?.join(', ')}) with current industry demands demonstrates forward-thinking career planning.

You're currently at the ${profile.career_level || 'mid-level'} stage, showing readiness for advancement. Your profile indicates strong potential for leadership roles, particularly in technical domains. With focused skill development and strategic networking, you're well-positioned to achieve your career objectives within the next 12-18 months.`,
  readiness_score: Math.floor(Math.random() * 15) + 75, // 75-90
  strengths: [
    `Exceptional proficiency in ${profile.skills?.[0]?.name || 'modern technologies'}`,
    "Strong educational foundation with relevant degree",
    "Clear career trajectory and well-defined goals",
    "Diverse skill set spanning multiple technical domains",
    "Demonstrated commitment to continuous learning",
    "Strategic thinking about career progression"
  ],
  areas_for_improvement: [
    "Expand leadership and team management capabilities",
    "Deepen expertise in system architecture and scalability",
    "Build more robust professional network in target industry",
    "Increase visibility through technical content creation"
  ],
  recommended_actions: [
    "Lead a high-impact project showcasing technical and leadership skills",
    "Contribute to 3-4 major open-source projects in your stack",
    "Obtain professional certifications in cloud platforms (AWS/GCP/Azure)",
    "Build a portfolio of 5 production-ready showcase projects",
    "Establish connections with senior engineers at target companies",
    "Start technical blogging or speaking at industry conferences",
    "Mentor 2-3 junior developers to build leadership experience",
    "Participate in hackathons and technical competitions"
  ]
});

// Generate realistic resume parse response
const generateResumeAnalysis = (filename: string) => ({
  success: true,
  message: "Resume parsed and analyzed successfully using AI",
  data: {
    profile: {
      full_name: "Alex Johnson",
      email: "alex.johnson@email.com",
      phone: "+1 (555) 123-4567",
      current_role: "Senior Software Engineer",
      years_of_experience: 5,
      summary: "Results-driven software engineer with 5+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud architectures.",
    },
    extracted_data: {
      skills: [
        { name: "React", category: "Frontend", proficiency_level: "expert", years: 4 },
        { name: "TypeScript", category: "Programming", proficiency_level: "advanced", years: 3 },
        { name: "Node.js", category: "Backend", proficiency_level: "advanced", years: 4 },
        { name: "Python", category: "Programming", proficiency_level: "intermediate", years: 2 },
        { name: "AWS", category: "Cloud", proficiency_level: "advanced", years: 3 },
        { name: "Docker", category: "DevOps", proficiency_level: "intermediate", years: 2 }
      ],
      experience: [
        {
          company: "Tech Innovations Inc.",
          role: "Senior Software Engineer",
          duration: "2022 - Present",
          achievements: [
            "Led development of microservices architecture serving 2M+ users",
            "Improved application performance by 40% through optimization",
            "Mentored team of 5 junior developers"
          ]
        },
        {
          company: "StartUp Solutions",
          role: "Full Stack Developer",
          duration: "2020 - 2022",
          achievements: [
            "Built React-based dashboard reducing customer onboarding time by 60%",
            "Implemented CI/CD pipeline reducing deployment time by 75%"
          ]
        }
      ],
      education: [
        {
          degree: "Bachelor of Science",
          field_of_study: "Computer Science",
          institution: "State University",
          graduation_year: 2019,
          grade: "3.8 GPA"
        }
      ],
      certifications: [
        "AWS Certified Solutions Architect",
        "Google Cloud Professional Developer"
      ]
    }
  }
});

// MOCK API implementation
export const agent1API = {
  // Create new user profile
  async createProfile(profile: Partial<UserProfile>): Promise<any> {
    await mockDelay(800);
    
    const newProfile = {
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    mockProfiles[profile.user_id!] = newProfile;
    
    return {
      success: true,
      message: "Profile created successfully",
      data: newProfile
    };
  },

  // Get user profile
  async getProfile(userId: string): Promise<any> {
    await mockDelay(400);
    
    if (mockProfiles[userId]) {
      return {
        success: true,
        data: mockProfiles[userId]
      };
    }
    
    throw new Error('Profile not found');
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<any> {
    await mockDelay(600);
    
    if (mockProfiles[userId]) {
      mockProfiles[userId] = {
        ...mockProfiles[userId],
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      return {
        success: true,
        message: "Profile updated successfully",
        data: mockProfiles[userId]
      };
    }
    
    throw new Error('Profile not found');
  },

  // Parse resume (MOCK)
  async parseResume(userId: string, file: File): Promise<ResumeParseResponse> {
    await mockDelay(2000); // Longer delay to simulate AI processing
    
    const resumeData = generateResumeAnalysis(file.name);
    
    // Update profile with resume data
    if (mockProfiles[userId]) {
      mockProfiles[userId] = {
        ...mockProfiles[userId],
        ...resumeData.data.profile,
        resume_uploaded: true,
        resume_filename: file.name,
        skills: resumeData.data.extracted_data.skills.map((s: any) => ({
          name: s.name,
          category: s.category,
          proficiency_level: s.proficiency_level
        })),
        experience: resumeData.data.extracted_data.experience,
        certifications: resumeData.data.extracted_data.certifications,
        updated_at: new Date().toISOString()
      };
    }
    
    return resumeData;
  },

  // Add GitHub profile (MOCK)
  async addGitHub(userId: string, githubUsername: string): Promise<any> {
    await mockDelay(1500);
    
    return {
      success: true,
      message: "GitHub profile analyzed successfully",
      data: {
        username: githubUsername,
        repos: 47,
        contributions: 1234,
        languages: ["JavaScript", "TypeScript", "Python", "Go"],
        analysis: {
          contribution_level: "high",
          code_quality: "excellent",
          project_diversity: "strong",
          consistency: "regular contributor"
        }
      }
    };
  },

  // Add LinkedIn profile (MOCK)
  async addLinkedIn(userId: string, linkedinUrl: string): Promise<any> {
    await mockDelay(1800);
    
    return {
      success: true,
      message: "LinkedIn profile analyzed successfully",
      data: {
        connections: 500,
        recommendations: 12,
        endorsements: 89,
        analysis: {
          network_strength: "strong",
          industry_presence: "established",
          engagement_level: "active"
        }
      }
    };
  },

  // Generate career analysis (MOCK)
  async generateAnalysis(userId: string): Promise<CareerAnalysisResponse> {
    await mockDelay(2500); // Longer delay to simulate AI processing
    
    const profile = mockProfiles[userId] || {
      career_level: "mid-level",
      skills: [{ name: "JavaScript", category: "Programming" }],
      education: [{ field_of_study: "Computer Science", institution: "University" }],
      career_interests: ["Software Development", "AI/ML"],
      target_roles: ["Senior Developer", "Tech Lead"]
    };
    
    return {
      success: true,
      message: "Career analysis completed",
      data: generateMockAnalysis(profile)
    };
  },

  // Health check (MOCK)
  async healthCheck(): Promise<any> {
    await mockDelay(200);
    
    return {
      status: "healthy",
      agent: "Agent 1: Career Profiling Agent (MOCK MODE)",
      ai_model: "Gemini 2.5 Flash Simulation",
      version: "1.0.0"
    };
  }
};
