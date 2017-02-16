//-----------------------------------------------------------------------------
// Name:    prmax.lists.SaveToList
// Author:  Chris Hoy
// Purpose:
// Created: 22/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.projects.projects");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

formatRowCtrl = function(inDatum) {
	return isNaN(inDatum) ? '...' : '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/static/images/rowctrl.gif" ></img>';
	}

dojo.declare("prmax.projects.projects",
	[dijit._Widget, dijit._Templated, dijit._Container],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.projects","templates/projects.html"),
	constructor: function()
	{
		this.model = new prcommon.data.QueryWriteStore(
		{	url:"/projects/projects",
			onError:ttl.utilities.globalerrorchecker
		});

		this.projectlists_model = null;
		this.projectcollateral_model = null ;
		this.projectid = null;
		this.projectname = "";

		this._LoadProjectCallBack = dojo.hitch(this,this._LoadProjectDetails);
		this._DeleteProjectCallBack = dojo.hitch(this,this._DeleteProjectDetails);
		this._getModelItemCall = dojo.hitch(this,this._getModelItem);


		dojo.subscribe(PRCOMMON.Events.Project_Add, dojo.hitch(this,this._AddItemEvent));
		dojo.subscribe(PRCOMMON.Events.Project_Delete, dojo.hitch(this,this._DeleteItemEvent));

	},
	postCreate:function()
	{
		this.projects.attr("structure",this.view);
		this.projectlists.attr("structure",this.view_lists);
		this.projectcollateral.attr("structure",this.view_collateral);

		this.projects.setStore(this.model);

		this.baseonCellClick = this.projects['onCellClick'];
		this.projects['onStyleRow'] = dojo.hitch(this,this._OnStyleRow);
		this.projects['onCellClick'] = dojo.hitch(this,this._OnCellClick);
	},
	_OnStyleRow:function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
	},
	_OnSelectRow : function(e) {

		var row=this.projects.getItem(e.rowIndex);
		this._ShowProjectDetails( row.i.projectid );
		this.projects.selection.clickSelectEvent(e);
	},
	_OnCellClick:function(e)
	{
		if ( e.cellIndex == 0 )
		{
			this._OnSelectRow(e);
		}
		// user click on the button row
		else if ( e.cellIndex == 1 )
		{
			this._OnSelectRow(e);
			this.onRowContextMenu(e);
		}
		else
		{
			this.baseonCellClick(e);
		}
	},
	_LoadProjectDetails:function ( response )
	{
		if ( response.success=="OK" )
		{
			console.log ( response.project );
			dojo.attr( this.projects_name,"innerHTML" , response.project.projectname ) ;
			this.projectid = response.project.projectid;
			this.projectname = response.project.projectname;
			dojo.removeClass(this.main_frame,"prmaxhidden");
		}
	},
	_ShowProjectDetails:function( projectid )
	{
		if (this.projectid != projectid )
		{
			// need to capture the data for dipslay
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._LoadProjectCallBack,
					url:'/projects/get',
					content:{ projectid:projectid } }));

			// load both the grids
			if (this.projectlists_model == null )
			{
				this.projectlists_model = new prcommon.data.QueryWriteStore(
					{	url:"/projects/listmembers",
						onError:ttl.utilities.globalerrorchecker
					});
				this.projectlists.store = this.projectlists_model ;
				this.projectcollateral_model = new prcommon.data.QueryWriteStore(
					{	url:"/projects/collateral",
						onError:ttl.utilities.globalerrorchecker
					});
				this.projectcollateral.store = this.projectcollateral_model ;
			}

			this.projectlists.setQuery(ttl.utilities.getPreventCache({projectid:projectid}));
			this.projectcollateral.setQuery(ttl.utilities.getPreventCache({projectid:projectid}));
		}
	},
	view: {
			cells: [[
			{name: 'Description ',width: "auto",field:"projectname"}
			//{name: ' ',width: "15px",field:"projectid", formatter:formatRowCtrl, styles: 'text-align: center;'}
			]]
	},
	view_collateral: {
			cells: [[
			{name: 'Collateral ',width: "auto",field:"collateralname"}
			]]
	},
	view_lists: {
			cells: [[
			{name: 'List',width: "auto",field:"listname"},
			{name: 'Count',width: "30px",field:"count"}
			]]
	},
	startup:function()
	{
	},
	 destroy: function()
	 {
		this.inherited(arguments);
		delete this.model;
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	},
	refresh:function()
	{
		this.projects.setQuery ( ttl.utilities.getPreventCache({}) );
		this.projects.selection.clear();
		this.projectid = null;
		this._ClearPanel();
	},
	_ClearPanel:function()
	{
		this.projectid = null;
		this.projectlists.setQuery(ttl.utilities.getPreventCache({projectid:-1}));
		this.projectcollateral.setQuery(ttl.utilities.getPreventCache({projectid:-1}));
		dojo.attr( this.projects_name,"innerHTML" , "") ;
		dojo.addClass(this.main_frame,"prmaxhidden");
	},
	_ShowAddProject:function()
	{
		this.newproject.show();
	},
	_AddItemEvent:function(data)
	{
		this.model.newItem(data);
	},
	_getModelItem:function()
	{
		console.log("_getModelItem",arguments);
		if ( arguments[0].i.i !=null )
			this.tmp_row = arguments[0].i;
		else
			this.tmp_row = arguments[0];
	},
	_DeleteItemEvent:function( projectid)
	{
		if ( projectid == this.projectid )
		{
			this._ClearPanel();
			this.projects.selection.clear();
		}
		var item  = {identity:projectid,
			onItem: this._getModelItemCall};

		this.model.fetchItemByIdentity(item);
		if (this.tmp_row )
			this.model.deleteItem( this.tmp_row );
	},
	_Rename:function()
	{

	},
	_DeleteProjectDetails:function (response )
	{
		if ( response.success=="OK" )
		{
			dojo.publish(PRCOMMON.Events.Project_Delete,[response.projectid]);
			alert("Project Deleted");
		}
	},
	_Delete:function()
	{
		if ( confirm ( "Delete Project " + this.projectname + "?") ==true )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._DeleteProjectCallBack,
					url:'/projects/delete',
					content:{ projectid:this.projectid } }));
		}
	}
});
