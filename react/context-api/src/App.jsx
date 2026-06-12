import React from 'react'
import { createContext } from 'react'
import Child1 from './Child1'
 export const postman = createContext();
const App = () => {
  let data = {
    fullname : "Pratyush",
    Salary:1234567
  }
  return (
   
    <postman.Provider value={data}>
    <Child1 />
    </postman.Provider>
  )
}

export default App
