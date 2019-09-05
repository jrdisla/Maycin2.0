const Cart = require('../Class/Cart');
var express = require('express');
var router = express.Router();
var path = require('path');
var mongodb = require('mongodb').MongoClient;

router.use(express.static('public'));

var url = "mongodb://localhost:27017/";

router.get('/', function(req, res, next) {

    var id = req.query.id;
    var type = req.query.type;
    var data = {};
   mongodb.connect(url,function (err,db) {
       var dbo = db.db("Maycin");
       dbo.collection('items').findOne({type:type},function (err,result) {
           data = result;
           if(err)
               throw err;
           db.close();
           res.render("shop",{
               'data':result,
               'type':type
           });
       });
   });
});

router.get("/cart/",function (req,res,next) {

    let session = 0;
    let username = '';
    if(req.session.user !== undefined)
    {
        session = 1;
        username = req.session.user;
        const plp = req.query.id;
        mongodb.connect(url,function (err,db) {
            let dbo = db.db("Maycin");
            dbo.collection('Carts').find({
                "prods.cd": plp
            }).toArray(function (err, result) {
                console.log("RESULTTTTTTTTT"+result);
                if(result.length > 0) {
                    result.forEach(function (data) {
                        let out = data.prods;
                        sendprice(out, res, session, username, db);
                    })
                }
                else
                {
                    console.log("AQUI?");
                    res.render('shopcart',{
                        car:null,
                        session: session,
                        cd : username,
                        price: 0,
                        items: 0

                    });
                }
            });
        })
    }

});
let insertCart = function(dbo,cart,db){
   dbo.collection('Carts').insertOne(cart,function (err,result) {
      if (err) throw err;
      console.log("El resultado es:"+result);
      db.close;
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
    let tienda = req.body.tienda;
    let type = req.body.type;
    let info = req.body.info;
    let radio = req.body.radio;
    let size = req.body.size;
    let cant = req.body.cant;
    let file = `./files/${req.files.file.name}`;
    let cd_cliente = req.session.user;
    let tday = new Date();
   mongodb.connect(url,function (err,db) {
      if(err) throw err;
      let dbo = db.db("Maycin");
      let it = tday.getFullYear()+''+(tday.getMonth()+1)+''+tday.getDay()+''+tday.getHours()+''+tday.getMinutes()+''+tday.getSeconds()+''+tday.getMilliseconds();
      dbo.collection("Carts").find({cedula : cd_cliente}).limit(1).count(function (err, res) {
         if (err)
            throw err;
         if(res===0){
             let prod = [{
                 id_i: it,
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
                 id_i : it,
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
      res.redirect("/");
   });
});

let sendprice = function(out,res,session,username,db)
{
    let total_price = 0;
    let price = 0;
    let cant = 0;
    let subTotal = 0;
    let index = 0;
        let dbo = db.db("Maycin");
        out.forEach(function (pr) {
            dbo.collection('prices').findOne({
                type: pr.type,
                size: pr.size
            },function (err,result) {
                if (err) throw err;
                price = parseFloat(result.price);
                cant = parseFloat(pr.cant);
                subTotal = price * cant;
                total_price += subTotal;
                if(index===(out.length-1))
                {
                    var num = 'RD$' + total_price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    db.close();
                    res.render('shopcart',{
                        car:out,
                        session: session,
                        cd : username,
                        price: num,
                        items: out.length

                    });
                }
                index++;

            });
        });
};

router.get('/test',function (req,res) {
   mongodb.connect(url,function (err,db) {
       const dbo = db.db('Maycin');
       dbo.collection('prices').findOne({
           type: "Shopping",
           size: "7X15"
       }).then(function (doc) {
           console.log(doc);
       })
   })
});
router.delete('/delete/',function (req,res) {
    let type = req.body.id;
    mongodb.connect(url,function (err,db) {
        let dbo = db.db("Maycin");
        dbo.collection("Carts").update(
            {
                cedula:req.session.user
            },
            {
                $pull: {
                    prods: {
                        id_i: type
                    }
                }
            }
            ,function (err,result) {
                if(err) {
                    console.log("err", err);
                } else {
                    console.log("sucessful");
                  res.send("good");
                }
        })
    })
});
let updateCart = function(req,res){
    if(req.session.user !== undefined)
    {
        console.log("OCNO LLEGO");
        var session = 1;
        var username = req.session.user;
        const plp = req.query.id;
        mongodb.connect(url,function (err,db) {
            let dbo = db.db("Maycin");
            dbo.collection('Carts').find({
                "prods.cd": plp
            }).toArray(function (err, result) {
                result.forEach(function (data) {
                    let out = data.prods;
                    sendprice(out,res,session,username,db);
                })
            });
        })
    }
};
router.get("/confirm/",function (req,res) {
    let session = 0;
    let username = '';
    if(req.session.user !== undefined)
    {
        session = 1;
        username = req.session.user;
        mongodb.connect(url,function (err,db) {
            let dbo = db.db("Maycin");
            dbo.collection('Carts').find({
                "prods.cd": req.session.user
            }).toArray(function (err, result) {
                console.log("RESULTTTTTTTTT"+result);
                if(result.length > 0) {
                    result.forEach(function (data) {
                        let out = data.prods;
                        //      db.close();
                        sendOrder(out, res,db);
                    })
                }
                else
                {
                    console.log("AQUI?");
                    res.render('shopcart',{
                        car:null,
                        session: session,
                        cd : username,
                        price: 0,
                        items: 0

                    });
                }
            });
        })

    }
});

let sendOrder = function(out,res,sessionid,db,name,last,dir,city,provin,radio,tele)
{
    let tday = new Date();
    let it = tday.getFullYear()+''+(tday.getMonth()+1)+''+tday.getDay()+''+tday.getHours()+''+tday.getMinutes()+''+tday.getSeconds()+''+tday.getMilliseconds();
    let dbo = db.db("Maycin");
    dbo.collection("Orders").insertOne({
        id: it,
        Nombre: name,
        Apellido: last,
        Direccion: dir,
        Ciudad: city,
        Provincia: provin,
        Cedula: sessionid,
        WhatsApp: radio,
        Telefono: tele,
        Productos:out
    },function (err,result) {
        if(err) throw err;
       console.log(result);
       db.close();
    });
};
router.get("/order/",function (req,res) {
   res.render("order")
});
router.post("/order/done/",function (req,res) {
let name = req.body.name;
let lastn = req.body.last;
let dir = req.body.addr;
let city = req.body.city;
let provin = req.body.provi;
let radio = req.body.radio;
let tele = req.body.tel;
    let sessionid = 0;
    let username = '';
    if(req.session.user !== undefined)
    {
        username = req.session.user;
        mongodb.connect(url,function (err,db) {
            let dbo = db.db("Maycin");
            dbo.collection('Carts').find({
                "prods.cd": req.session.user
            }).toArray(function (err, result) {
                console.log("RESULTTTTTTTTT"+result);
                if(result.length > 0) {
                    result.forEach(function (data) {
                        let out = data.prods;
                        sendOrder(out, res,username,db,name,lastn,dir,city,provin,radio,tele);
                    })
                }
            });
        })

    }

});
module.exports = router;
