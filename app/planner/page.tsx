"use client";

import { useState } from "react";
import { useUIState, useActions } from "ai/rsc";
import type { AI } from "./action";

import { Button } from "@/components/ui/button";
import { JSX, SVGProps } from "react";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/themebutton";

export default function Page() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();


  return (
    <div key="1" className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-md">
         <ModeToggle />
          <div className="text-center space-y-2 mb-4">
            <h1 className="text-3xl font-bold">Daily Tasks</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your day and let us generate your daily to-do list.
            </p>
          </div>
          <form
            className="flex items-center space-x-4"
            onSubmit={async (e) => {
              e.preventDefault();

              // Add user message to UI state
              setMessages((currentMessages) => [
                ...currentMessages,
                {
                  id: Date.now(),
                  display: <div></div>,
                },
              ]);

              // Submit and get response message
              const responseMessage = await submitUserMessage(inputValue);
              setMessages((currentMessages) => [
                ...currentMessages,
                responseMessage,
              ]);

              setInputValue("");
            }}
          >
            <Input
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Write your day here"
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
            />
            <Button className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Generate
            </Button>
          </form>
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400">
        {
          // View messages in UI state
          messages.map((message) => (
            <div key={message.id}>{message.display}</div>
          ))
        }
      </p>
    </div>
  );
}

function CalendarDaysIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
