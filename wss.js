require("dotenv").config();
const { setTimeout } = require("node:timers/promises");

const { myWishList, getContent, getImageUrl } = require("./common");
const { addItem, updateOldData } = require("./notion");
const { login, send, deleteMsg } = require("./discord");

const WebSocket = require("ws");
let pingCnt = null;
let pendingCnt = 0;

const merchants = (jData) => {
  if (jData.t !== "MERCHANT_CREATE") return;

  const merchant = jData.d;
  if (!myWishList[merchant.server]) return;

  const card = myWishList[merchant.server].find(
    (item) => item.card === merchant.card
  );
  const extra = myWishList[merchant.server].find(
    (item) => item.extra === merchant.extra
  );

  if (card || extra) {
    const sendData = {
      content: getContent(merchant),
      files: [getImageUrl(merchant)],
    };

    // console.log(sendData);

    send(sendData);
  }
};

const connectSocket = (client) => {
  console.log(`Logged in as ${client.user.tag}!`);

  const ws = new WebSocket(process.env.URL_KLOA);
  ws.on("error", (error) => {
    console.error("received ERROR", error.message);
    send({
      content: error.message,
    });

    setTimeout(+process.env.RECONNECT_TIMEOUT_MS).then(() => {
      console.log("reconnect Socket");
      process.exit(0);
    });
  });
  ws.on("message", function (data, flags) {
    const jData = JSON.parse(data.toString("utf8"));

    switch (jData.op) {
      case 0:
        merchants(jData);
        break;
      case 2: // update ping count
        console.log("[receive]", jData);
        pendingCnt = 0;
        pingCnt = jData.s;
        break;
      case 3: // connection
        console.log("[receive]", jData);
        const interval = jData.d.heartbeat_interval * 1000;
        setInterval(() => {
          pendingCnt++;
          if (pendingCnt > +process.env.MAX_PENDING_COUNT) {
            console.error("request count is over. restarting...");
            process.exit(0);
          }

          const data = { op: 1, s: pingCnt };
          console.log("[send]", data);
          ws.send(Buffer.from(JSON.stringify(data), "utf8"));
        }, interval);
        break;
    }
  });
};

const createdMessage = async (message) => {
  console.log(
    `[Message Created] channelId: ${message.channelId}, id: ${message.id}, content: ${message.content}`
  );

  await addItem(message.id);

  const msgIdList = await updateOldData();
  for (const id of msgIdList) {
    await deleteMsg(id, () => {
      console.log("Delete successful", id);
    });
  }
};

const run = () => {
  login(connectSocket, createdMessage);
};

// pm2 start ./wss.js --name cWSMerchants --time
run();
