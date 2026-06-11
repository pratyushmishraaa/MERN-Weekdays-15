import React from 'react'
import { useState,useRef,useEffect } from 'react'
const App = () => {
  const [count,setCount] = useState(0);
  let ref = useRef(0);
  // console.log(ref);
  let value =0;
  const handleClick = ()=>{
    setCount(count+1);
    // value = value+1;
    // console.log(value);
    // ref.current = ref.current+1;
    // console.log(ref.current);
    ref.current = ref.current+1;
    console.log(ref.current);
  }
  // useEffect(()=>{
  //   ref.current.style.color = "red";
  // })
  return (
    <div>
    <h1>The value of count is {count}</h1>
    {/* {console.log(ref.current.style.color ="red")} */}
    <button onClick={handleClick}>Increment</button>  
    </div>
  )
}

export default App
