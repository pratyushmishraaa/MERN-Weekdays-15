import React from 'react'
import Child2 from './Child2'
const Child1 = (props) => {
   let data2 = props.data;
  return (
    <div>
      
      <Child2 data2={data2} />
      
    </div>
  )
}

export default Child1
