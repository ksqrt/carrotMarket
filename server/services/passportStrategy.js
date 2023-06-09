const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/User');
const KAKAO_ID = require('../config/config');

module.exports = () => {
    passport.use(new KakaoStrategy({
        clientID: KAKAO_ID,
        callbackURL: '/auth/kakao/callback'
    }, async(accessToken, refreshToken, profile, done) => {
        console.log('kakao profile', profile);
        try { 
            const exUser = await User.findOne({
                // where: {snsId: profile.id, provider: 'kakao'},
                where: {
                    email: profile._json?.kakao_account?.email, 
                    name: profile.id
                },
            });
            if(exUser){
                done(null, exUser);
            } else{
                const newUser = await User.create({
                    email: profile._json?.kakao_account?.email,
                    //nick: profile.displayName,
                    name: profile.id,
                    //provider: 'kakao'
                });
                done(null, newUser);
            }
        } catch(error){
            console.error(error);
            done(error);
        }
    }));
}