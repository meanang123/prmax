//-----------------------------------------------------------------------------
// Name:    prcommon.data.DataStores
// Author:  Chris Hoy
// Purpose: allows data to be chnaged from a query
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.data.DataStores");

dojo.require("dojo.data.ItemFileReadStore");

dojo.declare("prcommon.data.DataStores", null,
{
	constructor: function(/* Object */ params)
	{
		this._prmaxoutlettypes = new dojo.data.ItemFileReadStore({ url:"/common/lookups?searchtype=prmaxoutlettypes"} );
		this._frequencies = new dojo.data.ItemFileReadStore(	{ url:"/common/lookups?searchtype=frequencies"} );
		this._reasoncode_data_upd = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=reasoncodes&reasoncategoryid=2"});
		this._reasoncode_data_add = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=reasoncodes&reasoncategoryid=1"});
		this._reasoncode_data_del = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=reasoncodes&reasoncategoryid=3"});
		this._reasoncode_data_email = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=reasoncodes&reasoncategoryid=4"});
		this._interest_master_type =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=interestgroups"});
		this._interest_sections =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=interestgroups&sections=1"});
		this._research_frequencies =  new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=researchfrequencies"});
		this._countries = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=countries"});
		this._contacthistorysources = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=contacthistorytypes"});
		this._contacthistorysourcesext = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=contacthistorytypes&include_no_option=1"});
		this._messagetypes = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=messagetypes"});
		this._customertypes_model = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=customertypes"});
		this._customertypes_model_ext = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=customertypes&include_no_option=1"});
		this._researchprojectstatus = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=researchprojectstatus"});
		this._customersources = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=customersources&include_no_option=1"});
	},
	Reason_Add_Default:5,
	Reason_Upd_Default:8,
	fetch:function()
	{
		this._interest_master_type.fetch();
		this._messagetypes.fetch();

		/*this._prmaxoutlettypes.fetch();
		this._frequencies.fetch();
		this._reasoncode_data_upd.fetch();
		this._reasoncode_data_add.fetch();
		this._reasoncode_data_del.fetch();
		this._research_frequencies.fetch();
		this._countries.fetch();
		this._contacthistorysources.fetch();
		this._contacthistorysourcesext.fetch();
		*/

	},
	MessageTypes:function()
	{
		return this._messagetypes;
	},
	OutletTypes:function()
	{
		return this._prmaxoutlettypes;
	},
	Frequency:function()
	{
		return this._frequencies;
	},
	Research_Reason_Update_Codes:function()
	{
		return this._reasoncode_data_upd;
	},
	Research_Reason_Add_Codes:function()
	{
		return this._reasoncode_data_add;
	},
	Research_Reason_Del_Codes:function()
	{
		return this._reasoncode_data_del;
	},
	Research_Reason_Add_Email:function()
	{
		return this._reasoncode_data_email;
	},
	Interest_Filter:function()
	{
		return this._interest_master_type;
	},
	Research_Frequencies:function()
	{
		return this._research_frequencies;
	},
	Countries:function()
	{
			return this._countries;
	},
	ContactHistoryTypes:function( include_no_option )
	{
		if ( include_no_option === true )
			return this._contacthistorysourcesext;
		else
			return this._contacthistorysources;
	},
	Interest_Sections:function()
	{
		return this._interest_sections;
	},
	Customer_Types:function()
	{
			return this._customertypes_model;
	},
	Customer_Types_Filter:function()
	{
		return this._customertypes_model_ext;
	},
	Research_Project_Status:function()
	{
		return this._researchprojectstatus;
	},
	Customer_Source_Filter:function()
	{
		return this._customersources;
	}
});
