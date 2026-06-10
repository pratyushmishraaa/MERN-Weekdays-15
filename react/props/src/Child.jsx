import React from 'react'

const Child = ({purchasingPower,fullname,age}) => {
   // let fullname = "abhinav";
   
  return (
    <div>
    {/* <h1>Hello Paras</h1> */}
    {/* <h1>Hello {fullname}</h1> */}
    <h1>Hello {fullname}</h1>
    <h1>My {age}</h1>
    <h1>{purchasingPower}</h1>
    
      
    </div>
  )
}

export default Child
