const Cart = require('../Class/Cart');
let express = require('express');
let router = express.Router();
let path = require('path');
let mongodb = require('mongodb').MongoClient;

router.use(express.static('public'));

let url = "mongodb://localhost:27017/";

router.get('/', function(req, res, next) {
    let type = req.query.type;
    let data = {};
   mongodb.connect(url,function (err,db) {
       let dbo = db.db("Maycin");
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
                        sendprice(out, res, session, username, db,0,null,null,null,null,null,null,null);
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
             let addr = new Cart(cd_cliente,prod);
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

let sendprice = function(out,res,session,username,db,val,name,last,dir,city,provin,tele,id)
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
                    let num = 'RD$' + total_price.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    db.close();
                    if(val ===0){
                        res.render('shopcart',{
                            car:out,
                            session: session,
                            cd : username,
                            price: num,
                            items: out.length

                        });
                    }
                    else
                    {
                        res.render('orders',{
                            id:id,
                            name:name,
                            last:last,
                            dir:dir,
                            city:city,
                            provin:provin,
                            tele: tele,
                            car:out,
                            session: session,
                            cd : username,
                            price: num,
                            items: out.length

                        });
                    }

                }
                index++;

            });
        });
};

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
        let session = 1;
        let username = req.session.user;
        const plp = req.query.id;
        mongodb.connect(url,function (err,db) {
            let dbo = db.db("Maycin");
            dbo.collection('Carts').find({
                "prods.cd": plp
            }).toArray(function (err, result) {
                result.forEach(function (data) {
                    let out = data.prods;
                    sendprice(out,res,session,username,db,0,null,null,null,null,null,null,null);
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
                "prods.cd": username
            }).toArray(function (err, result) {
                console.log("RESULTTTTTTTTT"+result);
                if(result.length > 0) {
                    result.forEach(function (data) {
                        let out = data.prods;
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
       deleteFromcart(db,sessionid)
       //db.close();
    });


};

let deleteFromcart = function (db,cd) {
    let dbo = db.db("Maycin");
    let myquery = { cedula: cd };
    dbo.collection("Carts").deleteOne(myquery, function(err, obj) {
        if (err) throw err;
        console.log("1 document deleted");
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

router.get("/orders/",function (req,res) {

    let session = 0;
    if(req.session.user !== undefined)
    {
        session = 1;
        mongodb.connect(url,function (err,db) {
           let dbo = db.db("Maycin");
           dbo.collection("Orders").find({
               "Productos.cd":req.query.id
           }).toArray(function (err,result) {
               if(err)
                   throw err;
               result.forEach(function (data) {
                   let Nombre= data.Nombre;
                   let Apellido= data.Apellido;
                   let Direccion= data.Direccion;
                   let Ciudad= data.Ciudad;
                   let  Provincia= data.Provincia;
                   let   Telefono= data.Telefono;
                   let id = data.id;
                   let out = data.Productos;
                   sendprice(out,res,session,req.query.id,db,1,Nombre,Apellido,Direccion,Ciudad,Provincia,Telefono,id);
               })
           });
        });
    }
});

module.exports = router;
