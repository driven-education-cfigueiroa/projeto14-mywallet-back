import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { handleError } from '../utils/index.js';
import * as coll from '../configs/index.js';
import * as sch from '../schemas/index.js';

export const signUp = async (req, res, next) => {
  const user = req.body;
  const { error } = sch.signUp.validate(user, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }
  const userExists = await coll.users.findOne({ email: user.email });
  if (userExists) return res.sendStatus(409);
  delete user.confirmPassword;
  res.locals.user = user;
  next();
};

export const signIn = async (req, res, next) => {
  const user = req.body;
  const { error } = sch.signIn.validate(user, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }
  const { email, password } = user;
  try {
    const user = await coll.users.findOne({ email });
    if (!user) return res.sendStatus(401);
    const passwordOk = bcrypt.compareSync(password, user.password);
    if (!passwordOk) return res.sendStatus(401);
    res.locals.user = user;
  } catch (error) {
    handleError(error, res);
  }
  next();
};

export const token = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization?.replace('Bearer ', '');
  if (!token) return res.sendStatus(401);
  try {
    const session = await coll.sessions.findOne({ token });
    if (!session) return res.sendStatus(401);
    const user = await coll.users.findOne({ _id: session?.userId });
    if (!user) return res.sendStatus(401);
    res.locals.user = user;
  } catch (error) {
    handleError(error, res);
  }
  next();
};

export const entry = (req, res, next) => {
  const { value, description, operation } = req.body;
  const user = res.locals.user;
  const entry = {
    value,
    description,
    operation,
    user: user._id,
    date: dayjs().format('DD/MM'),
  };
  const { error } = sch.entry.validate(entry, { abortEarly: false });
  if (error) {
    const errors = error.details.map((detail) => detail.message);
    return res.status(400).send(errors);
  }
  res.locals.entry = entry;
  next();
};
