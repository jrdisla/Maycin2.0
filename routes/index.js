var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  var session = 0;
  var username = '';
  if(req.session.user !== undefined)
  {
      session = 1;
      username = req.session.user;
  }
  res.render('index', {
    title: 'Express',
    session: session,
    cd : username
  }
  );
});

router.get('/session/:id',function (req,res) {
  console.log("llego");
  if(req.session.user === undefined)
  {
      console.log("no hay user"+req.session.user);
      req.session.user = req.params.id;
      console.log("Setted user: "+req.session.user);
      res.redirect("/shop/"+req.session.user);
  }
  else
  {
    console.log("hay user");
    res.redirect("/shop/"+req.session.user);
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


module.exports = router;
