// import React from 'react'

// const Child = React.memo(() => {
//    console.log("Child Component Rendered");
//   return (
//     <div>
//     <h1>Child Component</h1>
      
//     </div>
//   )
// });

// export default Child


import React from 'react'
import {memo} from "react";
const Child = () => {
   console.log("Child Component Rendered");
  return (
    <div>
    <h1>Child Component</h1>
      
    </div>
  )
};

export default memo(Child);
