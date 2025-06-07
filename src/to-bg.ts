import { translateCommand } from "./internal/translateCommand";

export default async function Command() {
  return translateCommand({
    targetLanguage: "bulgarian",
    nativeLangExample: "Привет, это сообщение с `markdown` и <b>тегами</b>",
    targetLangExample: "Здравей, това е съобщение с `markdown` и <b>тегове</b>",
  });
}
