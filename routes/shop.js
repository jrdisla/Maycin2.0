const Cart = require('../Class/Cart');
var express = require('express');
var router = express.Router()
var path = require('path');
var mongodb = require('mongodb').MongoClient;

router.use(express.static('public'));
var outData ='';
// var insertCart = function(db,cart){
//   db.conllection('Carts').insertOne({
//      cedula : cart.id,
//      productos: cart.prods
//   });
// };
var url = "mongodb://localhost:27017/";

router.get('/', function(req, res, next) {

    var id = req.query.id;
    var type = req.query.type;
    console.log("LLEGUE A SHOP /");
   //
   // var item_shop = {
   //     type: 'cup',
   //     size: ['Pequeñas','Medianas','Grandes'],
   //     cantidad: [5,10,25,50,100,200,300,400,500]
   //
   // };
    var data = {};
   mongodb.connect(url,function (err,db) {
       var dbo = db.db("Maycin");
       // dbo.collection('items').insertOne(item_shop,function (err,result) {
       //     if (err)
       //         throw err;
       //     console.log(result);
       // });
       dbo.collection('items').findOne({type:type},function (err,result) {
           data = result;
           if(err)
               throw err;
       //    console.log(data.size);
           db.close();
           res.render("shop",{
               'data':result,
               'type':type
           });
       });
   });
});
  //  var cart = new Cart(id,[{
  //     name: 'Nuevo',
  //     size: '24',
  //     cd: id
  //  }]);
  //
  //  var toAdd = {
  //     name: 'function',
  //     size: '25',
  //     cd: id
  //  };
  //
  //  var url = "mongodb://localhost:27017/";
  //  mongodb.connect(url,function (err,db) {
  //     if(err) throw err;
  //
  //     console.log(cart);
  //     var dbo = db.db("Maycin");
  //
  //     insertCart(dbo,cart,db);
  //    // addTocart(dbo,toAdd,id);
  //
  // //    findClient(dbo,'12345678909',db);
  // //     let daw = findClient(dbo,'12345678909',db);
  // //     console.log("a");
  // //     console.log("hola"+daw)
  //
  //     // for(let i=0;i<arr.length;i++)
  //     // {
  //     //    console.log(arr[i].size);
  //     // }S
  //   //  console.log('El cliente es:')
  //  });

router.get("/cart/",function (req,res,next) {

    var session = 0;
    var username = '';
    if(req.session.user !== undefined)
    {
        session = 1;
        username = req.session.user;
        console.log('estoy en index /'+username);
    }


    const plp = req.query.id;
    console.log("LLEGUE AL CARROOOOOOOOOOOOOOOOOOOOOOO"+plp);
    mongodb.connect(url,function (err,db) {
        var dbo = db.db("Maycin");
        dbo.collection('Carts').find({
            "prods.cd": plp
        }).toArray(function (err, result) {
            result.forEach(function (data) {
                let out = data.prods;
                out.forEach(function (tr) {
                    console.log(tr.name);
                    console.log(tr.cd);
                });
                console.log('out: '+out);

                db.close();
                res.render('shopcart',{
                    car:out,
                    session: session,
                    cd : username
                });

            })
        });
    })

});
let insertCart = function(dbo,cart,db){
   dbo.collection('Carts').insertOne(cart,function (err,result) {
      if (err) throw err;
      console.log("El resultado es:"+result);
      db.close;
     // db.close();
   })
};
let addTocart = function(dbo,toAdd,id,db){
   dbo.collection('Carts')
       .updateOne(
           {cedula:id},
           {$push: {prods:toAdd}}
       );
   db.close();
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
   // var first = req.body.first;
   // var last = req.body.last;
   var tienda = req.body.tienda;
   // var city = req.body.city;
   // var muni = req.body.muni;
   // var addr = req.body.addr;
    var type = req.body.type;
   var info = req.body.info;
   var radio = req.body.radio;
   var size = req.body.size;
   var cant = req.body.cant;
   var file = `./files/${req.files.file.name}`;
   var cd_cliente = req.session.user;
   mongodb.connect(url,function (err,db) {
      if(err) throw err;
      var dbo = db.db("Maycin")
      dbo.collection("Carts").find({cedula : cd_cliente}).limit(1).count(function (err, res) {
         if (err)
            throw err;
         if(res===0){
             let prod = [{
                 type: type,
                 cd: cd_cliente,
                 tienda: tienda,
                 inf: info,
                 colors: radio,
                 size: size,
                 cant: cant,
                 logo: file
             }];
             var addr = new Cart(cd_cliente,prod);
            insertCart(dbo,addr,db);
         }
         else {
             let prod = {
                 type: type,
                 cd: cd_cliente,
                 tienda: tienda,
                 inf: info,
                 colors: radio,
                 size: size,
                 cant: cant,
                 logo: file
             };
            addTocart(dbo,prod,cd_cliente,db);
         }
         db.close();
      });
    //  console.log("la cantidad es: "+ver);
     // insertCart(dbo,addr,db);
      res.redirect("/");
   });

 //  insertCart(dbo,prod,db);
   // var fact = new Fact(first,last,city,muni,addr,tienda,'41','shop',size,cant,file,info,'2 colors',tienda,cant);
   // console.log(fact.user.cedula);
   // let EDFile = req.files.file
   // EDFile.mv(`./files/${EDFile.name}`,err => {
   //    if(err) return res.status(500).send({ message : err })
   //
   //    return res.status(200).send({ message : 'File upload' })
   // })


});
module.exports = router;
