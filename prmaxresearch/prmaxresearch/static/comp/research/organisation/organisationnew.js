//-----------------------------------------------------------------------------
// Name:    organisationnew.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2017
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../organisation/templates/organisationnew.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"dojox/form/BusyButton",
	"dijit/form/NumberTextBox",
	"dojox/validate/regexp"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang, topic ){
 return declare("research.organisation.organisationnew",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._updated_call_back = lang.hitch (this, this._updated_call);
	},
	postCreate:function()
	{
		this.prmax_outlettypeid.set("store", PRCOMMON.utils.stores.OutletTypes());
		//this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());
		this.countryid.set("store",PRCOMMON.utils.stores.Countries())

		//this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Add_Default);
		this.countryid.set("value", 1);

		this.inherited(arguments);
	},
	_update: function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}
		request.post('/research/admin/organisation/research_add_organisation',
			utilities2.make_params({ data : this.form.get("value")})).
			then(this._updated_call_back);
	},
	_updated_call:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Organisation Added");
			this.savebtn.cancel();
			this.clear();
			this.outletname.focus();
		}
		else
		{
			alert("Failed to add");
			this.savebtn.cancel();
		}
	},
	clear:function()
	{
		this.prmax_outlettypeid.set("value", null ) ;
		this.countryid.set("value", 1);
		this.outletname.set("value","");
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.www.set("value","");
		this.tel.set("value","");
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.profile.set("value","");
		this.savebtn.cancel();
	}
});
});





