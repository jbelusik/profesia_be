const fs = require("fs");
const express = require("express");
var cors = require("cors");
const uuid = require("uuid");

const port = 3001;

const app = express();
app.use(cors());
app.use(express.json());

const readJson = () => {
  const rawData = fs.readFileSync("./data.json");
  return JSON.parse(rawData);
};

const writeJson = (data) => {
  fs.writeFileSync("./data.json", JSON.stringify(data));
};

app.get("/boards", (req, res) => {
  const data = readJson();
  res.status(200).json(data);
});

app.post("/boards", (req, res) => {
  const data = readJson();
  const name = req.body.name;

  const newUuid = uuid.v4();
  data.boards.push({
    name,
    id: newUuid,
    lists: [],
  });

  writeJson(data);

  res.status(200).json(newUuid);
});

app.post("/boards/:boardId/lists", (req, res) => {
  const data = readJson();
  const name = req.body.name;
  const boardId = req.params.boardId;
  const newUuid = uuid.v4();

  data.boards
    .find((board) => board.id === boardId)
    .lists.push({
      id: newUuid,
      name,
      items: [],
    });

  writeJson(data);

  res.status(200).json(newUuid);
});

app.post("/boards/:boardId/lists/:listId/items", (req, res) => {
  const data = readJson();
  const name = req.body.name;
  const boardId = req.params.boardId;
  const listId = req.params.listId;
  const newUuid = uuid.v4();

  data.boards
    .find((board) => board.id === boardId)
    .lists.find((list) => list.id === listId)
    .items.push({
      id: newUuid,
      name,
    });

  writeJson(data);

  res.status(200).json(newUuid);
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
