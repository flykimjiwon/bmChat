// import { createBrowserClient } from "@supabase/ssr";
// // 브라우저에서 바로 supabase api 호출할 떄 사용함
// // 반대는 서버클라이언트

// import { Database } from "@/types/supabase" //@는 루트경로 ,직접만든 데이터베이스 타입 그대로 가져오기

import { createBrowserClient } from "@supabase/ssr";
// import { Database } from "@/types/supabase";

// export const supaBrowserClient = createBrowserClient<Database>(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!
// );

export const createSupabaseBrowserClient = ()=>
    createBrowserClient(
        // createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )