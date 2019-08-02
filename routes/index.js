var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/session/:id',function (req,res) {
  console.log("llego");
  console.log(req.session);
  if(req.session.user == null)
  {
    console.log("no hay user");
      req.session.user = req.params.id;
      console.log("Setted user");
  }
  else
  {
    console.log("hay user");
  }
  // else
  // {
  //   req.session.user = req.params.id;
  //   console.log("Setted user");
  // }

  //res.redirect("/shop/"+req.session.user);

});
// router.get('/session', function(req, res, next) {
//   console.log("id: "+req.session.user);
//   res.send("El usuario u session es:"+req.session.user)
// });


module.exports = router;
