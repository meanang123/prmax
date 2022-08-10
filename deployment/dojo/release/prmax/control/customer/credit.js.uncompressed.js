require({cache:{
'url:control/customer/templates/credit.html':"<div>\r\n\t<form data-dojo-attach-point=\"form\"  data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n\t\t<table width=\"580px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td colspan=\"4\"><div class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Credit for </div><div class=\"prmaxrowdisplaylarge\" style=\"display:inline\" data-dojo-attach-point=\"customername\"></div></td></tr>\r\n\t\t\t<tr>\r\n\t\t\t\t\t<td class=\"prmaxrowlabel\" align=\"right\">Cost</td>\r\n\t\t\t\t\t<td class=\"prmaxrowlabel\"><input data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-attach-point=\"cost\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"cost\",required:true,trim:true,style:\"width:8em\",constraints:{min:0.01,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-attach-event=\"onBlur:_on_amount\" ></input></td>\r\n\t\t\t\t\t<td class=\"prmaxrowlabel\" align=\"right\">Amount Remaining</td>\r\n\t\t\t\t\t<td class=\"prmaxrowlabel\"><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"toallocate\" data-dojo-props='type:\"text\",style:\"width:8em\",readOnly:true' ></input></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td align=\"right\" class=\"prmaxrowlabel\">Vat</td>\r\n\t\t\t\t<td><input data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-props='type:\"text\",name:\"vat\",required:true,constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"},style:\"width:8em\"' data-dojo-attach-point=\"vat\" data-dojo-attach-event=\"onBlur:_on_vat_amount\"></input></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr>\r\n\t\t\t\t\t<td class=\"prmaxrowlabel\" align=\"right\" >Gross</td>\r\n\t\t\t\t\t<td><input data-dojo-attach-point=\"payment\" data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"gross\",style:\"width:8em\",constraints:{min:0.00,max:99999.00,fractional:true,places:\"0,2\"},readOnly:true'></input></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" valign=\"top\">Message</td><td colspan=\"3\"><div class=\"dialogprofileframe\" ><textarea data-dojo-attach-point=\"message\" data-dojo-props='name:\"message\",\"class\":\"dijitTextarea\",style:\"width:99%;height:99%\"' data-dojo-type=\"dijit/form/Textarea\" ></textarea></div></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Credit Date</td><td><input data-dojo-props='type:\"text\",name:\"payment_date\",required:\"true\"' data-dojo-attach-point=\"payment_date\" data-dojo-type=\"dijit/form/DateTextBox\" ></td></tr>\r\n\t\t\t<tr>\r\n\t\t\t\t<td class=\"prmaxrowlabel\" align=\"right\">Send Email</td>\r\n\t\t\t\t<td>\r\n\t\t\t\t\t<input data-dojo-attach-point=\"emailtocustomer\" data-dojo-props='\"class\":\"prmaxinput\",name:\"emailtocustomer\",type:\"checkbox\",checked:\"checked\"' data-dojo-type=\"dijit/form/CheckBox\" data-dojo-attach-event=\"onClick:_email_required\"/>\r\n\t\t\t\t\t<input data-dojo-attach-point=\"email\" data-dojo-props='required:true,\"class\":\"prmaxinput\",name:\"email\",type:\"text\",style:\"width:20em\",trim:\"true\"' data-dojo-type=\"dijit/form/ValidationTextBox\" />\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t\t<tr><td colspan=\"4\" >\r\n\t\t\t\t<div data-dojo-attach-point=\"alloc_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:690px;height:320px\"'></div>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" colspan=\"4\" align=\"right\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-point=\"addbtn\" data-dojo-props='labelBusy:\"Crediting Account\",type:\"button\"' data-dojo-attach-event=\"onClick:_create\">Credit Account</button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n\r\n<div data-dojo-attach-point=\"alloc_manual\" data-dojo-type=\"control/customer/manual_allocate_amount\"></div>\r\n\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    credit.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/credit", [
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
