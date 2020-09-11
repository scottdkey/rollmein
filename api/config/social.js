const {
  AMAZON_CID,
  AMAZON_CS,
  GITHUB_CID,
  GITHUB_CS,
  FACEBOOK_CID,
  FACEBOOK_CS,
  GOOGLE_CID,
  GOOGLE_CS,
  INSTAGRAM_CID,
  INSTAGRAM_CS,
  SPOTIFY_CID,
  SPOTIFY_CS,
  TWITCH_CID,
  TWITCH_CD,
} = process.env;

export const AMAZON = {
  clientID: AMAZON_CID,
  clientSecret: AMAZON_CS,
};
export const GITHUB = {
  clientID: GITHUB_CID,
  clientSecret: GITHUB_CS,
};
export const FACEBOOK = {
  clientID: FACEBOOK_CID,
  clientSecret: FACEBOOK_CS,
};
export const GOOGLE = {
  clientID: GOOGLE_CID,
  clientSecret: GOOGLE_CS,
};
export const INSTAGRAM = {
  clientID: INSTAGRAM_CID,
  clientSecret: INSTAGRAM_CS,
};
export const SPOTIFY = {
  clientID: SPOTIFY_CID,
  clientSecret: SPOTIFY_CS,
};
export const TWITCH = {
  clientID: TWITCH_CID,
  clientSecret: TWITCH_CD,
};
