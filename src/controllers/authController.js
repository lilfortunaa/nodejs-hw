
import createHttpError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcrypt';
import {createSession, setSessionCookies} from '../services/auth.js';
import { Session } from "../models/session.js";

export const registerUser = async (req, res, next) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(createHttpError(400, 'Email in use'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashedPassword,
  });

  const newSession = await createSession(newUser._id);

  setSessionCookies(res, newSession);

  res.status(201).json(newUser);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(401, 'User not found');
  }

  const hashedPassword = await bcrypt.compare(password, existingUser.password);
  if(!hashedPassword) {
    throw createHttpError(401, 'Invalid credentials');
  }

   await Session.deleteOne({ userId: existingUser._id });
  const newSession = await createSession(existingUser._id);

  setSessionCookies(res, newSession);

  res.status(201).json({existingUser});
};

export const refreshUserSession = async (req,res) => {
  const session = await session.findOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookie.refreshToken,
  });

  if(!session){
    throw createHttpError(401, 'Session not found');
  }

  const isRefreshTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
  if(isRefreshTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await session.deleteOne({
    _id: req.cookies.sessionId,
    refreshToken: req.cookie.refreshToken,
  });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    message: 'Session refreshed',
  });
};

export const logoutUser = async (req, res) => {
  const {sessionId} = req.cookies;

  if(sessionId) {
    await Session.deleteOne({_id:sessionId});
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};
