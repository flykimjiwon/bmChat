'use client'
// 에러 컴포넌트는 원래 이렇게 써야함
import {BounceLoader} from "react-spinners"

import React from 'react'

const Error = () => {
  return (
    <div className="flex flex-col items-center mt-12"><BounceLoader></BounceLoader>
    <div className="font-bold my-2">There is something wrong...</div>
    </div>
  )
}

export default Error