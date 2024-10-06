"use client";
import React, { useState, useEffect, useRef } from "react";
import { Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const Chatbot: React.FC = () => {
  const PYTHON_BACKEND_URL = process.env.NEXT_PUBLIC_PYTHON_URL as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    const newMessage: Message = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${PYTHON_BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from the chatbot");
      }

      const data = await response.json();
      const botMessage: Message = { text: data.response, sender: "bot" };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        text: "Sorry, there was an error processing your request.",
        sender: "bot",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-semibold pb-2">Ask AI</h2>
        <div className="flex flex-col h-[72vh] max-w-5xl mx-auto ">
          <div className="flex-grow overflow-auto mb-4 space-y-4">
            {messages.length < 1 && (
              <>
                <p>
                  Hi, this is your friendly AI assistant to answer your queries
                  about your concerns around farming.
                </p>
                <p>Type a message to get started</p>
              </>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="bg-white flex justify-center items-center rounded-full p-2">
                    <Bot className="h-5 w-5 text-gray-600" />
                  </div>
                )}

                <div
                  className={`p-2 ml-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-slate-800 text-white"
                      : "bg-white drop-shadow-md border"
                  } max-w-[70%] flex items-start`}
                >
                  <span>{message.text}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-2 rounded-lg max-w-[70%] flex items-start">
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex space-x-2">
            <Input
              className="bg-white"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
            />
            <Button onClick={handleSend} disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
