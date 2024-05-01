import {
  experimental_generateObject,
} from "ai";
import { OpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import { JSX, SVGProps, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface TaskInfo {
  taskName: string;
  task: string;
  time: string;
  info: string;
}


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // optional API key, default to env property OPENAI_API_KEY // optional organization
});

export default async function getTaskInfo(taskName: string, content: string) {

  try {
    await new Promise((resolve) => setTimeout(resolve, 7000));

    const result = await experimental_generateObject({
      model: openai.chat(process.env.OPENAI_API_MODEL || "gpt-3.5-turbo-0125"),
      system: `Generate a list of tasks about the user's ${content}. Each task should include a name, a description, and a time frame for completion. For example:
      {
        "taskName": "Workout",
        "task": "30-minute cardio session followed by strength training",
        "info": "go to gym and do 30m cardio and other exirscize",
        "time": "6:00 AM - 7:00 AM"
      },
      Please generate tasks based on the user's input. Use the following structure:
      {
        "taskName": "taskname that it needs to be done"
        "task": "A detail of the task"
        "info": "additional task details and strategies"
        "time": "time frame for task completion for example : " 2-pm 3-pm" "
      }.
    `,
      messages: [{ role: "user", content: content }],
      schema: z.object({
        TaskInfo: z.array(
          z.object({
            taskName: z.string().describe("taskname that it needs to be done"),
            task: z.string().describe("A detail of the task"),
            time: z.string().describe("time frame for task completion"),
            info: z
              .string()
              .describe("additional task details and strategies"),
          })
        ),
      }),
    });

    await new Promise((resolve) => setTimeout(resolve, 7000));

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {result.object.TaskInfo.map(
          async (taskInfo: TaskInfo, index: number) => (
            <div className="bg-white rounded-lg shadow-md p-6 border-black" key={index}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-black">{taskInfo.taskName}</h3>
                <Checkbox id="1"/>
              </div>
              <p className="text-black mb-4">{taskInfo.task}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-black">
                  <CalendarDaysIcon className="h-5 w-5" />
                  <span>{taskInfo.time}</span>
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Details</AccordionTrigger>
                    <AccordionContent>
                      {taskInfo.info}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              {await new Promise((resolve) => setTimeout(resolve, 7000))}
            </div>
          )
        )}
      </div>
    );
  } catch (error) {
    console.error(error);
    return null;
  }
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
