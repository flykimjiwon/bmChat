'use client'
// 에러 컴포넌트는 원래 이렇게 써야함
import {DotLoader} from "react-spinners"

import React from 'react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center mt-12">
      <div>
      <DotLoader></DotLoader>
      </div>
    <div className="font-bold my-2">loading...</div>
    </div>
  )
}

export default Loading;