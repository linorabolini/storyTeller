export const AUTH_CONFIG = {
  domain: "loumine.eu.auth0.com",
  clientID: "GfHlPF5oP9B5rOhYE59eR0822jhNh4Jw",
  redirectUri:
    window.location.href.indexOf("localhost") > 0
      ? "http://localhost:3000/callback"
      : "http://collabStory.github.io/callback"
};
