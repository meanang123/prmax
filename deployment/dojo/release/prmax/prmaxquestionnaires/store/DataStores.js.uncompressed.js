//-----------------------------------------------------------------------------
// Name:
// Author:  Chris Hoy
// Purpose:
// Created: 27/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
define("prmaxquestionnaires/store/DataStores", [
	"dojo/_base/declare", // declare
	"dojo/data/ItemFileReadStore"
	], function(declare, ItemFileReadStore ){
 return declare("prmaxquestionnaires.store.DataStores",
	null,{
	constructor: function()
	{
		this._countries = new ItemFileReadStore ( { url:"/common/lookups?searchtype=countries"});
		this._interest_sections = new ItemFileReadStore ( { url:"/common/lookups?searchtype=interestgroups&sections=1"});
		this._frequencies = new ItemFileReadStore(	{ url:"/common/lookups?searchtype=frequencies"} );
		this._prmaxoutlettypes = new ItemFileReadStore({ url:"/common/lookups?searchtype=prmaxoutlettypes"} );

	},
	fetch:function()
	{
		this._countries.fetch();
		this._interest_sections.fetch();
		this._frequencies.fetch();
	},
	Countries:function()
	{
			return this._countries;
	},
	interest_sections:function()
	{
		return this._interest_sections;
	},
	Frequency:function()
	{
		return this._frequencies;
	},
	OutletTypes:function()
	{
		return this._prmaxoutlettypes;
	}
});
});
