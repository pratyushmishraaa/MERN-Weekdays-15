// let a =10;

// function akshay(){
//    function shubham(){
//       function paras(){
//          console.log(a);
//       }
//    }
// }

// function abc(){
// console.log("hello");
// }
// abc();
// let a =20;


// console.log(a);

//  let ram = function (){

// }
// ram();

// (props)=>{}

// (()=> console.log("hello"))();
// (()=> console.log("Akshay"))();

let a =10;
function outer(){
   function inner(){
      console.log(a);
   }
   inner();
}
outer();