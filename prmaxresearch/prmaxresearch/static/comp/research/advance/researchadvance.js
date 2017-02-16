//-----------------------------------------------------------------------------
// Name:    advance.js
// Author:  Chris Hoy
// Purpose:
// Created: 05/10/2010
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../advance/templates/researchadvance.html",
	"dijit/layout/ContentPane",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic"
	], function(declare, BaseWidgetAMD, template, ContentPane, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore,lang,topic ){
 return declare("research.advance.researchadvance",
	[BaseWidgetAMD,ContentPane],{
	templateString: template,
	constructor: function()
	{
		this._save_call_back = lang.hitch(this, this._save_call ) ;
		this._load_call_back = lang.hitch(this, this._load_call ) ;
		this._advancefeaturestatusid = new ItemFileReadStore ( { url:"/common/lookups?searchtype=advancefeaturestatus"});
	},
	postCreate:function()
	{
		this.advancefeaturestatusid.set("store", this._advancefeaturestatusid );

		this.inherited(arguments);
	},
	_save_call:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Research Details Updated");
		}
		else
		{
			alert("Problem saving Research Details");
		}
		this.savenode.cancel();
	},
	_save:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		var d = this.advance_last_contact.get("value");
		var content = this.form.get("value");

		content["advance_last_contact"] = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();

		request.post("/advance/research_details_save" ,
			utilities2.make_params({ data: content })).then
			(this._save_call_back);
	},
	load:function( outletid )
	{
		this.outletid.set("value", outletid );

		request.post("/advance/getResearchExt",
			utilities2.make_params({ data: {outletid:outletid}})).then
			(this._load_call_back);
	},
	_load_call:function( response )
	{
		if ( response.success == "OK" )
		{
			this.advance_last_contact.set("value" , new Date(response.data.advance_last_contact.year, response.data.advance_last_contact.month-1, response.data.advance_last_contact.day));
			this.advance_url.set("value" , response.data.advance_url);
			this.advance_notes.set("value", response.data.advance_notes);
			this.advancefeaturestatusid.set("value", response.data.advancefeaturestatusid);
		}
		else
		{
			alert("Problem Loading Research Details");
		}
	}
});
});





