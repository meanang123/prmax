//-----------------------------------------------------------------------------
// Name:    WebSourcesAdd
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
	"dojo/text!../web/templates/WebSourcesAdd.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, topic ){
 return declare("prcommon2.web.WebSourcesAdd",
	[BaseWidgetAMD],{
	templateString: template,
	mode:"add",
	constructor: function()
	{
		this._add_call_back = lang.hitch(this,this._add_call);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._update_call_back = lang.hitch(this, this._update_call);
		this._dialog = null;
	},
	postCreate:function()
	{
		this.inherited(arguments);
	},
	_add_publisher:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.savenode.cancel();
			throw "N";
		}

		if (this.mode == "add")
		{
			if ( confirm("Add Web Sources?"))
			{
				request.post('/research/admin/websources/add',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);
			}
		}
		else
		{
			if ( confirm("Update Web Sources?"))
			{
				request.post('/research/admin/websources/update',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._update_call_back);
			}
		}
	},
	_add_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Web Source Added");
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Web_Sources_Added, response.data);
		}
		else if ( response.success == "DU")
		{
			alert("Web Sources Already Exists");
			this.websourcedescription.focus();
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
			alert("Web Source Updated");
			topic.publish(PRCOMMON.Events.Web_Sources_Update, response.data);
			this.clear();
			if (this._dialog)
				this._dialog.hide();
		}
		else if ( response.success == "DU")
		{
			alert("Web Sources Already Exists");
			this.websourcedescription.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.websourcedescription.set("value","");
		this.websourceid.set("value",-1);
		this.savenode.cancel();
	},
	focus:function()
	{
		this.websourcedescription.focus();
	},
	_setDialogAttr:function ( dialog)
	{
		this._dialog = dialog;
	},
	load:function( websourceid)
	{
		this.clear();

		request.post('/research/admin/websources/get',
				utilities2.make_params({ data : {websourceid:websourceid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this.websourcedescription.set("value", response.data.websourcedescription);
			this.websourceid.set("value", response.data.websourceid);
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
	}
});
});
