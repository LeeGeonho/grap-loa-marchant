const { cards } = require("./cards");
const { continents } = require("./continents");

module.exports.getContent = (data) => {
  const { server, extra, card, continent, zone } = data;
  let serverName = "";
  switch (server) {
    case 1:
      serverName = "루페온";
      break;
    case 2:
      serverName = "실리안";
      break;
  }
  if (serverName !== "") {
    serverName = `*${serverName}*`;
  }

  let grade = "";
  if (cards[card]) {
    grade = `(${cards[card].grade})`;
  }

  let msgExtra = "";
  if (extra) {
    msgExtra = `, ${extra}`;
  }

  const method = getMethod(serverName, continent);
  const mention = getMention(serverName, card);

  return `${serverName}[${continent}][${zone}] ${card}${grade}${msgExtra}${method}${mention}`;
};

const getMethod = (serverName, continent) => {
  if (serverName !== "") return "";

  const { members, method } = continents[continent];
  if (!members || members.length == 0) {
    console.error("continents data empty!", continent);
    return "";
  }

  return `\n${members.join("나 ")}로 ${method}사용`;
};

const getMention = (serverName, cardName) => {
  if (serverName !== "") return "";
  if (!cards[cardName]) return "";

  const date = new Date();
  const hour = date.getHours(); // 13시 ~ 20시 외엔 제외
  if (hour < 13 || hour > 20) return "";
  const day = date.getDay(); // 주말 제외
  if (day == 0 || day == 6) return "";

  const { grade } = cards[cardName];
  if (!["영웅", "전설"].find((item) => item == grade)) return "";

  // members
  // 1084332850087743538 : 쪼댕
  // 268011265220280320 : 신비하리
  return `\n<@${process.env.DISCORD_MENTION_ID}>`;
};

module.exports.getImageUrl = (data) => {
  let { continent, zone } = data;
  continent = continent.replaceAll(/[()]/g, "");
  continent = continent.replaceAll(/[ ]/g, "_");
  zone = zone.replaceAll(/[()]/g, "");
  zone = zone.replaceAll(/[ ]/g, "_");
  return `https://cdn.korlark.com/images/merchant/maps/${continent}/${zone}.png`;
};
// 1:루페온, 2:실리안, 3:아만
module.exports.myWishList = {
  1: [
    {
      card: "에버그레이스 카드",
      type: 2,
    },
    {
      card: "바르칸 카드",
      type: 2,
    },
    {
      extra: "안정된 연성 촉매",
      type: 4,
    },
  ],
  2: [
    {
      card: "에버그레이스 카드",
      type: 2,
    },
    {
      card: "바르칸 카드",
      type: 2,
    },
    {
      extra: "안정된 연성 촉매",
      type: 4,
    },
  ],
  3: [
    {
      card: "에버그레이스 카드",
      type: 2,
    },
    {
      card: "어린 아만 카드",
      type: 2,
    },
    {
      card: "프리우나 카드",
      type: 2,
    },
    {
      card: "라자람 카드",
      type: 2,
    },
    {
      card: "빌헬름 카드",
      type: 2,
    },
    {
      card: "바르칸 카드",
      type: 2,
    },
    {
      card: "칼테이야 카드",
      type: 2,
    },
    {
      card: "유클리드 카드",
      type: 2,
    },
    {
      card: "앙케 카드",
      type: 2,
    },
    {
      card: "라카이서스 카드",
      type: 2,
    },
    {
      card: "키르케 카드",
      type: 2,
    },
    {
      card: "다르시 카드",
      type: 2,
    },
    {
      card: "사일러스 카드",
      type: 2,
    },
    {
      card: "오스피어 카드",
      type: 2,
    },
    {
      card: "마리나 카드",
      type: 2,
    },
    {
      card: "라우리엘 카드",
      type: 2,
    },
    {
      card: "웨이 카드",
      type: 2,
    },
    {
      card: "아르노 카드",
      type: 2,
    },
    {
      extra: "안정된 연성 촉매",
      type: 4,
    },
    {
      extra: "오징어",
      type: 4,
    },
  ],
};
