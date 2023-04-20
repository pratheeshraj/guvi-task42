const mongooose=require("mongoose");

const dataConnection =()=>{

    mongooose.connect(process.env.MONGO_URL).then(
        console.log("database is connection")
    ).catch((err)=>{
console.log(err);
    })

}

module.exports=dataConnection