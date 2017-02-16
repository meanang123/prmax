//-----------------------------------------------------------------------------
// Name:    DateExtended.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../date/templates/DateExtended.html",
	"ttl/utilities2",
	"dojo/json",
	"dijit/form/TextBox",
	"dijit/form/DateTextBox",
	"dijit/form/CheckBox"
	], function(declare, BaseWidgetAMD, template, utilities2, json)
	{
 return declare("prcommon2.date.DateExtended",
	[BaseWidgetAMD],{
	name:"",
	value:"",
	required:false,
	templateString:template,
	postCreate:function()
	{
		this.date_box.set("value", new Date());
	},
	_get_data:function()
	{
		return json.stringify(
		{
			text : "",
			date: utilities2.to_json_date ( this.date_box.get("value")),
			month : this.month_checkbox.get("value")
		})
	},
	_setValueAttr:function( value )
	{
		if ( value == null || value.date.year == null )
		{
			this.date_box.set("value", (this.required) ? new Date() : null );
			this.month_checkbox.set("value",false);
		}
		else
		{
			if ( value.date.year == null )
				this.date_box.set("value","");
			else
				this.date_box.set("value",new Date(value.date.year,value.date.month-1, value.date.day ) );
			this.month_checkbox.set("value",value.month);
		}
	},
	_getValueAttr:function()
	{
		return this._get_data();
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
	},
	_getNameAttr:function()
	{
		return this.name;
	}
});
});
