import { Client, Collection } from "discord.js";
import DistubePlayer from "distube";
import { AuroraClientOptions } from "./AuroraClientOptions";
import { Command } from "./Command";
import { SoundCloudPlugin } from "@distube/soundcloud";
import { SpotifyPlugin } from "@distube/spotify";
import { YtDlpPlugin } from "@distube/yt-dlp";
import * as Config from "../config.json";
import * as Package from "../package.json";
import { Functions } from "./Functions";
import { AuroraEventManager } from "./AuroraEventManager";
import { PrismaClient } from "@prisma/client";
import { SubCommand } from "./SubCommand";
import { AuroraLocaleManager } from "./AuroraLocaleManager";
import { AuroraTempManager } from "./AuroraTempManager";

export class AuroraClient extends Client<true> {
  interactions: Collection<string, Command | SubCommand> = new Collection();
  player: DistubePlayer;
  config: typeof Config;
  package: typeof Package;
  functions: Functions;
  db: PrismaClient;
  tempvoices: AuroraTempManager;
  locales: AuroraLocaleManager;

  constructor() {
    super(AuroraClientOptions);

    this.db = new PrismaClient();
    this.player = new DistubePlayer(this, {
      nsfw: false,
      emitNewSongOnly: true,
      plugins: [new YtDlpPlugin(), new SpotifyPlugin(), new SoundCloudPlugin()],
    });
    this.config = Config;
    this.package = Package;
    this.functions = new Functions(this);
    this.tempvoices = new AuroraTempManager(this);
    this.locales = new AuroraLocaleManager(this);
  }

  init() {
    this.tempvoices.init();
    this.locales.init();
    new AuroraEventManager(this).init();

    this.db.$connect();
    this.login(process.env["CLIENT_TOKEN"]);
  }
}
