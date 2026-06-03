let obj1={
   name:"pratyush",
   age:25,
   address:{
      city:"noida",
      state:"up",
   }
}
// obj2 =obj1;
// let obj2 ={...obj1};
// let obj2 = structuredClone(obj1);
// let obj2 = JSON.parse(JSON.stringify(obj1));

// obj2.name ="vikas";
obj2.address.city ="buxar";
console.log(obj2);
console.log(obj1);