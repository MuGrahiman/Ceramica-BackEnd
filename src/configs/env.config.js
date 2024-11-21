require("dotenv").config();

module.exports = {
    Port : process.env.PORT || 5000,
    MongoDB_USER:process.env.MONGODB_USER ,
    MongoDB_PASS: encodeURIComponent(process.env.MONGODB_PASS),
    MongoDB_CLUSTER: process.env.MONGODB_CLUSTER,
    MongoDB_DB:process.env.MONGODB_DB,
    
}