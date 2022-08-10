require({cache:{
'url:control/customer/templates/payment.html':"<div>\r\n\t<form data-dojo-attach-point=\"form\"  data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n\t\t<table width=\"600px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td colspan=\"2\"><div class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Take Payment for </div><div class=\"prmaxrowdisplaylarge\" style=\"display:inline\" data-dojo-attach-point=\"customername\"></div></td>\r\n\t\t\t<tr><td width=\"150px\"  align=\"right\" class=\"prmaxrowtag\">Payment Type</td>\r\n\t\t\t\t<td><select data-dojo-props='name:\"paymenttypeid\",autoComplete:\"true\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"paymenttypeid\"></select></td>\r\n\t\t\t</tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Value</td><td>\r\n\t\t\t\t<table width=\"100%\" cellpadding=\"0\" cellpadding=\"0\" ><tr>\r\n\t\t\t\t\t<td><input data-dojo-type=\"dijit/form/CurrencyTextBox\" data-dojo-props ='\"class\":\"prmaxinput\",type:\"text\",name:\"value\",required:true, trim:true,style:\"width:8em\",constraints:{min:0.01,max:99999.00,fractional:true,places:\"0,2\"}' data-dojo-attach-point=\"payment\" data-dojo-attach-event=\"onBlur:_on_blur_amount\"></input></td>\r\n\t\t\t\t\t<td data-dojo-attach-point=\"alloc_view_3\" class=\"prmaxhidden prmaxrowtag\">Amount to Allocated</td>\r\n\t\t\t\t\t<td data-dojo-attach-point=\"alloc_view_4\" class=\"prmaxhidden prmaxrowtag\"><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"toallocate\" data-dojo-props='type:\"text\",style:\"width:8em\",readOnly:\"readonly\"'></input></td>\r\n\t\t\t\t</tr></table>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Send Email Confirmation</td><td><input data-dojo-attach-point=\"emailtocustomer\" data-dojo-props='\"class\":\"prmaxinput\",name:\"emailtocustomer\",type:\"checkbox\"' data-dojo-type=\"dijit/form/CheckBox\" checked /></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"alloc_view_1\"><td class=\"prmaxrowtag\" align=\"right\">Expire Date</td><td><input data-dojo-props='type:\"text\",name:\"licence_expire\"' data-dojo-attach-point=\"licence_expire\" data-dojo-type=\"dijit/form/DateTextBox\" ></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" valign=\"top\">Message</td><td><div class=\"dialogprofileframe\" ><textarea data-dojo-attach-point=\"message\" data-dojo-props='name:\"message\",\"class\":\"dijitTextarea\",style:\"width:99%;height:99%\"' data-dojo-type=\"dijit/form/Textarea\" ></textarea></div></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"alloc_view_2\"><td class=\"prmaxrowtag\" align=\"right\" >Email Address</td><td><input data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",style:\"width:100%\",trim:true,required:true,regExpGen:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\",size:40,maxLength:70'data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Payment Date</td><td><input data-dojo-props='type:\"text\",name:\"payment_date\",required:true' data-dojo-attach-point=\"payment_date\" data-dojo-type=\"dijit/form/DateTextBox\" ></td>\r\n\t\t\t<tr data-dojo-attach-point=\"alloc_view\"><td colspan=\"2\"><div data-dojo-attach-point=\"alloc_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:590px;height:300px\"'></div></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"right\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='busylabel:\"Taking Payment ...\",type:\"button\"' data-dojo-attach-point=\"btn\" data-dojo-attach-event=\"onClick:_TakePayment\">Take Payment</button></td>\r\n\t\t</table>\r\n\t</form>\r\n\t<div data-dojo-attach-point=\"alloc_manual\" data-dojo-type=\"control/customer/manual_allocate_amount\"></div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    payment.js
// Author:   
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/payment", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/payment.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"control/customer/allocation",
	"dojo/store/util/SimpleQueryEngine",	
	"dojox/validate/regexp",
	"dijit/form/Form",
	"dijit/form/FilteringSelect",
	"dijit/form/CurrencyTextBox",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/DateTextBox",
	"dijit/form/Textarea",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton",
	"control/customer/manual_allocate_amount",
	"dijit/layout/ContentPane"
	
	], function(declare, BaseWidgetAMD, template, BorderContainer,request,utilities2,lang,topic,domclass,domattr,ItemFileReadStore, Allocation, SimpleQueryEngine){

return declare("control/customer/payment",
	[BaseWidgetAMD,Allocation],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._PaymentTakenCallBack = lang.hitch(this,this._PaymentTakenCall);

		this.paymenttypes = new ItemFileReadStore ({url:'/common/lookups?searchtype=paymenttypes',onError:utilities2.globalerrorchecker,clearOnClose:true,urlPreventCache:true});
	},
	setCustomer:function( customer, dialog)
	{
		this.btn.cancel();
		this._customerid = customer.customerid;
		this._customername = customer.customername;

		domattr.set(this.customername , "innerHTML" , customer.customername ) ;
		if (customer.invoiceemail != null && customer.invoiceemail != "")
			this.email.set("value", customer.invoiceemail);
		else
			this.email.set("value", customer.email);

		this._dialog = dialog;
		if ( this._dialog != null)
			this._dialog.show();
			
		if ( this.manualmode)
		{
			this.alloc_grid_view.resize( {w:590, h:300});
			this.load_allocation(customer.customerid,"payment");
		}
	},
	_PaymentTakenCall:function( response )
	{
		if ( response.success == "OK" )
		{
			if ( this.manualmode )
				alert("Payment Taked");
			else
				alert("Payment Taken and invoice sent");
			this.Clear();
			topic.publish(PRCOMMON.Events.Financial_ReLoad, []);
			this._dialog.hide();
		}
		else
		{
			alert("Problem taking payment");
		}

		this.btn.cancel();
	},
	_TakePayment:function()
	{
		if (utilities2.form_validator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.btn.cancel();
			return false;
		}

		if ( this.manualmode )
		{
			if ( this.toallocate.get("value") > this.payment.get("value"))
			{
				alert("Over Allocation");
				this.btn.cancel();
				return ;
			}
		}

		var content = this.form.get("value");

		content["icustomerid"] = this._customerid;
		d = this.payment_date.get("value");
		if ( d != null )
			content["payment_date"] = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();

		if ( this.manualmode )
		{
			content["unpaidamount"] = this.toallocate.get("value");
			content['allocations'] = this.getAllocations();

		}
		else
		{
			var d = this.licence_expire.get("value");
			if (d != null)
				content["licence_expire"] = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();
		}
			request.post("/payment/payment_take",
				utilities2.make_params({ data : content})).
				then(this._PaymentTakenCallBack);				
	},
	_on_blur_amount:function()
	{
		if ( this.manualmode)
		{
			var amount = this.payment.get("value");
			var amount_allocated = 0.0;

			var line = SimpleQueryEngine(function(object){return true; })(this._allocation.data);

			for (var c = 0 ;  c < line.length; c++)
			{
				if ( line[c] == null ) continue;

				amount_allocated += dojo.number.round(parseFloat(line[c].allocated),2);
			}

			this.toallocate.set("value",dojo.number.format(dojo.number.round(amount - amount_allocated,2),{places:2}));

		}
	},
	Clear:function()
	{
		this.payment.set("value","");
		this.email.set("value","");
		this.emailtocustomer.set("checked",false);
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.paymenttypeid.set("store", this.paymenttypes);
		this.paymenttypeid.set("value",1);
		if (this.manualmode )
		{
			domclass.add(this.alloc_view_1, "prmaxhidden");
			domclass.remove(this.alloc_view_3, "prmaxhidden");
			domclass.remove(this.alloc_view_4, "prmaxhidden");
			this._postCreate();
		}
		else
		{
			domclass.add( this.alloc_view , "prmaxhidden");
		}
	},
	_Allocate:function()
	{
		// verify amount
		if ( this.toallocate_value.isValid() == false )
			return;

		// check
		if ( this._allocted_row.i.unpaidamount/100 <= this.toallocate_value.get("value") )
		{
			alert("Over Allocation");
			return false ;
		}

		this.alloc_grid.setValue ( this._allocted_row , "allocated" , this.toallocate_value.get("value"),true );
		this._on_blur_amount();
	}
});
});
	
