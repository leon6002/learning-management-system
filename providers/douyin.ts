import { TokenSet } from "@auth/core/types";
import type { OAuthConfig, OAuthUserConfig } from "@auth/core/providers";

export interface DouyinProfile extends Record<string, any> {
  data: {
    /**
     * The unique identification of the user in the current application.Open id
     * for the client.
     *
     * To return this field, add `fields=open_id` in the user profile request's query parameter.
     */
    open_id: string;
    /**
     * The unique identification of the user across different apps for the same developer.
     * For example, if a partner has X number of clients,
     * it will get X number of open_id for the same TikTok user,
     * but one persistent union_id for the particular user.
     *
     * To return this field, add `fields=union_id` in the user profile request's query parameter.
     */
    union_id?: string;
    /**
     * User's profile image.
     *
     * To return this field, add `fields=avatar_url` in the user profile request's query parameter.
     */
    avatar: string;

    nickname: string;
  };
  error: {
    /**
     * The error category in string.
     */
    code: string;
    /**
     * The error message in string.
     */
    message: string;
    /**
     * The error message in string.
     */
    log_id: string;
  };
}

export default function Douyin<P extends DouyinProfile>(
  options: OAuthUserConfig<P>,
): any {
  const baseUrl = "https://open.douyin.com";
  const apiBaseUrl = "https://open.douyin.com";

  return {
    id: "dy",
    name: "Douyin",
    type: "oauth",
    authorization: {
      url: `${baseUrl}/platform/oauth/connect/`,
      params: {
        scope: "user_info",
        client_key: options.clientId,
      },
      response_type: "code",
    },
    token: {
      url: `${baseUrl}/oauth/access_token`,

      async request({ params, provider }: any) {
        const res = await fetch(`${baseUrl}/oauth/access_token`, {
          method: "POST",
          headers: {
            "Cache-Control": "no-cache",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_key: provider.clientId!,
            client_secret: provider.clientSecret!,
            code: params.code!,
            grant_type: "authorization_code",
            redirect_uri: provider.callbackUrl!,
          }),
        }).then((res) => res.json());
        console.log("access_token: ", res);
        const tokens: TokenSet = {
          access_token: res.access_token,
          expires_at: res.expires_in,
          refresh_token: res.refresh_token,
          scope: res.scope,
          id_token: res.open_id,
          session_state: res.open_id,
        };
        return {
          tokens,
        };
      },
    },

    userinfo: {
      url: `${apiBaseUrl}/oauth/userinfo`,
      async request({ tokens, provider }: any) {
        const formData = new URLSearchParams();
        formData.append("open_id", tokens.open_id);
        formData.append("access_token", tokens.access_token);
        console.log({
          "start request, open_id": tokens.open_id,
          access_token: tokens.access_token,
        });
        const profile = await fetch(provider.userinfo?.url as URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "User-Agent": "authjs",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData,
        }).then(async (res) => await res.json());
        console.log("user request complete, profile is: ", profile);

        return profile;
      },
    },
    profile(profile: any) {
      profile = profile.data;
      return {
        id: profile.open_id,
        name: profile.nickname,
        image: profile.avatar,
        email: `${profile.open_id}@noemail.com`,
      };
    },
    style: { bg: "#24292f", text: "#fff" },
    options,
  };
}
