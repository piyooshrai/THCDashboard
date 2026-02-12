import type { LoginResponse, RegisterData, UserProfile } from './authService';

// Mock users database
const MOCK_USERS = {
  admin: {
    id: 'admin-001',
    email: 'admin@test.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    phone: '+1234567890',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  client: {
    id: 'client-001',
    email: 'client@test.com',
    password: 'client123',
    firstName: 'Client',
    lastName: 'User',
    role: 'client',
    phone: '+1234567891',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  va: {
    id: 'va-001',
    email: 'va@test.com',
    password: 'va123',
    firstName: 'Virtual',
    lastName: 'Assistant',
    role: 'va',
    phone: '+1234567892',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

const generateMockToken = (userId: string): string => {
  return `mock-token-${userId}-${Date.now()}`;
};

export const mockAuthService = {
  /**
   * Mock login - checks credentials against test users
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find matching user
    const user = Object.values(MOCK_USERS).find(
      u => u.email === email && u.password === password
    );

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password: _, ...userWithoutPassword } = user;
    const accessToken = generateMockToken(user.id);
    const refreshToken = generateMockToken(`${user.id}-refresh`);

    // Store in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('demoMode', 'true');

    return {
      success: true,
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  },

  /**
   * Mock register - creates a new test user
   */
  async register(data: RegisterData): Promise<LoginResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newUser = {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      phone: data.phone,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const accessToken = generateMockToken(newUser.id);
    const refreshToken = generateMockToken(`${newUser.id}-refresh`);

    // Store in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    localStorage.setItem('demoMode', 'true');

    return {
      success: true,
      user: newUser,
      accessToken,
      refreshToken,
    };
  },

  /**
   * Mock logout
   */
  async logout(): Promise<void> {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('demoMode');
  },

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<{ user: UserProfile }> {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Not authenticated');
    }
    return { user: JSON.parse(userStr) };
  },

  /**
   * Mock refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      throw new Error('Not authenticated');
    }
    const user = JSON.parse(userStr);
    const accessToken = generateMockToken(user.id);
    localStorage.setItem('accessToken', accessToken);
    return { accessToken };
  },

  /**
   * Get current user from local storage
   */
  getCurrentUserFromStorage(): UserProfile | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  },
};

// Helper to check if in demo mode
export const isDemoMode = (): boolean => {
  return import.meta.env.VITE_DEMO_MODE === 'true' || localStorage.getItem('demoMode') === 'true';
};

// Export test credentials for easy reference
export const TEST_CREDENTIALS = {
  admin: { email: 'admin@test.com', password: 'admin123' },
  client: { email: 'client@test.com', password: 'client123' },
  va: { email: 'va@test.com', password: 'va123' },
};
