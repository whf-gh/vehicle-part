var express = require('express');
var app = express();
const port = process.env.PORT || 8081;
const extern_url = process.env.RENDER_EXTERNAL_URL || `http://127.0.0.1:${port}`;

var htxt;
var txtf="style='font-size:50px'";
var txt0=`<html><head><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'></head><body><form action='${extern_url}/search' style='font-size:50px' method='GET'>`;
var txt1=`<html><body><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><form action='${extern_url}/pay' style='font-size:50px' method='GET'>`;
var txt2='<br><br>Pleaes input the last several signs of your vehicle license number.';
var txt3="<br><input type='text' style='font-size:50px' name='VL ";
var txt4="' value='";
var txt5;
var txt6="'>"
var txt7="<input type='submit' style='font-size:50px' value='Search'></form></body></html>";
var txt8="<input type='submit' style='font-size:50px' value='Pay'></form></body></html>";

//app.use(express.static('public'));
 
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log(`listen at ${extern_url}`);
})

var io = require('socket.io')(server);
var socket_obj;
var socket_connected=false;
var res_obj;
var cnt=0;

io.on('connection', function(socket){
	console.log("io connected" + cnt++);
	socket_obj=socket;
  	socket_connected=true;
  	socket.on('found', function(message){
    	console.log('found'+message);
    	var object = JSON.parse(message.toString());
    	var inf=object.inf;
    	var num=object.num;
    	var txt=txt1+inf+txt3+txt4+num+txt6+txt8;
    	res_obj.end(txt);
    	console.log('found'+num);
  	});
  	socket.on('unfound', function(message){
    	console.log('unfound'+message);
    	var object = JSON.parse(message.toString());
    	var inf=object.inf;
    	var num=object.num;
    	var txt=txt0+num+' is not found'+txt2+txt3+txt6+txt7;
    	res_obj.end(txt);  		
    	console.log('unfound'+num);
  	});
  	socket.on('payed', function(message){
    	console.log('payed'+message);
  		var object = JSON.parse(message.toString());
    	var inf=object.inf;
    	var num=object.num;
    	var txt=txt0+'Thank you for your payment.'+txt2+txt3+txt6+txt7;
    	res_obj.end(txt);  	

    	console.log('payed'+num);
  	})
  	socket.on('unpayed', function(message){
    	console.log('unpayed'+message);
    	var object = JSON.parse(message.toString());
    	var inf=object.inf;
    	var num=object.num;
    	var txt=txt0+num+' is not found. Payment fails.'+txt2+txt3+txt6+txt7;
    	res_obj.end(txt);  

    	console.log('unpayed'+num);
  	})
});

app.get('/search', function (req, res) {
   	if (socket_connected){
      	socket_obj.emit('VL',req.query.VL);
      	res_obj=res;
   	}
})

app.get('/pay', function (req, res) {
   	if (socket_connected){
      	socket_obj.emit('Pay',req.query.VL);
      	res_obj=res;
   	}  
})

app.get('/', function (req, res) {
   	var txt=txt0+txt2+txt3+txt6+txt7;
   	res.end(txt);  
   	console.log('home');
})