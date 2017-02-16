//-----------------------------------------------------------------------------
// Name:    ProductionCompanyAdd
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
	"dojo/text!../production/templates/ProductionCompanyAdd.html",
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
 return declare("prcommon2.production.ProductionCompanyAdd",
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
			if ( confirm("Add Production Company?"))
			{
				request.post('/research/admin/production/add',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._add_call_back);
			}
		}
		else
		{
			if ( confirm("Update Production Company?"))
			{
				request.post('/research/admin/production/update',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._update_call_back);
			}
		}
	},
	_add_call:function( response )
	{
		if (response.success=="OK")
		{
			alert("Production Company Added");
			this.clear();
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Production_Company_Added, response.data.productioncompany);
		}
		else if ( response.success == "DU")
		{
			alert("Production Company Already Exists");
			this.productioncompanydescription.focus();
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
			alert("Production Company Updated");
			topic.publish(PRCOMMON.Events.Production_Company_Update, response.data.productioncompany);
			this.clear();
			if (this._dialog)
				this._dialog.hide();
		}
		else if ( response.success == "DU")
		{
			alert("Production Company Already Exists");
			this.productioncompanydescription.focus();
		}
		else
		{
				alert("Failed");
		}
		this.savenode.cancel();
	},
	clear:function()
	{
		this.productioncompanydescription.set("value","");
		this.productioncompanyid.set("value",-1);
		this.savenode.cancel();
	},
	focus:function()
	{
		this.productioncompanydescription.focus();
	},
	_setDialogAttr:function ( dialog)
	{
		this._dialog = dialog;
	},
	load:function( productioncompanyid)
	{
		this.clear();

		request.post('/research/admin/production/get',
				utilities2.make_params({ data : {productioncompanyid:productioncompanyid}})).
				then(this._load_call_back);
	},
	_load_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this.productioncompanydescription.set("value", response.data.productioncompany.productioncompanydescription);
			this.productioncompanyid.set("value", response.data.productioncompany.productioncompanyid);
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
			if ( confirm("Delete Production Company?"))
			{
				request.post('/research/admin/production/delete',
					utilities2.make_params({ data : this.form.get("value")})).
					then(this._delete_call_back);
			}
	},
	_delete_call:function( response )
	{
		if ( response.success == "OK")
		{
			alert("Production Company Deleted");
			if (this._dialog)
				this._dialog.hide();
			topic.publish(PRCOMMON.Events.Production_Company_Deleted, this.productioncompanyid.get("value"));
		}
		else
		{
				alert("Problem Deleting Production Company");
		}
	}});
});
