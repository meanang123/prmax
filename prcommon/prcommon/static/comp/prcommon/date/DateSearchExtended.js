//-----------------------------------------------------------------------------
// Name:    prcommon.date.DateSearchExtended
// Author:  Chris Hoy
// Purpose:
// Created: 07/12/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.date.DateSearchExtended");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.form.DateTextBox");
dojo.require("prcommon.search.std_search");

dojo.declare("prcommon.date.DateSearchExtended",
	[ prcommon.search.std_search, ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	noselection:"No Selection",
	name:"",
	required:false,
	templatePath: dojo.moduleUrl( "prcommon.date","templates/DateSearchExtended.html"),
	postCreate:function()
	{
		this.from_date_box.set("value", new Date());
		this.to_date_box.set("value", new Date());
		this.inherited(arguments);
	},
	_getData:function()
	{
		var value = this.option.get("value");
		if (value != this.noselection)
		{
			return dojo.toJson(
			{
				option : value,
				from_date: ttl.utilities.toJsonDate ( this.from_date_box.get("value")),
				to_date: ttl.utilities.toJsonDate ( this.to_date_box.get("value")),
				month : this.month_checkbox.get("value")
			})
		}
		return "";
	},
	_defaultSettings:function()
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
			this._defaultSettings();
		}
		else
		{
			obj = dojo.fromJson ( value ) ;
			try
			{
				this.option.set("value", obj.option);
				this.from_date_box.set("value", ttl.utilities.fromJsonDate( obj.from_date) );
				this.to_date_box.set("value", ttl.utilities.fromJsonDate( obj.to_date) );
				this.month_checkbox.set("checked",obj.month );
			}
			catch (e )
			{
				this._defaultSettings();
			}
		}

		this._ShowOptions();
		this._Get(this._getData());

	},
	_getValueAttr:function()
	{
		return this._getData();
	},
	_OptionChanged:function()
	{
		this._ShowOptions();
		this._Get(this._getData());
	},
	_ShowOptions:function()
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
			dojo.removeClass(this.to_date_box.domNode,"prmaxhidden");
			dojo.removeClass(this.to_box_label,"prmaxhidden");
		}
		else
		{
			dojo.addClass(this.to_date_box.domNode,"prmaxhidden");
			dojo.addClass(this.to_box_label,"prmaxhidden");
		}
	},
	_DateChanged:function()
	{
		this._Get(this._getData());
	},
	Clear:function()
	{
		this._setValueAttr(null);
	}
});
