import React from 'react'

const Child = (props) => {
   console.log(props);
   const handleChange = (e) =>{

      props.setName(e.target.value);
   }
  return (
    <div>
    <input type="text" placeholder='Enter the name' onChange={handleChange} value ={props.name}/>
      
    </div>
  )
}

export default Child
