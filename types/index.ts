// User and Authentication Types
export interface User {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "owner" | "staff" | "trainer";
  is_active: boolean;
  email_verified_at?: string;
  tenant: Tenant;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  logo?: string;
  subscription_plan: "starter" | "pro";
  subscription_status: "trial" | "active" | "past_due" | "canceled" | "expired";
  trial_ends_at?: string;
  subscription_ends_at?: string;
  max_members: number;
  max_trainers: number;
  max_classes: number;
  settings?: any;
  created_at: string;
  updated_at: string;
}

// Member Types
export interface Member {
  id: string;
  tenant_id: string;
  membership_plan_id?: string;
  member_number: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
  phone: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  emergency_contact?: string;
  medical_notes?: string;
  photo?: string;
  status: "active" | "expired" | "frozen" | "suspended";
  membership_start_date?: string;
  membership_end_date?: string;
  frozen_until?: string;
  qr_code: string;
  membership_plan?: MembershipPlan;
  created_at: string;
  updated_at: string;
}

export interface MembershipPlan {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  price: number;
  billing_period: "monthly" | "quarterly" | "yearly";
  duration_days: number;
  includes_classes: boolean;
  class_credits?: number;
  includes_personal_training: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Class Types
export interface Class {
  id: string;
  tenant_id: string;
  trainer_id?: string;
  name: string;
  description?: string;
  type:
    | "yoga"
    | "pilates"
    | "spinning"
    | "crossfit"
    | "zumba"
    | "hiit"
    | "boxing"
    | "other";
  max_capacity: number;
  duration_minutes: number;
  date: string;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
  recurrence_pattern?: any;
  status: "scheduled" | "ongoing" | "completed" | "canceled";
  notes?: string;
  trainer?: User;
  bookings?: ClassBooking[];
  created_at: string;
  updated_at: string;
}

export interface ClassBooking {
  id: string;
  class_id: string;
  member_id: string;
  status: "booked" | "attended" | "no_show" | "canceled";
  booked_at: string;
  attended_at?: string;
  canceled_at?: string;
  cancellation_reason?: string;
  member?: Member;
  class?: Class;
  created_at: string;
  updated_at: string;
}

// Attendance Types
export interface AttendanceRecord {
  id: string;
  tenant_id: string;
  member_id: string;
  checked_in_by?: string;
  date: string;
  check_in_time: string;
  check_out_time?: string;
  check_in_method: "qr_code" | "manual" | "card";
  notes?: string;
  member?: Member;
  checked_in_by_user?: User;
  created_at: string;
  updated_at: string;
}

// Transaction Types
export interface MembershipTransaction {
  id: string;
  tenant_id: string;
  member_id: string;
  membership_plan_id: string;
  processed_by?: string;
  transaction_number: string;
  amount: number;
  type: "new" | "renewal" | "upgrade" | "downgrade";
  payment_method: "cash" | "card" | "transfer" | "online";
  status: "pending" | "completed" | "failed" | "refunded";
  start_date: string;
  end_date: string;
  notes?: string;
  metadata?: any;
  member?: Member;
  membership_plan?: MembershipPlan;
  processed_by_user?: User;
  created_at: string;
  updated_at: string;
}

// Dashboard Types
export interface DashboardStats {
  members: {
    total: number;
    active: number;
    new_this_month: number;
    expiring_soon: number;
  };
  attendance: {
    today: number;
  };
  revenue: {
    this_month: number;
  };
  subscription: {
    plan: string;
    status: string;
    ends_at?: string;
    is_trial: boolean;
  };
}

export interface RevenueData {
  period: "day" | "week" | "month" | "year";
  data: Array<{
    [key: string]: number;
    total: number;
  }>;
  total: number;
}

export interface AttendanceTrends {
  daily_trends: Array<{
    date: string;
    count: number;
  }>;
  peak_hours: Array<{
    hour: number;
    count: number;
  }>;
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  token_type: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  exception?: string;
  file?: string;
  line?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev?: string;
    next?: string;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

// Form Types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  gym_name: string;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface MemberForm {
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  date_of_birth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  emergency_contact?: string;
  medical_notes?: string;
}

export interface ClassForm {
  name: string;
  description?: string;
  type:
    | "yoga"
    | "pilates"
    | "spinning"
    | "crossfit"
    | "zumba"
    | "hiit"
    | "boxing"
    | "other";
  trainer_id?: string;
  max_capacity: number;
  duration_minutes: number;
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface MembershipPurchaseForm {
  membership_plan_id: string;
  payment_method: "cash" | "card" | "transfer" | "online";
  start_date?: string;
  notes?: string;
}
