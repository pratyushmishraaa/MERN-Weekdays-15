function makeMaggie(rawMaggie,cb){
   console.log(`I have bought ${rawMaggie} from market`);
   cb();
}
function boilWater(cb){
   console.log("I have boiled water");
   cb();
}
function addMasala(cb){
   console.log("I have added masala");
   cb();
}
function serveMaggie(cb){
   console.log("I have served maggie");
   cb();
}

makeMaggie("aataMaggie",()=>{
   boilWater(()=>{
      addMasala(()=>{
         serveMaggie(()=>{
            console.log("Maggie is ready to eat");
         });
      })
   })
})


