/**
 * Interface for the payload used to create a new user.
 */
export interface CreateUserPayload {
  name: string;
  email: string;
  phone_number: string;
  password: string; 
  bio: string;
  date_of_birth: string;
  user_type: number;
  status: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}