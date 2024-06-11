import "dotenv/config";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { getStat } from "./iot-api";

const openai = new OpenAI();

const getHourlyCarCount = async (startTime: string, endTime: string) => {
  const data = await getStat({
    orderNumber: process.env.IOT_ORDER_NUMBER || "",
    productId: "J3ukJZfI6gRCriN0tkARlQcE2QhKMrGm",
    id: ["8FM6TrnXFkPs9TPn5dqL3ouR6vjEIT2Z"],
    period: "Custom",
    dimension: "Hour",
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
    messages: startMessages,
    tools: [
      {
        type: "function",
        function: {
          name: "get_hourly_car_count",
          description: "Get the hourly car count at Insinöörinkatu",
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
      get_hourly_car_count: getHourlyCarCount,
    } as const;

    for (const toolCall of toolCalls) {
      const functionName = toolCall.function
        .name as keyof typeof availableFunctions;
      const functionToCall = availableFunctions[functionName];
      const functionArgs = JSON.parse(toolCall.function.arguments);
      const functionResponse = await functionToCall(
        functionArgs.startTime,
        functionArgs.endTime
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
