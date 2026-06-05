// const res = fetch("https://jsonplaceholder.typicode.com/todos/1");
// console.log(res);
// fetch("https://jsonplaceholder.typicode.com/todo/1")
// .then((res)=> res.json())
// // .then((res)=> console.log(res.json));
// .then((data)=>console.log(data))
// .catch((err)=>console.log(err))
// .finally(()=>console.log("fetching done"));

//promises methods 

// Promise.all 

// const p1 = Promise.reject("success1");
// const p2 = Promise.resolve("success2");
// const p3 = Promise.reject("Error");
// Promise.race([p1,p2,p3])
// .then((res)=>console.log(res))
// .catch((err)=>console.log(err));



const vikas = new Promise((resolve,reject)=>{
   // resolve("Success");
   setTimeout(()=>{
      fetch("https://jsonplaceholder.typicode.com/todos/1")
   .then((res)=> res.json())
   .then((data)=>resolve(data))
   .catch((err)=>reject(err))
   },2000);
})
// console.log(vikas);
vikas
.then((res)=>console.log(res))
.catch((err)=>console.log(err)); 


