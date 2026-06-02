// let age =18;
// if(age>18){
//    console.log("you are eligible to vote");
// } else if (age ==18){
//    console.log("You are just eligible to vote");
// }
//  else{
//    console.log("You are not eligible to vote");
// }

//switch 

// let age =15;
// switch(age){
//     case 18:
//       console.log("can vote");
//       break;
//       case 16:
//          console.log("can not vote");
//          break;
//          default:
//             console.log("Invalid age");
//             break;
// }

// let age =19;
// console.log(age>18 ? "can vote " : "can not vote");

// && || !

let username = "satya";
let password = "12345";

if(username == "satya " && password == "12345"){
   console.log("login Success");
}

if(username =="satya" || password == "12345"){
   console.log("login Success");
}
if(!(username == "satya" && password == "12345")){
   console.log("login Failed");
}