import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import * as cheerio from "cheerio";

type Data = {
  ok: boolean;
  err?: String;
  lv?: String;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const res1 = await axios(
      "https://lostark.game.onstove.com/Profile/Character/%EC%AA%BC%EB%81%84%EB%A7%A4"
    );
    const $ = cheerio.load(res1.data);

    const classImg = $(".profile-character-info__img").attr("src");
    const name = $(".profile-character-info__name").text();
    const battleLevel = $(".profile-character-info__lv").text();
    const expeditionLevel = $(".level-info__expedition>span:last-child").text();
    const itemLevel = $(".level-info2__expedition>span:last-child").text();
    const guildNmae = $(".game-info__guild>span:last-child").text();

    const item = $("");

    // const item = $(".").text();

    const characterData = {
      classImg,
      name,
      battleLevel,
      expeditionLevel,
      itemLevel,
      guildNmae,
    };

    console.log(res1);

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(404).json({ ok: false, err: `${err}` });
  }
}
