import { Router } from 'express';
import User from '../models/user';
const router = new Router();

router.get('/', async (req, res, next) => {
  try {
    let users = await User.find({});
    res.status(200).send({
      retcode: 0,
      title: '用户列表',
      users: users
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:_id', async (req, res, next) => {
  try {
    const _id = req.params._id;
    const user = await User.findOne({_id: _id});
    res.status(200).send({
      retcode: 0,
      title: '用户',
      user: user
    });
  } catch (err) {
    next(err);
  }
});


export default router;

