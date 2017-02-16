//-----------------------------------------------------------------------------
// Name:    manual_allocate_amount.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/manual_allocate_amount.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/store/util/SimpleQueryEngine",		
	"dijit/Dialog",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Button"
	], function(declare, BaseWidgetAMD, template, request,utilities2,lang,topic,domclass,domattr,SimpleQueryEngine){

return declare("control.customer.manual_allocate_amount",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
	setValues:function( pctrl , maxvalue )
	{
		this.pctrl = pctrl ;
		this.clear();
		this.toallocate_value.constraints.max = maxvalue;
		this.popup_view.show();
	},
	clear:function()
	{
		this.toallocate_value.set("value",0.01);
	},
	_close:function()
	{
		this.popup_view.hide();
		this.clear();
	},
	_allocate:function()
	{
		// verify amount
		if ( this.toallocate_value.isValid() == false )
			return;

		// check
		if ( this.pctrl._allocted_row.unpaidamount_display < this.toallocate_value.get("value") )
		{
			alert("Over Allocation");
			return false;
		}

		this.pctrl._allocted_row.allocated = this.toallocate_value.get("value");
		this.pctrl._allocation.put(this.pctrl._allocted_row);

		this.pctrl._onBlur();
		this._close();
	}
});
});
