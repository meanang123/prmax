//-----------------------------------------------------------------------------
// Name:    Edit.js
// Author:  Chris Hoy
// Purpose:
// Created: 27/07/2013
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../international/templates/Edit.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr"
	], function(declare, BaseWidgetAMD, template, BorderContainer, request, utilities2, ItemFileReadStore,lang,topic, domattr){
 return declare("research.international.Edit",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_call);
		this._load_call_back = lang.hitch(this, this._load_call);
	},
	postCreate:function()
	{
		this.prmax_outlettypeid.set("store",PRCOMMON.utils.stores.OutletTypes());

		this.inherited(arguments);
	},
	load:function( outletid )
	{
		this.outletid.set("value", outletid );
		this.updatebtn.cancel();
		request.post('/research/admin/outlets/research_outlet_edit_get',
			utilities2.make_params({ data : {outletid: outletid}})).
			then ( this._load_call_back);
	},
	_load_call:function( response )
	{
		if ( response.success == "OK")
		{
			with ( response )
			{
				this.prmax_outlettypeid.set("value",outlet.outlet.prmax_outlettypeid);
				var tmp = outlet.outlet.outletid+" - " + outlet.outlet.outletname;
				domattr.set(this.outlet_details_view,"innerHTML",  tmp );
			}
		}
		else
		{
			alert("Problem Loading");
		}

	},
	_update:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.updatebtn.cancel();
			throw "N";
		}

		request.post('/research/admin/outlets/update_international',
			utilities2.make_params({ data : this.form.get("value")})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			alert("Updated");
		}
		else
		{
			alert("Problem");
		}
		this.updatebtn.cancel();
	},
	_error_call:function()
	{
		this.savenode.cancel();
	}

});
});


