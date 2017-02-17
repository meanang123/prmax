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
		templatePath: dojo.moduleUrl( "ttl","templates/Splash.htm"),
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
