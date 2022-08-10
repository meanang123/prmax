// wrapped by build app
define("ttl/TtlWidget", ["dijit","dojo","dojox"], function(dijit,dojo,dojox){
//-----------------------------------------------------------------------------
// Name:    TtlWidget.js
// Author:  Chris Hoy
// Purpose: 
// Created: 18/02/2008
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("ttl.TtlWidget");

dojo.declare(
	"ttl.TtlWidget",
	null,
	{
		resize:function(domNode)
		{
			var c = this.getOuterSize(domNode.parentNode);
		
			//var c = dojo.coords(domNode.parentNode);
			//c.l = c.t = 0; 
			domNode.style.height=c.h+"px";
		},
		getOuterSize:function(domNode)
		{
			var c = dojo.coords(domNode);
			c.x=c.y=c.l=c.t = 0; 
			return c ;
		}
	}
);


});
