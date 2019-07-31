const Cart = require('../Class/Cart');
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
router.use(express.static('public'));
var outData ='';
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

  //    findClient(dbo,'12345678909',db);
      let daw = findClient(dbo,'12345678909',db);
      console.log("a");
      console.log("hola"+daw)
      // for(let i=0;i<arr.length;i++)
      // {
      //    console.log(arr[i].size);
      // }S
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
  dbo.collection('Carts').find({
     "prods.cd": cedula
  }).toArray(function (err, result) {
     result.forEach(function (data) {
        let out = data.prods;
        console.log('out: '+out);
        db.close();
        return out;

     })
  });
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
