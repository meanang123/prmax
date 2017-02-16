//-----------------------------------------------------------------------------
// Name:    prmax.customer.client.pickcolour
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.customer.clients.pickcolour");

dojo.require("dijit.ColorPalette");

dojo.declare("prmax.customer.clients.pickcolour",
	[ ttl.BaseWidget],
	{
	name:"",
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.customer.clients","templates/pickcolour.html"),
	constructor: function()
	{
		this._value = "";
	},
	_show_dialog:function()
	{
		this.colour_dialog.show();
	},
	_new_color:function( value )
	{
		this._setValueAttr ( value );
		this._close_dialog();
	},
	_close_dialog:function()
	{
		this.colour_dialog.hide();
	},
	_setValueAttr:function( value)
	{
		this._value = value;
		this.colour_view.style["backgroundColor"] = value;
	},
	_getValueAttr:function()
	{
		if (this._value == null )
			return "";
		else
			return this._value;
	}
});
