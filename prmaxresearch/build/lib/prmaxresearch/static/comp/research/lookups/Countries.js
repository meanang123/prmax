//-----------------------------------------------------------------------------
// Name:    Countries.js
// Author:  Chris Hoy
// Purpose:
// Created: 18/07/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../lookups/templates/Countries.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang ){
 return declare("research.lookup.Countries",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this.countries =  new Observable( new JsonRest( {target:'/research/admin/countries/list', idProperty:"countryid"}));
		this.countrytypes_filter = new ItemFileReadStore ({ url:"/common/lookups?searchtype=countrytypes&nofilter=1"});
		this.countrytypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=countrytypes"});
		this.countries_list = new ItemFileReadStore( {url:"/common/lookups?searchtype=countries&nofilter=1"} );

		this._add_call_back = lang.hitch(this, this._add_call);
		this._upd_call_back = lang.hitch(this, this._upd_call);
		this._show_edit_call_back  = lang.hitch(this,this._show_edit_call);

	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Name',className: "standard", field:"countryname"},
			{label: 'Type',className: "standard", field:"countrytypedescription"},
			{label: 'Parent',className: "standard", field:"parentcountryname"}
		];

		this.countries_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.countries,
			query:{}
		});

		this.countries_grid.on("dgrid-select", lang.hitch(this,this._select_country));


		this.countrytypeid_filter.set("store" , this.countrytypes_filter);
		this.countrytypeid_filter.set("value", -1 );
		this.countrytypeid.set("store" , this.countrytypes);
		this.countrytypeid.set("value", 1 );
		this.regioncountryid.set("store", this.countries_list);
		this.regioncountryid.set("value", -1);
		this.upd_countrytypeid.set("store" , this.countrytypes);
		this.upd_regioncountryid.set("store", this.countries_list);

		this.inherited(arguments);
	},
	_select_country:function(e)
	{
		request.post('/research/admin/countries/countries_get',
				utilities2.make_params({ data : {countryid: e.rows[0].data.countryid }})).
				then (this._show_edit_call_back);
	},
	_show_edit_call:function( response )
	{
		if ( response.success == "OK")
		{
			this.upd_countryid.set("value", response.data.countryid);
			this.upd_countryname.set("value", response.data.countryname);
			this.upd_countrytypeid.set("value", response.data.countrytypeid);
			this.upd_regioncountryid.set("value", ( response.data.regioncountryid == null) ? -1 : response.data.regioncountryid );
			this.updbtn.cancel();
			this.upd_dlg.show();
		}
		else
		{
			alert("Problem Loading");
		}
	},
	startup:function()
	{
		this.inherited(arguments);
		this.countries_grid_view.set("content", this.countries_grid);
	},
	_execute:function()
	{
			var query = {};

			if ( arguments[0].countrytypeid != -1 )
				query["countrytypeid"] = arguments[0].countrytypeid;
			if ( arguments[0].filter != "" )
				query["countryname"] = arguments[0].filter;

			this.countries_grid.set("query",query);
	},
	_clear_filter:function()
	{
		this.filter.set("value","");
		this.countrytypeid.set("value",-1);
	},
	_add:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		if ( confirm("Add Country"))
		{
			request.post('/research/admin/countries/countries_add',
				utilities2.make_params({data : this.form.get("value")})).
				then(this._add_call_back);
		}
	},
	_add_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.countries.add( response.country ) ;
			alert ( "Added");
			this.add_dlg.hide();
		}
		else
		{
			if ( response.message)
				alert(response.message ) ;
			else
				alert("Problem");
		}
		this.addbtn.cancel();
		this.updbtn.cancel();
	},
	_upd_call:function( response )
	{
		if ( response.success == "OK" )
		{
			this.countries.put( response.country ) ;
			alert ( "Updated");
			this.upd_dlg.hide();
		}
		else if ( response.success == "DU" )
		{
			alert ( "Already Exists");
		}
		else
		{
			if ( response.message)
				alert(response.message ) ;
			else
				alert("Problem");
		}
		this.addbtn.cancel();
		this.updbtn.cancel();
	},
	_show_new:function()
	{
		this.countryname.set("value","");
		this.countrytypeid.set("value",1);
		this.regioncountryid.set("value", -1);
		this.add_dlg.show();
		this.countryname.focus();
	},
	_update:function()
	{
		if ( utilities2.form_validator(this.upd_form)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		request.post('/research/admin/countries/countries_update',
			utilities2.make_params({data : this.upd_form.get("value")})).
			then(this._upd_call_back);
	}
});
});