const router = require('express').Router();
const { celebrate } = require('celebrate');
const { getCurrentUser, updateProfile, logOut } = require('../controllers/users');
const { isValidateUpdateProfile } = require('../middlewares/validation');

router.get('/me', getCurrentUser);
router.patch('/me', celebrate(isValidateUpdateProfile), updateProfile);
router.delete('/signout', logOut);

module.exports = router;
