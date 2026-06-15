import {createSlice,nanoid} from "@reduxjs/toolkit";

export const todoSlice = createSlice({
   name:"todos",
   initialState:[],
   reducers:{
      addTodo:(state,action)=>{
         const newTodo={
            id:nanoid(),
            text:action.payload.text,
            completed:false,
         
         }
         state.push(newTodo)
      },
      removeAll:()=>{
         return [];
      }

   }
})

export const {addTodo,removeAll} = todoSlice.actions;
export default todoSlice.reducer;