import passport from "passport";
import type { VerifyCallback } from "passport-google-oauth20";
import type { Profile } from "passport";

import {
  Strategy,
} from "passport-google-oauth20";

passport.use(
  new Strategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID!,
      clientSecret:
        process.env.GOOGLE_SECRET!,
      callbackURL:
        "/api/auth/google/callback",
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      return done(
        null,
        profile
      );
    }
  )
);