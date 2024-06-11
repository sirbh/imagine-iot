import "dotenv/config";
import OpenAI from "openai";
import { getStat } from "./iot-api";

import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import products from "../products.json";

const openai = new OpenAI();

const getCount = async (
  attributeId: string,
  startTime: string,
  endTime: string,
  dimension: "Minute" | "Hour" | "Day" | "Week" | "Quarter" | "Month" | "Year"
) => {
  console.log(attributeId, startTime, endTime, dimension);

  const data = await getStat({
    orderNumber: process.env.IOT_ORDER_NUMBER || "",
    productId: "J3ukJZfI6gRCriN0tkARlQcE2QhKMrGm",
    id: [attributeId],
    period: "Custom",
    dimension: dimension,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
  });

  return data[0].statistics
    .map((s) => `${new Date(s.stattime).toISOString()}: ${s.sum}`)
    .join("\n");
};

export const runConversation = async (
  startMessages: ChatCompletionMessageParam[]
) => {
  const newMessages = [] as ChatCompletionMessageParam[];

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `You are a helpful assistant. Time is ${new Date().toISOString()}\n\nAvailable attributes: \n${products[0].attributes
          .map((p) => `${p.id}: ${p.name}`)
          .join("\n")}`,
      },
      ...startMessages,
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "get_count",
          description: "Get count of attribute at Insinöörinkatu",
          parameters: {
            type: "object",
            properties: {
              startTime: {
                type: "string",
                description: "The start time of the period",
              },
              endTime: {
                type: "string",
                description: "The end time of the period",
              },
              dimension: {
                type: "string",
                description:
                  "Can be one of Minute, Hour, Day, Week, Quarter, Month, Year. For example Hour will get hourly values for the period",
              },
              attributeId: {
                type: "string",
                description: "The attribute ID to get the count for",
              },
            },
            required: ["startTime", "endTime"],
          },
        },
      },
    ],
  });

  const responseMessage = completion.choices[0].message;
  newMessages.push(responseMessage);

  const toolCalls = responseMessage.tool_calls;
  if (toolCalls) {
    const availableFunctions = {
      get_count: getCount,
    } as const;

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function
        .name as keyof typeof availableFunctions;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      const functionResponse = await functionToCall(
        functionArgs.attributeId,
        functionArgs.startTime,
        functionArgs.endTime,
        functionArgs.dimension
      );

      newMessages.push({
        tool_call_id: toolCall.id,
        role: "tool",
        content: functionResponse,
      });
    }

    const secondResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [...startMessages, ...newMessages],
    });

    newMessages.push(secondResponse.choices[0].message);
  }

  return newMessages;
};
