export interface Admin {
  _id: string;
  username: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuthResponse {
  token: string;
  admin: Admin;
}
