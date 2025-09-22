// Unit Management Types for CasaLink
// Enhanced types for property unit management with Malaysian naming schemes

export interface PropertyConfiguration {
  id: string
  condo_id: string
  blocks: number
  floors_per_block: number
  units_per_floor: number
  unit_types: {
    residential?: boolean
    commercial?: boolean
    parking?: boolean
    storage?: boolean
    [key: string]: boolean | undefined
  }
  naming_scheme: NamingScheme
  excluded_units: string[]
  special_floors: {
    penthouse?: number[]
    mechanical?: number[]
    parking?: number[]
    [key: string]: number[] | undefined
  }
  created_at: string
  updated_at: string
}

export interface NamingScheme {
  type: 'standard' | 'tower' | 'block' | 'custom'
  format?: string
  separator?: string
  padding?: {
    floor?: number
    unit?: number
  }
  prefix?: string
  suffix?: string
}

export interface Unit {
  id: string
  condo_id: string
  unit_number: string
  block_number?: string
  floor_number?: number
  tower?: string
  unit_type: 'residential' | 'commercial' | 'parking' | 'storage' | 'other'
  resident_id?: string
  excluded: boolean
  naming_scheme?: NamingScheme
  resident_emails: string[]
  notes?: string
  status: 'occupied' | 'vacant' | 'maintenance'
  created_at: string
  updated_at: string
}

export interface PropertyManager {
  id: string
  condo_id: string
  user_id: string
  role: 'manager' | 'security' | 'admin'
  permissions: {
    manage_units?: boolean
    manage_residents?: boolean
    manage_visitors?: boolean
    view_analytics?: boolean
    manage_settings?: boolean
    [key: string]: boolean | undefined
  }
  is_active: boolean
  assigned_at: string
  created_at: string
  updated_at: string
  user?: {
    id: string
    name: string
    email: string
    phone?: string
    avatar_url?: string
  }
}

export interface UnitResident {
  id: string
  unit_id: string
  email: string
  name?: string
  phone?: string
  is_primary: boolean
  is_active: boolean
  invited_at?: string
  accepted_at?: string
  created_at: string
  updated_at: string
  unit?: {
    id: string
    unit_number: string
    condo_id: string
  }
}

export interface UnitGenerationRequest {
  condo_id: string
  blocks: number
  floors_per_block: number
  units_per_floor: number
  unit_types: {
    residential?: boolean
    commercial?: boolean
    parking?: boolean
    storage?: boolean
  }
  naming_scheme: NamingScheme
  excluded_units?: string[]
  special_floors?: {
    penthouse?: number[]
    mechanical?: number[]
    parking?: number[]
  }
}

export interface UnitGridCell {
  unit_number: string
  block_number?: string
  floor_number?: number
  unit_type: string
  excluded: boolean
  status: 'occupied' | 'vacant' | 'maintenance'
  resident_count: number
  has_residents: boolean
}

export interface UnitGridData {
  blocks: {
    [blockName: string]: {
      floors: {
        [floorNumber: string]: UnitGridCell[]
      }
    }
  }
  total_units: number
  excluded_units: number
  occupied_units: number
  vacant_units: number
}

export interface ManagerAssignmentRequest {
  condo_id: string
  user_email: string
  role: 'manager' | 'security' | 'admin'
  permissions: {
    manage_units?: boolean
    manage_residents?: boolean
    manage_visitors?: boolean
    view_analytics?: boolean
    manage_settings?: boolean
  }
}

export interface ResidentLinkingRequest {
  unit_id: string
  emails: string[]
  primary_email?: string
}

// Malaysian Property Naming Scheme Templates
export const MALAYSIAN_NAMING_SCHEMES = {
  standard: {
    type: 'standard' as const,
    format: 'Block-Floor-Unit',
    separator: '-',
    padding: { floor: 2, unit: 2 }
  },
  tower: {
    type: 'tower' as const,
    format: 'Tower-X-Floor-Unit',
    separator: '-',
    padding: { floor: 2, unit: 2 }
  },
  apartment: {
    type: 'standard' as const,
    format: 'BlockFloorUnit',
    separator: '',
    padding: { floor: 2, unit: 2 }
  },
  commercial: {
    type: 'standard' as const,
    format: 'Level-Unit',
    separator: '-',
    padding: { floor: 2, unit: 2 }
  }
} as const

export type MalaysianNamingScheme = keyof typeof MALAYSIAN_NAMING_SCHEMES

// Unit Type Configuration
export const UNIT_TYPES = {
  residential: {
    label: 'Residential',
    description: 'Standard residential units',
    default: true
  },
  commercial: {
    label: 'Commercial',
    description: 'Office and retail spaces',
    default: false
  },
  parking: {
    label: 'Parking',
    description: 'Car park spaces',
    default: false
  },
  storage: {
    label: 'Storage',
    description: 'Storage units',
    default: false
  }
} as const

export type UnitType = keyof typeof UNIT_TYPES
