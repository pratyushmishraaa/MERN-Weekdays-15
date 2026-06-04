// function xyz(to,sub,body){
//    console.log(`mail sent to ${to} with subject ${sub} and body ${body}`);
// }
// xyz("paras@gmail.com","kaise ho","sab theek hai");

function xyz(to){
   return function(sub){
      return function(body){
         console.log(`mail sent to ${to} with subject ${sub} and body ${body}`);
      }
   }
}
xyz("paras@gmail.com")("kaise ho")("sab theek hai");