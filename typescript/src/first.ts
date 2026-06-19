// let message:string = "Hello paras";
// console.log(message);

//primitive

// let username:string="paras";
// let age:number=12
// let isloggedIn:boolean=true;
// console.log(isloggedIn);

//Arrays 

// let numbers : number[]=[1,2,3,4,5];
// console.log(numbers);

// let names:string[]= ["abhinav","akshay","paras"];
// console.log(names);

//unknown 

// let userInput : unknown;

// userInput ="pratyush";
// userInput =34;

// void (for functions which do not return anything)

// function subscribe(message:string):void{
//     console.log(message);
// }

//null and undefined 

// let nullValue :null = null;
// let undefinedValue:undefined = undefined;

//type-inference

// let inferredParas = "hello Pratyush";
// let inferredabhinav =45;



// functions in ts 

// function add(a:number,b:number):number{
//     return a+b;
// }
// const sum =add(4,6);
// console.log(sum);


//optional parameters 

// function greet(name:string,greeting?:string):string{

//     if(greeting){
//         return ` ${greeting},${name} `
//     }
//     return `Hello , ${name}`;
// }
// const bulawa = greet("pratyush");
// console.log(bulawa);


//objects 

// let user:{name:string,age:number} ={
//     name:"pratyush",
//     age:25
// }
// console.log(user.name,user.age);


//Interface 

// interface User{
//     name:string,
//     age:number,
//     email?:string,
//     readonly id:number;
// }

// let user:User ={
//     name:"pratyush",
//     age:25,
//     email:"pratyush@gmail.com",
//     id:1
// }
// // user.id=2;
// console.log(user);
