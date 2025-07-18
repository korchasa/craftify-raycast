# Craftify

Craftify is a set of useful tools to boost productivity directly in Raycast. The extension uses OpenAI and other LLMs for translation, correction, explanation, and summarization of text, as well as for working with YouTube subtitles.

## Features

- Every command save result to clipboard
- Commands that change the selected text:
    + `to-en` - translates text to English
    + `to-bg` - translates text to Bulgarian
    + `to-ua` - translates text to Ukrainian
    + `fix-text` - corrects errors in the text
    + `edit-text` - applies a user prompt to the selected text
- Commands that analyze the text and output the result in Raycast:
    + `summarize` - creates a summary of the text
    + `explain` - explains the text in simple language
    + `simplify` - simplifies the text
    + if the user selects a URL, the extension tries to extract text from the page at that URL
    + if the user selects a YouTube URL, the extension tries to extract subtitles from YouTube at that URL

## User settings

- `nativeLanguage` - user's primary language
- `llmModel` - LLM model
- `llmToken` - API key for LLM

## Usage

1. Select text in any application.
2. Call the desired command via Raycast (for example, "Summarize", "Fix Text Errors", "Edit Text", etc.).
3. The result will replace selected text or shown in the Raycast window (depending on the command).

## ToDo

- Punto Switcher replacement
- Apply custom prompt for selected text

## Dependencies

- [@raycast/api](https://www.npmjs.com/package/@raycast/api)
- [youtube-transcript](https://www.npmjs.com/package/youtube-transcript)
- [@agentic/stdlib](https://www.npmjs.com/package/@agentic/stdlib)

## License

MIT