import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3001';
const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

class AuthService {
  private static instance: AuthService;
  private refreshTokenPromise: Promise<AuthResponse> | null = null;

  private constructor() {
    // Initialize axios interceptors
    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Get new tokens
            const tokens = await this.refreshTokens();
            
            // Update the original request with the new access token
            originalRequest.headers['Authorization'] = `Bearer ${tokens.access_token}`;
            
            // Retry the original request
            return axios(originalRequest);
          } catch (refreshError) {
            // If refresh fails, redirect to login
            this.logout();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Set initial Authorization header if access token exists
    const accessToken = this.getAccessToken();
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private getRefreshToken(): string | undefined {
    return Cookies.get(REFRESH_TOKEN_COOKIE);
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    // Set access token cookie (15 minutes expiration)
    Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, { 
      expires: 15 / (24 * 60), // 15 minutes in days
      path: '/',
      domain: 'localhost'
    });

    // Set refresh token cookie (7 days expiration)
    Cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
      expires: 7,
      path: '/',
      domain: 'localhost'
    });

    // Set Authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  private clearTokens(): void {
    Cookies.remove(ACCESS_TOKEN_COOKIE, { path: '/', domain: 'localhost' });
    Cookies.remove(REFRESH_TOKEN_COOKIE, { path: '/', domain: 'localhost' });
    delete axios.defaults.headers.common['Authorization'];
  }

  public async login(email: string, password: string): Promise<void> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      email,
      password,
    });

    const { access_token, refresh_token } = response.data;
    this.setTokens(access_token, refresh_token);
  }

  public async register(email: string, password: string): Promise<void> {
    await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
    });
  }

  public async refreshTokens(): Promise<AuthResponse> {
    // If there's already a refresh in progress, return that promise
    if (this.refreshTokenPromise) {
      return this.refreshTokenPromise;
    }

    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Create a new refresh promise
    this.refreshTokenPromise = axios
      .post<AuthResponse>(`${API_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      })
      .then((response) => {
        const { access_token, refresh_token } = response.data;
        this.setTokens(access_token, refresh_token);
        return response.data;
      })
      .finally(() => {
        this.refreshTokenPromise = null;
      });

    return this.refreshTokenPromise;
  }

  public async logout(): Promise<void> {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      try {
        await axios.post(`${API_URL}/auth/logout`, {
          refresh_token: refreshToken,
        });
      } catch (error) {
        // Silent fail on logout
      }
    }
    this.clearTokens();
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  public getAccessToken(): string | undefined {
    return Cookies.get(ACCESS_TOKEN_COOKIE);
  }
}

export const authService = AuthService.getInstance(); 