// import React from 'react'
import {useState} from 'react'
import { useDispatch } from 'react-redux'
import {addTodo} from "./redux/todoSlice.js"
import ViewTodo from './ViewTodo.jsx'
import {removeAll} from "./redux/todoSlice.js"
const App = () => {
  const[inputText, setInputText] = useState("");
  const dispatch = useDispatch();
  const handleChange =(e)=>{
    setInputText(e.target.value);
  }
  const handleClick= (e) =>{
    e.preventDefault();
    if(inputText ==="") return alert("Please enter a task");
    dispatch(addTodo({text:inputText}));
    setInputText("");
  }
  const handleClick2 =()=>{
    dispatch(removeAll());
  }
  return (
    <div>
    <input type="text" placeholder='Enter your task' onChange={handleChange} value={inputText} />
    <button onClick={handleClick}>AddTodo</button>
    <button onClick={handleClick2}>Remove All</button>


    <br />
    <ViewTodo />


      
    </div>
  )
}

export default App
