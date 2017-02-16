//-----------------------------------------------------------------------------
// Name:    OutletEdit.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.dataadmin.outlets.OutletEdit");

dojo.require("prmax.dataadmin.outlets.AdvanceView");

dojo.declare("prmax.dataadmin.outlets.OutletEdit",
	[ ttl.BaseWidget ],
	{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.dataadmin.outlets","templates/OutletEdit.html"),
		constructor: function()
		{
			this._LoadCallBack = dojo.hitch( this, this._LoadCall);
			this._UpdatedCallBack = dojo.hitch( this, this._UpdatedCall);
			this._GetEntryCallBack = dojo.hitch (this, this._getContactEntry);
			this.private_menu = null;
			this.private_menu_limited = null;

			this.outlet_contact_model= new prcommon.data.QueryWriteStore (
				{	url:"/employees/contactlist?extended=1",
					onError:ttl.utilities.globalerrorchecker,
					nocallback:true
				});

			dojo.subscribe(PRCOMMON.Events.Employee_Deleted, dojo.hitch(this,this._EmployeeDeletedEvent));
			dojo.subscribe(PRCOMMON.Events.Outlet_Deleted, dojo.hitch(this,this._OutletDeletedEvent));
			dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));
			dojo.subscribe(PRCOMMON.Events.Employee_Add, dojo.hitch(this,this._EmployeeAddEvent));
			dojo.subscribe(PRCOMMON.Events.Employee_Updated, dojo.hitch(this,this._EmployeeUpdateEvent));

		},
		postCreate:function()
		{
			this.outlet_contact_grid.set("structure",this.outletContact_View);
			this.outlet_contact_grid._setStore(this.outlet_contact_model);
			this.outlet_contact_grid['onStyleRow'] = dojo.hitch(this,ttl.GridHelpers.onStyleRow);
			this.outlet_contact_grid.onRowContextMenu = dojo.hitch(this,this.onRowContextMenu);
			this.baseonCellClick = this.outlet_contact_grid.onCellClick;
			this.outlet_contact_grid.onCellClick =  dojo.hitch(this,this.onCellClick);
			this.outlet_contact_grid.onRowClick  = dojo.hitch(this,this.onSelectRow);
			this.inherited(arguments);
		},
		onSelectRow : function(e)
		{
			this.outlet_contact_grid.selection.clickSelectEvent(e);
		},
		resize:function()
		{
			this.frame.resize(arguments[0]);
		},
		onRowContextMenu:function(e)
		{
			this.outlet_contact_grid.selection.clickSelectEvent(e);
			this._Menu(e);
		},
		_Menu:function(e)
		{
			this._row = this.outlet_contact_grid.getItem(e.rowIndex);

			if (this.delete_menu)
			{
				this.delete_menu = new dijit.Menu();
				this.delete_menu.startup();
			}
			if (this.private_menu===null)
			{
				this.private_menu = new dijit.Menu();
				this.private_menu.addChild(new dijit.MenuItem({label:"Delete Contact", onClick:dojo.hitch(this,this._DeleteEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
				this.private_menu.addChild(new dijit.MenuItem({label:"Add Contact", onClick:dojo.hitch(this,this._AddEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
				this.private_menu.addChild(new dijit.MenuItem({label:"Set Primary Contact", onClick:dojo.hitch(this,this._PrimaryContact),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
				this.private_menu.startup();
			}
			if (this.private_menu_limited===null)
			{
				this.private_menu_limited = new dijit.Menu();
				this.private_menu_limited.addChild(new dijit.MenuItem({label:"Add Contact", onClick:dojo.hitch(this,this._AddEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
				this.private_menu_limited.startup();
			}
			if ( this._row.prmaxstatusid == 2 )
			{
				this.delete_menu._openMyself(e);
			}
			else
			{
				if ( this._row.i.prn_primary)
					this.private_menu_limited._openMyself(e);
				else
					this.private_menu._openMyself(e);
			}
		},
		onCellClick : function(e)
		{
			this.outlet_contact_grid.selection.clickSelectEvent(e);
			this.inherited(arguments);

			this._row = this.outlet_contact_grid.getItem(e.rowIndex);
			if ( e.cellIndex == 2 )
			{
				this._Menu(e);
			}
			else
			{
				this.contact_edit.Load( this._row.i.employeeid, this._row.i.outletid );
				this.contact_edit_container.selectChild(this.contact_edit);
			}
		},
		_PrimaryContact:function()
		{
			this.employee_set_primary_ctrl.Load (  this._row.i.employeeid ,   this._row.i.contactname, this._row.job_title ) ;
			this.employee_set_primary_dlg.show();
		},
		_EditEmployee:function()
		{
			this.employee_change_ctrl.Load (  this._row.i.employeeid ,  this._outletid  ) ;
			this.employee_change_dlg.show();
		},
		_DeleteEmployee:function()
		{
			this.employee_delete_ctrl.Load ( this._row.i.employeeid, this._row.i.job_title, this._row.i.contactname);
			this.employee_delete_dlg.show();
		},
		_AddEmployee:function()
		{
			this.employee_change_ctrl.Load (  -1 ,  this._outletid  ) ;
			this.employee_change_dlg.show();
		},
		outletContact_View:{
			cells: [[
				{name: 'Contact',width: "200px",field:"contactname"},
				{name: 'Job Title',width: "200px",field:"job_title"},
				{name: " ",width: "15px",field:"",formatter:ttl.utilities.formatRowCtrl},
				{name: 'Source',width: "50px",field:"sourcename"},
				{name:'Status',width: "50px",field:"prmaxstatusid", formatter:ttl.utilities.formatDeletedCtrl}
			]]
	},
	_LoadCall:function ( response )
	{
		if ( response.success=="OK")
		{
			this.outlet_main.Load ( this._outletid, response.outlet ) ;
			this.outlet_profile_ctrl.Load( this._outletid, 1 , response.outlet.outlet.profile ) ;
			this.outlet_research_ctrl.Load ( this._outletid, response.outlet.outlet.outlettypeid ) ;
			this.outlet_prn_ctrl.Load( this._outletid, response.outlet) ;
			this.outlet_advance_ctrl.Load ( this._outletid ) ;
			this.contact_edit_container.selectChild ( this.blank_cont_view ) ;
			this.contact_edit.Clear();
		}
	},
	Load:function ( outletid )
	{
		this._outletid = outletid;
		this.outlet_audit_ctrl.Load ( this._outletid ) ;

		if (this._outletid == -1 )
		{
			this.Clear();
		}
		else
		{
			this.outlet_contact_grid.setQuery( ttl.utilities.getPreventCache({outletid:this._outletid}));
			dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._LoadCallBack,
						url:'/outlets/research_outlet_edit_get',
						content: {outletid: outletid}
						}));
		}
	},
	Clear: function()
	{
		this.outlet_main.Clear();
		this.outlet_contact_grid.setQuery( ttl.utilities.getPreventCache({}));
		this.outlet_profile_ctrl.Clear();
		this.outlet_prn_ctrl.Clear();
	},
	destroy:function()
	{
		try
		{
			this.inherited(arguments);
		}
		catch(e){}
	},
	_ShowDetails:function()
	{
		this.outlet_container.selectChild ( this.outlet_details_view ) ;
	},
	_ShowContacts:function()
	{
		this.outlet_container.selectChild ( this.outlet_contact_view ) ;
	},
	_ShowAudit:function()
	{
		this.outlet_container.selectChild ( this.outlet_audit_view ) ;

	},
	_ShowProfile:function()
	{
		this.outlet_container.selectChild ( this.outlet_profile_view ) ;
	},
	_ShowResearch:function()
	{
		this.outlet_container.selectChild ( this.outlet_research_view ) ;
	},
	_ShowPrn:function()
	{
		this.outlet_container.selectChild ( this.outlet_prn_view ) ;
	},
	_ShowAdvance:function()
	{
		this.outlet_container.selectChild ( this.outlet_advance_view ) ;
	},
	_EmployeeDeletedEvent:function ( employee )
	{
		this.employee = null;
		// see if employee is on grid ?
		var item  =	{	identity:employee.employeeid,
						onItem: this._GetEntryCallBack};
		this.outlet_contact_model.fetchItemByIdentity(item);
		// is on grid then remove record
		if (this.employee !== null )
			this.outlet_contact_model.deleteItem( this.employee );
	},
	_EmployeeUpdateEvent:function ( employee )
	{
		if ( employee == null )
		{
			this.outlet_contact_grid.setQuery( ttl.utilities.getPreventCache({outletid:this._outletid}));
		}
		else
		{
			this.employee = null;
			// see if employee is on grid ?
			var item  =	{	identity:employee.employeeid,
							onItem: this._GetEntryCallBack};
			this.outlet_contact_model.fetchItemByIdentity(item);
			if (this.employee !== null )
			{
				this.outlet_contact_model.setValue(  this.employee, "job_title" , employee.job_title, true );
				this.outlet_contact_model.setValue(  this.employee, "contactname" , employee.contactname, true );
			}
		}
	},
	_EmployeeAddEvent:function ( employee )
	{
		employee.sourcename="PRmax";
		this.outlet_contact_model.newItem(employee);
	},
	_OutletDeletedEvent:function( outlet )
	{
		this.Clear();
	},
	_getContactEntry:function()
	{
		this.employee = arguments[0];
	},
	_DialogCloseEvent:function(  source )
	{
		if ( source == "emp_del" )
			this.employee_delete_dlg.hide();
		if ( source == "emp_cha" )
			this.employee_change_dlg.hide();
		if ( source == "out_pri")
			this.employee_set_primary_dlg.hide();
	}
});


