export interface userData {
  name?: string;
  email: string;
  password: string;
  role?: string;
}

export interface userResponse {
  token: string;
  user: userData;
}
