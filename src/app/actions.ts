"use server";

import { runConversation } from "@/server/chat";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export const completeConversation = async (
  conversation: ChatCompletionMessageParam[]
) => {
  return await runConversation(conversation);
};
