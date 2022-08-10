// wrapped by build app
define("ttl/PaneSimple", ["dijit","dojo","dojox","dojo/require!dijit/layout/ContentPane"], function(dijit,dojo,dojox){
//-----------------------------------------------------------------------------
// Name:    PaneSimple.js
// Author:  Chris Hoy
// Purpose: Simple scrolling pane to display details
// Created: 10/03/2008
//
// To do:
// chnage this into a header and a content pane will allow for panel to contact
// etc
//
//-----------------------------------------------------------------------------
dojo.provide("ttl.PaneSimple");

dojo.require("dijit.layout.ContentPane");

dojo.declare("ttl.PaneSimple",
	[dijit.layout.ContentPane, dijit._Templated, dijit._Contained],
	{
	// summary:
	// example:
	templateString:"<div class='ttlPaneSimple'>\r\n\t<div dojoAttachPoint=\"titleBoxNode\" class='ttlPaneSimpleTitle'>\r\n\t\t<div dojoAttachPoint='titleTextNode' class='ttlPaneSimpleText'>${title}</div>\r\n\t</div>\r\n\t\t<div dojoAttachPoint='containerNode' class='ttlPaneSimpleBody ${mode}'></div>\r\n</div>",
	mode:"expanded",

	postCreate: function(){
		this.inherited("postCreate",arguments)
	},
	startup: function()
	{
		this.inherited("startup",arguments)
		// fix the size of the scrolling containder
		var h = parseInt(this.domNode.style.height.replace("px",""));
		var c = dojo.coords(this.titleBoxNode);
		if (c.h==0) c.h = 30;
		this.containerNode.style.height= h-c.h+"px";
		this.inherited(arguments);
	},
	resize:function(c)
	{
	}

});

});
