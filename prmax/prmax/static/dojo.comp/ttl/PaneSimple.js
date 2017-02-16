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
	templatePath: dojo.moduleUrl("ttl", "templates/PaneSimple.htm"),
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
