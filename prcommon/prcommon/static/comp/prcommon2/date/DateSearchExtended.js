//-----------------------------------------------------------------------------
// Name:    prcommon.date.DateSearchExtended
// Author:  Chris Hoy
// Purpose:
// Created: 07/12/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../date/templates/DateSearchExtended.html",
	"ttl/utilities2",
	"dojo/json",
	"prcommon2/search/std_search",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dijit/form/TextBox",
	"dijit/form/DateTextBox",
	"dijit/form/CheckBox",
	"prcommon2/search/SearchCount",
	"dijit/form/ComboBox"
	], function(declare, BaseWidgetAMD, template, utilities2, json,std_search,domattr,domclass)
	{
 return declare("prcommon2.date.DateSearchExtended",
	[BaseWidgetAMD,std_search],{
	noselection:"No Selection",
	name:"",
	value:"",
	required:false,
	templateString: template,
	postCreate:function()
	{
		this.from_date_box.set("value", new Date());
		this.to_date_box.set("value", new Date());
		this.inherited(arguments);
	},
	_get_data:function()
	{
		var value = this.option.get("value");
		if (value != this.noselection)
		{
			return json.stringify(
			{
				option : value,
				from_date: utilities2.to_json_date ( this.from_date_box.get("value")),
				to_date: utilities2.to_json_date ( this.to_date_box.get("value")),
				month : this.month_checkbox.get("value")
			})
		}
		return "";
	},
	_default_settings:function()
	{
		this.option.set("value", this.noselection);
		this.from_date_box.set("value", new Date());
		this.to_date_box.set("value", new Date());
		this.month_checkbox.set("checked",true);
	},
	_setValueAttr:function( value )
	{
		if ( value == null || value === "" )
		{
			this._default_settings();
		}
		else
		{
			obj = json.parse ( value ) ;
			try
			{
				this.option.set("value", obj.option);
				this.from_date_box.set("value", utilities2.from_json_date( obj.from_date) );
				this.to_date_box.set("value", utilities2.from_json_date( obj.to_date) );
				this.month_checkbox.set("checked",obj.month );
			}
			catch (e )
			{
				this._default_settings();
			}
		}

		this._show_options();
		this._get_selector(this._get_data());

	},
	_getValueAttr:function()
	{
		return this._get_data();
	},
	_option_changed:function()
	{
		this._show_options();
		this._get_selector(this._get_data());
	},
	_show_options:function()
	{
		var show_from = false;
		var show_to = false;

		switch ( this.option.get("value") )
		{
			case this.noselection :
				break;
			case "After":
				show_from = true;
				break;
			case "Before":
				show_from = true;
				break;
			case "Between" :
				show_from = true;
				show_to = true ;
				break;
		}

		if (show_from)
			dojo.removeClass(this.from_date_box.domNode,"prmaxhidden");
		else
			dojo.addClass(this.from_date_box.domNode,"prmaxhidden");
		if (show_to)
		{
			domclass.remove(this.to_date_box.domNode,"prmaxhidden");
			domclass.remove(this.to_box_label,"prmaxhidden");
		}
		else
		{
			domclass.add(this.to_date_box.domNode,"prmaxhidden");
			domclass.add(this.to_box_label,"prmaxhidden");
		}
	},
	_date_changed:function()
	{
		this._get_selector(this._get_data());
	},
	clear:function()
	{
		this._setValueAttr(null);
	}
});
});
