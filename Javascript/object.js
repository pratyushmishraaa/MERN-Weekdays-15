// let fruits = ["apple","banana","grapes"];
// let [abhinav , ...pratyush] = fruits;
// console.log(abhinav);
// console.log(pratyush[1]);

//multiple argument handling 
// function sum(a,b){
//    return a+b;

// }
// let res1 =sum(4,5);
// console.log(res1);

function sum(...args){
   let add =0;
   for(let i =0;i<args.length;i++){
      add+=args[i];
   }
   console.log(add);
}
sum(1,2,3,4,5,6,7,8,9);