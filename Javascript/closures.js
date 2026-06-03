function outer(){


   let a =10;
   function inner(){
      console.log(a);
   }
  return inner;
}
 let res1 = outer();
//  console.log(res1);
 res1();


