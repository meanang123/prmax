//-----------------------------------------------------------------------------
// Name:    prmax.display.StdViewCommon
// Author:  Chris Hoy
// Purpose:
// Created: 14/09/2010
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.display.StdViewCommon");

dojo.require("prcommon.advance.stdview");
dojo.require("prmax.searchgrid.ApplyMarks");

dojo.declare("prmax.display.StdViewCommon",
	[],{
		startup_view:"outlet_view",
		advancefeatureslistid:-1,
		widgetsInTemplate: true,
		private_data:true,
	constructor: function() {
		this.modelSearch= new prcommon.data.QueryWriteStore(
				{	url:'/search/list',
					tableid:1,
					oncallback: dojo.hitch(this,this._SelectionChanged),
					onError:ttl.utilities.globalerrorchecker
				});
		// menu's
		this._firsttime = true;
		this.std_menu = null;
		this.std_menu_private_emp= null;
		this.private_menu= null;
		this.std_menu_freelance= null;
		this.std_freelance_private_menu= null;
		this._startup_state = true;
		// data controls
		this._count = new PRMAX.SearchGridCount();
		try
		{
			this.ctrldisplay = new PRMAX.DisplayObject();
		}
		catch(e)
		{
			alert("missing 2");

			this.ctrldisplay = new Object();
		}
		this._sortorder = PRMAX.utils.settings.stdview_sortorder ;
		this._context_row = null;

		// call back methods
		this._SortCallback = dojo.hitch(this,this._SortCall);
		this._DeletePrivateOutletResponseCall = dojo.hitch(this,this._DeletePrivateOutletResponse);
		this._ExclustionCallBack = dojo.hitch(this, this._ExclustionCall);
		this._getModelItemCall = dojo.hitch(this,this._getModelItem);

		// local dialogs
		this.stdDialog = new prmax.DlgCtrl2("width:35em;height:35em");
		this.outputDialog = null;
		this.largeDialog = new prmax.DlgCtrl2("width:35em;height:44em");

		// event to which this control should respond
		dojo.subscribe(PRCOMMON.Events.Employee_Deleted, dojo.hitch(this,this._EmployeeDeletedEvent));
		dojo.subscribe(PRCOMMON.Events.Employee_Updated, dojo.hitch(this,this._EmployeeUpdateEvent));
		dojo.subscribe(PRCOMMON.Events.SearchSession_Added, dojo.hitch(this,this._AddItemEvent));
		dojo.subscribe(PRCOMMON.Events.SearchSession_Deleted, dojo.hitch(this,this._DeleteItemEvent));
		dojo.subscribe(PRCOMMON.Events.Outlet_Deleted, dojo.hitch(this,this._OutletDeleteEvent));
		dojo.subscribe(PRCOMMON.Events.Outlet_Updated, dojo.hitch(this,this._OutletUpdateEvent));
		dojo.subscribe(PRCOMMON.Events.SearchSession_Changed, dojo.hitch(this,this._SearchUpdateEvent));
		dojo.subscribe(PRCOMMON.Events.Display_Retry, dojo.hitch(this,this._DisplayRetryEvent));
		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));

		PRMAX.search = this;
	},
	postCreate:function()
	{
		//  check view
		if ( this.views != null )
			this.views.selectChild ( this[this.startup_view] ) ;

		// for pro version show extra menu options
		if (PRMAX.utils.settings.productid==PRCOMMON.Constants.PRMAX_Pro)
		{
			dojo.removeClass(this.tag_menu.domNode,"prmaxhidden");
		}

		this.baseonCellClick = this.searchgrid['onCellClick'];
		this.searchgrid['onStyleRow'] = dojo.hitch(this,this._onStyleRow);
		this.searchgrid['onRowClick'] = dojo.hitch(this,this.onSelectRow);
		this.searchgrid['onCellClick'] = dojo.hitch(this,this.onCellClick);
		this.searchgrid['onRowContextMenu'] = dojo.hitch(this,this.onRowContextMenu);
		this.searchgrid['onHeaderClick'] = dojo.hitch(this,this._HeaderRow);

		// prevent sorting on headers
		this.searchgrid.canSort = function (col) { return false;};

		dojo.connect(this.clear,"onClick",dojo.hitch(this,this._Mark,PRCOMMON.Constants.Search_grid_clear));
		dojo.connect(this.markall,"onClick",dojo.hitch(this,this._Mark,PRCOMMON.Constants.Search_grid_markall));
		dojo.connect(this.invertmarks,"onClick",dojo.hitch(this,this._Mark,PRCOMMON.Constants.Search_grid_invertmarks));
		dojo.connect(this.clearappend,"onClick",dojo.hitch(this,this._Mark,PRCOMMON.Constants.Search_grid_clear_appended));
		dojo.connect(this.markappended,"onClick",dojo.hitch(this,this._Mark,PRCOMMON.Constants.Search_grid_mark_appended));

		this.searchgrid._setStore ( this.modelSearch ) ;
		this._UpdateCount();
		if (this.startup_view == "advance_view")
			this.advance_ctrl.UpdateCount();

		this.inherited(arguments);

	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
		//this.advance_view.resize(arguments[0]);
		this.inherited(arguments);
	},
	// Current selection chnaged need to update totals data
	_SelectionChanged:function(response)
	{
		this._count.Set( response.data ) ;
		this.countinfo.set("value", this._count ) ;
	},
	// control for event header pressed control
	_HeaderRow:function()
	{
		// this shows search dialog
		this.sort_dlg.set("callback",this._SortCallback);
		this.sort_dlg.set("value",this._sortorder);
		this.sort_dlg.show();
	},
	// If sorting has changed
	_SortCall:function(sortorder)
	{
		//s et sorting and refresh grid
		if (this._sortorder != sortorder)
		{
			this._sortorder = sortorder;
			this.refresh();
		}
	},
	getSortIndex:function()
	{
		return this._sortorder;
	},
	// standard grid view
	layoutSearch:{noscroll: false,
			cells: [[
				{name: ' ',width: "6px",styles: 'text-align: center;', width: "6px",field:'prmax_outletgroupid',formatter:ttl.utilities.outletType},//type: dojox.grid.cells.Bool},
				{name: ' ',width: "13px",styles: 'text-align: center;', width: "20px",field:'selected',formatter:ttl.utilities.formatButtonCell},//type: dojox.grid.cells.Bool},
				{name: ' ',width: "13px",formatter:ttl.utilities.formatRowCtrl,field:'sessionsearchid'},
				{name: 'Outlet',width: "250px",field:'outletname'},
				{name: 'Contact',width: "150px",field:'contactname'},
				{name: 'Title',width: "170px",field:'job_title'},
				{name: 'Email',width: "250px",field:'email'},
				{name: 'Country',width: "150px",field:'countryname'}
			]]
	},
	layoutSearch2:{noscroll: false,
			cells: [[
				{name: ' ',width: "6px",styles: 'text-align: center;', width: "6px"},//type: dojox.grid.cells.Bool},
				{name: ' ',width: "13px",styles: 'text-align: center;', width: "20px",field:'selected',formatter:ttl.utilities.formatButtonCell},//type: dojox.grid.cells.Bool},
				{name: ' ',width: "13px",formatter:ttl.utilities.formatRowCtrl,field:'sessionsearchid'},
				{name: 'Outlet',width: "250px",field:'outletname'},
				{name: 'Contact',width: "150px",field:'contactname'},
				{name: 'Title',width: "170px",field:'job_title'},
				{name: 'Email',width: "250px",field:'email'},
				{name: 'Country',width: "150px",field:'countryname'}
			]]
	},
	// grid call back to apply style to a grid row
	_onStyleRow:function(inRow)
	{

		// std grid setting
		if (inRow.selected)
		{
			inRow.customClasses += " prmaxSelectedRow";
			console.log("selected");
			return;
		}
		if (inRow.odd)  inRow.customClasses += " dojoxGridRowOdd";
		if (inRow.over)  inRow.customClasses += " dojoxGridRowOver";

		// check the data row an apply depending on info
		var rowData = this.searchgrid.getItem(inRow.index);
		// row has been appended to grid
		if (rowData && rowData.i.appended && !inRow.selected)
			inRow.customClasses += " appendedRow";
		// row is a private record
		else if ( rowData && !rowData.i.appended && !inRow.selected  && rowData.i.customerid != -1 )
			inRow.customClasses += " overridePrivateRow";
	},
	// call back from mark function
	_MarkCall:function(response)
	{
		console.log("_MarkCall");
		// update totals
		this._count.Set( response.data.count ) ;
		this.countinfo.set("value", this._count ) ;
		// Changed to force refresh becuase of grid cache
		this.searchgrid.setQuery(ttl.utilities.getPreventCache({sortorder:this._sortorder}));
	},
	// Chnaged marked record
	_Mark:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: dojo.hitch(this,this._MarkCall),
				url:'/search/sessionmark',
				content:{markstyle:arguments[0]}
			}));
	},
	// refresh the current display
	refresh:function(data, clear)
	{
		var rowId = null;
		if (data)
			this.ctrldisplay.Set(data);

		if (clear==true)
			this.searchgrid.selection.clear();
		else
		{
			var row = this.searchgrid.selection.getSelected();
			rowId = this.searchgrid._getItemIndex(row[0], false);
		}
		this.searchgrid.showMessage(this.searchgrid.loadingMessage);
		this.searchgrid.setQuery(ttl.utilities.getPreventCache({sortorder:this._sortorder}));
		if (clear==true && data != null && data.total == 0 )
			dojo.publish(PRCOMMON.Events.Display_Clear,[]);
		else
		{
			console.log(row);
			setTimeout("PRMAX.search.scrollTo("+rowId+");",1);
		}
	},
	// attemp to move to a specific row in the grid
	scrollTo:function(rowId)
	{
		this.searchgrid.scrollToRow(rowId);
	},
	// force the display of the first record in the grid
	displayForceLoad:function()
	{
		if (this.ctrldisplay.outletid>0 && PRMAX.utils.settings.autoselectfirstrecord)
		{
			this.searchgrid.selection.select(0);
			dojo.publish(PRCOMMON.Events.Display_Load, [this.ctrldisplay]);
		}
		else
		{
			dojo.publish(PRCOMMON.Events.Display_Clear);
		}
		this._startup_state = false ;
	},
	// Save the entries in the grid to
	_Save:function()
	{
		this.stdDialog.set("content",'<div dojoType="prmax.lists.SaveToListNew" selected="'+this._count.selected+'"  style="width:100%;height:99%"></div>');
		this.stdDialog.show("Save to List");
	},
	// Apply tags to the entries in the grid
	_ApplyTags:function()
	{
		this.stdDialog.set("content",'<div dojoType="prmax.interests.ApplyTags" selected="'+this._count.selected+'" ></div>');
		this.stdDialog.show("Add Tags");
	},
	_ApplyRoles:function()
	{
		this.stdDialog.set("content",'<div dojoType="prmax.roles.ApplyRoles" selected="'+this._count.selected+'" ></div>');
		this.stdDialog.show("Apply Roles");
	},
	_ApplyMarks:function()
	{
		this.apply_marks.set("closedlg", this.apply_marks_dlg) ;
		this.apply_marks_dlg.show();
	},
	// deduplicate the entries in the grid
	_DeDuplicate:function()
	{
		this.stdDialog.set("content",'<div dojoType="prmax.searchgrid.Deduplicate"></div>');
		this.stdDialog.show("De duplicate");
	},
	// show the output options for the grid
	_OutputPrint:function()
	{
		if ( this.outputDialog == null )
		{
			this.outputDialog = new prmax.DlgCtrl2("width:710px;height:490px");
			this.outputDialog.set("content",'<div id="output_w_1" dojotype="prmax.display.Output" selection="'+this._count.selected+'"></div>');
		}
		else
		{
			// will need to clean up?
			dijit.byId("output_w_1").Clear( this._count.selected );
		}
		this.outputDialog.show("Output");
	},
	_OutputEmail:function()
	{
		dijit.byId("std_banner_control").ShowEmailPanel( this._count.selected );
	},
	// Delete entries fron the grid
	_Delete:function()
	{
		this.stdDialog.set("content",'<div dojoType="prmax.lists.DeleteToList" selected="'+this._count.selected+'" ></div>');
		this.stdDialog.show("Delete Entries from Search");
	},
	// call back from server for the clear all options
	_ClearAllCall:function( response )
	{
		if ( response.success=="OK")
		{
			this.refresh({ outletid : -1 ,  employeeid: -1, outlettypeid:-1 } , true );
			this.setCount( {total:0,selected:0,appended:0});
			dojo.publish(PRCOMMON.Events.Display_Clear,[]);
		}
	},
	// Clear all the entries in the grid
	_ClearAll:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: dojo.hitch(this,this._ClearAllCall),
				url:'/search/sessionclear'
			}));
	},
	// menu system for a click on the row or the row button
	onRowContextMenu:function(e)
	{
		this._context_row =this.searchgrid.getItem(e.rowIndex);
		var menu = null;

		if ( this.private_data)
		{
			// Private outlet
			if (this._context_row.i.customerid!=-1 && this._context_row.i.outlettypeid!=19 && this._context_row.i.outlettypeid!=41)
				menu = this._private_record_context_menu();

			// Private freelance
			if (this._context_row.i.customerid!=-1 && this._context_row.i.outlettypeid==19)
				menu = this._freelance_private_context_menu();
			// Private freelance
			if (this._context_row.i.customerid!=-1 && this._context_row.i.outlettypeid==41)
				menu = this._freelance_private_context_menu();

			// Private contact
			if (this._context_row.i.customerid==-1 &&
				 this._context_row.i.ecustomerid!=-1&&
					this._context_row.i.outlettypeid!=19 && this._context_row.i.outlettypeid!=41)
				menu = this._std_record_private_employee_context_menu();
		}

		// standard Outlet
		if (this._context_row.i.customerid==-1 && this._context_row.i.outlettypeid!=19 && this._context_row.i.outlettypeid!=41 && menu == null)
			menu = this._std_record_context_menu();

		// Standard freelance
		if (this._context_row.i.customerid==-1 && this._context_row.i.outlettypeid==19 && menu == null)
			menu = this._std_freelance_record_context_menu();

		// Standard freelance
		if (this._context_row.i.customerid==-1 && this._context_row.i.outlettypeid==41 && menu == null)
			menu = this._std_freelance_record_context_menu();

		if (menu)
			menu._openMyself(e);
	},
	// click on a row of the grid
	onCellClick : function(e) {
		console.log("onCellClick",e);

		// user click on a general display row
		if ( e.cellIndex  == 0 || e.cellIndex >2 &&  e.cellIndex<7) {
			this.onSelectRow(e);
		}
		// user click on the selection row
		else if ( e.cellIndex == 1 )
		{
			var row=this.searchgrid.getItem(e.rowIndex);

			this.modelSearch.setValue(  row, "selected" , !row.i.selected, true );
		}
		// user click on the button row
		else if ( e.cellIndex == 2 )
		{
			this.onRowContextMenu(e);
		}
		// user click somewhere but onwhere we are interested in
		else
		{
			console.log(this.baseonCellClick);
			this.baseonCellClick(e);
		}
	},
	// row selection event/
	onSelectRow : function(e) {
		console.log("selectRow ",e);
		//e.rowIndex
		var row=this.searchgrid.getItem(e.rowIndex);
		console.log(row.i);
		// set the current data to the current row and show the row in the display
		this.ctrldisplay.Set(row.i);
		dojo.publish(PRCOMMON.Events.Display_Load , [this.ctrldisplay] );
		this.searchgrid.selection.clickSelectEvent(e);
	},
	// Clear up the local stored data
	_ClearLocal:function()
	{
		this.ctrldisplay.Clear();
	},
	// menu
	_std_record_context_menu:function(e)
	{
		if (this.std_menu ==null)
		{
            this.std_menu = new dijit.Menu();
			if ( this.private_data)
			{
				this.std_menu.addChild(new dijit.MenuItem({label:"Add Contact", onClick:dojo.hitch(this,this._AddEmployee)}));
				this.std_menu.addChild(new dijit.MenuItem({label:"Edit Contact", onClick:dojo.hitch(this,this._ChangeEmployee)}));
				this.std_menu.addChild(new dijit.MenuItem({label:"Edit Outlet", onClick:dojo.hitch(this,this._ChangeOutlet)}));
			}
			this.std_menu.addChild(new dijit.MenuItem({label:"Add to Exclude Outlet List", onClick:dojo.hitch(this,this._ExcludeList_Outlet)}));
			this.std_menu.addChild(new dijit.MenuItem({label:"Add to Exclude Employee List", onClick:dojo.hitch(this,this._ExcludeList_Employee)}));
			this.std_menu.addChild(new dijit.MenuItem({label:"Search", onClick:dojo.hitch(this,this._Search)}));
			this.std_menu.addChild(new dijit.MenuItem({label:"Print Summary", onClick:dojo.hitch(this,this._PrintSummary)}));
			this.std_menu.startup();
		}
		return this.std_menu;
	},
	// menu
	_std_record_private_employee_context_menu:function()
	{
		if (this.std_menu_private_emp ==null)
		{
            this.std_menu_private_emp = new dijit.Menu();
			if ( this.private_data)
			{
				this.std_menu_private_emp.addChild(new dijit.MenuItem({label:"Add Contact", onClick:dojo.hitch(this,this._AddEmployee)}));
				this.std_menu_private_emp.addChild(new dijit.MenuItem({label:"Change Contact", onClick:dojo.hitch(this,this._EditEmployee)}));
				this.std_menu_private_emp.addChild(new dijit.MenuItem({label:"Edit Outlet", onClick:dojo.hitch(this,this._ChangeOutlet)}));
			}
			this.std_menu_private_emp.addChild(new dijit.MenuItem({label:"Search", onClick:dojo.hitch(this,this._Search)}));
			this.std_menu_private_emp.addChild(new dijit.MenuItem({label:"Print Summary", onClick:dojo.hitch(this,this._PrintSummary)}));
			this.std_menu_private_emp.startup();
		}
		return this.std_menu_private_emp;
	},
	// menu
	_private_record_context_menu:function(e)
	{
		if (this.private_menu ==null)
		{
            this.private_menu = new dijit.Menu();
            this.private_menu.addChild(new dijit.MenuItem({label:"Add Contact", onClick:dojo.hitch(this,this._AddEmployee)}));
            this.private_menu.addChild(new dijit.MenuItem({label:"Edit Contact", onClick:dojo.hitch(this,this._EditEmployee)}));
            this.private_menu.addChild(new dijit.MenuItem({label:"Edit Outlet", onClick:dojo.hitch(this,this._EditOutlet)}));
            this.private_menu.addChild(new dijit.MenuItem({label:"Delete Outlet", onClick:dojo.hitch(this,this._DeletePrivateOutlet)}));
            this.private_menu.addChild(new dijit.MenuItem({label:"Search", onClick:dojo.hitch(this,this._Search)}));
            this.private_menu.addChild(new dijit.MenuItem({label:"Print Summary", onClick:dojo.hitch(this,this._PrintSummary)}));
            this.private_menu.startup();
		}
		return this.private_menu;
	},
	// menu
	_std_freelance_record_context_menu:function(e)
	{
		if (this.std_menu_freelance ==null)
		{
            this.std_menu_freelance = new dijit.Menu();
            this.std_menu_freelance.addChild(new dijit.MenuItem({label:"Edit Freelance", onClick:dojo.hitch(this,this._ChangeFreelance)}));
						this.std_menu_freelance.addChild(new dijit.MenuItem({label:"Add to Exclude Freelance List", onClick:dojo.hitch(this,this._ExcludeList_Freelance)}));
            this.std_menu_freelance.addChild(new dijit.MenuItem({label:"Search", onClick:dojo.hitch(this,this._Search)}));
            this.std_menu_freelance.addChild(new dijit.MenuItem({label:"Print Summary", onClick:dojo.hitch(this,this._PrintSummary)}));
            this.std_menu_freelance.startup();
		}
		return this.std_menu_freelance;
	},
	// menu
	_freelance_private_context_menu:function(e)
	{
		if (this.std_freelance_private_menu ==null)
		{
            this.std_freelance_private_menu = new dijit.Menu();
            this.std_freelance_private_menu.addChild(new dijit.MenuItem({label:"Edit Freelance", onClick:dojo.hitch(this,this._ChangePrivateFreelance)}));
            this.std_freelance_private_menu.addChild(new dijit.MenuItem({label:"Delete Freelance", onClick:dojo.hitch(this,this._DeletePrivateFreelance)}));
            this.std_freelance_private_menu.addChild(new dijit.MenuItem({label:"Search", onClick:dojo.hitch(this,this._Search)}));
            this.std_freelance_private_menu.startup();
		}
		return this.std_freelance_private_menu;
	},
	// chnage the employee at the current outlet
	_ChangeEmployeeAtOutlet:function()
	{
		this.largeDialog.set("content",'<div dojoType="prmax.employee.ChangeEmployee" outletid="'+this._context_row.i.outletid+'" employeeid="'+this._context_row.i.employeeid+'" current="'+this._context_row.i.contactname+'"></div>');
		this.largeDialog.show("Change Selected Contact's for Outlet("+this._context_row.i.outletname+")");
	},
	// Add a new employee
	_AddEmployee: function()
	{
		this.largeDialog.set("content",'<div dojoType="prmax.employee.EmployeeEdit" addsession="true" employeeid="-1" outletid="'+this._context_row.i.outletid+'"></div>');
		this.largeDialog.show("Add Contact to Outlet ("+this._context_row.i.outletname+")");
	},
	_EditEmployee: function()
	{
		if  (this._context_row.i.ecustomerid==-1)
		{
			this.largeDialog.set("content",'<div dojoType="prmax.employee.EmployeeOverride" employeeid="'+this._context_row.i.employeeid + '"></div>');
			this.largeDialog.show("Change Contact Details (" + this._context_row.i.contactname+ ")");
		}
		else
		{
			this.largeDialog.set("content",'<div dojoType="prmax.employee.EmployeeEdit" employeeid="'+this._context_row.i.employeeid+'" outletid="-1"></div>');
			this.largeDialog.show("Edit Contact ("+this._context_row.i.contactname+")");
		}
	},
	_ChangeEmployee:function()
	{
		this.stdDialog.set("content",'<div dojoType="prmax.employee.EmployeeOverride" employeeid="'+this._context_row.i.employeeid+'" ></div>');
		this.stdDialog.show("Change Contact Details (" + this._context_row.i.contactname + ")");
	},
	_ChangePrivateFreelance:function()
	{
		dijit.byId("std_banner_control").ShowFreelance(this._context_row.i.outletid);
	},
	_DeletePrivateFreelance:function()
	{
		if (confirm("Do you want to delete freelance" + this._context_row.i.outletname + "?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._DeletePrivateOutletResponseCall,
					url:'/outlets/freelance_delete',
					content:{outletid:this._context_row.i.outletid}}
					));
		}
	},
	_EditOutlet:function()
	{
		dijit.byId("std_banner_control").ShowOutlet(this._context_row.i.outletid);
	},
	_DeletePrivateOutlet:function()
	{
		if (confirm("Do you want to delete outlet ( " + this._context_row.i.outletname + " )?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: dojo.hitch(this,this._DeletePrivateOutletResponseCall),
					url:'/outlets/outlet_delete',
					content:{outletid:this._context_row.i.outletid, statistics:true}
			}));
		}
	},
	_DeletePrivateOutletResponse:function(response)
	{
		console.log(response);
		if (response.success=="OK")
		{
			alert(response.data.outlet.outletname + ' deleted succesfully');
			dojo.publish(PRCOMMON.Events.Outlet_Deleted,[response.data]);
			//this.setCount(response.data);
		}
		else
		{
			alert("Problem deleting outlet");
		}
	},
	_ChangeOutlet:function()
	{
		this.stdDialog.set("content",'<div dojoType="prmax.outlet.OutletOverride" outletid="'+this._context_row.i.outletid+'" outlettypeid="1"></div>');
		this.stdDialog.show("Edit Outlet Details (" + this._context_row.i.outletname + ")");
	},
	_ChangeFreelance:function()
	{
		this.stdDialog.set("content",'<div dojoType="prmax.outlet.OutletOverride" outletid="'+this._context_row.i.outletid+'" outlettypeid="19" ></div>');
		this.stdDialog.show("Edit Freelance Details (" + this._context_row.i.contactname + ")");
	},
	_Search:function()
	{
		dijit.byId("std_banner_control").ShowSearchStd();
	},
	enableControls:function()
	{
		var enabled = this._count.total?false:true;

		this.markoptions.set("disabled", enabled );
		this.save.set("disabled",enabled);
		this.delete_option.set("disabled",enabled);
		this.clearall.set("disabled",enabled);
		if (this.tools != null )
			this.tools.set("disabled",enabled);
		if ( this.output != null )
		{
			if (PRMAX.utils.settings.isdemo == true )
				enabled = true ;
			this.output.set("disabled",enabled);
		}
	},
	getSearchGrid:function()
	{
		return this.searchgrid;
	},
	_UpdateCountCall:function(response)
	{
		console.log ( "_UpdateCountCall" , response.data);
		this.setCount(response.data);
		this._SetListInfo( response.data ) ;
		this.ctrldisplay.Set (response.data);
		// only do this if the current view is outlet
		if (this.startup_view == "outlet_view")
		{
			if (this.ctrldisplay.outletid>0 && PRMAX.utils.settings.autoselectfirstrecord)
			{
				try{
					this.searchgrid.selection.select(0);
					if ( this._startup_state == false )
						dojo.publish(PRCOMMON.Events.Display_Load , [ this.ctrldisplay ] ) ;
					else
						setTimeout("dojo.publish('"+PRCOMMON.Events.Display_Retry+"',[]);",1000);

					this._startup_state = false ;
					}
				catch(e)
				{
					// problem here
					// would need to wait and call re-try on a diplay loop
					setTimeout("dojo.publish('"+PRCOMMON.Events.Display_Retry+"',[]);",1000);
				}
			}
		}
	},
	_DisplayRetryEvent:function()
	{
		console.log("_DisplayRetryEvent", this.ctrldisplay ) ;
		dojo.publish(PRCOMMON.Events.Display_Load , [ this.ctrldisplay ] ) ;
	},
	_UpdateCount:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParamsIgnore({
				load: dojo.hitch(this,this._UpdateCountCall),
				url:'/search/count'
			}));
	},
	setCount:function(data)
	{
		this._count.Set(data);
		this.countinfo.set("value", this._count);
		this.enableControls();
	},
	closeStdDialog:function()
	{
		this.stdDialog.hide();
	},
	_PrintSummary:function()
	{
		// callback for printing a summary report for an outlet
			dijit.byId("std_report_control").StartDialog(
			{
				reportoutputtypeid:0,
				reporttemplateid:2,
				outletid:this.ctrldisplay.outletid
			});
	},
	 destroy: function()
	 {
		this.inherited(arguments);
	},
	// used added employee to search results
	// add to display
	_AddItemEvent:function( entry , count )
	{
		this.modelSearch.newItem(entry);

		if ( count )
			this.setCount( count );

	},
	_getModelItem:function()
	{
		console.log("_getModelItem",arguments);
		if ( arguments[0].i.i !=null )
			this.tmp_row = arguments[0].i;
		else
			this.tmp_row = arguments[0];
	},
	// delete sessionid from screen
	_DeleteItemEvent:function( sessionsearchlist )
	{
		for ( var key in sessionsearchlist)
		{
			this.tmp_row = null;
			var item  = {identity:sessionsearchlist[key],
					onItem: this._getModelItemCall};

			console.log(item);
			this.modelSearch.fetchItemByIdentity(item);
			console.log(this.tmp_row);
			if (this.tmp_row )
				this.modelSearch.deleteItem( this.tmp_row );
		}
	},
	_EmployeeUpdateEvent:function (employee, sessionsearchid )
	{
		if ( sessionsearchid )
		{
			this.tmp_row = null;
			var item  = {identity:sessionsearchid,
						onItem: this._getModelItemCall};

			this.modelSearch.fetchItemByIdentity(item);
			if (this.tmp_row!=null)
			{
				this.modelSearch.SetNoCallBackMode(true);
				this.modelSearch.setValue(  this.tmp_row, "employeeid" , employee.employeeid, true );
				this.modelSearch.setValue(  this.tmp_row, "contactname" , employee.contactname, true );
				this.modelSearch.setValue(  this.tmp_row, "job_title" , employee.job_title, true );
				this.modelSearch.setValue(  this.tmp_row, "email" , employee.email, true );

				this.modelSearch.SetNoCallBackMode(false);
			}
		}
	},
	_DeleteSearchSessionList:function( searchlist )
	{
		for ( var key in searchlist )
		{
			console.log("Item" , searchlist[key]);
			this.tmp_row = null;
			var item  = {identity:searchlist[key],
						onItem:  this._getModelItemCall};
			this.modelSearch.fetchItemByIdentity(item);
			if (this.tmp_row)
				this.modelSearch.deleteItem(this.tmp_row);
		}
	},
	// an employee has been deleted check to see if it used on the search grid
	_EmployeeDeletedEvent:function( employee )
	{
		console.log ("SearchGrid _EmployeeDeletedEvent" , employee ) ;
		this._DeleteSearchSessionList(employee.search);
	},
	// an outlet has been deleted removed all reference to ot
	_OutletDeleteEvent:function( outlet )
	{
		console.log ("SearchGrid _OutletDeeleteEvent" , outlet ) ;
		// clear out interface
		this._DeleteSearchSessionList(outlet.search);

		// clear out if was first selection
		if (this.ctrldisplay.outletid == outlet.outlet.outletid)
			this._ClearLocal();

		// if statistics then update counts
		if ( outlet.statistics != null )
			this.setCount( outlet.statistics );

	},
	// Outlet has been changed
	_OutletUpdateEvent:function( outlet )
	{
		console.log ("SearchGrid _OutletUpdateEvent" , outlet ) ;
		for ( var key in outlet.search )
		{
			console.log("Item" , outlet.search[key]);
			this.tmp_row = null;
			var item  = {identity:outlet.search[key],
						onItem: this._getModelItemCall};
			this.modelSearch.fetchItemByIdentity(item);
			if (this.tmp_row)
			{
				this.modelSearch.SetNoCallBackMode(true);
				this.modelSearch.setValue(  this.tmp_row, "contactname" , outlet.employee.contactname, true );
				this.modelSearch.setValue(  this.tmp_row, "outletname" , outlet.outlet.outletname, true );
				this.modelSearch.SetNoCallBackMode(false);
			}
		}

		// if statistics then update counts
		if ( outlet.statistics != null )
			this.setCount( outlet.statistics );
	},
	_SearchUpdateEvent:function( data ,mode, advance_mode)
	{
		console.log("search",data);
		// reset the sort order on a new search to the customer default
		if ( mode == 0 )
			this._sortorder = PRMAX.utils.settings.stdview_sortorder ;

		if ( data.searchby == "outlet" || data.searchby == null )
		{
			this.setCount( data );
			this._SetListInfo( data ) ;
			this.refresh( data , true );
			this.displayForceLoad();
			if (data.searchby == null ) data.searchby = "outlet";
		}
		else if ( data.searchby == "advance" )
		{
			this.advance_ctrl.Load ( data , advance_mode ) ;
		}
		else if ( data.searchby == "crm" )
		{

		}
		this.showView ( data.searchby + "_view" );

	},
	_DialogCloseEvent:function(  source )
	{
		this.largeDialog.hide();
		this.stdDialog.hide();
		this.largeDialog.set("content",'');
		this.stdDialog.set("content",'');
	},
	Refresh:function ( show_view )
	{
		if ( this._firsttime == false && ( show_view == null || show_view == "outlet_view" ))
		{
			// if the data has been updated from the hidden zone then this doesn't wotk
			this.searchgrid.update();
		}
		if ( show_view != null )
			this.showView(show_view);

		this._firsttime = false ;
	},
	_SetListInfo:function ( data )
	{
		this._listid = data.listid;
		this._EnableListControls();
		if (this.list_name != null )
			dojo.set(this.list_name,"innerHTML",  data.listname?data.listname:"Search Results");
	},
	_EnableListControls:function()
	{
		if ( this.list_update != null )
		{
			var disabled = this._listid>0?false:true;

			this.list_update.set("disabled",disabled);
			this.list_save_as.set("disabled",disabled);
			this.list_clear.set("disabled",disabled);
		}
	},
	showView:function( viewname )
	{
		var current = this.views.selectedChildWidget;
		var newpage = this[viewname];
		if ( current != newpage )
		{
			this.views.selectChild ( newpage ) ;
			dojo.publish(PRCOMMON.Events.Display_View_Changed,[viewname]);
		}
	},
	_ExcludeList_Outlet:function()
	{
		if ( confirm ( "Add Outlet " + this._context_row.i.outletname + " to Exclusion List"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._ExclustionCallBack,
					url:'/search/exclude/outlet_add',
					content:{outletid:this._context_row.i.outletid}
			}));
		}
	},
	_ExcludeList_Freelance:function()
	{
		if ( confirm ( "Add Freelancer " + this._context_row.i.outletname + " to Exclusion List"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._ExclustionCallBack,
					url:'/search/exclude/outlet_add',
					content:{outletid:this._context_row.i.outletid}
			}));
		}
	},
	_ExcludeList_Employee:function()
	{
		var msg = ( this._context_row.i.contactname != null) ? this._context_row.i.contactname + "("+this._context_row.i.job_title+")" : this._context_row.i.job_title ;

		if ( confirm ( "Add Contact " + msg + " to Exclusion List"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._ExclustionCallBack,
					url:'/search/exclude/employee_add',
					content:{employeeid:this._context_row.i.employeeid}
			}));
		}
	},
	_ExclustionCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Added to Exclusion List");
		}
		else if ( response.success == "DU")
		{
			alert("Already in the Exclusion List");
		}
		else
		{
			alert("Problem Adding too the Exclusion List");
		}
	},
	_RemoveExclusion:function()
	{
		this.exclusion_dlg.ShowDlg();
	}
});
