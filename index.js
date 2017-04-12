var express= require('express');

var app = express();

// keeps server info out of header
app.disable('x-powered-by');

var handlebars = require('express-handlebars').create({defaultLayout:'main'})
;
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('port',process.env.PORT || 3000);

//do more imports here



app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
  res.render('home');
});

app.get('/',function(req,res){
  res.send('Express Works');

});

app.listen(app.get('port'), function(){
  console.log("Express started on http://localhost:" + app.get('port') + ' press Ctrl-C to terminate');

});
