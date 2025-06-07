import { translateCommand } from "./internal/translateCommand";

export default async function Command() {
  return translateCommand({
    targetLanguage: "ukrainian",
    nativeLangExample: "Привет, это сообщение с `markdown` и <b>тегами</b>",
    targetLangExample: "Привіт, це повідомлення з `markdown` і <b>тегами</b>",
  });
}
