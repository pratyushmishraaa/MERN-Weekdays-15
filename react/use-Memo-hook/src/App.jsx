import React from 'react'
import { useState , useMemo , useCallback} from 'react'
import Child from "./components/Child";
const App = () => {
  const[count,setCount] = useState(0);
  const[count2,setCount2] = useState(0);
 const handleClick = ()=>{
  setCount(count+1);
 }
 const handleClick2 = ()=>{
  setCount2(count2+1);
 }
 function sum(){
  console.log("Heavy function Called");
  let sum =0;
  for(let i =0;i<1000000000;i++){
    sum = sum+i;
  }
  return sum;
 }
 let res = useMemo(()=>sum(),[]);

 function sayHi(){
  console.log("Hi");
 }

 const sayHi2 = useCallback(()=>sayHi(),[]);
  return (
    <div>
    <h1>The value of sum is {res}</h1>
    <h1>The value of count is {count}</h1>
    <button onClick={handleClick}>Increment</button>
    <br />
    <button onClick={handleClick2}>Child Component button</button>
    <h1>The Value of Count2 is {count2}</h1>
    <Child count2={count2} sayHi2={sayHi2} />
    </div>
  )
}

export default App
