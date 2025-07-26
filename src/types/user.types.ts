export type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  name: string;
  email: string;
  password: string;
  isOnboarded: boolean;
  createdAt: Date;
};
