 export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
 
 
 // ===== CORE CLIENT (INTERNAL) =====
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';

const getToken = (): string | null => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).token : null;
  } catch {
    return null;
  }
};

// ✅ FIXED: requireAuth parameter controls token injection
const fetchWithRetry = async <T>(
  endpoint: string,
  options: RequestInit = {},
  maxRetries = 3,
  delay = 1000,
  requireAuth = true  // 👈 NEW: Controls token injection
): Promise<ApiResponse<T>> => {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();

  // 👇 BUILD HEADERS WITH PROPER TOKEN LOGIC
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };

  if (requireAuth && token) {
    headers['auth-token'] = token;  // ✅ ADD TOKEN for auth-required APIs
  }
  // Public APIs (auth=false) skip token completely

  const config: RequestInit = {
    ...options,
    headers: { ...headers, ...options.headers },  // Merge custom headers last
  };

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, config);
      const data = await res.json();

      if (res.ok && data?.success !== false) {
        return { success: true, data: data.data || data };
      }
      return { success: false, error: data?.message || `HTTP ${res.status}` };
    } catch (error: any) {
      console.warn(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        return { success: false, error: error.message || 'Request failed' };
      }
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  return { success: false, error: 'Max retries exceeded' };
};

 
 
export const AiChat = (query:string,history:any): Promise<ApiResponse> =>
  fetchWithRetry('/api/v1/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ query ,history})
  }, 1, 1000,true);