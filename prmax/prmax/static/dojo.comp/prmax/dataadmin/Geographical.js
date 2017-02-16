//-----------------------------------------------------------------------------
// Name:    search.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.Geographical");

dojo.declare("prmax.dataadmin.Geographical",
	[ ttl.BaseWidget ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin","templates/Geographical.html"),
		constructor: function()
		{
			this.geographical = new prcommon.data.QueryWriteStore ( {url:'/dataadmin/geographical',"nocallback":true} );
			this.geographical_types = new dojo.data.ItemFileReadStore ({ url:"/common/lookups?searchtype=geographicallookuptypes&addempty=1"});
			this.coverage_store = new dojox.data.QueryReadStore ( {url:'/dataadmin/coverage'} );
			this.children_store = new dojox.data.QueryReadStore ( {url:'/geographical/geographical_children'} );

			dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));
			dojo.subscribe(PRCOMMON.Events.Geographical_Area_Delete, dojo.hitch(this,this._GeogDeleteEvent));
			dojo.subscribe(PRCOMMON.Events.Geographical_Area_Update, dojo.hitch(this,this._GeogUpdateEvent));
			dojo.subscribe(PRCOMMON.Events.Geographical_Area_Add, dojo.hitch(this,this._GeogAddEvent));
			dojo.subscribe(PRCOMMON.Events.Coverage_Moved, dojo.hitch(this,this._CoverageMovedEvent));


		},
		postCreate:function()
		{
			this.geographical_grid.set("structure",this.view);
			this.geographical_grid._setStore(this.geographical );
			this.coverage_grid.set("structure",this.coverage_view);
			this.coverage_grid._setStore(this.coverage_store );

			this.baseonCellClick = this.geographical_grid['onCellClick'];
			this.geographical_grid['onStyleRow'] = dojo.hitch(this,ttl.GridHelpers.onStyleRow);
			//this.geographical_grid['onRowClick'] = dojo.hitch(this,this.onSelectRow);
			this.geographical_grid['onCellClick'] = dojo.hitch(this,this.onCellClick);
			this.geographicallookups.store = this.geographical_types;
			this.geographicallookups.set("value",-1);
			this.inherited(arguments);
		},
		view: {
			cells: [[
			{name: 'Area',width: "auto",field:"geographicalname"},
			{name: 'Type',width: "auto",field:"geographicallookupdescription"},
			{name: 'Internal Id',width: "auto",field:"geographicalid"}
			]]
		},
		coverage_view: {
			cells: [[
			{name: 'Outlet',width: "auto",field:"outletname"}
			]]
		},
		resize:function()
		{
			this.frame.resize(arguments[0]);
			this.inherited(arguments);
		},
		destroy:function()
		{
			try
			{
				this.inherited(arguments);
			}
			catch(e){}
		},
		_Execute:function()
		{
				var query = {filter:arguments[0].filter,geographicallookuptypeid:-1};
				if ( arguments[0].geographicallookuptypeid != -1 )
					query["geographicallookuptypeid"] = arguments[0].geographicallookuptypeid;

				this.geographical_grid.setQuery( ttl.utilities.getPreventCache(query));
		},
		_ClearFilter:function()
		{
			this.filter.set("value","");
			this.geographicallookuptypeid.set("value",-1);
		},

		onSelectRow : function(e) {
			console.log("onSelectRow",e);
			this._row=this.geographical_grid.getItem(e.rowIndex);
			this._ShowDetails();

			this.geographical_grid.selection.clickSelectEvent(e);
			console.log("onSelectRow");
		},
		onCellClick : function(e)
		{
			console.log("onCellClick" , e);
			this.onSelectRow(e);
		},
		_ShowDetails:function()
		{
			dojo.removeClass( this.geographical_edit.domNode , "prmaxhidden" ) ;
			this.geographical_edit.Load ( this._row.i.geographicalid );
			this.coverage_grid.setQuery( ttl.utilities.getPreventCache({geographicalid:this._row.i.geographicalid}));
		},
		_HideDetails:function()
		{
			dojo.addClass( this.geographical_edit.domNode , "prmaxhidden" ) ;
			this.geographical_edit.Load ( -1 );
			this._row = null;
		},
		_AddNew:function()
		{
			this.geographical_add.Load(-1);
			this.geographical_add_dlg.show();
		},
		_DialogCloseEvent:function(  source )
		{
			this.geographical_add_dlg.hide();
			this.geographical_add.Load(-1);
		},
		_GeogDeleteEvent:function( geographicalid )
		{
			this.geographical.deleteItem(this._row);
			this._HideDetails();
		},
		_GeogUpdateEvent:function( data )
		{
			this.geographical.setValue(  this._row, "geographicalname" , data.geographical.geographicalname, true );
			this.geographical.setValue(  this._row, "geographicallookupdescription" , data.geographicallookupdescription, true );
		},
		_GeogAddEvent:function ( data )
		{
			gHelper.AddRowToQueryWriteGrid(this.geographical_grid,this.geographical.newItem( data ));
		},
		_CoverageMovedEvent:function()
		{
			this.coverage_grid.setQuery( ttl.utilities.getPreventCache({geographicalid:this._row.i.geographicalid}));
		}
});





