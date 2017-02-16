//-----------------------------------------------------------------------------
// Name:    ReasonCodes.js
// Author:  Chris Hoy
// Purpose:
// Created: 04/03/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/ReasonCodes.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Cache",
	"dojo/store/Observable",
	"dojo/store/Memory",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/CheckBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Cache, Observable, Memory, request, utilities2, json, ItemFileReadStore ){
 return declare("research.lookup.ReasonCodes",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._store = new Observable( new JsonRest( {target:'/research/admin/reasoncodes', idProperty:"reasoncodeid"}));
		this.reasoncategories = new ItemFileReadStore ({ url:"/common/lookups?searchtype=reasoncategories"});
		this.reasoncategories_filter = new ItemFileReadStore ({ url:"/common/lookups?searchtype=reasoncategories&nofilter=1"});

		this._add_reason_call_back = dojo.hitch(this, this._add_reason_call);
	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Reason Name',className: "standard",field:'reasoncodedescription'},
			{label: 'Categories', className: "standard",field:'reasoncategoryname'}
		];
		this.reasons = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._store,
			query:{}
		})
		this.reasoncategoryid.set("store", this.reasoncategories);
		this.reasoncategoryfilter.set("store", this.reasoncategories_filter);
		this.reasoncategoryfilter.set("value",-1);
		this.reasoncategoryid.set("value",1);

		this.inherited(arguments);
	},
	startup:function()
	{
		this.inherited(arguments);

		this.reasons_view.set("content", this.reasons);

	},
	_view:{noscroll: false,
			cells: [[
				{name: 'Reason Name',width: "auto",field:'reasoncodedescription'},
				{name: 'Categories',width: "auto",field:'reasoncategoryname'}
		]]
	},
	_execute:function()
	{
		var query = {};

		if ( arguments[0].filter.length>0 )
			query["filter"] = arguments[0].filter;

		if (arguments[0].reasoncategoryid != -1)
				query["reasoncategoryid"] = arguments[0].reasoncategoryid
			this.reasons.set("query",query);
	},
	_execute_add:function()
	{
		if (this.reasoncodedescription.isValid() == false )
		{
			alert("No Code Specified");
		}
		else
		{
			request.post('/research/admin/reason_code_add',
				utilities2.make_params({ data : {reasoncodedescription:arguments[0].reasoncodedescription,
								reasoncategoryid:arguments[0].reasoncategoryid}})).
				then ( this._add_reason_call_back );
		}
		return false ;
	},
	_add_reason_call:function( response )
	{
		if (response.success == "OK" )
		{
			alert("Reason Added");
			this._store.add( response.data );
		}
		else if (response.success == "DU" )
		{
			alert("Reason Already Exists");
		}
		else
		{
			alert("Problem Adding Reason");
		}
	},
	_clear_filter:function()
	{
		this.reasoncategoryfilter.set("value",-1);
		this.reason_filter_description.set("value","");
	}
});
});





