// rafce
import { sleep } from '@/lib/utils'
import React from 'react'
import TodoContainer from './components/BmchatContainer';

const page = async () => {
    // 사파리에서 잘 안되네 ㅋㅋ
    console.log(">>>>슬립 왜 안찍혀")
    // throw new Error("custom error");
    await sleep(1500);
    console.log(">>>>222슬립 왜 안찍혀")
  return <div>
    <TodoContainer></TodoContainer>
  </div>
  
}

export default page;  