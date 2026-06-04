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

// function sum(...args){
//    let add =0;
//    for(let i =0;i<args.length;i++){
//       add+=args[i];
//    }
//    console.log(add);
// }
// sum(1,2,3,4,5,6,7,8,9);



let obj1={
   fname:"pratyush",
   lname:"Mishra",
   print:function(city){
      console.log(`hello ${this.fname} ${this.lname}` + ` from ${city}`);
   }
}
// obj1.print();

let obj2={
   fname:"abhinav",
   lname:"singh",
}
// obj1.print.call(obj2, "Noida");
// obj1.print.apply(obj2, ["Noida"]);
// obj1.print.bind(obj2, "Noida")();














