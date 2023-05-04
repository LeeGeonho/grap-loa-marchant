const { Client } = require("@notionhq/client");

const notion = new Client({
  auth: process.env.NOTION_SECRET,
});

const databaseId = process.env.NOTION_DATABASE_ID;

module.exports.addItem = async (messageId) => {
  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        id: {
          type: "title",
          title: [{ type: "text", text: { content: messageId } }],
        },
        createdAt: {
          type: "date",
          date: { start: new Date() },
        },
        deleted: {
          type: "checkbox",
          checkbox: false,
        },
      },
    });

    console.log("Success! Entry added.");
  } catch (error) {
    console.error(error.body);
  }
};

module.exports.updateOldData = async () => {
  const list = await retrieve();
  const msgIdList = [];

  if (list.length > +process.env.NOTION_MESSAGE_BUCKET) {
    const delRowCount = list.length - +process.env.NOTION_MESSAGE_BUCKET;

    for (let i = 0; i < delRowCount; i++) {
      await updateItem(list[i].id);
      msgIdList.push(list[i].properties.id.title[0].text.content);
    }
  }

  return msgIdList;
};

const retrieve = async () => {
  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: "deleted",
      checkbox: {
        equals: false,
      },
    },
    sorts: [
      {
        property: "createdAt",
        direction: "ascending",
      },
    ],
  });

  return response.results;
};

const updateItem = async (page_id) => {
  await notion.pages.update({
    page_id,
    properties: {
      deleted: {
        checkbox: true,
      },
    },
  });
};
