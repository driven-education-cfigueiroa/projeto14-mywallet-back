import { Router } from 'express';
import * as mw from '../middlewares/index.js';
import * as ct from '../controllers/index.js';

const router = Router();

router.post('/signup', mw.signUp, ct.signUp);
router.post('/signin', mw.signIn, ct.signIn);

router.use(mw.token);
router.post('/entries', mw.entry, ct.createEntry);
router.get('/entries', ct.findEntries);

export default router;
