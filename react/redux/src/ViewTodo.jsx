import React from 'react'
import { useSelector } from 'react-redux'

const ViewTodo = () => {
   const data = useSelector((state)=>state.todos);
   console.log(data);
  return (
    <div>
    {
      data.map((item)=>
      {
         return <h1 key={item.id}>{item.text}</h1>
      })
    }
      
    </div>
  )
}

export default ViewTodo
