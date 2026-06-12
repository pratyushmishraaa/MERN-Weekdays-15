import React from 'react'
import { useContext } from 'react'
import { postman } from './App'
const Child2 = () => {
   const data = useContext(postman);
   // console.log(data);
  return (
    <div>
    <h1>My name is : {data.fullname}</h1>
    <h1>My age is : {data.Salary}</h1> 
      
    </div>
  )
}

export default Child2
