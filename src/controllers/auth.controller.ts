import { Request, Response } from "express";
import * as authService from "../services/user.service";
import { AuthError } from "../utils/errors/errors";

export const signup = async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: { user },
  });
};

export const login = async (req: Request, res: Response) => {
  const { accessToken, refreshToken, user } = await authService.loginUser(
    req.body.email,
    req.body.password
  );

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: { accessToken, refreshToken, user },
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  if (!req.body.refreshToken) {
    throw new AuthError("Refresh token is required");
  }

  const newAccessToken = authService.refreshAccessToken(req.body.refreshToken);

  res.status(200).json({
    success: true,
    message: "Access token refreshed successfully",
    data: { accessToken: newAccessToken },
  });
};

export const logout = async (_req: Request, res: Response) => {
  // For mobile, logout is client-side: delete tokens from storage
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};
