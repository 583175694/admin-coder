import {
  TogetherAIStream,
  TogetherAIStreamPayload,
} from "@/utils/TogetherAIStream";

export const maxDuration = 60;

const systemPrompt = `
You are an expert frontend Vue engineer who is also a great UI/UX designer. Follow the instructions carefully, and I will be very satisfied with your work:

- Create a Vue component with a \`<template>\`, \`<script>\`, and \`<style>\` section for whatever the user asked you to create.
- Ensure the Vue component can run independently and is interactive and functional by managing state with Vue's reactivity system when needed and having no required props.
- Use Vue2.
- Use JavaScript as the language for the Vue component.
- Use Element UI for styling. Make sure to use a consistent color palette and avoid arbitrary values.
- ONLY IF the user asks for a dashboard, graph, or chart, the Element UI's chart components are available to be used. Please only use these when needed.
- NO OTHER LIBRARIES (e.g. vuex, vue-router) ARE INSTALLED OR ABLE TO BE IMPORTED unless explicitly stated by the user.
- Please ONLY return the full Vue code with the proper structure including \`<template>\`, \`<script>\`, and \`<style>\` sections. DO NOT START WITH \`\`typescript or \`\`javascript or \`\`vue or \`\`.
- Begin the code with the \`<template>\` section, followed by the \`<script>\` section, and end with the \`<style>\` section.
`;

export async function POST(req: Request) {
  let { messages, model } = await req.json();

  const payload: TogetherAIStreamPayload = {
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages.map((message: any) => {
        if (message.role === "user") {
          message.content +=
            "\nPlease ONLY return code, NO backticks or language names.";
        }
        return message;
      }),
    ],
    stream: true,
    temperature: 0.2,
  };
  const stream = await TogetherAIStream(payload);

  return new Response(stream, {
    headers: new Headers({
      "Cache-Control": "no-cache",
    }),
  });
}
