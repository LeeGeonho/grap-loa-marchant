const cron = require("node-cron");
const axios = require("axios");
const stringTable = require("string-table");
const moment = require("moment");

const { Client, GatewayIntentBits, Events } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});
const DISCORD_BOT_TOKEN =
  "MTA5MjY1MDkzOTc1Nzg5MTY4OA.G7pE2n.0bjJ-eiXditDypOs80bpCCWD1x-wjc2bmgzyJc";
const DISCORD_CHANNEL_ID = "1092670894452789318";

const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot("6047039008:AAFqVyYN2e74dNO0Zb1reIYDdoyesdNIkbM");
const TELEGRAM_CLIENT_ID = "5302097517";

const MESSAGE_BUCKET = [];
const notify = [
  {
    server: 3,
    type: 1,
  },
  {
    card: "다이나웨일 카드",
    type: 2,
  },
  {
    card: "앙케 카드",
    type: 2,
  },
  {
    card: "알비온 카드",
    type: 2,
  },
  {
    card: "아르노 카드",
    type: 2,
  },
  {
    card: "영원의 아크 카양겔 카드",
    type: 2,
  },
  {
    card: "칼테이야 카드",
    type: 2,
  },
  {
    card: "파이어혼 카드",
    type: 2,
  },
  {
    card: "베히모스 카드",
    type: 2,
  },
  {
    card: "그노시스 카드",
    type: 2,
  },
  {
    card: "뮨 히다카 카드",
    type: 2,
  },
  {
    card: "별자리 큰뱀 카드",
    type: 2,
  },
  {
    card: "라하르트 카드",
    type: 2,
  },
  {
    card: "라자람 카드",
    type: 2,
  },
  {
    card: "칼리나리 네리아 카드",
    type: 2,
  },
  {
    card: "아이작 카드",
    type: 2,
  },
  {
    card: "에버그레이스 카드",
    type: 2,
  },
  {
    card: "진 매드닉 카드",
    type: 2,
  },
  {
    card: "자크라 카드",
    type: 2,
  },
  {
    card: "웨이 카드",
    type: 2,
  },
  {
    card: "모카모카 카드",
    type: 2,
  },
  {
    card: "세헤라데 카드",
    type: 2,
  },
  {
    card: "케이사르 카드",
    type: 2,
  },
  {
    card: "유클리드 카드",
    type: 2,
  },
  {
    card: "하늘 고래 카드",
    type: 2,
  },
  {
    card: "어린 아만 카드",
    type: 2,
  },
  {
    card: "마리우 카드",
    type: 2,
  },
  {
    card: "칼도르 카드",
    type: 2,
  },
  {
    card: "티엔 카드",
    type: 2,
  },
  {
    card: "키르케 카드",
    type: 2,
  },
  {
    card: "하눈 카드",
    type: 2,
  },
  {
    card: "라카이서스 카드",
    type: 2,
  },
  {
    card: "오스피어 카드",
    type: 2,
  },
  {
    card: "사일러스 카드",
    type: 2,
  },
  {
    card: "프리우나 카드",
    type: 2,
  },
  {
    card: "카인 카드",
    type: 2,
  },
  {
    card: "클라우디아 카드",
    type: 2,
  },
  {
    card: "피엘라 카드",
    type: 2,
  },
  {
    card: "천둥날개 카드",
    type: 2,
  },
  {
    card: "디오게네스 카드",
    type: 2,
  },
  {
    card: "다르시 카드",
    type: 2,
  },
  {
    card: "벨루마테 카드",
    type: 2,
  },
  {
    card: "라우리엘 카드",
    type: 2,
  },
  {
    card: "바스키아 카드",
    type: 2,
  },
  {
    card: "마레가 카드",
    type: 2,
  },
  {
    card: "아자키엘 카드",
    type: 2,
  },
  {
    card: "바르칸 카드",
    type: 2,
  },
  {
    extra: "오징어",
    type: 4,
  },
  {
    extra: "안정된 연성 촉매",
    type: 4,
  },
];

const getMerchants = async () => {
  const result = await axios.get(
    "https://api.korlark.com/merchants?limit=15&server=3"
  );

  if (result.status !== 200 || !result.data) {
    console.log("korlark api error. see the error log");
    console.error(result);
    return;
  }

  const now = moment();
  const message = [];

  for (const merchant of result.data.merchants) {
    if (
      moment.duration(now.diff(moment(merchant.created_at + "Z"))).asMinutes() <
      20
    ) {
      const card = notify.find((item) => item.card === merchant.card);
      const extra = notify.find((item) => item.extra === merchant.extra);

      if (card || extra) {
        message.push({
          continent: merchant.continent,
          zone: merchant.zone,
          card: merchant.card,
          extra: merchant.extra || "없음",
        });
      }
    }
  }
  if (message.length <= 0) {
    console.log("merchants empty. skip...");
    return;
  }

  const table = stringTable.create(message, { capitalizeHeaders: true });
  // console.log(table);

  // 1. [Telegram] send message -------------------
  // const msgResult = await bot.sendMessage(TELEGRAM_CLIENT_ID, table);
  // PREV_MESSAGE_ID = msgResult.message_id;
  // await deleteMessage(msgResult.message_id);
  // --------------------------------------------------
  // 2. [Discord] send message --------------------
  let imageUrls = [];
  for (const msg of message) {
    imageUrls.push(
      `https://cdn.korlark.com/images/merchant/maps/${
        msg.continent
      }/${msg.zone.replaceAll(" ", "_")}.png`
    );
  }

  await client.channels.cache
    .get(DISCORD_CHANNEL_ID)
    .send({
      content: table,
      files: imageUrls,
    })
    .then(async (res) => {
      await deleteMessage(res.id);
    });
  // --------------------------------------------------
};

// 최근 10개 메시지만 남기고 제거한다.
const deleteMessage = async (messageId) => {
  MESSAGE_BUCKET.push(messageId);

  console.log(MESSAGE_BUCKET);
  if (MESSAGE_BUCKET.length > 10) {
    // 1. [Telegram] delete message -------------------
    // await bot.deleteMessage(TELEGRAM_CLIENT_ID, MESSAGE_BUCKET.shift());

    // 2. [Discord] delete message --------------------
    await client.channels.fetch(DISCORD_CHANNEL_ID).then((channel) => {
      channel.messages.delete(MESSAGE_BUCKET.shift());
    });
  }
};

const run = async () => {
  client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  await client.login(DISCORD_BOT_TOKEN);

  // getMerchants(); // debug

  cron.schedule("0 40 * * * *", getMerchants); // 매시 40분
  // cron.schedule("0 0 * * * *", deleteMessage); // 매시 0분
};

// pm2 start ./index.js --name cMerchants --time
run();
