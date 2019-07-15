var express = require('express');
var router = express.Router();
class Fact {
   constructor(name,lastName,city, muni,addr,tienda,cedula, type,size,cant,logo,info,color,tiendaF,money){
      this.user = {
         "name": name,
         "lastName": lastName,
         "city": city,
         "muni": muni,
         "addr":addr,
         "tienda": tienda,
         "cedula": cedula
      }
      this.order = [{
            "type": type,
            "size": size,
            "cant": cant,
            "logo": logo,
            "info": info,
            "color": color,
            "tienda": tiendaF,
            "money": money
      }]
   }
}

router.use(express.static('public'));

router.get('/:id', function(req, res, next) {
   var id = req.param.id
   console.log(id);
   res.render('shop');
});

router.post('/upload',(req,res) => {

   var first = req.body.first;
   var last = req.body.last;
   var  tienda = req.body.tienda;
   var  city = req.body.city;
   var   muni = req.body.muni;
   var    addr = req.body.addr;
   var info = req.body.info;
   var  radio = req.body.radio;
   var   size = req.body.size;
   var   cant = req.body.cant;
   var file = `./files/${req.files.file.name}`;

   var fact = new Fact(first,last,city,muni,addr,tienda,'41','shop',size,cant,file,info,'2 colors',tienda,cant)
   console.log(fact.user.cedula);
   let EDFile = req.files.file
   EDFile.mv(`./files/${EDFile.name}`,err => {
      if(err) return res.status(500).send({ message : err })

      return res.status(200).send({ message : 'File upload' })
   })

})
module.exports = router;