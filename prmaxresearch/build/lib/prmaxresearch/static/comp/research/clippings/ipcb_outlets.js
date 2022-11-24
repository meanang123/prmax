//-----------------------------------------------------------------------------
// Name:    ipcb_outlets.js
// Author:  Chris Hoy
// Purpose:
// Created:
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/ipcb_outlets.html",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/data/ItemFileReadStore",
	"dojo/store/Observable",
	"ttl/store/JsonRest",
	"dojox/data/JsonRestStore",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, request, utilities2, lang, ItemFileReadStore,Observable,JsonRest,JsonRestStore){
return declare("research.clippings.ipcb_outlets",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this._countries = new ItemFileReadStore ({ url:"/common/lookups?searchtype=countries"});
		this._outlets = new JsonRestStore( {target:'/research/clippings/list_outlets', idProperty:"outletid"});
		this._load_details_call_back = lang.hitch(this,this._load_details_call);
		this._update_translation_call_back = lang.hitch(this,this._update_translation_call);

	},
	postCreate:function()
	{

		this.countryid.set("store", this._countries);
		this.countryid.set("value",1);
		this.outletid.set("store", this._outlets);

		this.inherited(arguments);

	},
	_change_country:function()
	{
		var countryid=this.countryid.get("value");

		this.outletid.set("query",{"countryid":countryid});

	},
	load:function( outletexternallinkid, show_func )
	{
		this._show_func = show_func;
		this.outletexternallinkid.set("value",outletexternallinkid);
		request.post('/research/clippings/get_outlet_trans_record',
			utilities2.make_params({ data: {outletexternallinkid:outletexternallinkid}} )).then
			(this._load_details_call_back);
	},
	_load_details_call:function(response)
	{
		if ( response.success=="OK")
		{
			this._show_func("ipcb_outlets");
			//this.countryid.set("value", response.data.countryid);
			this.outletid.set("value", response.data.outletid);
		}
	},
	_update_outlet:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		request.post('/research/clippings/update_outlet_trans',
				utilities2.make_params({ data: this.form.get("value")} )).then
				(this._update_translation_call_back);
	},
	_update_translation_call:function(response)
	{
		if (response.success=="OK")
		{
			this._show_func("ipcb_outlets",response.data);
		}
	}
});
});
