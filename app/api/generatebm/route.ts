import { NextResponse } from 'next/server';

// JSON 응답의 형식을 정의합니다 (예시로 any 사용)
type ApiResponse = any;

export async function POST(request: Request): Promise<NextResponse> {
  const { prompt } = await request.json();

  const maxRetries = 3;  // 최대 재시도 횟수
  const retryDelay = 1000;  // 재시도 간격 (밀리초 단위)

  const fetchWithRetries = async (url: string, options: RequestInit, retries: number): Promise<ApiResponse> => {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        if ((response.status === 503 || response.status === 504) && retries > 0) {
          // 503,504 오류일 경우 재시도
          console.log(`503 오류 발생. 재시도 중... 남은 횟수: ${retries}`);
          await new Promise(resolve => setTimeout(resolve, retryDelay)); // 지연 후 재시도
          return fetchWithRetries(url, options, retries - 1);
        } else {
          throw new Error(`API 요청 실패: ${response.status}`);
        }
      }

      return await response.json() as ApiResponse;
    } catch (error) {
      if (retries > 0) {
        console.log(`재시도 중... 남은 횟수: ${retries}, 오류: ${error}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay)); // 지연 후 재시도
        return fetchWithRetries(url, options, retries - 1);
      } else {
        throw error;
      }
    }
  };

  try {
    const data = await fetchWithRetries('http://43.201.248.119:2333/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        text: prompt,
      }),
    }, maxRetries);

    return NextResponse.json(data);
  } catch (error) {
    console.error('최종 오류:', error);
    return NextResponse.json({ error: '서버 오류 또는 외부 API 요청 실패' }, { status: 500 });
  }
}
