// Mock Supabase Client for testing without real Supabase connection
// This allows us to test the app functionality even without proper Supabase setup

interface MockSupabaseResponse<T> {
  data: T | null;
  error: any;
}

class MockSupabaseClient {
  private mockData: any = {
    users: [],
    personas: [],
    conversations: [],
    messages: [],
    favorites: [],
    badges: [
      {
        id: 'badge-1',
        name: '첫 대화',
        description: '첫 번째 대화를 완료했습니다',
        icon: '💬',
        category: '대화',
        rarity: 'Common',
        criteria: { type: 'first_conversation' },
        created_at: new Date().toISOString()
      },
      {
        id: 'badge-2',
        name: '열정적인 학습자',
        description: '일주일 연속으로 대화를 완료했습니다',
        icon: '🔥',
        category: '성장',
        rarity: 'Rare',
        criteria: { type: 'consecutive_days', days: 7 },
        created_at: new Date().toISOString()
      }
    ],
    user_badges: [],
    performance_records: [],
    notifications: [],
    user_settings: [],
    learning_goals: [],
    styling_requests: []
  };

  from(table: string) {
    return {
      select: (columns?: string) => this.select(table, columns),
      insert: (data: any) => this.insert(table, data),
      update: (data: any) => this.update(table, data),
      delete: () => this.delete(table),
      eq: (column: string, value: any) => this.eq(column, value),
      single: () => this.single(),
      order: (column: string, options?: any) => this.order(column, options),
      limit: (count: number) => this.limit(count),
      gte: (column: string, value: any) => this.gte(column, value),
      lte: (column: string, value: any) => this.lte(column, value),
      not: (column: string, operator: string, value?: any) => this.not(column, operator, value),
      or: (condition: string) => this.or(condition),
      upsert: (data: any, options?: any) => this.upsert(table, data, options)
    };
  }

  private select(table: string, columns?: string): any {
    return {
      data: this.mockData[table] || [],
      error: null,
      eq: (column: string, value: any) => this.eq(column, value),
      single: () => this.single(),
      order: (column: string, options?: any) => this.order(column, options),
      limit: (count: number) => this.limit(count),
      gte: (column: string, value: any) => this.gte(column, value),
      lte: (column: string, value: any) => this.lte(column, value),
      not: (column: string, operator: string, value?: any) => this.not(column, operator, value),
      or: (condition: string) => this.or(condition)
    };
  }

  private insert(table: string, data: any): any {
    const newData = Array.isArray(data) ? data : [data];
    const insertedData = newData.map(item => ({
      id: `mock-${table}-${Date.now()}-${Math.random()}`,
      ...item,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    if (!this.mockData[table]) {
      this.mockData[table] = [];
    }
    this.mockData[table].push(...insertedData);

    return {
      data: insertedData.length === 1 ? insertedData[0] : insertedData,
      error: null,
      single: () => ({ data: insertedData[0], error: null })
    };
  }

  private update(table: string, data: any): any {
    return {
      data: { ...data, updated_at: new Date().toISOString() },
      error: null,
      eq: (column: string, value: any) => this.eq(column, value),
      single: () => this.single()
    };
  }

  private delete(table: string): any {
    return {
      error: null,
      eq: (column: string, value: any) => this.eq(column, value)
    };
  }

  private eq(column: string, value: any): any {
    return {
      data: [],
      error: null,
      single: () => this.single(),
      order: (column: string, options?: any) => this.order(column, options),
      limit: (count: number) => this.limit(count),
      gte: (column: string, value: any) => this.gte(column, value),
      lte: (column: string, value: any) => this.lte(column, value),
      not: (column: string, operator: string, value?: any) => this.not(column, operator, value),
      or: (condition: string) => this.or(condition),
      upsert: (data: any, options?: any) => this.upsert('', data, options)
    };
  }

  private single(): any {
    return {
      data: null,
      error: { code: 'PGRST116', message: 'No rows returned' }
    };
  }

  private order(column: string, options?: any): any {
    return {
      data: [],
      error: null,
      limit: (count: number) => this.limit(count)
    };
  }

  private limit(count: number): any {
    return {
      data: [],
      error: null
    };
  }

  private gte(column: string, value: any): any {
    return {
      data: [],
      error: null,
      lte: (column: string, value: any) => this.lte(column, value),
      not: (column: string, operator: string, value?: any) => this.not(column, operator, value)
    };
  }

  private lte(column: string, value: any): any {
    return {
      data: [],
      error: null,
      not: (column: string, operator: string, value?: any) => this.not(column, operator, value)
    };
  }

  private not(column: string, operator: string, value?: any): any {
    return {
      data: [],
      error: null
    };
  }

  private or(condition: string): any {
    return {
      data: [],
      error: null,
      order: (column: string, options?: any) => this.order(column, options)
    };
  }

  private upsert(table: string, data: any, options?: any): any {
    return {
      data: Array.isArray(data) ? data : [data],
      error: null,
      select: () => this.select(table),
      single: () => this.single()
    };
  }

  // Mock auth methods
  auth = {
    getSession: () => Promise.resolve({
      data: { session: null },
      error: null
    }),
    signUp: (credentials: any) => Promise.resolve({
      data: { user: { id: 'mock-user-id' }, session: null },
      error: null
    }),
    signInWithPassword: (credentials: any) => Promise.resolve({
      data: { user: { id: 'mock-user-id' }, session: null },
      error: null
    }),
    signOut: () => Promise.resolve({ error: null })
  };
}

// Export mock client
export const supabase = new MockSupabaseClient() as any;

// Mock environment variables
if (typeof window !== 'undefined') {
  (window as any).mockSupabase = true;
  console.log('🧪 Using Mock Supabase Client for testing');
} 