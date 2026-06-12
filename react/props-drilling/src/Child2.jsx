import React from 'react'

const Child2 = (props) => {
   let bio = props.data2;
   console.log(bio);

  return (
    <div>
    <h1>My name is : {bio.fullname}</h1>
    <h1>My age is : {bio.age}</h1>
      
    </div>
  )
}

export default Child2

