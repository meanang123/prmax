//-----------------------------------------------------------------------------
// Name:    edit.js
// Author:  Chris Hoy
// Purpose:
// Created: 19/08/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.projects.edit");


dojo.require("prmax.dataadmin.projects.outletwizard");
dojo.require("prmax.dataadmin.outlets.OutletEdit");
dojo.require("prmax.dataadmin.freelance.FreelanceEdit");

dojo.declare("prmax.dataadmin.projects.edit",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.projects","templates/edit.html"),
	constructor: function()
	{
		this.model = new prcommon.data.QueryWriteStore (
			{	url:'/dataadmin/projects_members',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
			});

		this._UpdateCallBack = dojo.hitch(this, this._UpdateCall );
	},
	postCreate:function()
	{
		this.grid.set("structure", this.view);
		this.grid._setStore(this.model);
		this.grid.onRowClick = dojo.hitch(this,this._OnSelectRow);
		this.researchprojectstatusid.set("store",PRCOMMON.utils.stores.Research_Project_Status());

		this.inherited(arguments);
	},
	_OnSelectRow:function ( e )
	{
		this._row = this.grid.getItem(e.rowIndex);
		if (e.cellIndex == 3 )
		{
			this.researchprojectitemid.set("value", this._row.i.researchprojectitemid );
			this.researchprojectstatusid.set("value", this._row.i.researchprojectstatusid);

			this.status_dlg.show();
		}
		else
		{
			if ( this._row.i.prmax_outletgroupid == "freelance" )
			{
				this.zone.selectChild ( this.freelanceedit);
				this.freelanceedit.Load ( this._row.i.outletid );
			}
			else
			{
				this.zone.selectChild ( this.outletedit);
				this.outletedit.Load ( this._row.i.outletid );
			}
		}
	},
	resize:function()
	{
		this.borderControl.resize( arguments[0] ) ;
		this.inherited(arguments);
	},
	Load:function( project )
	{
		this.researchprojectid = project.researchprojectid;
		this.grid.setQuery(ttl.utilities.getPreventCache({researchprojectid:project.researchprojectid}));

		dojo.attr(this.projectname , "innerHTML", project.researchprojectname );
	},
	view: {
		cells: [[
		{name: 'Outletname',width: "300px",field:"outletname"},
		{name: 'Status',width: "150px",field:"researchprojectstatusdescription"},
		{name: ' ', width: "12px", formatter:ttl.utilities.editRowCtrl},
		{name: ' ', width: "12px", formatter:ttl.utilities.formatRowCtrl}

		]]
	},
	_Filter:function()
	{

	},
	_Clear:function()
	{
		this.researchprojectitemid.set("researchprojectitemid",-1);
		this.researchprojectstatusid.set("value",1);
		this.researcheddate.set("checked",true);
	},
	_UpdateCall:function ( response )
	{
		if ( response.success == "OK")
		{
			this.model.setValue(  this._row, "researchprojectstatusdescription" , response.data.researchprojectstatusdescription, true );
			this._Clear();
			this.status_dlg.hide();
			alert("Record Updated");
		}
		else
		{
			alert("Problem");
		}
	},
	_UpdateRecord:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._UpdateCallBack,
			url:'/dataadmin/project_item_update',
			content: this.form.get("value")
		}));
	}
});





