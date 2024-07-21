import { createBmchat, deleteBmchat, getBmchat, getBmchatSearch, updateBmchat } from "@/apis/bm_chat";
import { Database } from "@/types/supabase";
import { useState,useEffect } from "react"

type TodoDto = Database["public"]["Tables"]["bm_chat"]["Row"]

const useBmchatController = () =>{
    const [loading,setLoading] = useState(true);
    const [todos,setTodos] = useState<TodoDto[]>([]);

    const onGetTodos = async () =>{
        setLoading(true);
        try{
            const resultTodos = await getBmchat();
            if(resultTodos) setTodos(resultTodos);
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        onGetTodos();
    },[])

    // 비어있는 todo 생성
    const onCreateEmptyTodos = async()=>{
        // await createBmchat();
        await onGetTodos();
    }
    // todo 업데이트
    const onUpdateTodos = async(id:number, content:string) =>{
        await updateBmchat(id,content);
        await onGetTodos();
    }

    // todo 삭제
    const onDeleteTodos = async(id:number)=>{
        await deleteBmchat(id);
        await onGetTodos();
    }

    // todo 검색
    const onSearchTodos = async(terms:string)=>{
        if(terms){
            const todoResult = await getBmchatSearch(terms);
            if(todoResult) setTodos(todoResult);
        }else{
            await onGetTodos();
        }
    }

    return {loading,todos,onCreateEmptyTodos,onUpdateTodos,onDeleteTodos,onSearchTodos};
}

export default useBmchatController;