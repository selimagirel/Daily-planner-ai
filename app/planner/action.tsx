"use server"
import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";
import getTaskInfo from "@/lib/agents/task-manager";
import { spinner } from "@/components/spinner";

export interface TaskInfo {
  readonly taskName: string;
  readonly task: string;
  readonly time: string;
  readonly info: string;
}


type AIStateItem =
  | {
      readonly role: "user" | "assistant" | "system";
      readonly content: string;
    }
  | {
      readonly role: "function";
      readonly content: string;
      readonly name: string;
    };

interface UIStateItem {
  readonly id: number;
  readonly display: React.ReactNode;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });



function Spinner() {
  return <div>{spinner}</div>;
}




export async function submitUserMessage(userInput: string): Promise<UIStateItem> {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  aiState.update([...aiState.get(), { role: "user", content: userInput }]);

  const ui = render({
    model: "gpt-3.5-turbo-0125",
    provider: openai,
    messages: [
      { role: "system", content: `You are a day planner assistan your job is plan the user day time by time based on the user ${userInput} day ` },
      { role: "user", content: userInput },
      ...aiState.get(),
    ],
    text: ({ content, done }) => {
      if (done) {
        aiState.done([...aiState.get(), { role: "assistant", content }]);
      }

      return <div>{content}</div>;
    },
    tools: {
      get_task_info: {
        description: "Get the information of the user day",
        parameters: z
          .object({
            taskName: z.string().describe("detail of the user day"),
          })
          ,
        render: async function* ({ taskName }) {
          yield <Spinner />;

          const TaskInfo = await getTaskInfo(taskName,userInput);

          aiState.done([
            ...aiState.get(),
            {
              role: "function",
              name: "get_task_info",
              content: JSON.stringify({TaskInfo}),
            },
          ]);

          await new Promise((resolve) => setTimeout(resolve, 6000));


          return (<div>{TaskInfo}</div>);
        },
      },
    },
  });

  return { 
    id: Date.now(),
    display: ui ,
     
  };
}

const initialAIState: AIStateItem[] = [];
const initialUIState: UIStateItem[] = [];

export const AI = createAI({
  actions: { submitUserMessage },
  initialUIState,
  initialAIState,
});
