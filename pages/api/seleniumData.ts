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
  let item_lv, battle_lv, item_dress;
  try {
    const { Builder, By, Key, until } = require("selenium-webdriver");
    const chrome = require("selenium-webdriver/chrome");
    const screen = {
      width: 640,
      height: 480,
    };

    const url =
      "https://lostark.game.onstove.com/Profile/Character/%EC%AA%BC%EB%81%84%EB%A7%A4";

    (async function myFunction() {
      let driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(new chrome.Options().headless().windowSize(screen))
        .build(); //가상 브라우저 빌드
      try {
        await driver.get(url); //get(url) 인거 보면 뭔지 알것같이 생겼다
        let char_item_lv = await driver.wait(
          until.elementLocated(
            By.css(
              "#lostark-wrapper > div > main > div > div.profile-ingame > div.profile-info > div.level-info2 > div.level-info2__expedition > span:nth-child(2)"
            )
          ),
          100
        );
        item_lv = await char_item_lv.getText(); //아이템 렙

        let char_battle_lv = await driver.wait(
          until.elementLocated(By.css(".level-info__item > span:nth-child(2)")),
          100
        );
        battle_lv = await char_battle_lv.getText();

        let char_item_dress = [];

        //호버링 장비 가져오기 (옷 6개)
        for (let i = 1; i <= 6; i++) {
          let hover_char_item_dress = driver.findElement(
            By.css(
              `#profile-equipment > div.profile-equipment__slot > div.slot${i}`
            )
          );
          let actions = driver.actions({ async: true });
          await actions.move({ origin: hover_char_item_dress }).perform();

          //호버링후 "+16타락한 마수의 사멸 머리장식" 가져옴
          char_item_dress.push(
            await driver.wait(until.elementLocated(By.css(".NameTagBox")), 100)
          );
        }

        item_dress = await char_item_dress[5].getText();

        console.log(item_lv);
        console.log(battle_lv);
        console.log(item_dress);
      } finally {
        await driver.quit(); //가상 브라우저를 종료시킨다
      }
    })();

    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(404).json({ ok: false, err: `${err}` });
  }
}
