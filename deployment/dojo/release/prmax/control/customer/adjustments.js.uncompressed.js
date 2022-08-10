require({cache:{
'url:control/customer/templates/adjustments.html':"<div>\r\n\t<form data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false\"' data-dojo-type=\"dijit/form/Form\">\r\n\t\t<table width=\"600px\" cellpadding=\"0\" cellpadding=\"0\" >\r\n\t\t\t<tr><td colspan=\"2\"><div class=\"prmaxrowdisplaylarge\" style=\"text-align:center;display:inline\">Adjustment for </div><div class=\"prmaxrowdisplaylarge\" style=\"display:inline\" data-dojo-attach-point=\"customername\"></div></td>\r\n\t\t\t<tr><td width=\"150px\"  align=\"right\" class=\"prmaxrowlabel\">Adjustment Type</td><td><select\r\n\t\t\t\t\tdata-dojo-props='name:\"adjustmenttypeid\",autoComplete:\"true\",labelType:\"html\"'\r\n\t\t\t\t\tdata-dojo-type=\"dijit/form/FilteringSelect\"\r\n\t\t\t\t\tdata-dojo-attach-point=\"adjustmenttypeid\"></select></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Value</td><td>\r\n\t\t\t\t<table width=\"100%\" cellpadding=\"0\" cellpadding=\"0\" ><tr>\r\n\t\t\t\t\t<td><input\r\n\t\t\t\t\t\t\t\tdata-dojo-props='\"class\":\"prmaxinput\",type:\"text\",name:\"value\",required:\"true\",trim:\"true\",style:\"width:8em\",constraints:{fractional:true,places:\"0,2\",min:0.01,max:99999.00}'\r\n\t\t\t\t\t\t\t\tdata-dojo-type=\"dijit/form/CurrencyTextBox\"\r\n\t\t\t\t\t\t\t\tdata-dojo-attach-point=\"payment\"\r\n\t\t\t\t\t\t\t\tdata-dojo-attach-event=\"onBlur:_on_blur_amount\"></input></td>\r\n\t\t\t\t\t<td class=\"prmaxrowlabel\">Amount Remaining</td>\r\n\t\t\t\t\t<td class=\"prmaxrowlabel\"><input data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"toallocate\" data-dojo-props='type:\"text\",style:\"width:8em\",readonly:\"readonly\"' ></input></td>\r\n\t\t\t\t</tr></table>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" >Adjustment Date</td><td><input data-dojo-props='type:\"text\",name:\"adjustmentdate\",required:\"true\"' data-dojo-attach-point=\"adjustmentdate\" data-dojo-type=\"dijit/form/DateTextBox\" ></td>\r\n\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" align=\"right\" valign=\"top\">Message</td><td><div class=\"dialogprofileframe\" ><textarea data-dojo-attach-point=\"message\" data-dojo-props='name:\"message\",\"class\":\"dijitTextarea\",style:\"width:99%;height:99%\"' data-dojo-type=\"dijit/form/Textarea\" ></textarea></div></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"alloc_view\"><td colspan=\"2\">\r\n\t\t\t\t<div data-dojo-attach-point=\"alloc_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:590px;height:200px\"'></div>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowlabel\" colspan=\"2\" align=\"right\"><button data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-point=\"addbtn\" data-dojo-props='busyLabel:\"Adding Adjustments ...\",type:\"button\"' data-dojo-attach-event=\"onClick:_adjustment\">Adjust Account</button></td>\r\n\t\t</table>\r\n\t</form>\r\n\t<div data-dojo-attach-point=\"alloc_manual\" data-dojo-type=\"control/customer/manual_allocate_amount\"></div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    adjustments.js
// Author:  
// Purpose:
// Created: 22/11/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("control/customer/adjustments", [
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