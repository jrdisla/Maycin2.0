var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
/* GET home page. */
router.get('/', function(req, res, next) {
  var session = 0;
  var username = '';
  if(req.session.user !== undefined)
  {
      session = 1;
      username = req.session.user;
      console.log('estoy en index /'+username);
  }
  res.render('index', {
    title: 'Express',
    session: session,
    cd : username
  }
  );
});

router.get('/Logic/',function (req,res) {
  var id = req.query.id;
  if(req.session.user === undefined)
  {
    req.session.user = id;
    res.redirect("/");
  }
  else
  {
    res.redirect("/");
  }
});

router.get('/logout/',function (req,res) {
  req.session.destroy();
  res.redirect("/");
});

router.get('/session/',function (req,res) {
  console.log("llego");
  var id = req.query.id;
  var typ = req.query.type;
  if(req.session.user === undefined)
  {
      console.log("no hay user"+req.session.user);
      req.session.user = id;
      console.log("Setted user: "+req.session.user);
      res.redirect("/shop/?id="+id+"&type="+typ);

  }
  else
  {
    console.log("hay user");
    res.redirect("/shop/?id="+id+"&type="+typ);
  }
  // else
  // {
  //   req.session.user = req.params.id;
  //   console.log("Setted user");
  // }

  //res.redirect("/shop/"+req.session.user);

});
router.get('/session', function(req, res, next) {
  console.log("llego el user: " +req.session.user);
  if(req.session.user === undefined)
  {
    console.log("no hay user"+req.session.user);
    //req.session.user = req.params.id;
    console.log("Setted user");
  }
  else
  {
    console.log("hay user");
  }
});

router.get('/insert',function (req,res) {

  let item = {
    type : "Tazas",
    size : ["Pequeñas","Medianas","Grandes"],
    cantidad: [10,20,30,50,100,200,300],
    price :[
      {

        size:"Pequeñas",
        price: 10,
      },
      {
        size:"Medianas",
        price: 12.5,
      },
      {
        size:"Grandes",
       price: 14.5
      }

    ]
    };


mongodb.connect(url,function (err,db) {
  const dbo = db.db("Maycin");
  dbo.collection("items").insertOne(item,function (err,result) {
    if(err)
      throw err;
    db.close();
      }

  )
})
});


module.exports = router;
