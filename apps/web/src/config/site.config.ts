import { SiteConfig } from "@/types"

export const siteConfig: SiteConfig = {
  name: "Key Sprint",
  author: "aniketkuma-r",
  description:
    "keySprint is a multiplayer online browser-based typing game. allows people to race each-other by typing.",
  keywords: [
    "typescript",
    "websocket",
    "socket.io",
    "multiplayer",
    "typing",
    "game",
    "keysprint",
    "typeracer"
  ],
  url: {
    base: process.env.NEXT_PUBLIC_APP_URL!,
    author: "https://github.com/aniketkuma-r",
  },
  links: {
    github: "https://github.com/aniketkuma-r/keysprint",
  }
}