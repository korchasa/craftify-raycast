import { ActionPanel, Action, Form } from "@raycast/api";
import { useForm, FormValidation } from "@raycast/utils";
import { modifyTextWithLLMCommand } from "./internal/modifyTextWithLLMCommand";

interface Values {
  prompt: string;
}

export default function Command() {
  const { handleSubmit, itemProps } = useForm<Values>({
    async onSubmit({ prompt }) {
      await modifyTextWithLLMCommand({
        prompt: prompt + "\n\nReturn your answer as a JSON object with one field: 'result'",
        hudMessage: "Applying prompt...",
        successMessage: "Text edited",
        errorMessage: "Failed to edit text",
      });
    },
    validation: {
      prompt: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Apply Prompt" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        title="Prompt"
        placeholder="Enter your instruction for the LLM (e.g. 'Make this text more formal')"
        {...itemProps.prompt}
      />
    </Form>
  );
}
