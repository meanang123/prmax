//-----------------------------------------------------------------------------
// Name:    create.js
// Author:  Chris Hoy
// Purpose:
// Created: 19/08/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.projects.create");

dojo.declare("prmax.dataadmin.projects.create",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.projects","templates/create.html"),
	constructor: function()
	{
		this._LoadCallBack = dojo.hitch(this, this._LoadCall ) ;
		this._AddCallBack = dojo.hitch(this, this._AddCall ) ;
		this._users = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=dataadmin&nofilter"});
		this.model = new prcommon.data.QueryWriteStore (
			{	url:'/search/list?searchtypeid=5&research=1',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
			});
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.iuserid.store = this._users;
		this.iuserid.set("value", -1);
		this.grid.set("structure", this.view);
		this.grid._setStore(this.model);
	},
	resize:function()
	{
		this.borderControl.resize ( arguments[0] ) ;
		this.inherited(arguments);
	},
	_ClearSearchCall:function( response )
	{
		this.grid.setQuery(ttl.utilities.getPreventCache({}));
	},
	_ClearSearch:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._ClearSearchCallBack,
				url:'/search/sessionclear',
				content: {searchtypeid: 5}
		}));
	},
	_ClearSearchResults:function( response )
	{
		if ( response.success == "OK")
		{
			this._LoadCall();
		}

	},
	_IsEmpty:function( content )
	{
		var search_type = content["search_type"];

		for(var item in content)
		{
			if (item.indexOf(search_type)!=-1)
			{
				if (content[item].length!=0)
				{
					return false;
				}
			}
		}
		return true;
	},
	_Search:function( )
	{
		var fname = "pr_std_search_outlet_form";
		if ( this.search_tabcont.selectedChildWidget == this.search_tab_freelance )
			fname = "pr_std_search_freelance_form";

		var form = dijit.byId( fname ) ;

		form.setExtendedMode(false);
		var content = form.get("value");

		if ( this._IsEmpty(content) == true )
		{
			alert("No Search Criteria Specified");
			this.searchbutton.cancel();
			return ;
		}
		else
		{
			// This is a special case for
			if ( fname=="pr_std_search_outlet_form")
			{
				var field = dijit.byId(  "pr_search_outlet_roles" ) ;
				if ( field.get("value").length>0 && field.get("IsDefault") == true && this._SearchCriteriaCount(content) == 1 )
				{
					alert("This search will return all outlets. Please select another criteria e.g. Media Channel");
					this.searchbutton.cancel();
					return ;
				}
			}
		}

		content['mode'] = 0;
		content['search_partial'] = 2

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._LoadCallBack,
						url:'/search/dosearch',
						content: content
						}));
	},
	_LoadCall:function( response )
	{
		this.searchbutton.cancel();
		this.grid.setQuery(ttl.utilities.getPreventCache({}));

	},
	_Clear:function()
	{
		this.grid.setQuery(ttl.utilities.getPreventCache({}));
		this.sendq.set("checked", true);
		this.iuserid.set("value", -1 ) ;
		this.projectname.set("value","");
		this.projectname.focus();
	},
	_AddCall:function( response )
	{
		if ( response.success == "OK" )
		{
			alert("Project Added");
			this._Clear();
		}
		else if ( response.success == "DU")
		{
			alert("Project Already Exists");
			this.projectname.focus();
		}
		else
		{
			alert("Problem adding Project");
			this.projectname.focus();
		}
	},
	_Create:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.searchbutton.cancel();
			return;
		}

		if ( confirm("Add Project"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._AddCallBack,
				url:'/dataadmin/projects_add',
				content: this.form.get("value")}));
		}
	},
	view: {
		cells: [[
		{name: ' ', width: "12px", formatter:ttl.utilities.formatRowCtrl},
		{name: 'Name',width: "auto",field:"outletname"},
		{name: 'Contact',width: "auto",field:"contactname"},
		{name: 'Source',width: "50px",field:"sourcename"},
		{name: 'Id',width: "50px",field:"outletid"}
		]]
	}
});





