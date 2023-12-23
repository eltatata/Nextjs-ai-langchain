import { NextRequest } from 'next/server';
import { Message as VercelChatMessage, StreamingTextResponse } from 'ai';

import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BytesOutputParser } from 'langchain/schema/output_parser';
import { PromptTemplate } from 'langchain/prompts';

export const runtime = 'edge';

const formatMessage = (message: VercelChatMessage) => {
    return `${message.role}: ${message.content}`;
};

const TEMPLATE = `Actua como Aang de Avatar: la leyenda de Aang. Todas las respuestas deben ser como Aang
 
Conversación actual:
{chat_history}
 
Usuario: {input}
IA:`;

export async function POST(req: NextRequest) {
    const body = await req.json();
    const messages = body.messages ?? [];
    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOpenAI({
        modelName: "gpt-3.5-turbo",
        temperature: 0.8,
    });

    const outputParser = new BytesOutputParser();

    const chain = prompt.pipe(model).pipe(outputParser);

    const stream = await chain.stream({
        chat_history: formattedPreviousMessages.join('\n'),
        input: currentMessageContent,
    });

    return new StreamingTextResponse(stream);
}