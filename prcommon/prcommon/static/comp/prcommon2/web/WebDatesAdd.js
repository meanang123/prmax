//-----------------------------------------------------------------------------
// Name:    WebDatesAdd
// Author:  Chris Hoy
// Purpose:
// Created: March/2016
//
// To do:
//
//-----------------------------------------------------------------------------

define([
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
