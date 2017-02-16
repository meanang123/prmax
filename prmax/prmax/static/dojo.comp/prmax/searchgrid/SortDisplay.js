//-----------------------------------------------------------------------------
// Name:    prmax.display.StdBanner
// Author:  Chris Hoy
// Purpose:
// Created: 29/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.searchgrid.SortDisplay");

dojo.declare("prmax.searchgrid.SortDisplay",
	[ ttl.BaseWidget],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.searchgrid","templates/SortDisplay.html"),
	constructor: function()
	{
		this._value = 1;
		this._callback = null;
		this.store = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=sortorder"});
	},
	postCreate:function()
	{
		dojo.attr(this.accLabel,'for',this.accNode.id);
		dojo.attr(this.descLabel,'for',this.descNode.id);

		this.select.store = this.store;
		this.inherited(arguments)

	}	,
	_setCallbackAttr:function(value)
	{
		this._callback = value;
		// change display
		this.saveNode.cancel();
	},
	_setValueAttr:function(value)
	{
		this._value = value.toString();
		// change display
		this.saveNode.cancel();
		if (this._value[0]=="-")
		{
			this.accNode.set("checked",true);
			this.descNode.set("checked",false);
		}
		else
		{
			this.descNode.set("checked",false);
			this.accNode.set("checked",true);
		}

		this.select.set("value",Math.abs(parseInt(this._value)));
	},
	_getValueAttr:function()
	{
		return this._value ;
	},
	_Sort:function()
	{
		var f = this.form.getValues();

		console.log(f);

		this._value  = f.order + f.sortfield;
		this.dlg.hide();
		if (this._callback)
			this._callback( this._value);
	},
	show:function()
	{
		this.dlg.show();
	},
	_Close:function()
	{
		this.dlg.hide();
	}
});