import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
} from '../services/auth.js';
import { ONE_DAY } from '../constants/index.js';
import { UsersCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_DAY),
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  setupSession(res, session);
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
export const updateAvatarController = async (req, res) => {
  const userId = req.user._id;
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  let avatarUrl;

  if (req.file) {
    avatarUrl = await saveFileToUploadDir(req.file);
  }

  await UsersCollection.findByIdAndUpdate(userId, { photo: avatarUrl });

  res.status(200).json({ message: 'Avatar updated successfully' });
};
export const getUserInfoController = async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    throw createHttpError(401, 'User not authenticated');
  }
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  res.status(200).json({
    status: 200,
    message: 'User info retrieved successfully',
    data: user,
  });
};
export const updateUserInfoController = async (req, res) => {
  const userId = req.user._id;
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const allowedFields = ['name', 'gender', 'dailyNorma'];
  const fieldsToUpdate = {};

  Object.keys(req.body).forEach((field) => {
    if (allowedFields.includes(field)) {
      fieldsToUpdate[field] = req.body[field];
    }
  });

  if (Object.keys(fieldsToUpdate).length === 0) {
    throw createHttpError(400, 'No valid fields to update');
  }

  const updatedUser = await UsersCollection.findByIdAndUpdate(
    userId,
    { $set: fieldsToUpdate },
    { new: true },
  );
  res.status(200).json({
    status: 200,
    message: 'User profile updated successfully',
    data: updatedUser,
  });
};
