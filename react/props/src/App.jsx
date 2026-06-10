import React from 'react'
import Child from "./Child.jsx";

const App = () => {
  return (
    <div>
      
      <Child purchasingPower ="1000"/>
      <Child fullname="Paras"  salary = "20000" age="26"/>
      <Child fullname="Pratyush" salary="150" age="22"/>
      
    </div>
  )
}

export default App
