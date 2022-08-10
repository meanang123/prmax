// wrapped by build app
define("ttl/Splash", ["dijit","dojo","dojox","dojo/require!dijit/_Templated,dijit/_Widget,dijit/_Container"], function(dijit,dojo,dojox){
//-----------------------------------------------------------------------------
// Name:    Splash.js
// Author:  Chris Hoy
// Purpose: function to help grid 
// Created: 11/01/2008
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("ttl.Splash");

dojo.require("dijit._Templated"); 
dojo.require("dijit._Widget"); 
dojo.require("dijit._Container");


dojo.declare("ttl.Splash", 
	[ dijit._Widget, dijit._Templated, dijit._Container ],
	{
		templateString:"<div class=\"Progress\"><span class=\"Title\">Loading . . .</span><br>\r\n  <span class=\"ProgressMsg\"><img src=\"/static/images/loading.gif\"/></span>\r\n</div>\r\n",
		constructor: function() 
		{
		},
		postCreate: function () 
		{
			this.inherited("postCreate", arguments);
		},
		startup: function() 
		{
		}
});

});
