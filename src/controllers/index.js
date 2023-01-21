import bcrypt from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import { handleError } from '../utils/index.js';
import * as coll from '../configs/index.js';

export const signUp = async (_req, res) => {
  const user = res.locals.user;
  const passwordHash = bcrypt.hashSync(user.password, 10);
  try {
    await coll.users.insertOne({ ...user, password: passwordHash });
    res.sendStatus(201);
  } catch (error) {
    handleError(error, res);
  }
};

export const signIn = async (_req, res) => {
  const user = res.locals.user;
  const token = uuidV4();
  try {
    await coll.sessions.deleteOne({ userId: user._id });
    await coll.sessions.insertOne({ token, userId: user._id });
    res.send({ token });
  } catch (error) {
    handleError(error, res);
  }
};

export const createEntry = async (_req, res) => {
  const entry = res.locals.entry;
  try {
    await coll.entries.insertOne(entry);
    res.sendStatus(201);
  } catch (error) {
    handleError(error, res);
  }
};

export const findEntries = async (_req, res) => {
  const user = res.locals.user;
  try {
    const entries = await coll.entries.find({ user: user._id }).toArray();
    delete user.password;
    res.send({ entries, user });
  } catch (error) {
    handleError(error, res);
  }
};
