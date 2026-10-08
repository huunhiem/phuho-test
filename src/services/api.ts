const API_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  status?: number;
}

async function request<T = any>(
  action: string,
  method: 'GET' | 'POST' = 'GET',
  payload: Record<string, any> = {}
): Promise<ApiResponse<T>> {

  if (!API_URL) {
    throw new Error(
      'Chua c?u hình VITE_APPS_SCRIPT_URL trên Vercel.'
    );
  }

  let response: Response;

  if (method === 'GET') {
    const params = new URLSearchParams();

    params.set('action', action);

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    });

    response = await fetch(
      `${API_URL}?${params.toString()}`,
      {
        method: 'GET',
        redirect: 'follow'
      }
    );
  } else {
    response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify({
        action,
        ...payload
      }),
      redirect: 'follow'
    });
  }

  const text = await response.text();

  let result: ApiResponse<T>;

  try {
    result = JSON.parse(text);
  } catch {
    console.error('API RAW RESPONSE:', text);

    throw new Error(
      'Google Apps Script không tr? v? JSON h?p l?.'
    );
  }

  if (!response.ok) {
    throw new Error(
      result.error ||
      result.message ||
      `API HTTP ${response.status}`
    );
  }

  return result;
}

export const LMSApi = {

  async login(username: string, password: string) {
    const result = await request<{
      authenticated: boolean;
      user: any;
    }>(
      'login',
      'POST',
      {
        username: username.trim(),
        password
      }
    );

    if (!result.success) {
      throw new Error(
        result.error ||
        'Tên dang nh?p ho?c m?t kh?u không chính xác!'
      );
    }

    if (
      !result.data?.authenticated ||
      !result.data?.user
    ) {
      throw new Error(
        'Tên dang nh?p ho?c m?t kh?u không chính xác!'
      );
    }

    return result.data.user;
  },

  async getUsers() {
    const result = await request<any[]>(
      'getUsers',
      'GET'
    );

    if (!result.success) {
      throw new Error(
        result.error ||
        'Không th? t?i danh sách tài kho?n.'
      );
    }

    return result.data || [];
  },

  async getStudents() {
    const result = await request<any[]>(
      'getStudents',
      'GET'
    );

    if (!result.success) {
      throw new Error(
        result.error ||
        'Không th? t?i danh sách h?c sinh.'
      );
    }

    return result.data || [];
  },

  async getClasses() {
    const result = await request<any[]>(
      'getClasses',
      'GET'
    );

    if (!result.success) {
      throw new Error(
        result.error ||
        'Không th? t?i danh sách l?p.'
      );
    }

    return result.data || [];
  },

  async getQuestions() {
    const result = await request<any[]>(
      'getQuestions',
      'GET'
    );

    if (!result.success) {
      throw new Error(
        result.error ||
        'Không th? t?i ngân hàng câu h?i.'
      );
    }

    return result.data || [];
  },

  async getExams() {
    const result = await request<any[]>(
      'getExams',
      'GET'
    );

    if (!result.success) {
      throw new Error(
        result.error ||
        'Không th? t?i danh sách d? thi.'
      );
    }

    return result.data || [];
  },

  async getSubmissions() {
    const result = await request<any[]>(
      'getSubmissions',
      'GET'
    );

    if (!result.success) {
      throw new Error(
        result.error ||
        'Không th? t?i bài n?p.'
      );
    }

    return result.data || [];
  },

  async addSubmission(submission: any) {
    return request(
      'addSubmission',
      'POST',
      submission
    );
  }
};