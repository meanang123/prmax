//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose:
// Created: 03/02/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressrelease.seo.customer.view");

dojo.require("ttl.BaseWidget");
dojo.require("ttl.utilities");
dojo.require("prcommon.prcommonobjects");

dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.Toolbar");
dojo.require("dijit.form.Button");
dojo.require("dijit.layout.StackContainer");

dojo.require("dojox.grid.DataGrid");

// actual pages
dojo.require("prmax.collateral.view");
dojo.require("prmax.customer.clients.view");
dojo.require("prmax.pressrelease.seo.view");
dojo.require("prmax.help.HelpBrowser");

dojo.declare("prmax.pressrelease.seo.customer.view",
	[ ttl.BaseWidget ],{
	displayname:"",
	templatePath: dojo.moduleUrl( "prmax.pressrelease.seo.customer.","templates/view.html"),
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_view:function()
	{
		this.controls.selectChild(this.seo_view);
	},
	_clients:function()
	{
		this.controls.selectChild(this.client_view);
		this.client_view.resize();
	},
	_collateral:function()
	{
		this.controls.selectChild(this.collateral_view);
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	},
	_Help:function()
	{
		this.controls.selectChild(this.help_view);
	},
	_Logout:function()
	{
		if (confirm("Logout of Prmax?")==true)
			window.location.href = "/logout";
	}
});
