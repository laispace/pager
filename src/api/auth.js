import { Router } from 'express';
const router = new Router();
import passport from 'passport';

router.get('/check/login', async (req, res, next) => {
  res.status(200).send({
    retcode: 0,
    user: req.user,
    isAuthenticated: req.isAuthenticated()
  });
});

// github login
router.get('/login/github', passport.authenticate('github'));

// github login redirect
router.get('/login/github/callback', passport.authenticate('github', {successRedirect: '/#/projects', failureRedirect: '/login'}));

// logout
router.get('/logout', async (req, res, next) => {
  req.logout();
  res.redirect('/#/login');
});

router.get('/profile', async (req, res, next) => {
  //require('connect-ensure-login').ensureLoggedIn()
  //res.render('profile', { user: req.user });
});

export default router;

