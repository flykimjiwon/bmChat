'use client'
import { createBmchat, deleteBmchat, getBmchat, getBmchatSearch, updateBmchat } from "@/apis/bm_chat";
import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import Loading from "../loading";
import { TbMessageChatbot } from "react-icons/tb";
import { TbUser } from "react-icons/tb";
// import Image from 'next/image';

const BmchatContainer = () => {



  const [messages, setMessages] = useState([
    { sender: '부물AI', text: '부동산과 관련된 질문에 특화된 AI 챗봇 부물이에요!' },
    { sender: '부물AI', text: '부동산과 관련된 질문을 물어봐 주세요 😁' }
  ]);

  // useEffect(()=>{
  //   setTimeout(()=>{
  //     let arr = [...messages]
  //     arr.push({ sender: '부물AI', text: '부동산과 관련된 질문을 물어봐 주세요 😁' })
  //     setMessages(arr)
  //   },500)
  // },[])
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [isFirstQuestion, setIsFirstQuestion] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // const recommendedQuestions = [
    // "현재 부동산 시장 동향은 어떨까요?",
    // "부동산 투자에 좋은 지역은 어디인가요?",
    // "부동산 세금 관련 정보를 알고 싶어요.",
    // "녹번 힐스테이트 실거래가",
    // "서울 집값 어떻게될거같니",
  // ];
  const allRecommendedQuestions = [
    "현재 부동산 시장 동향은 어떨까요?",
    "부동산 투자에 좋은 지역은 어디인가요?",
    "부동산 세금 관련 정보를 알고 싶어요.",
    "녹번 힐스테이트 실거래가",
    "서울 집값 어떻게될거같니",
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
  

  const [recommendedQuestions, setRecommendedQuestions] = useState<string[]>([]);

  useEffect(() => {
    const randomQuestions = allRecommendedQuestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setRecommendedQuestions(randomQuestions);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e:any) => {
    if(!inputValue) return;
    e.preventDefault();
    if(isFirstQuestion){
      // 첫질문 시작된경우 대화내역 초기화
      let arr:any = []
      setMessages(arr)
    }
    if (inputValue.trim()) {
      // 사용자의 메시지를 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: '질문자', text: inputValue },
      ]);
      
      // "부물 AI가 답변을 준비중입니다..." 메시지 추가 테스트
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: '부물AI', text: "부물AI가 답변을 준비중입니다..." },
      ]);

      // 입력 필드 비우기
      setInputValue('');

      // 첫 질문 후 추천 질문 숨기기
      setIsFirstQuestion(false);


      // 로딩 상태 시작
      setLoading(true);
      try {
        const res = await axios.post('/api/generatebm', {
          prompt: inputValue
        });
        console.log(res, '========모델컬요청테스트성공=======');
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
          // 다른 API 호출
          const res = await axios.post('/api/generate', {
            prompt: inputValue
          });
          console.log(res, '========fallback API 요청 성공 GPT사용=======');
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
      }finally {
        setLoading(false);
      }
      
      // try {
      //   const res = await axios.post('/api/generatebm', {
      //     prompt: inputValue
      //   });
      //   console.log(res, '========모델컬요청테스트성공=======');
      //   // console.log(res.data.choices[0].message.content);
      //   // const answer = res.data.choices[0].message.content; // GPT
      //   const answer = res.data.response; //부물

      //   // "부물 AI가 답변을 준비중입니다..." 메시지를 대체
      //   setMessages((prevMessages) => {
      //     const updatedMessages = [...prevMessages];
      //     updatedMessages.pop(); // 마지막 메시지("부물 AI가 답변을 준비중입니다...") 제거
      //     return [...updatedMessages, { sender: '부물AI', text: answer }];
      //   });

      //   // Supabase 대화 저장
      //   createBmchat(inputValue, answer);
      // } catch (err) {
      //   console.log(err, "요청실패");

      //   // 오류가 발생한 경우 "부물 AI가 답변을 준비중입니다..." 메시지를 대체
      //   setMessages((prevMessages) => {
      //     const updatedMessages = [...prevMessages];
      //     updatedMessages.pop(); // 마지막 메시지("부물 AI가 답변을 준비중입니다...") 제거
      //     return [...updatedMessages, { sender: '부물AI', text: "답변을 가져오는 데 실패했습니다. 다시 시도해 주세요." }];
      //   });
      // } finally {
      //   // 로딩 상태 종료
      //   setLoading(false);
      // }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    // flex justify-center : 좌우중간 items-center : 상하중간
    <div className="flex justify-center h-screen bg-gray-100"> {/* 전체 화면 중앙에 정렬 */}
      <div style={{ boxShadow: '0 0 #0000, 0 0 #0000, 0 1px 2px 0 rgb(0 0 0 / 0.05)' }}
        className=" bg-white p-6 m-3 rounded-lg border border-[#e5e7eb] w-full max-w-[440px] h-[634px]">
          {/* 높이는 하단 Chat Ontainer와 맞춰줘야함 */}

        {/* Loading Spinner */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Loading />
          </div>
        )}

        {/* Heading */}
        {/* <div className="flex flex-col space-y-1.5 pb-6">
          <h2 className="font-semibold text-lg tracking-tight">부물AI 챗봇</h2>
          <p className="text-sm text-[#6b7280] leading-3">부동산 도우미 AI 챗봇입니다.</p>
        </div> */}
        <div className="flex flex-col space-y-1.5 pb-6">
  <div className="flex justify-between items-center">
    <div>
      <h2 className="font-semibold text-lg tracking-tight">부물AI 챗봇</h2>
      <p className="text-sm text-[#6b7280] leading-3">부동산 도우미 AI 챗봇입니다.</p>
    </div>
    {/* <button className="ml-auto bg-[#6b7280] text-white px-4 py-2 rounded-lg">
      버튼
    </button> */}
           {/* <button className="ml-auto text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#d5d5d5]">
          <Image src="/path/to/your/image.png" alt="icon" width={20} height={20} className="mr-2" />
        </button> */}
  </div>
