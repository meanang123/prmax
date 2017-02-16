//-----------------------------------------------------------------------------
// Name:    PersonSearch.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2014
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.search.PersonSearch");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Dialog");
dojo.require("ttl.Form");
dojo.require("prmax.search.standard2");

dojo.declare("prmax.search.PersonSearch",
	[ ttl.BaseWidget],
	{
	templatePath: dojo.moduleUrl( "prmax.search","templates/PersonSearch.html"),
	constructor: function()
	{
		this._dialog = null;
		this._load_call_back = dojo.hitch(this, this._load_call);
	},
	start_search:function()
	{
		this.clear();
		this.search_people_dlg.show();
	},
	_search:function()
	{
		this.form_name.setExtendedMode(false);
		var content = this.form_name.get("value");

		if ( this._is_empty( content ) == true )
		{
			alert("No Search Criteria Specified");
			return ;
		}

		dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._load_call_back,
					url:'/search/dosearch',
					content: content
					}));
	},
	_load_call:function(response)
	{
		dojo.publish(PRCOMMON.Events.SearchSession_Changed , [response.data,PRMAX.utils.settings.searchappend,0]);

		if ( response.data.total == 0)
		{
			alert("No Result Found");
		}
		else
		{
			dijit.byId("std_banner_control").ShowResultList();
			this.search_people_dlg.hide();
		}
	},
	_extended_search:function()
	{
		dijit.byId("std_banner_control").ShowSearchStd();
		this.search_people_dlg.hide();
	},
	_is_empty:function( content )
	{
		if ( this.person_outletname.get("value") != "")
			return false;

		if ( this.person_searchname.get("value") != "")
			return false;

		return true;
	},
	clear:function()
	{
		this.person_outletname.Clear();
		this.person_searchname.Clear();
	}
});





