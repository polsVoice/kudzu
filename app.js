
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , jsdom = require( "jsdom" )
  , request = require( "request" )
  , url = require( "url" )
  , XMLHttpRequest = require( "xmlhttprequest" ).XMLHttpRequest;

var app = module.exports = express.createServer();

//var params = "srczip=98007";

var callPHP = function()
{
	if ( typeof FormData === "undefined" ){
		console.log( "FormData is undefined!" );
	}
	//var fData = new FormData();
	var httpc = new XMLHttpRequest();
	var url = "http://www.boardgamegeek.com/findgamers.php?action=findclosestform";
	var params = "srczip=98007&maxdist=5";

	httpc.open( "POST", url, true );
	httpc.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	httpc.setRequestHeader( "Content-Type", params.length );
	//httpc.setRequestHeader( "Connection", "close" );

	httpc.onreadystatechange = function()
	{
		if ( httpc.readyState == 4 && httpc.status == 200 )
		{
			console.log( httpc.responseText );
		}
	}
	httpc.send( params );
}

// Configuration

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

// Routes

app.get('/', routes.index);

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

app.get( "/kudzu", function( req, res )
{
	request( {uri: "http://www.boardgamegeek.com/findgamers.php?action=findclosestform"}, 
	function( err, res, body )
	{
		var self = this;
		self.items = [];
		if ( err && res.statusCode !== 200 )
		{
			console.log( "Request error." );
		}
		
		jsdom.env( {
			html: body,
			scripts: ["http://code.jquery.com/jquery-latest.min.js"],
			done: function( err, window )
			{
			
				var $ = window.jQuery,
					$body = $( "body" ),
					$a = $body.find( "a" ),
					value = "",
					theField = $( "input[name=srczip]" );
				console.log( "The length of $a is " + $a.length );
				theField.val( "98007" );
				value = theField.val();
				console.log( "The value is " + value );
						var xhr = new XMLHttpRequest();
		var theField = $( "srczip" );
		if ( theField )
		console.log( "Field found!" );
			
				callPHP();
			}
		} );

	} );
} );
