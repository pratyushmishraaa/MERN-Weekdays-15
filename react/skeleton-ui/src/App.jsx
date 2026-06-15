// import React from 'react'
import {useState, useEffect} from 'react'
import Card from './Card'
import Skeleton from './Skeleton'
import {lazy , Suspense} from 'react'

const Product = lazy(()=>import('./Product'))


const App = () => {
  const[loading,setLoading] = useState(true);

  useEffect(()=>{
    setTimeout(()=>{
      setLoading(false);
    },5000)
  })

  return (
    <div>
    {loading?<Skeleton />:<Card />}

    <Suspense fallback={<h1>Loading... ho rha h </h1>}>
      <Product />
    </Suspense>


      
    </div>
  )
}

export default App
