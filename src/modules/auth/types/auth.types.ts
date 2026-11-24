export type User = {
  id: string;
  email: string;
  approved: boolean;
  roles: string[];
  profile_id: string;
  user_metadata?: { display_name?: string };
};

export type LoginResponse = {
  user: User;
  session: { access_token: string };
};
