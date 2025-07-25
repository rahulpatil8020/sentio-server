export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
  profileType?: string; // Optional: "STUDENT", "PROFESSIONAL", etc.
};

export type User = {
  name: string;
  email: string;
  password: string;
  profileType?: string; // Optional for future context like "STUDENT", "PROFESSIONAL"
  createdAt: Date;
};
