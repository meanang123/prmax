//-----------------------------------------------------------------------------
// Name:    credit.js
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
	"dojo/text!../customer/templates/credit.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dojo/data/ItemFileWriteStore",
	"control/customer/allocation",
	"dojo/store/util/SimpleQueryEngine",	
	"dojox/validate/regexp",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/Textarea",
	"dijit/form/CheckBox",
	"dojox/form/BusyButton",
	"dijit/form/ValidationTextBox",
	"control/customer/manual_allocate_amount",
	"dijit/layout/ContentPane",

	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore,ItemFileWriteStore, Allocation, SimpleQueryEngine){

return declare("control.customer.credit",
	[BaseWidgetAMD,Allocation],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._credit_call_back = lang.hitch(this,this._credit_call);
	},
	setCustomer:function( cust , dialog)
	{
		this._customerid = cust.customerid;
		this._customername = cust.customername;

		this.email.set("value",cust.invoiceemail? cust.invoiceemail:cust.email);
		domattr.set( this.customername, "innerHTML", this._customername ) ;
		this._dialog = dialog;
		if ( this._dialog != null)
			this._dialog.show();
		this.alloc_grid_view.resize( {w:590, h:300} );
		
		this.load_allocation(cust.customerid,"payment");
		this.addbtn.cancel();
	},
	_credit_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Credit Added");
			this.clear();
			topic.publish(PRCOMMON.Events.Financial_ReLoad, []);
			this._dialog.hide();
		}
		else
		{
			alert("Problem adding credit");
		}
		this.addbtn.cancel();
	},
	_create:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.addbtn.cancel();
			return false;
		}

		if ( this.toallocate.get("value") > this.payment.get("value"))
		{
			alert("Over Allocation");
			this.addbtn.cancel();
			return ;
		}

		var content = this.form.get("value");

		content["icustomerid"] = this._customerid;
		content["payment_date"] = utilities2.to_json_date ( this.payment_date.get("value") ) ;
		content["unpaidamount"] = this.toallocate.get("value");
		content['allocations'] = this.getAllocations();

		request.post('/customer/credit_take',
			utilities2.make_params({ data : content})).
			then(this._credit_call_back);			
	},
	_on_amount:function()
	{
		var cost = this.cost.get("value");
		var vat = cost *.2;

		this.vat.set("value",dojo.number.format (vat, {places:2}));
		this.payment.set("value",dojo.number.format (cost + vat, {places:2}));

		this._doallocation();
	},
	clear:function()
	{
		this.payment.set("value","0");	
		this.vat.set("value",0);
		this.cost.set("value","0");

		this.message.set("value","");

		this.addbtn.cancel();
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this._postCreate();
	},
	_email_required:function()
	{
		this.email.set("required",this.emailtocustomer.get("checked"));
	},
	_on_vat_amount:function()
	{
		var cost = this.cost.get("value");
		var vat = this.vat.get("value");

		this.payment.set("value",dojo.number.format (cost + vat, {places:2}));

		this._doallocation();
	}
});
});
