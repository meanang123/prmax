//-----------------------------------------------------------------------------
// Name:    Profile.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/02/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../pages/templates/GeographicalCoverage.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/dom-attr",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dijit/form/Textarea"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request , Grid, JsonRest, domattr){
 return declare("prmaxquestionnaires.pages.GeographicalCoverage",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_handler);
		this._page_ctrl = null;
		this._page_error = null;
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.coverage_grid = new Grid({
			columns: 		[
				{label: 'Coverage', className:"standard",field:"geographicalname"},
				{label: 'Type', className:"dgrid-column-type",field:"geographicallookupdescription"}
			],
			selectionMode: "none",
			store: new JsonRest( {target:'/questionnaire/coverage', idProperty:"geographicalid"}),
			query: {outletid: PRMAX.questionnaire.outlet.outlet.outletid,
			researchprojectitemid: PRMAX.questionnaire.questionnaireid }
		});

		this.outlet_coverage_grid_view.set("content", this.coverage_grid);

		this.load(PRMAX.questionnaire);

		if ( PRMAX.questionnaire.outlet.outlet.countryid == 119)
		{
			domattr.set(this.country_name,"innerHTML","Australia");
		}
	},
	_update_coverage:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post('/questionnaire/update_coverage',
			utilities2.make_params({ data : this.form.get("value")})).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			if (this._page_ctrl)
			{
				this._page_ctrl();
			}
			else
				alert("Coverage Updated");
		}
		else
		{
			alert("Changes Failed to Apply");
			if ( this._page_error)
				this._page_error();
		}
	},
	load:function( questionnaire )
	{
		this.geognotes.set("value", questionnaire.geognotes);
		this.questionnaireid.set("value",questionnaire.questionnaireid);
	},
	_error_handler:function(response, ioArgs)
	{
		utilities2.xhr_post_error(response, ioArgs);
	},
	save_move:function( page_ctrl, error_ctrl )
	{
		this._page_ctrl = page_ctrl;
		this._page_error = error_ctrl;
		this._update_coverage();
	}
});
});
