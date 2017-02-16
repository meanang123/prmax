//-----------------------------------------------------------------------------
// Name:    viewers.js
// Author:  Chris Hoy
// Purpose:
// Created: 16/06/2014
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.crm.solidsocial.preview");

dojo.require("dijit.layout.BorderContainer");

dojo.declare("prcommon.crm.solidsocial.preview",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.crm.solidsocial","templates/preview.html"),
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	load:function( keywords )
	{

		this.frame.resize( {w:590, h:400});
		this.keywords.set("value", keywords );

	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
	},
	_show_selection:function()
	{
		if ( ttl.utilities.formValidator(this.formnode)==false)
		{
			alert("Not all required field filled in");
			return;
		}

		var command="keywords=" + this.keywords.get("value");

		if (this.exact.get("checked"))
			command += "&exact=on";

		this.results.set("href","/crm/sm/preview_page?"+command);

	}
});





