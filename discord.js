const { Client, GatewayIntentBits, Events } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// members
// 1084332850087743538 : 쪼댕
// 268011265220280320 : 신비하리
// tags
// [ '신비하리#1803', '쪼댕#7395', 'GeonHoBot#1355' ]

module.exports.login = async (readyCallback, messageCallback) => {
  client.on(Events.ClientReady, async () => {
    if (readyCallback) readyCallback(client);
  });

  client.on(Events.MessageCreate, (message) => {
    if (messageCallback) messageCallback(message);
  });

  await client.login(process.env.DISCORD_BOT_TOKEN);
};

module.exports.send = (sendData, callback) => {
  client.channels.cache
    .get(process.env.DISCORD_CHANNEL_ID)
    .send(sendData)
    .then(async (res) => {
      if (callback) callback(res);
    });
};

module.exports.deleteMsg = async (id, callback) => {
  await client.channels
    .fetch(process.env.DISCORD_CHANNEL_ID)
    .then((channel) => {
      channel.messages.delete(id);
      if (callback) callback();
    })
    .catch(console.error);
};
