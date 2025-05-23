import { PassportStrategy } from '@nestjs/passport';
import {
  Strategy,
  StrategyOptions,
  VerifyCallback,
} from 'passport-google-oauth20';
import { Inject, Injectable } from '@nestjs/common';
import googleOauthConfig from 'config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '@modules/auth/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfiguration: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfiguration.clientId,
      clientSecret: googleConfiguration.clientSecret,
      callbackURL: googleConfiguration.callbackURL,
      scope: ['email', 'profile'],
      passReqToCallback: false, // Добавлено, чтобы соответствовать StrategyOptions
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log(`email: ${profile.emails[0].value}`);
    const user = await this.authService.validateGoogleUser({
      email: profile.emails[0].value,
      password: '',
      oauth_provider: 'google',
      oauth_id: profile.id,
    });
    done(null, user);
  }
}