</div>


        {/* Chat Container */}
        <div className="overflow-y-auto pr-4 h-[464px] w-full">
          {messages.map((msg, index) => (
            <div key={index} className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
              <div className="rounded-full bg-gray-100 border p-1">
              {/* <TbMessageChatbot size={20} aria-hidden="true" /> */}
              {
                msg.sender=="부물AI"?<TbMessageChatbot size={20} aria-hidden="true"></TbMessageChatbot>:<TbUser size={20} aria-hidden="true"></TbUser>
              }
            </div>
                {/* <div className="rounded-full bg-gray-100 border p-1">
                  <TbMessageChatbot></TbMessageChatbot>
                  <svg stroke="none" fill="black" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true" height="20" width="20" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"></path>
                  </svg>
                </div> */}
              </span>
              <p className="leading-relaxed">
                <span className="block font-bold text-gray-700">{msg.sender} </span>{msg.text}
              </p>
            </div>
          ))}
          {/* <hr></hr>
          {
            recommendedQuestions.map((msg,index)=>(
              <div key={index} className="flex gap-3 my-4 text-gray-600 text-sm flex-1">
              <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
              <div className="rounded-full bg-gray-100 border p-1">
              {
                <TbUser size={20} aria-hidden="true"></TbUser>
              }
            </div>
              </span>
              <p className="leading-relaxed">
                <span className="block font-bold text-gray-700">{"질문자"} </span>{msg}
              </p>
            </div>
            ))
          }
          <hr></hr> */}
          <div ref={messagesEndRef} />
        </div>

{/* Recommended Questions */}
{isFirstQuestion && (
          <div className="fixed top-[460px] w-full max-w-[320px] px-2">
            <div className="bg-neutral-50 rounded-lg shadow-md">
              {/* <p className="font-semibold text-base px-3">→추천질문</p> */}
              <ul className="list-disc pl-5 space-y-1">
                {recommendedQuestions.map((question, index) => (//text-[#6b7280] 
                  <p key={index} className="text-[#6b7280] cursor-pointer hover:underline"
                    onClick={() => setInputValue(question)}>
                    {question}
                  </p>
                ))}
              </ul>
            </div>
          </div>
        )}



        {/* Input box */}
        <div className="flex items-center pt-0 w-full">
          <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleSendMessage}>
            <input
              className="flex h-10 w-full rounded-md border border-[#e5e7eb] px-3 py-2 text-base placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#9ca3af] disabled:cursor-not-allowed disabled:opacity-50 text-[#030712] focus-visible:ring-offset-2"
              placeholder="질문을 입력해주세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={loading} // 로딩 중일 때 비활성화
            />
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium text-[#f9fafb] disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-[#111827E6] h-10 px-4 py-2"
              type="submit"
              disabled={loading || !inputValue} // 로딩 중일 때 비활성화
              // input에 값 없을떄도 disabled
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
