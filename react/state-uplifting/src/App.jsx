import React from 'react'
import Child from './Child'
import { useState } from 'react'
const App = () => {
  const[name,setName] = useState("");
  return (
    <div>
    <h1>The value coming from child is : {}</h1>
      
      <Child setName={setName} name={name}/>
      
    </div>
  )
}

export default App
