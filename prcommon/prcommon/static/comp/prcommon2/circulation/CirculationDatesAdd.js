//-----------------------------------------------------------------------------
// Name:    CirculationDatesAdd
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
	"dojo/text!../circulation/templates/CirculationDatesAdd.html",
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
 return declare("prcommon2.circulation.CirculationDatesAdd",
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
			if ( confirm("Add Circulation Dates?"))
			{
				request.post('/research/admin/circulationdates/add',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);
			}
		}
		else
		{
			if ( confirm("Update Circulation Dates?"))
			{
				request.post('/research/admin/circulationdates/update',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._update_call_back);
			}
		}
	},
	_add_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Circulation Dates Added");
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Circulation_Dates_Added, response.data.circulationdates);
		}
		else if ( response.success == "DU")
		{
			alert("Circulation Date Already Exists");
			this.circulationauditdatedescription.focus();
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
			alert("Circulation Dates Updated");
			topic.publish(PRCOMMON.Events.Circulation_Dates_Update, response.data.circulationdates);
			this.clear();
			if (this._dialog)
				this._dialog.hide();
		}
		else if ( response.success == "DU")
		{
			alert("Circulation Dates Already Exists");
			this.circulationauditdatedescription.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.circulationauditdatedescription.set("value","");
		this.circulationauditdateid.set("value",-1);
		this.savenode.cancel();
	},
	focus:function()
	{
		this.circulationauditdatedescription.focus();
	},
	_setDialogAttr:function ( dialog)
	{
		this._dialog = dialog;
	},
	load:function( circulationauditdateid)
	{
		this.clear();

		request.post('/research/admin/circulationdates/get',
				utilities2.make_params({ data : {circulationauditdateid:circulationauditdateid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this.circulationauditdateid.set("value", response.data.circulationdates.circulationauditdateid);
			this.circulationauditdatedescription.set("value", response.data.circulationdates.circulationauditdatedescription);
			this.circulationauditdateid.set("value", response.data.circulationdates.circulationauditdateid);
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
		if ( confirm("Delete Circulation Dates"))
		{
			request.post('/research/admin/circulationdates/delete',
					utilities2.make_params({ data : {circulationauditdateid : this.circulationauditdateid.get("value")}})).
					then(this._delete_call_back);
		}
	},
	_delete_call:function( response)
	{
		if (response.success=="OK")
		{
			alert("Circulation Dates Deleted");
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Circulation_Dates_Deleted, this.circulationauditdateid.get("value"));
		}
		else
		{
				alert("Failed");
		}
	}
});
});
