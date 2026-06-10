import React from 'react'
import { useState } from 'react'
const App = () => {
  // let btn = document.getElementById("btn");
  // console.log(btn);
  // btn.addEventListener("click",function(){
  //   console.log("Clicked");
  // })
  // let a =5;
  const[count,setCount] = useState(0);
 const handleClick = ()=>{
  // console.log("Clicked");
  // a = a-1;
  // console.log(a);
  setCount(count+1);
  console.log(count);


 }
 
  return (
    <div>
    <h1>The value of count is {count}</h1>
    {/* <button onClick={()=>console.log("Button Clicked")}>Click</button> */}
    <button onClick={handleClick}>Increment</button>
      
    </div>
  )
}

export default App
