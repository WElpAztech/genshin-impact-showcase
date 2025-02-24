import express from "express";
import cors from"cors";
import { Wrapper } from "enkanetwork.js";

const app = express();
const port = 3000;

app.use(cors());

const { genshin } = new Wrapper({ cache: true });

app.get(`/genshin/:uid`, (req, res) => {
    genshin.getPlayer(req.params.uid)
    .then(genshinData => {res.json(genshinData);})
})

app.listen(port, () => { console.log(port); })