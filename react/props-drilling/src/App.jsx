import React from 'react'
import Child1 from './Child1'
const App = () => {
  let data ={
    fullname : "Pratyush",
    age:25
  }
  return (
    <div>
      
      <Child1 data={data} />
      
    </div>
  )
}

export default App
