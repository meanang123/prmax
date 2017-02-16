//-----------------------------------------------------------------------------
// Name:    SeoView.js
// Author:  Chris Hoy
// Purpose:
// Created: 11/01/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.iadmin.accounts.SeoView");

dojo.require("ttl.BaseWidget");

dojo.require( "dojox.grid.EnhancedGrid");
dojo.require( "dojox.data.JsonRestStore");


dojo.declare("prmax.iadmin.accounts.SeoView",
	[ttl.BaseWidget],{
		templatePath: dojo.moduleUrl( "prmax.iadmin.accounts","templates/SeoView.html"),
	constructor: function()
	{
		this._seos = new dojox.data.JsonRestStore( {target:"/iadmin/seo/seo_list_shop", idAttribute:"seoreleaseid"});
		this._seopaymenttypes =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=seopaymenttypes?filter=1"});

	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.grid.set("structure",this.view);
		this.grid._setStore(this._seos );
		this.filter_seopaymenttypeid.set("store", this._seopaymenttypes);
		this.filter_seopaymenttypeid.set("value", -1);
	},
	Load:function(icustomerid)
	{
		this._icustomerid = icustomerid;
		this.grid.setQuery({icustomerid:icustomerid});
	},
	resize:function()
	{
		this.inherited(arguments);
		this.borderCtrl.resize(arguments[0]);
	},
	view :{noscroll: false,
			cells: [[
			{name: 'Published',width: "5em",field:'published_display'},
			{name: 'Payment',width: "8em",field:'seopaymenttypedescription' },
			{name: 'Invoice',width: "5em",field:'seo_invoice_date_display'},
			{name: 'Inv Nbr.',width: "5em",field:'invoicenbr'},
			{name: 'Headline',width: "auto",field:'headline'}
		]]
	},
	_ClearFilter:function()
	{

	},
	_ExecuteFilter:function()
	{

	}
});
