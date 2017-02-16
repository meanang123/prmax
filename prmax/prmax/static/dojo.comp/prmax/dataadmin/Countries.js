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
dojo.provide("prmax.dataadmin.Countries");

dojo.declare("prmax.dataadmin.Countries",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/Countries.html"),
	constructor: function()
	{
		this.countries = new prcommon.data.QueryWriteStore ( {url:'/dataadmin/countries',"nocallback":true} );
		this.countrytypes_filter = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=countrytypes&nofilter=1"});
		this.countrytypes = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=countrytypes"});
		this.countries_list = new dojox.data.QueryReadStore ( {url:"/common/lookups?searchtype=countries&nofilter=1"} );

		this._AddCallBack = dojo.hitch(this, this._AddCall);

	},
	postCreate:function()
	{
		this.countries_grid.set("structure",this.view);
		this.countries_grid._setStore(this.countries );
		this.countrytypeid_filter.set("store" , this.countrytypes_filter);
		this.countrytypeid_filter.set("value", -1 );
		this.countrytypeid.set("store" , this.countrytypes);
		this.countrytypeid.set("value", 1 );
		this.regioncountryid.set("store", this.countries_list);
		this.regioncountryid.set("value", -1);

		this.inherited(arguments);
	},
	view: {
		cells: [[
		{name: 'Name',width: "auto",field:"countryname"},
		{name: 'Type',width: "auto",field:"countrytypedescription"},
		{name: 'Parent',width: "auto",field:"parentcountryname"}
		]]
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
		this.inherited(arguments);
	},
	_Execute:function()
	{
			var query = {};

			if ( arguments[0].countrytypeid != -1 )
				query["countrytypeid"] = arguments[0].countrytypeid;
			if ( arguments[0].filter != "" )
				query["countryname"] = arguments[0].filter;

			this.countries_grid.setQuery( ttl.utilities.getPreventCache( query));
	},
	_ClearFilter:function()
	{
		this.filter.set("value","");
		this.countrytypeid.set("value",-1);
	},
	onSelectRow : function(e)
	{
		this._row = this.geographical_grid.getItem(e.rowIndex);
	},
	onCellClick : function(e)
	{
		this.onSelectRow(e);
	},
	_Add:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.addBtn.cancel();
			return;
		}

		if ( confirm("Add Country"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._AddCallBack,
				url:'/dataadmin/countries_add',
				content: this.form.get("value")}));
		}
	},
	_AddCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.countries.newItem( response.country ) ;
			alert ( "Added")
			this.add_dlg.hide();
		}
		else
		{
			if ( response.message)
				alert(response.message ) ;
			else
				alert("Problem");
		}
		this.addBtn.cancel();
	},
	_ShowNew:function()
	{
		this.countryname.set("value","");
		this.countrytypeid.set("value",1);
		this.regioncountryid.set("value", -1);
		this.add_dlg.show();
		this.countryname.focus();
	}
});





