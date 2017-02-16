//-----------------------------------------------------------------------------
// Name:    PublisherAdd
// Author:  Chris Hoy
// Purpose:
// Created: 08/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------

define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../publisher/templates/PublisherAdd.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/topic",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dojox/validate/regexp",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, request, utilities2, json, lang, domclass, topic ){
 return declare("prcommon2.publisher.PublisherAdd",
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
			if ( confirm("Add Publisher?"))
			{
				request.post('/research/admin/publisher/add',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);
			}
		}
		else
		{
			if ( confirm("Update Publisher?"))
			{
				request.post('/research/admin/publisher/update',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._update_call_back);
			}
		}
	},
	_add_call:function( response )
	{
		console.log(response);

		if (response.success=="OK")
		{
			alert("Publisher Added");
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Publisher_Added, response.data.publisher);
		}
		else if ( response.success == "DU")
		{
			alert("Publisher Alread Exists");
			this.publishername.focus();
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
			alert("Publisher Updated");
			topic.publish(PRCOMMON.Events.Publisher_Update, response.data.publisher);
			this.clear();
			if (this._dialog)
				this._dialog.hide();
		}
		else if ( response.success == "DU")
		{
			alert("Publisher Already Exists");
			this.publishername.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.publishername.set("value","");
		this.publisherid.set("value",-1);
		this.www.set("value","");
		this.savenode.cancel();

	},
	focus:function()
	{
		this.publishername.focus();
	},
	_setDialogAttr:function ( dialog)
	{
		this._dialog = dialog;
	},
	load:function( publisherid)
	{
		this.clear();

		request.post('/research/admin/publisher/get',
				utilities2.make_params({ data : {publisherid:publisherid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response)
	{
		if ( response.success == "OK")
		{
			this.publishername.set("value", response.data.publisher.publishername);
			this.publisherid.set("value", response.data.publisher.publisherid);
			this.www.set("value", response.data.publisher.www);
			if ( response.data.inuse==false )
				domclass.remove(this.delete_button,"prmaxhidden");
			else
				domclass.add(this.delete_button,"prmaxhidden");
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
			if ( confirm("Delete Publisher?"))
			{
				request.post('/research/admin/publisher/delete',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._delete_call_back);
			}
	},
	_delete_call:function( response )
	{
		if ( response.success == "OK")
		{
			alert("Publisher Deleted");
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Publisher_Deleted, this.publisherid.get("value"));
		}
		else
		{
				alert("Problem Delting Publisher");
		}
	}
});
});
