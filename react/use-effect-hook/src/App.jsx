import React from 'react'
import { useState , useEffect , useLayoutEffect} from 'react'
const App = () => {
  // console.log("API Called");
  const [count,setCount] = useState(0);
  const handleClick = ()=>{
    setCount(count+1);
  }
  // useEffect(()=>{
  //   console.log("API Called");
  // },[]);
  useEffect(()=>{
    console.log("Component Mounted");
  });
  useLayoutEffect(()=>{
    console.log("Component update");
    return ()=>{
      console.log("Component Unmounted");
    }
  },[count]);
  return (
    <div>
    <h1>The value of count is {count}</h1>
    <button onClick={handleClick}>Increment</button>
      
    </div>
  )
}

export default App
