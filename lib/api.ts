import { supabase, type Condominium, type User, type Amenity, type Visitor, type Booking, type CommunityPost } from './supabase'

// Condominiums
export const condominiumsApi = {
  async getAll(): Promise<Condominium[]> {
    const { data, error } = await supabase.from('condominiums').select('*')
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Condominium | null> {
    const { data, error } = await supabase.from('condominiums').select('*').eq('id', id).single()
    if (error) throw error
    return data
  }
}

// Users
export const usersApi = {
  async getByCondo(condoId: string): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*').eq('condo_id', condoId)
    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },

  async create(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const { data, error } = await supabase.from('users').insert([user]).select().single()
    if (error) throw error
    return data
  }
}

// Amenities
export const amenitiesApi = {
  async getByCondo(condoId: string): Promise<Amenity[]> {
    const { data, error } = await supabase.from('amenities').select('*').eq('condo_id', condoId)
    if (error) throw error
    return data || []
  },

  async create(amenity: Omit<Amenity, 'id' | 'created_at'>): Promise<Amenity> {
    const { data, error } = await supabase.from('amenities').insert([amenity]).select().single()
    if (error) throw error
    return data
  }
}

// Visitors
export const visitorsApi = {
  async getByCondo(condoId: string): Promise<Visitor[]> {
    const { data, error } = await supabase.from('visitors').select('*').eq('condo_id', condoId)
    if (error) throw error
    return data || []
  },

  async create(visitor: Omit<Visitor, 'id' | 'created_at'>): Promise<Visitor> {
    const { data, error } = await supabase.from('visitors').insert([visitor]).select().single()
    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: string): Promise<Visitor> {
    const { data, error } = await supabase.from('visitors').update({ status }).eq('id', id).select().single()
    if (error) throw error
    return data
  }
}

// Bookings
export const bookingsApi = {
  async getByCondo(condoId: string): Promise<Booking[]> {
    const { data, error } = await supabase.from('bookings').select('*').eq('condo_id', condoId)
    if (error) throw error
    return data || []
  },

  async create(booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> {
    const { data, error } = await supabase.from('bookings').insert([booking]).select().single()
    if (error) throw error
    return data
  }
}

// Community Posts
export const communityApi = {
  async getByCondo(condoId: string): Promise<CommunityPost[]> {
    const { data, error } = await supabase.from('community_posts').select('*').eq('condo_id', condoId).order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },

  async create(post: Omit<CommunityPost, 'id' | 'created_at'>): Promise<CommunityPost> {
    const { data, error } = await supabase.from('community_posts').insert([post]).select().single()
    if (error) throw error
    return data
  }
}
