// middleware/auth.js
export function requireAuth(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/auth/login');
  }
}