const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/User');
const KAKAO_ID = require('../config/config');
const mongoose = require('mongoose');

module.exports = () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try {
          const exUser = await User.findOne({
            $or: [
              { email: profile._json?.kakao_account?.email },
              { name: profile.id },
            ],
          });

          if (exUser) {
            done(null, exUser);
          } else {
            const newUser = await User.create({
              email: profile._json?.kakao_account?.email,
              name: profile.id,
            });

            done(null, newUser);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      }
    )
  );
};
