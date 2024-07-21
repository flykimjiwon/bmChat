"use client";

import { createSupabaseBrowserClient } from "@/lib/client/supabase";


//todo list 가져오기 bm_chat 이거만 새로 만든 테이블로 이름 바꿔서 쓰면됨, 데이터 적재만 지속적으로하면됨
//채팅목록말고 관리자페이지 하나만 딱만들어서 어떤 채팅했는지 기록만하게하기

export const getBmchat = async () =>{
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.from("bm_chat").select("*").is("deleted_at",null)
    .order("id",{
        ascending:false, //최신 데이터 순으로 정렬
    });

    return result.data;
}

//todoList 가져오기 by Id
export const getBmchatById = async (id:number) =>{
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.from("bm_chat").select("*")
    .is("deleted_at",null)
    .eq("id",id);

    return result.data;
}

// todoList 가져오기 + search

export const getBmchatSearch = async (terms:string) =>{
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.from("bm_chat").select("*")
    .is("deleted_at",null)
    .ilike("content",`%${terms}%`) // terms라는게 포함되어있는 컨텐츠
    .order("id",{ascending:false})
    .limit(500); //

    return result.data;
}

// todoList 생성하기

export const createBmchat = async (question:string,answer:string) =>{
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.from("bm_chat")
    .insert({question:question,answer:answer}) //key value같으면 생략도 가능
    .select();

    return result.data;
}

// todoList 업데이트하기

export const updateBmchat = async (id:number,content:string) =>{
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.from("bm_chat")
    .update({
        content,
        updated_at:new Date().toISOString(), //업데이트한 시간으로 바꿔주기
    }).eq("id",id)
    .select();

    return result.data;
}

// todoList softDelete
export const deleteBmchat = async (id:number) =>{
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.from("bm_chat")
    .update({
        deleted_at:new Date().toISOString(), // 삭제된 것이라고 약속
        updated_at:new Date().toISOString(), //업데이트한 시간으로 바꿔주기
    }).eq("id",id)
    .select();

    return result.data;
}

// todoList hardDelete
// 실제로는 이런 하드 딜리트는 쓰지않는게 좋다.
export const deleteBmchatHard = async (id:number) =>{
    const supabase = createSupabaseBrowserClient();
    const result = await supabase.from("bm_chat")
    .delete().eq("id",id);

    return result.data;
}