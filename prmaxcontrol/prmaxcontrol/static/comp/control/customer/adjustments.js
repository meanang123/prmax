//-----------------------------------------------------------------------------
// Name:    adjustments.js
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
	"dojo/text!../customer/templates/adjustments.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"control/customer/allocation",
	"dijit/form/Form",
	"dijit/form/FilteringSelect",
	"dijit/form/TextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/DateTextBox",
	"dojox/form/BusyButton",
	"dijit/form/Textarea",
	"dojox/grid/DataGrid",
	"control/customer/manual_allocate_amount",
	"dijit/layout/ContentPane"
	

	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore, Allocation){

return declare("control/customer/adjustments",
	[BaseWidgetAMD,Allocation],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._adjustment_call_back = lang.hitch(this,this._adjustment_call);
		this.adjustmenttypes = new ItemFileReadStore ( {url:'/common/lookups?searchtype=adjustmenttypes',onError:utilities2.globalerrorchecker, clearOnClose:true, urlPreventCache:true });
	},
	setCustomer:function( customerid , customername , dialog)
	{
		this._customerid = customerid;
		this._customername = customername;

		domattr.set( this.customername , "innerHTML" , this._customername ) ;
		this._dialog = dialog;
		if ( this._dialog != null)
			this._dialog.show();		
		this.alloc_grid_view.resize( {w:590, h:300});
		
		this.load_allocation(customerid,"adjustments");
		this.addbtn.cancel();
	},
	_adjustment_call:function( response )
	{
		if ( response.success == "OK" )
		{
			topic.publish(PRCOMMON.Events.Financial_ReLoad, []);
			alert("Adjustment Added");
			this._dialog.hide();
			this.clear();
		}
		else
		{
			alert("Problem making Adjustment");
		}

		this.addbtn.cancel();

	},
	_adjustment:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.addbtn.cancel();
			return false;
		}

		if ( this.toallocate.get("value") > Math.abs(this.payment.get("value")))
		{
			alert("Over Allocation");
			this.addbtn.cancel();
			return ;
		}

		var content = this.form.get("value");

		content["icustomerid"] = this._customerid;
		content['allocations'] = this.getAllocations();
		content["adjustmentdate"] = utilities2.to_json_date ( this.adjustmentdate.get("value") ) ;
			
		request.post("/payment/adjust_account",
			utilities2.make_params({ data : content})).
			then(this._adjustment_call_back);			
	},
	clear:function()
	{
		this.payment.set("value","");
		this.message.set("value","");
	},
	postCreate:function()
	{
		this.adjustmentdate.set("value",new Date());
		this.adjustmenttypeid.set("store", this.adjustmenttypes);
		this.adjustmenttypeid.set("value",1);
		this._postCreate();

		this.inherited(arguments);
	},
	_on_blur_amount:function()
	{
		this._doallocation();
	}
});
});