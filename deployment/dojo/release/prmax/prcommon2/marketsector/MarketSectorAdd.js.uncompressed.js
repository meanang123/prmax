require({cache:{
'url:prcommon2/marketsector/templates/MarketSectorAdd.html':"<div style=\"border: 1px solid black\">\r\n<form  data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\">\r\n\t<input data-dojo-props='name:\"marketsectorid\",type:\"hidden\",value:-1'  data-dojo-attach-point=\"marketsectorid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t<table cellspacing=\"0\" cellpadding=\"0\" width=\"400px\">\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Market Sector</td><td colspan=\"2\" ><input data-dojo-props='\"class\":\"prmaxinput\",name:\"marketsectordescription\",type:\"text\",trim:true,required:true,style:\"width:90%\",placeHolder:\"Market Sector\"'  data-dojo-attach-point=\"marketsectordescription\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr>\r\n\t\t\t<td data-dojo-attach-point=\"close_button\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_close\"></button></td>\r\n\t\t\t<td data-dojo-attach-point=\"delete_button\" class=\"prmaxhidden\" ><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Delete\"' data-dojo-attach-event=\"onClick:_delete\"></button></td>\r\n\t\t\t<td align=\"right\"><button data-dojo-attach-event=\"onClick:_add_marketsector\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" type=\"button\" busyLabel=\"Please Wait Saving...\" label=\"Save\"></button></td></tr>\r\n\t</table>\r\n</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    MarketSectorAdd
// Author:  Stamatia Vatsi
// Purpose:
// Created: May 2022
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/marketsector/MarketSectorAdd", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../marketsector/templates/MarketSectorAdd.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/topic",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, domclass, topic ){
 return declare("prcommon2.marketsector.MarketSectorAdd",
	[BaseWidgetAMD],{
	templateString: template,
	mode:"add",
	constructor: function()
	{
		this._add_call_back = lang.hitch(this,this._add_call);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._update_call_back = lang.hitch(this, this._update_call);
		this._delete_call_back = lang.hitch(this, this._delete_call);
		this._dialog = null;
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_add_marketsector:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		if (this.mode == "add")
		{
			if ( confirm("Add Market Sector?"))
			{
				request.post('/research/admin/marketsector/add',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);
			}
		}
		else
		{
			if ( confirm("Update Market Sector?"))
			{
				request.post('/research/admin/marketsector/update',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._update_call_back);
			}
		}
	},
	_add_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Market Sector Added");
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Market_Sector_Added, response.data.marketsector);
		}
		else if ( response.success == "DU")
		{
			alert("Market Sector Already Exists");
			this.marketsectordescription.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	_update_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Market Sector Updated");
			topic.publish(PRCOMMON.Events.Market_Sector_Update, response.data.marketsector);
			this.clear();
			if (this._dialog)
				this._dialog.hide();
		}
		else if ( response.success == "DU")
		{
			alert("Web Dates Already Exists");
			this.marketSectordescription.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.marketsectordescription.set("value","");
		this.marketsectorid.set("value",-1);
		this.savenode.cancel();
	},
	focus:function()
	{
		this.marketsectordescription.focus();
	},
	_setDialogAttr:function ( dialog)
	{
		this._dialog = dialog;
	},
	load:function(marketsectorid)
	{
		this.clear();

		request.post('/research/admin/marketsector/get',
				utilities2.make_params({ data : {marketsectorid:marketsectorid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this.marketsectorid.set("value", response.data.marketsector.marketsectorid);
			this.marketsectordescription.set("value", response.data.marketsector.marketsectordescription);
			if (response.data.inuse == true )
				domclass.add( this.delete_button,"prmaxhidden");
			else
				domclass.remove( this.delete_button,"prmaxhidden");

			this._dialog.show();
		}
		else
		{
			alert("Problem");
		}
	},
	_close:function()
	{
		if ( this._dialog)
			this._dialog.hide();
	},
	_delete:function()
	{
		if ( confirm("Delete Market Sector?"))
		{
			request.post('/research/admin/marketsector/delete',
					utilities2.make_params({ data : {marketsectorid : this.marketsectorid.get("value")}})).
					then(this._delete_call_back);
		}
	},
	_delete_call:function( response)
	{
		if (response.success=="OK")
		{
			alert("Market Sector Deleted");
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Market_Sector_Deleted, this.marketsectorid.get("value"));
		}
		else
		{
				alert("Failed");
		}
	}
});
});
