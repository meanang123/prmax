//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.viewfilter
// Author:  Chris Hoy
// Purpose:
// Created: 23/12/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressrelease.viewfilter");

dojo.require("dojox.collections.Dictionary");

dojo.declare("prmax.pressrelease.viewfilter",
	[ ttl.BaseWidget ],
	{
	templateString: dojo.cache( "prmax","pressrelease/templates/viewfilter.html"),
	constructor: function()
	{
		this._fields_options_1 = new dojox.collections.Dictionary();
		this._fields_options_1.add("All", 1);
		this._fields_options_1.add("Not Sent", 2 );
		this._fields_options_1.add("Sent", 3 );
		this._fields_options_3 = new dojox.collections.Dictionary();
		this._fields_options_3.add(1, "All");
		this._fields_options_3.add(2, "Not Sent" );
		this._fields_options_3.add(3, "Sent" );

		this._fields_options_2 = new dojox.collections.Dictionary();
		this._fields_options_2.add(">6 Months", 4);
		this._fields_options_2.add("Year", 5);
		this._fields_options_2.add("All", 6);
		this._fields_options_4 = new dojox.collections.Dictionary();
		this._fields_options_4.add(4, ">6 Months");
		this._fields_options_4.add(5, "Year");
		this._fields_options_4.add(6, "All");
	},
	_OptionChanged:function()
	{
		if ( this.option.get("value")== "Sent")
		{
			dojo.removeClass(this.option2_label1,"prmaxhidden");
			dojo.removeClass(this.option2_label2,"prmaxhidden");
		}
		else
		{
			dojo.addClass(this.option2_label1,"prmaxhidden");
			dojo.addClass(this.option2_label2,"prmaxhidden");
		}
	},
	_setValueAttr:function(invalue)
	{
		switch(invalue)
		{
		case 1:
			this.option.set("value", this._fields_options_3.item(1));
			break;
		case 2:
			this.option.set("value", this._fields_options_3.item(2));
			break;
		case 4:
			this.option.set("value", this._fields_options_3.item(3));
			this.option2.set("value", this._fields_options_4.item(4));
			break;
		case 5:
			this.option.set("value", this._fields_options_3.item(3));
			this.option2.set("value", this._fields_options_4.item(5));
		case 6:
			this.option.set("value", this._fields_options_3.item(3));
			this.option2.set("value", this._fields_options_4.item(6));
			break;
		}

		this._OptionChanged();
	},
	_getValueAttr:function()
	{
		var option = this._fields_options_1.item(this.option.get("value"));
		if ( option == 3 )
			option = this._fields_options_2.item(this.option2.get("value"));

		return option;
	},
	Clear:function()
	{
		this.option.set("value", "All");
		this.option2.set("value", "All");
		this._OptionChanged();
	}
});
