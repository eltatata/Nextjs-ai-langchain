'use client';

import { useChat } from 'ai/react';

export default function Home() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className='flex flex-col justify-between gap-10 h-screen m-auto p-20 max-w-[1000px]'>
      <div className="max-w-[700px] flex flex-col items-start gap-y-10">
        {messages.map(m => (
          <div key={m.id}>
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="w-full flex items-end gap-2">
        <textarea
          className='w-full max-h-[200px] rounded-lg border bg-transparent outline-none p-2'
          value={input}
          onChange={handleInputChange}
        >
        </textarea>
        <button
          type="submit"
          className='border rounded-lg px-4 py-5 hover:bg-slate-800'
        >
          Send
        </button>
      </form>
    </div>
  )
}
