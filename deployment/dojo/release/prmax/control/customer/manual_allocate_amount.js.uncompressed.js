require({cache:{
'url:control/customer/templates/manual_allocate_amount.html':"<div>\r\n\t<div data-dojo-attach-point=\"popup_view\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Enter Amount Remaining\"'>\r\n\t\t<br/>\r\n\t\t<table width=\"300px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td colspan>Amount</td><td><input data-dojo-props='type:\"text\",name:\"value\",trim:true,style:\"width:8em\",constraints:{min:0.01,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"toallocate_value\" ></input></td></tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td align=\"left\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_close\">Close</button></td>\r\n\t\t\t\t<td align=\"right\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\"' data-dojo-attach-event=\"onClick:_allocate\">Allocate</button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    manual_allocate_amount.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------
define("control/customer/manual_allocate_amount", [
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
