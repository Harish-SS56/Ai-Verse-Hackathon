/**
 * API Service for Agent 1 - Career Profiling Agent
 * Connects to FastAPI backend at http://localhost:8000
 */

const API_BASE_URL = 'http://localhost:8000/api';

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

// Agent 1: Career Profiling API
export const agent1API = {
  // Create new user profile
  async createProfile(profile: Partial<UserProfile>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/agent1/profile/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create profile');
    }
    
    return response.json();
  },

  // Get user profile
  async getProfile(userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/agent1/profile/${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get profile');
    }
    
    return response.json();
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/agent1/profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return response.json();
  },

  // Parse resume
  async parseResume(userId: string, file: File): Promise<ResumeParseResponse> {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('user_id', userId);

    const response = await fetch(`${API_BASE_URL}/agent1/profile/parse-resume`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to parse resume');
    }
    
    return response.json();
  },

  // Add GitHub profile analysis
  async addGitHub(userId: string, githubUsername: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/agent1/profile/add-github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        github_username: githubUsername,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add GitHub profile');
    }
    
    return response.json();
  },

  // Add LinkedIn profile analysis
  async addLinkedIn(userId: string, linkedinUrl: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/agent1/profile/add-linkedin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        linkedin_url: linkedinUrl,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add LinkedIn profile');
    }
    
    return response.json();
  },

  // Generate career analysis
  async generateAnalysis(userId: string): Promise<CareerAnalysisResponse> {
    const response = await fetch(`${API_BASE_URL}/agent1/profile/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate analysis');
    }
    
    return response.json();
  },

  // Health check
  async healthCheck(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/agent1/health`);
    
    if (!response.ok) {
      throw new Error('Backend not responding');
    }
    
    return response.json();
  },
};

// Export default API object
export default {
  agent1: agent1API,
};
