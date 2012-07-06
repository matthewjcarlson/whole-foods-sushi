var express = require('express'),
    request = require('request'),
    qs = require('querystring'),
    cluster = require('cluster'),
    md5 = require("blueimp-md5").md5,
    os = require('os'),
	URL = require('url');

var app = express.createServer(express.logger());

var url = 'http://cartonapi.aviary.com/services/ostrich/render?';

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.post('/save', function (req, res) {
    console.log(req.body);
});

app.get('/aviary', function (req, res) {
   var ts = Math.round((new Date()).getTime() / 1000);
   var BLAH = "{'metadata':{'imageorigsize':[1000,662]},'actionlist':[{'action':'setfeathereditsize','width':1000,'height':662},{'action':'singe','params':[],'flatten':true}]}";

   var params = 
        { api_key: 'd3954246e',
          app_version: '1.0',
          backgroundcolor: '00000000',
          calltype: 'renderActionList',
          cellheight: -1,
          cellwidth: -1,
          cols: -1,
          filepath: 'http://freezing-lightning-2366.herokuapp.com/face_2190x1459.jpg',
          filterid: -1,
          format: 'jpg',
          hardware_version: 1,
          platform: 'web',
          quality: 60,
          renderparameters: BLAH,
          response_format: 'json',
          rows: -1,
          scale: 1.0,
          software_version: 1,
          ts: ts,
          version: 0.3  
        };
   var dd = encodeURIComponent(BLAH);
   
   var bigString = "e8068162c"+
                   "api_keyd3954246e" + 
                   "app_version1.0" + 
                   "backgroundcolor00000000" +
                   "calltyperenderActionList"+
                   "cellheight-1"+
                   "cellwidth-1"+
                   "cols-1"+
                   "filepath"+ encodeURIComponent("http://freezing-lightning-2366.herokuapp.com/face_2190x1459.jpg")+
                   "filterid-1"+
                   "formatjpg"+
                   "hardware_version1"+
                   "platformweb"+
                   "quality60"+
                   "renderparameters"+ dd +
                   "response_formatjson"+
                   "rows-1"+
                   "scale1"+
                   "software_version1"+
                   "ts" + ts +
                   "version0.3";     
   console.log(bigString);
   
   var p = qs.stringify(params);
   var sig =  md5(bigString);
      
   var sec = "&api_sig=" + sig;
    
   url += p + sec;
	
  var urlObj = {
	protocol: 'http:',
	slashes: true,
	host: 'cartonapi.aviary.com',
	hostname: 'cartonapi.aviary.com',
	href: url,
	search: '?' + p + sec,
	query: p + sec,
	pathname: '/services/ostrich/render',
	path: '/services/ostrich/render?' + p + sec
  };

  request({uri : urlObj}, function (error, response, body) {
     if (!error && response.statusCode == 200) {
          // console.log(response);
           console.log(body);
           res.send('Hello Aviary!');
     }
     else{
      console.log("***** Error *****");
      console.log(error);
      console.log(response);
      res.send('Hello Aviary Error!');
      
     }
   });
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
