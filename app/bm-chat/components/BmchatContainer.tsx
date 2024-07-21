'use client'
import { createBmchat, deleteBmchat, getBmchat, getBmchatSearch, updateBmchat } from "@/apis/bm_chat";
import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import Loading from "../loading";

const BmchatContainer = () => {
  const [messages, setMessages] = useState([
    { sender: '부물AI', text: '부동산과 관련된 질문을 물어봐 주세요' },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e:any) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // 사용자의 메시지를 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: '질문자', text: inputValue },
      ]);
      
      // "부물 AI가 답변을 준비중입니다..." 메시지 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: '부물AI', text: "AI가 답변을 준비중입니다..." },
      ]);

      // 입력 필드 비우기
      setInputValue('');

      // 로딩 상태 시작
      setLoading(true);

      try {
        const res = await axios.post('/api/generate', {
          prompt: inputValue
        });
        console.log(res, '========모델컬요청테스트성공=======');
        console.log(res.data.choices[0].message.content);
        const answer = res.data.choices[0].message.content;

        // "부물 AI가 답변을 준비중입니다..." 메시지를 대체
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages.pop(); // 마지막 메시지("부물 AI가 답변을 준비중입니다...") 제거
          return [...updatedMessages, { sender: '부물AI', text: answer }];
        });

        // Supabase 대화 저장
        createBmchat(inputValue, answer);
      } catch (err) {
        console.log(err, "요청실패");

        // 오류가 발생한 경우 "부물 AI가 답변을 준비중입니다..." 메시지를 대체
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages.pop(); // 마지막 메시지("부물 AI가 답변을 준비중입니다...") 제거
          return [...updatedMessages, { sender: '부물AI', text: "답변을 가져오는 데 실패했습니다. 다시 시도해 주세요." }];
        });
      } finally {
        // 로딩 상태 종료
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100"> {/* 전체 화면 중앙에 정렬 */}
      <div style={{ boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
        className=" bg-white p-6 m-3 rounded-lg border border-[#e5e7eb] w-full max-w-[440px] h-[634px]">

        {/* Loading Spinner */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Loading />
          </div>
        )}

        {/* Heading */}
        <div className="flex flex-col space-y-1.5 pb-6">
          <h2 className="font-semibold text-lg tracking-tight">부물AI 챗봇</h2>
          <p className="text-sm text-[#6b7280] leading-3">PAMI AI</p>
        </div>

        {/* Chat Container */}
        <div className="overflow-y-auto pr-4 h-[474px] w-full">
          {messages.map((msg, index) => (
            <div key={index} className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                <div className="rounded-full bg-gray-100 border p-1">
                  <svg stroke="none" fill="black" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
                  </svg>
                </div>
              </span>
              <p className="leading-relaxed">
                <span className="block font-bold text-gray-700">{msg.sender} </span>{msg.text}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        <div className="flex items-center pt-0 w-full">
          <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleSendMessage}>
            <input
              className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-sm placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="질문을 입력해주세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading} // 로딩 중일 때 비활성화
            />
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
              type="submit"
              disabled={loading} // 로딩 중일 때 비활성화
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default BmchatContainer;
