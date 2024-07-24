'use client'
import { createBmchat, deleteBmchat, getBmchat, getBmchatSearch, updateBmchat } from "@/apis/bm_chat";
import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import Loading from "../loading";
import { TbMessageChatbot } from "react-icons/tb";
import { TbUser } from "react-icons/tb";

const BmchatContainer = () => {
  const [messages, setMessages] = useState([
    { sender: '부물AI', text: '부동산과 관련된 질문에 특화된 AI 챗봇 부물이에요!' },
    { sender: '부물AI', text: '부동산과 관련된 질문을 물어봐 주세요 😁' }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const [showRecommendedQuestions, setShowRecommendedQuestions] = useState(false);
  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allRecommendedQuestions = [
    "현재 부동산 시장 동향은?",
    "부동산 투자에 좋은 지역은?",
    "부동산 세금 관련 정보",
    "녹번 힐스테이트 실거래가",
    "서울 집값 어떻게 될까요?",
    "서울 부동산 시장 동향은?",
    "서울 투자 좋은 지역은?",
    "서울 부동산 세금 정보",
    "서울 강남구 최근 트렌드",
    "서울 강북 투자 잠재력",
    "서울 아파트 전세 시장",
    "서울 재개발 지역 정보",
    "서울 상업용 부동산 주의점",
    "서울 집값 상승 가능 지역",
    "서울 주거 환경 개발 계획",
    "서울 집값 상승률 높은 동네",
    "서울 외국인 투자 인기 지역",
    "서울 부동산 정부 정책 영향",
    "서울 아파트 매매 시세",
    "서울 신규 주거단지 정보",
    "서울 주택 청약 가점 높은 지역",
    "서울 상가 임대 시세",
    "서울 부동산 규제 최신 소식",
    "서울 부동산 시장 전망",
    "서울 인기 부동산 지역 비교"
  ];

  useEffect(() => {
    generateRandomQuestions();
  }, []);

  const generateRandomQuestions = () => {
    const randomQuestions = allRecommendedQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setRecommendedQuestions(randomQuestions);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!inputValue) return;
    e.preventDefault();

    if (isFirstQuestion) {
      setMessages([]);
    }

    if (inputValue.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: '질문자', text: inputValue },
      ]);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: '부물AI', text: "부물AI가 답변을 준비중입니다..." },
      ]);

      setInputValue('');
      setIsFirstQuestion(false);
      setLoading(true);

      try {
        const res = await axios.post('/api/generatebm', { prompt: inputValue });
        const answer = res.data.response;

        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          updatedMessages.pop();
          return [...updatedMessages, { sender: '부물AI', text: answer }];
        });

        createBmchat(inputValue, answer);
      } catch (err) {
        console.log(err, "요청실패");

        try {
          const res = await axios.post('/api/generate', { prompt: inputValue });
          const answer = res.data.choices[0].message.content;

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages.pop();
            return [...updatedMessages, { sender: '부물AI', text: answer }];
          });

          createBmchat(inputValue, answer);
        } catch (fallbackErr) {
          console.log(fallbackErr, "fallback API 요청 실패");

          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            updatedMessages.pop();
            return [...updatedMessages, { sender: '부물AI', text: "답변을 가져오는 데 실패했습니다. 다시 시도해 주세요." }];
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleRecommendedQuestions = () => {
    setShowRecommendedQuestions(prev => !prev);
  };

  const handleRefreshQuestions = () => {
    generateRandomQuestions();
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div
        style={{ boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
        className="bg-white p-6 m-3 rounded-lg border border-[#e5e7eb] w-full max-w-[440px] h-[634px]"
      >
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Loading />
          </div>
        )}

        <div className="flex flex-col space-y-1.5 pb-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-lg tracking-tight">부물AI 챗봇</h2>
              <p className="text-sm text-[#6b7280] leading-3">부동산 도우미 AI 챗봇입니다.</p>
            </div>
            <button
              className="ml-auto text-[#6b7280] hover:text-[#111827] focus:outline-none"
              onClick={handleToggleRecommendedQuestions}
            >
              {showRecommendedQuestions ? '추천질문 닫기' : '추천질문 열기'}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto pr-4 h-[464px] w-full">
          {messages.map((msg, index) => (
            <div key={index} className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                <div className="rounded-full bg-gray-100 border p-1">
                  {msg.sender === "부물AI" ? <TbMessageChatbot size={20} aria-hidden="true" /> : <TbUser size={20} aria-hidden="true" />}
                </div>
              </span>
              <p className="leading-relaxed">
                <span className="block font-bold text-gray-700">{msg.sender}</span>{msg.text}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {showRecommendedQuestions || isFirstQuestion && (
          <div className="fixed top-[460px] w-full max-w-[320px] px-2">
            <div className="bg-neutral-50 rounded-lg shadow-md p-3">
              <ul className="list-disc pl-5 space-y-1">
                {recommendedQuestions.map((question, index) => (
                  <li key={index} className="text-[#6b7280] cursor-pointer hover:underline" onClick={() => setInputValue(question)}>
                    {question}
                  </li>
                ))}
              </ul>
              <button
                className="mt-2 text-[#6b7280] hover:text-[#111827] focus:outline-none"
                onClick={handleRefreshQuestions}
              >
                추천질문 새로 고침
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center pt-0 w-full">
          <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleSendMessage}>
            <input
              className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-base placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="질문을 입력해주세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading}
            />
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
              type="submit"
              disabled={loading || !inputValue}
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
