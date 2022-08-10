// wrapped by build app
define("ttl/layout/ContentPane", ["dijit","dojo","dojox","dojo/require!dijit/layout/ContentPane,ttl/utilities"], function(dijit,dojo,dojox){
//-----------------------------------------------------------------------------
// Name:    ttl.layout.ContentPane
// Author:  Chris Hoy
// Purpose: add default error handling to the dijit.layout.ContentPane
// Created: 18/08/2008
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("ttl.layout.ContentPane");

dojo.require("dijit.layout.ContentPane"); 
dojo.require("ttl.utilities");

dojo.declare(
	"ttl.layout.ContentPane",
	[dijit.layout.ContentPane],
	{
		onDownloadError:function(error)
		{
			return ttl.utilities.onDownloadError(error)||this.errorMessage;
		}
	}
);


});
