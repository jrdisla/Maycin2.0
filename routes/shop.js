const Cart = require('../Class/Cart');
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
router.use(express.static('public'));

// var insertCart = function(db,cart){
//   db.conllection('Carts').insertOne({
//      cedula : cart.id,
//      productos: cart.prods
//   });
// };

router.get('/:id', function(req, res, next) {
   var id = req.params.id;

   var cart = new Cart(id,[{
      name: 'Nuevo',
      size: '24',
      cd: id
   }]);

   var toAdd = {
      name: 'function',
      size: '25',
      cd: id
   };

   var url = "mongodb://localhost:27017/";
   mongodb.connect(url,function (err,db) {
      if(err) throw err;

      console.log(cart);
      var dbo = db.db("Maycin");
      //insertCart(dbo,cart);
     // addTocart(dbo,toAdd,id);
        findClient(dbo,id,db);
    //  console.log('El cliente es:')
   });

   res.render('shop');
});
let insertCart = function(dbo,cart){
   dbo.collection('Carts').insertOne(cart,function (err,result) {
      if (err) throw err;
      console.log("El resultado es:"+result);
     // db.close();
   })
};
let addTocart = function(dbo,toAdd,id){
   dbo.collection('Carts')
       .updateOne(
           {cedula:id},
           {$push: {prods:toAdd}}
       );
};

let findClient = function (dbo,cedula,db)
{
   // const c = dbo.collection('Carts').find(
   //     {cedula:cedula,
   //     'prods.cd': cedula
   //     }
   // );
   const cursor = dbo.collection('Carts').find({
      "prods.cd":'55545678907'
   }).toArray(function (err,result) {
    //  console.log(result)
      result.forEach(function (data) {
         data.prods.forEach(function (pol) {
            console.log(pol.name)
         });
      //   console.log(sh)
      })
   });
//console.log("aqio "+JSON.stringify(cursor));
};


router.post('/upload',(req,res) => {

   var first = req.body.first;
   var last = req.body.last;
   var tienda = req.body.tienda;
   var city = req.body.city;
   var muni = req.body.muni;
   var addr = req.body.addr;
   var info = req.body.info;
   var radio = req.body.radio;
   var size = req.body.size;
   var cant = req.body.cant;
   var file = `./files/${req.files.file.name}`;

   var fact = new Fact(first,last,city,muni,addr,tienda,'41','shop',size,cant,file,info,'2 colors',tienda,cant);
   console.log(fact.user.cedula);
   let EDFile = req.files.file
   EDFile.mv(`./files/${EDFile.name}`,err => {
      if(err) return res.status(500).send({ message : err })

      return res.status(200).send({ message : 'File upload' })
   })

});
module.exports = router;
