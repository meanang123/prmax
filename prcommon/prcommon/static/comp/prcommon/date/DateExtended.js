//-----------------------------------------------------------------------------
// Name:    DateExtended.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.date.DateExtended");

dojo.require("ttl.BaseWidget");

dojo.declare("prcommon.date.DateExtended",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	name:"",
	required:false,
	templatePath: dojo.moduleUrl( "prcommon.date","templates/DateExtended.html"),
	postCreate:function()
	{
		this.date_box.set("value", new Date());
		this.inherited(arguments);
	},
	_getData:function()
	{
		return dojo.toJson(
		{
			text : this.text_box.get("value"),
			date: ttl.utilities.toJsonDate ( this.date_box.get("value")),
			month : this.month_checkbox.get("value")
		})
	},
	_setValueAttr:function( value )
	{
		if ( value == null || value.date.year == null )
		{
			this.text_box.set("value","");
			this.date_box.set("value", (this.required) ? new Date() : null );
			this.month_checkbox.set("value",false);
		}
		else
		{
			this.text_box.set("value",value.text);
			if ( value.date.year == null )
				this.date_box.set("value","");
			else
				this.date_box.set("value",new Date(value.date.year,value.date.month-1, value.date.day ) );
			this.month_checkbox.set("value",value.month);
		}
	},
	_getValueAttr:function()
	{
		return this._getData();
	},
	isValid:function()
	{
		var tdate  = this.date_box.get("value");
		if ( tdate == null && this.required)
			return false;
		else
			return true;
	},
	focus:function()
	{
		this.date_box.focus();
	}
});
