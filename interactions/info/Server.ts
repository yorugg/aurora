import { ChannelType } from "discord.js";
import { AuroraClient } from "../../structures/AuroraClient";
import { SubCommand } from "../../structures/SubCommand";

export default class ServerCommand extends SubCommand {
  constructor(client: AuroraClient) {
    super(client, {
      name: "server",
      topName: "info",
      description: "Get the info about this server",
    });
  }
  async execute(interaction, l) {
    const guild = interaction.guild;
    const serverOwner = await guild.fetchOwner();

    interaction.reply({
      content: interaction.client.functions.reply(
        l("commands:info:server:reply", {
          server: `**${interaction.client.functions.md(guild.name)}**`,
        }),
        ":white_check_mark:"
      ),
      embeds: [
        interaction.client.functions
          .embed(interaction)
          .setThumbnail(guild.iconURL())
          .addFields([
            {
              name: l("commands:info:server:fields:common_info:name"),
              value: `
${l("commands:info:server:fields:common_info:id", { id: `${guild.id}` })}
${l("commands:info:server:fields:common_info:created_by", {
  user: `${serverOwner.user}`,
})}
${l("commands:info:server:fields:common_info:created_at", {
  timestamp: `${interaction.client.functions.formatTime(
    guild.createdTimestamp,
    "R"
  )}
${l("commands:info:server:fields:common_info:boost_count", {
  boosts: `${guild.premiumSubscriptionCount}`,
  level: `${l(`misc:boost_levels:${guild.premiumTier}`)}`,
})}`,
})}
        `,
            },
            {
              name: l("commands:info:server:fields:members:name"),
              value: `
${l("commands:info:server:fields:members:total", {
  total: `${guild.members.cache.size}`,
})}
${l("commands:info:server:fields:members:humans", {
  humans: `${guild.members.cache.filter((m) => !m.user.bot).size}`,
})}
${l("commands:info:server:fields:members:bots", {
  bots: `${guild.members.cache.filter((m) => m.user.bot).size}`,
})}
          `,
              inline: true,
            },
            {
              name: l("commands:info:server:fields:channels:name"),
              value: `
${l("commands:info:server:fields:channels:total", {
  total: `${
    guild.channels.cache.filter((c) => c.type !== ChannelType.GuildCategory)
      .size
  }`,
})}
${l("commands:info:server:fields:channels:text", {
  text: `${
    guild.channels.cache.filter((c) => c.type === ChannelType.GuildText).size
  }`,
})}
${l("commands:info:server:fields:channels:voice", {
  voice: `${
    guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size
  }`,
})}
${l("commands:info:server:fields:channels:stages", {
  stages: `${
    guild.channels.cache.filter((c) => c.type === ChannelType.GuildStageVoice)
      .size
  }`,
})}
${l("commands:info:server:fields:channels:forums", {
  forums: `${
    guild.channels.cache.filter((c) => c.type === ChannelType.GuildForum).size
  }`,
})}
    `,
              inline: true,
            },
          ])
          .setImage(
            guild.bannerURL({
              size: 2048,
              extension: "png",
            })
          ),
      ],
    });
  }
}
