require({cache:{
'url:prcommon2/web/templates/WebDatesAdd.html':"<div style=\"border: 1px solid black\">\r\n<form  data-dojo-props='onsubmit:\"return false\",\"class\":\"prmaxdefault\"' data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\">\r\n\t<input data-dojo-props='name:\"webauditdateid\",type:\"hidden\",value:-1'  data-dojo-attach-point=\"webauditdateid\" data-dojo-type=\"dijit/form/TextBox\"/>\r\n\t\t<table cellspacing=\"0\" cellpadding=\"0\" width=\"400px\">\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" >Web Dates</td><td colspan=\"2\" ><input data-dojo-props='\"class\":\"prmaxinput\",name:\"webauditdatedescription\",type:\"text\",trim:true,required:true,style:\"width:90%\",placeHolder:\"Web Dates\"'  data-dojo-attach-point=\"webauditdatedescription\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t<tr>\r\n\t\t\t<td data-dojo-attach-point=\"close_button\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_close\"></button></td>\r\n\t\t\t<td data-dojo-attach-point=\"delete_button\" class=\"prmaxhidden\" ><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Delete\"' data-dojo-attach-event=\"onClick:_delete\"></button></td>\r\n\t\t\t<td align=\"right\"><button data-dojo-attach-event=\"onClick:_add_dates\" data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" type=\"button\" busyLabel=\"Please Wait Saving...\" label=\"Save\"></button></td></tr>\r\n\t</table>\r\n</form>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    WebDatesAdd
// Author:  Chris Hoy
// Purpose:
// Created: March/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define("prcommon2/web/WebDatesAdd", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../web/templates/WebDatesAdd.html",
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
 return declare("prcommon2.web.WebDatesAdd",
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
	_add_dates:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		if (this.mode == "add")
		{
			if ( confirm("Add Web Dates?"))
			{
				request.post('/research/admin/webdates/add',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);
			}
		}
		else
		{
			if ( confirm("Update Web Dates?"))
			{
				request.post('/research/admin/webdates/update',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._update_call_back);
			}
		}
	},
	_add_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Web Dates Added");
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Web_Dates_Added, response.data.webdates);
		}
		else if ( response.success == "DU")
		{
			alert("Web Date Already Exists");
			this.webauditdatedescription.focus();
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
			alert("Web Dates Updated");
			topic.publish(PRCOMMON.Events.Web_Dates_Update, response.data.webdates);
			this.clear();
			if (this._dialog)
				this._dialog.hide();
		}
		else if ( response.success == "DU")
		{
			alert("Web Dates Already Exists");
			this.webauditdatedescription.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.webauditdatedescription.set("value","");
		this.webauditdateid.set("value",-1);
		this.savenode.cancel();
	},
	focus:function()
	{
		this.webauditdatedescription.focus();
	},
	_setDialogAttr:function ( dialog)
	{
		this._dialog = dialog;
	},
	load:function( webauditdateid)
	{
		this.clear();

		request.post('/research/admin/webdates/get',
				utilities2.make_params({ data : {webauditdateid:webauditdateid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this.webauditdateid.set("value", response.data.webdates.webauditdateid);
			this.webauditdatedescription.set("value", response.data.webdates.webauditdatedescription);
			this.webauditdateid.set("value", response.data.webdates.webauditdateid);
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
		if ( confirm("Delete Web Dates"))
		{
			request.post('/research/admin/webdates/delete',
					utilities2.make_params({ data : {webauditdateid : this.webauditdateid.get("value")}})).
					then(this._delete_call_back);
		}
	},
	_delete_call:function( response)
	{
		if (response.success=="OK")
		{
			alert("Web Dates Deleted");
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Web_Dates_Deleted, this.webauditdateid.get("value"));
		}
		else
		{
				alert("Failed");
		}
	}
});
});
