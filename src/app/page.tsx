"use client";

import { Button, Grid, TextInput } from "@tremor/react";
import { useState } from "react";
import { TrashIcon } from "@heroicons/react/outline";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "Use your own key, but don't submit it to us!",
  dangerouslyAllowBrowser: true,
});

export default function Home() {
  const [messages, setMessages] = useState<any[]>([
    {
      id: "1",
      role: "system",
      content: "You are a ping pong machine",
    },
    {
      id: "2",
      role: "user",
      content: "Ping?",
    },
    {
      id: "3",
      role: "assistant",
      content: "Pong!",
    },
    {
      id: "4",
      role: "user",
      content: "",
    },
  ]);

  return (
    <div className="max-w-7xl mx-auto pt-10">
      {messages.slice(0, -1).map((message: any) => (
        <div
          className={`p-4 ${
            message.role == "user"
              ? ""
              : "bg-gray-50 border-t-2 border-b-2 border-gray-100"
          }`}
        >
          <>
            <div className="relative">
              <div className="absolute right-0">
                <Button
                  variant="light"
                  color="gray"
                  tooltip="Delete"
                  icon={TrashIcon}
                  onClick={() => {
                    setMessages(messages.filter((m) => m.id != message.id));
                  }}
                />
              </div>
            </div>
            {message.role == "system" && (
              <p className="text-xs font-bold">system</p>
            )}
            <div>
              <p className="text-sm text-gray-600">{message.content || " "}</p>
            </div>
          </>
        </div>
      ))}
      {messages.slice(-1).map((message: any) => (
        <div className="flex pt-2 space-x-2">
          <TextInput
            className="border-0 shadow-none"
            placeholder="Type something here..."
            onChange={(e) => {
              setMessages([
                ...messages.slice(0, -1),
                {
                  id: "4",
                  role: "user",
                  content: e.target.value,
                },
              ]);
            }}
          />
          <Button
            disabled={message.content == ""}
            onClick={async () => {
              console.log(messages);
              const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages.map((message) => ({
                  role: message.role,
                  content: message.content,
                })),
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
              });

              const numMessages = messages.length;

              setMessages([
                ...messages,
                {
                  id: numMessages + 1,
                  role: "assistant",
                  content: response.choices[0].message.content,
                },
                {
                  id: numMessages + 2,
                  role: "user",
                  content: "",
                },
              ]);
            }}
          >
            Submit
          </Button>
        </div>
      ))}
    </div>
  );
}
