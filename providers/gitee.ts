export default function Gitee(config: any): any {
  const baseUrl = config?.enterprise?.baseUrl ?? "https://gitee.com";
  const apiBaseUrl = config?.enterprise?.baseUrl
    ? `${config?.enterprise?.baseUrl}/api/v5`
    : "https://gitee.com/api/v5";

  return {
    id: "gitee",
    name: "Gitee",
    type: "oauth",
    authorization: {
      url: `${baseUrl}/oauth/authorize`,
      params: { scope: "" },
    },
    token: {
      url: `${baseUrl}/oauth/token`,
      params: {
        grant_type: "authorization_code",
      },
    },
    userinfo: {
      url: `${apiBaseUrl}/user`,
      async request({ tokens, provider }: any) {
        const profile = await fetch(provider.userinfo?.url as URL, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "User-Agent": "authjs",
          },
        }).then(async (res) => await res.json());

        if (!profile.email) {
          const res = await fetch(`${apiBaseUrl}/user/emails`, {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              "User-Agent": "authjs",
            },
          });

          if (res.ok) {
            const emails: any[] = await res.json();
            profile.email = (emails.find((e) => e.primary) ?? emails[0]).email;
          }
        }

        return profile;
      },
    },
    profile(profile: any) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email ?? "",
        image: profile.avatar_url,
      };
    },
    style: { bg: "#24292f", text: "#fff" },
    options: config,
  };
}
