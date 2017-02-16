//-----------------------------------------------------------------------------
// Name:    date.js
// Author:  Chris Hoy
// Purpose:
// Created: 03/10/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.search.date");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.search.date",
	[ ttl.BaseWidget],
	name:"",
	templatePath: dojo.moduleUrl( "prcommon.search","templates/date.html"),
	postCreate:function()
	{
		this.inherited(arguments);
		this.to_date_value.attr("value", new Date());
		this.from_date_value.attr("value", new Date());
	},
	_getValueAttr:function()
	{
		return this._getData();
	},
	_getData:function()
	{
		return dojo.toJson(
		{
			selectionid:this.selectionid.attr("value"),
			to_date_value : ttl.utilities.toJsonDate ( this.to_date_value.attr("value")),
			from_date_value : ttl.utilities.toJsonDate ( this.from_date_value.attr("value"))
		});
	}
);





