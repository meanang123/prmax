//-----------------------------------------------------------------------------
// Name:    prmax.DisplayCtrl
// Author:  Chris Hoy
// Purpose: Controller for the display outlet details
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.display.DisplayCtrl");

dojo.require("prcommon.advance.listview");
dojo.require("dojox.collections.Dictionary");
dojo.require("prcommon.contacthistory.edit");
dojo.require("prcommon.crm.viewer_only");
dojo.require("prcommon.crm.responses.resend");

dojo.declare("prmax.display.DisplayCtrl", [dijit._Widget, dijit._Templated, dijit._Container], {
	// need to check that the patther is correct
	mainViewStringEmpty:"/layout/std_outlet_view_startup",
	mainViewString:"/display/outletmain?outletid=${outletid}&cachebuster=${cachebuster}",
	//profileViewString:"/display/outletprofile?outletid=${outletid}&cachebuster=${cachebuster}",
	//profilelink:"${displaylink}",
	widgetsInTemplate: true,
	private_data: true,
	source:"search",
	templatePath: dojo.moduleUrl( "prmax.display","templates/DisplayCtrl.html"),

	constructor: function()
	{
		this._check_outlet_call_back = dojo.hitch( this, this._check_outlet_call ) ;
		this.modelemployeeslist= new prcommon.data.QueryWriteStore (
			{	url:"/employees/contactlist",
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
			});

		this.modelemployeeslist.SetNoCallBackMode(true);
		try
		{
			this.ctrldata = new PRMAX.DisplayObject();
		}
		catch(e)
		{
			alert("missing 1");
			this.ctrldata = new Object();
		}
		this.mainViewButton = null;
		this.loaded_advance = false;
		this.loaded_contacts = false ;
		this.movetab = true ;
		// Context specific
		this._context = new dojox.collections.Dictionary();
		this._context.add("search", new PRMAX.DisplayContext("search", this));
		if (PRMAX.utils.settings.advancefeatures)
			this._context.add("advance", new PRMAX.DisplayContext("advance", this));

		// Call backs
		this.onLoadDisplayCtrlCall = dojo.hitch(this,this.onLoadDisplayCtrl);
		this._AddedToListCallBack = dojo.hitch(this,this._AddedToListCall);
		this._DeleteFromListCallBack = dojo.hitch(this,this._DeleteFromListCall);
		this._ChangeEmployeeCallback = dojo.hitch(this,this._ChangeEmployeeCall);
		this._DeleteEmployeeCallBack = dojo.hitch(this,this._DeleteEmployeeCall);
		this._GetEntryCallBack = dojo.hitch (this, this._getContactEntry);

		// Event handling
		dojo.subscribe(PRCOMMON.Events.Employee_Deleted, dojo.hitch(this,this._EmployeeDeletedEvent));
		dojo.subscribe(PRCOMMON.Events.Employee_Updated, dojo.hitch(this,this._EmployeeUpdateEvent));
		dojo.subscribe(PRCOMMON.Events.Outlet_Deleted, dojo.hitch(this,this._OutletDeleteEvent));
		dojo.subscribe(PRCOMMON.Events.Outlet_Updated, dojo.hitch(this,this._OutletUpdateEvent));
		dojo.subscribe(PRCOMMON.Events.Employee_Add, dojo.hitch(this,this._EmployeeAddEvent));
		dojo.subscribe(PRCOMMON.Events.Employee_Override, dojo.hitch(this,this._EmployeeOverridesChanged));
		dojo.subscribe(PRCOMMON.Events.Outlet_Overrides, dojo.hitch(this,this._OutletOverridesChanged));
		dojo.subscribe(PRCOMMON.Events.Display_Clear, dojo.hitch(this,this.ClearEvent));
		dojo.subscribe(PRCOMMON.Events.Display_Clear, dojo.hitch(this,this.ClearEvent));
		dojo.subscribe(PRCOMMON.Events.Display_View_Changed, dojo.hitch(this,this.ViewChangedEvent));
		dojo.subscribe(PRCOMMON.Events.Display_Load, dojo.hitch(this,this.LoadEvent));
		dojo.subscribe(PRCOMMON.Events.Display_ReLoad, dojo.hitch(this,this.RefreshEvent));
		//dojo.subscribe(PRCOMMON.Events.Update_Notes, dojo.hitch(this,this._profile_refresh_event));
		dojo.subscribe('/update/engagement_label', dojo.hitch(this,this._UpdateEngagementLabelEvent));

		this.iefix = false;
	},
	// called when a tab is selected
	onSelectTab:function(button)
	{
		// if the tab is the contact view make sure that this is displayed/ refreshed
		if (button.id==this.contactView.id && this.loaded_contacts===false)
		{
			this.loaded_contacts = true;
			this.contactgrid.setQuery( ttl.utilities.getPreventCache({outletid:this.ctrldata.outletid}));
		}
		if (button.id==this.advanceView.id && this.loaded_advance===false)
		{
			this.loaded_advance = true;
			if (this.advanceView.get("class") == 'prmaxhidden')
			{
				this.advanceView.set("class", "");
			}
			this.advancectrl.Load( this.ctrldata.outletid ) ;
		}
		if (button.id==this.contactView.id && dojo.isIE==8 && this.iefix == false )
		{
			// Force ie to re-display top pane to remove scroll bars from grid
			dojo.style(this.contactgrid.domNode,"width", dojo.style(this.contactgrid.domNode,"width") -10 + "px");
			dojo.style(this.contactgrid.domNode,"height", dojo.style(this.contactgrid.domNode,"height") -10 + "px");
			this.iefix  = true;
		}
	},
	// Print a report not currenlty used
	_printReport:function()
	{
		dijit.byId("std_report_control").StartDialog({
			reportoutputtypeid:0,
			reporttemplateid:2,
			outletid:this.ctrldata.outletid});
	},
	// actual function to hitch up controls and events
	postCreate:function()
	{

		// tab buttons
		// tab selected sub scrip event
		dojo.subscribe(this.tabControl.id+"-selectChild", dojo.hitch(this,this.onSelectTab));

		// contact grid events
		this.contactgrid.set("structure",this.layoutEmployeeList);
		this.contactgrid.onStyleRow = dojo.hitch(this,this.onContactRowStyle);
		this.contactgrid.onRowClick = dojo.hitch(this,this.onSelectContactRow);
		this.contactgrid.onCellClick=  dojo.hitch(this,this.onCellClick);
		this.contactgrid.onRowContextMenu = dojo.hitch(this,this.onRowContextMenu);
		this.contactgrid._setStore(this.modelemployeeslist);
		this.contactgrid.canSort = function (col) { return (col==1||col==4) ? false : true ;};

		this.inherited(arguments);
	},
	_LoadButtons:function()
	{
		this.mainViewButton = this.mainView.controlButton;
		this.contactsTabButton = this.contactView.controlButton;
		//this.profileTabButton = this.profileView.controlButton;
		this.advanceTabButton = this.advanceView.controlButton;
		this.crmView.set("title", PRMAX.utils.settings.crm_engagement_plural);
		this.crmTabButton = this.crmView.controlButton;
		if (this.crmTabButton)
		{
			this.crmTabButton.set('label', PRMAX.utils.settings.crm_engagement_plural);
		}
		this.freelancerContactTabButton = this.resendView.controlButton;

	},
	_UpdateEngagementLabelEvent:function()
	{
		this.crmView.set("title", PRMAX.utils.settings.crm_engagement_plural);
		this.crmTabButton.set('label', PRMAX.utils.settings.crm_engagement_plural);
	},
	// cell selected select
	onCellClick : function(e) {
		if ( e.cellIndex >0 &&  e.cellIndex<4)
		{
			this.onSelectContactRow(e);
			if ( e.cellIndex == 3 )
				this.onRowContextMenu(e);
		}
		else
		{
			this.inherited(arguments);
		}
	},
	onRowContextMenu:function(e)
	{
		this.contactgrid.selection.clickSelectEvent(e);
		this._context_row = this.contactgrid.getItem(e.rowIndex);
		var menu = null;
		var context = this._context.item(this.source);

		if (this._context_row.i.customerid!=-1||this._context_row.i.ccustomerid!=-1)
		{
			menu = context._private_record_context_menu();
		}
		if (this._context_row.i.customerid==-1||this._context_row.i.ccustomerid==-1)
		{
			menu = context._std_record_context_menu();
		}
		if (this._context_row.i.customerid!=-1&&this._context_row.i.ccustomerid==-1)
		{
			menu = context._private_record_context_menu2();
		}

		if (menu)
		{
			menu._openMyself(e);
		}
	},
	// format the grid
	onContactRowStyle:function(inRow)
	{
		if (inRow.over)
		{
			inRow.customClasses += " dojoxGridRowOver";
			return ;
		}

		if (inRow.selected)
		{
			inRow.customClasses += " prmaxSelectedRow";
			return;
		}

		var rowData = this.contactgrid.getItem(inRow.index);
		if (rowData && rowData.i.employeeid == this.grid_employeeid)
		{
			inRow.customClasses += " employeeSelected";
			return ;
		}
		else if (rowData && rowData.i.override_primary)
		{
			inRow.customClasses += " overridePrimaryRow";
			return;
		}
		else if (rowData && rowData.i.prn_primary)
		{
			inRow.customClasses += " prnPrimaryRow";
			return;
		}
		else if (rowData && rowData.i.customerid != -1)
		{
			inRow.customClasses += " overridePrivateRow";
			return ;
		}

		if (inRow.odd)
		{
			inRow.customClasses += " dojoxGridRowOdd";
		}
	},
	// Hides and display tab as required
	showOptionsTabs:function( control )
	{
		// page not been loaded
		if ( this.mainViewButton == null ) return;
		var display = "";
		if (control.outletid == -1 )  display = "none";

		this.mainViewButton.domNode.style.display= display;
		//this.profileTabButton.domNode.style.display=  display;

		if (this.crmTabButton)
			this.crmTabButton.domNode.style.display = (PRMAX.utils.settings.crm)?display:"none";

		if (this.freelancerContactTabButton)
		{
			this.freelancerContactTabButton.domNode.style.display = (ttl.data.utilities.isIndividual( control.outlettypeid ))?display:"none";
		}

		this.advanceTabButton.domNode.style.display = (PRMAX.utils.settings.advancefeatures) ? display:"none";

		// always hide the contacts tab for individuals
		if (display == "" && ttl.data.utilities.isIndividual( control.outlettypeid ) )
			display = "none";

		this.contactsTabButton.domNode.style.display=display;

		// force display of correct tab if current tab is about to be hidden
		if ((ttl.data.utilities.isIndividual( control.outlettypeid )===true &&
			(this.tabControl.selectedChildWidget==this.extendedtabControl||
			this.tabControl.selectedChildWidget==this.contactView))||
			(ttl.data.utilities.isIndividual( control.outlettypeid )===false &&
			this.tabControl.selectedChildWidget==this.resendView))
			{
				this.tabControl.selectChild(this.mainView);
			}
	},
	// contact list view fields
	layoutEmployeeList:{
		cells: [[
			{name: " ",width: "15px",field:"customerid",formatter:ttl.utilities.formatContactInfo},
			{name: 'Contact',width: "200px",field:"contactname"},
			{name: 'Job Title',width: "350px",field:"job_title"},
			{name: " ",width: "15px",field:"",formatter:ttl.utilities.formatRowCtrl}
			]]
	},
	// clear if outlet has been deleted
	_OutletDeleteEvent:function( outlet )
	{
		if (this.ctrldata.outletid==outlet.outletid)
		{
			this.Clear();
		}
	},
	// Load the details of a specific contact
	_Load:function( obj )
	{
		// we need the control list and the active pages at this point to make sure
		// we are looking at the correct party of the work and moving the correct screen
		if ( this.mainViewButton == null )
			this._LoadButtons();
		console.log("loadOutlet", obj );
		this.grid_employeeid = obj.employeeid;

		// check to see what tab is selcted etc
		if ( this.ctrldata.outletid != obj.outletid || obj===null)
		{
			if (obj)
			{
				this.Clear(false);
				this.ctrldata.Set(obj);
			}
			this.showOptionsTabs(this.ctrldata);
			this._SetMainView();
			//this._do_profile_link();
			this.contactdisplay.Clear();
			this.contactgrid.setQuery( ttl.utilities.getPreventCache({outletid:this.ctrldata.outletid}));
			this.controls.selectChild(this.tabControl);
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._check_outlet_call_back,
					url:"/outlets/check_outlet",
					content:{outletid:this.ctrldata.outletid}
				}));

			if (PRMAX.utils.settings.crm && this.crmctrl)
			{
				this.crmctrl.load_outlet(this.ctrldata.outletid, this.ctrldata.outletname);
			}

			if (ttl.data.utilities.isIndividual(this.ctrldata.outlettypeid)===false)
			{
				try{
					if (this.tabControl.selectedChildWidget==this.contactView)
					{
						this.loaded_contacts = true;
					}
					if (this.tabControl.selectedChildWidget==this.advanceView)
					{
						this.loaded_advance = true;
					}
				} catch(e) {}

				this.loadEmployee();
			}
			else {
				this.resendctrl.Load(obj.email, obj.employeeid);
			}
		}
		else if ( this.ctrldata.advancefeatureid != obj.advancefeatureid && obj != null && obj.advancefeatureid != -1 && PRMAX.utils.settings.advancefeatures)
		{
			this.ctrldata.Set(obj);
			this.advancectrl.ShowFeature( this.ctrldata.advancefeatureid ) ;

		}
		console.log("loadOutlet -completed");

	},
	_SetMainView:function()
	{
		this.mainView.set("href",dojo.string.substitute(this.mainViewString,{outletid:this.ctrldata.outletid,cachebuster:new Date().getTime()}));
	},
	refresh:function (outletid )
	{
		if ( this.ctrldata.outletid == outletid )
		{
			this._Load();
		}
	},
	// remove all the details and start again
	Clear:function(set)
	{
		this.controls.selectChild(this.blank_view);
		this.mainView.set("content","");
		if (set===undefined)
		{
			this.mainView.set("href" , this.mainViewStringEmpty );
		}

		//this.profileView.set("content","");

		this.loaded_contacts = false;
		this.loaded_advance = false;
		this.contactgrid.selection.clear();
		this.ctrldata.Clear();
		this.showOptionsTabs(this.ctrldata);
		this.loadEmployee();
		if (set===undefined||set===true)
		{
			this.contactgrid.setQuery();
			this.tabControl.selectChild(this.contactView);
		}
	},
	// user selects a speciufic conatct in the contact list
	onSelectContactRow : function(e) {
		console.log("onSelectContactRow", e);
		var rowData=this.contactgrid.getItem(e.rowIndex);
		this.ctrldata.employeeid = rowData.i.employeeid;
		this.ctrldata.contactname = rowData.i.contactname;
		this.loadEmployee();
		this.contactgrid.selection.clickSelectEvent(e);
	},
	loadEmployee:function()
	{
		this.contactdisplay.LoadEmployee(this.ctrldata.employeeid, this.ctrldata.contactname);
	},
	_AddEmployee:function()
	{
		PRMAX.search.largeDialog.set("content",'<div dojoType="prmax.employee.EmployeeEdit" addsession="true" employeeid="-1" outletid="'+this.ctrldata.outletid  + '"></div>');
		PRMAX.search.largeDialog.show("Add Contact  ("+this.ctrldata.outletname+")");
	},
	_EditEmployee:function()
	{
		if  (this._context_row.i.customerid==-1)
		{
			PRMAX.search.stdDialog.set("content",'<div dojoType="prmax.employee.EmployeeOverride" employeeid="'+this._context_row.i.employeeid + '"></div>');
			PRMAX.search.stdDialog.show("Change Contact Details (" + this._context_row.i.contactname+ ")");
		}
		else
		{
			PRMAX.search.largeDialog.set("content",'<div dojoType="prmax.employee.EmployeeEdit" employeeid="'+this._context_row.i.employeeid+'" outletid="-1"></div>');
			PRMAX.search.largeDialog.show("Edit Contact  ("+this._context_row.i.contactname+")");
		}
	},
	// This method is called when a contact is deleted
	_EmployeeDeletedEvent:function ( employee )
	{
		this.content = null;
		// see if employee is on grid ?
		var item  =	{	identity:employee.employee.employeeid,
						onItem: this._GetEntryCallBack};
		this.modelemployeeslist.fetchItemByIdentity(item);
		// is on grid then remove record
		if (this.content !== null )
		{
			this.modelemployeeslist.deleteItem( this.content );
		}

		if (this.ctrldata.employeeid==employee.employee.employeeid )
		{
			this.ctrldata.employeeid = -1;
			this.ctrldata.sessionsearchid = -1;
		}
		if (this.ctrldata.employeeid==employee.employee.employeeid )
		{
			this.ctrldata.employeeid=-1;
			this.loadEmployee();
		}
	},
	// response to a delete of an employee
	_DeleteEmployeeCall:function( response )
	{
		if (response.success=="OK")
		{
			// was succesfull tell system that the employee should be removed
			dojo.publish(PRCOMMON.Events.Employee_Deleted, [response.data]) ;
			alert("Contact Deleted");
		}
		else
		{
			alert("Problem Deleting Contact");
		}
	},
	// Delete a private employee record
	_DeleteEmployee:function()
	{
		if (confirm("Delete Contact "+ this._context_row.i.job_title + " "+ this._context_row.i.contactname))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._DeleteEmployeeCallBack,
					url:"/employees/employee_delete",
					content:{employeeid:this._context_row.i.employeeid}
				}));
		}
	},

	_AddedToListCall:function(response)
	{
		console.log("_AddedToListCall",response);

		if (response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.SearchSession_Added, [response.data, response.count]);
			alert("Added to Results");
		}
		else if (response.success=="DU")
		{
			alert("Already in results");
		}
		else
		{
			alert("Problem adding to results");
		}
	},
	_AddToResults:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._AddedToListCallBack,
				url:"/search/sessionaddemployee",
				content:{employeeid:this._context_row.i.employeeid}
			}));
	},
	_DeleteFromListCall:function( response )
	{
		console.log("_DeleteFromListCall", response);
		if (response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.SearchSession_Deleted, [response.data]);
			alert(" Contact deleted from Results");
		}
	},
	_DeleteToResults:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._DeleteFromListCallBack,
				url:"/search/sessiondeleteemployee",
				content:{employeeid:this._context_row.i.employeeid}
			}));
	},
	_ChangeEmployeeCall:function( response )
	{
		if (response.success=="DU")
		{
			alert("Already in Results");
		}

		if (response.success=="OK")
		{
			alert("Changed to Contact " + response.data.contactname);
			// need to update the result grid
			this.grid_employeeid  = response.data.employeeid;
			dojo.publish(PRCOMMON.Events.Employee_Updated, [response.data,response.data.sessionsearchid]);
			this.contactgrid.update();
		}
	},
	// Change the employee on the selected row of the grid
	_ChangeSelectedRow:function()
	{
		// trys to change the primary id
		// question
		if ( this.grid_employeeid != this._context_row.i.employeeid )
		{
			if (confirm("Change Contact to "+this._context_row.i.job_title + " "+ this._context_row.i.contactname))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._ChangeEmployeeCallback,
						url:"/search/sessionchangeemployee",
						content:{employeeid:this._context_row.i.employeeid,
										sessionsearchid: this.ctrldata.sessionsearchid}
				}));
			}
		}
		else
		{
			alert("Already Selected");
		}
	},
	// new employee added do we need to add this to this view
	_EmployeeAddEvent:function( employee )
	{
		console.log("AddEmployee", employee);
		if (this.ctrldata.outletid == employee.outletid )
		{
			var item = this.modelemployeeslist.newItem(employee);
			gHelper.AddRowToQueryWriteGrid(this.contactgrid,item);
			this.ctrldata.employeeid = employee.employeeid;
			this.loadEmployee();
		}
	},
	// employee override have changed we need to update screen
	_EmployeeOverridesChanged:function( employee )
	{
		if (this.ctrldata.employeeid === employee.employeeid )
		{
			this.loadEmployee ();
		}
	},
	// outlet override details has been changed
	_OutletOverridesChanged:function( outlet )
	{
		if (this.ctrldata.outletid === outlet.outlet.outletid )
		{
			this._SetMainView();
		}
	},

	// Callback function for get by operations
	_getContactEntry:function()
	{
		this.content = arguments[0];
	},
	// employee updated can we update this view
	_EmployeeUpdateEvent:function( employee )
	{
		// this updates the grid view
		var item  =	{	identity:employee.employeeid,
						onItem: this._GetEntryCallBack};

		this.modelemployeeslist.fetchItemByIdentity(item);
		if  (this.content )
		{
			this.modelemployeeslist.setValue(  this.content, "job_title" , employee.job_title, true );
			this.modelemployeeslist.setValue(  this.content, "contactname" , employee.contactname, true );
		}

		if (this.ctrldata.employeeid === employee.employeeid )
		{
			this.loadEmployee ();
		}
	},
	_OutletUpdateEvent:function( outlet )
	{
		if (this.ctrldata.outletid === outlet.outlet.outletid )
		{
			this._SetMainView();
		}
	},
	LoadEvent:function( criteria , source)
	{
		this.source = ( source != null ) ? source : "search";

		this._Load ( criteria );
		if ( criteria.advancefeatureid > 0 )
		{
			this.tabControl.selectChild(this.advanceView);
		}
		else
		{
				// only if the current tab if features should we move this
				// to eithher
				if ( this.ctrldata.outletid )
				{
					if (ttl.data.utilities.isIndividual(this.ctrldata.outlettypeid)===false)
					{
						if ( this.movetab == true )
						{
							this.tabControl.selectChild(this.contactView);
							this.movetab = false;
						}
					}
//					else
//						this.tabControl.selectChild(this.mainView);

				}
		}
	},
	ClearEvent:function( criteria )
	{
		console.log("ClearEvent");
		this.Clear ( criteria );
	},
	RefreshEvent:function()
	{
		if (this.ctrldata.outletid>0)
		{
			this._SetMainView();
			this.loadEmployee();
		}
	},
	//_profile_refresh_event:function( outletid, employeeid)
	//{
	//	if ( employeeid == null)
	//		this._do_profile_link();
	//},
	//_do_profile_link:function()
	//{
	//	if (this.ctrldata.displaylink)
	//		this.profileView.set("href",dojo.string.substitute(this.profilelink,{displaylink:this.ctrldata.displaylink}));
	//	else
	//		this.profileView.set("href",dojo.string.substitute(this.profileViewString,{outletid:this.ctrldata.outletid,cachebuster:new Date().getTime()}));
	//},
	resize:function()
	{
		this.borderCtrl.resize( arguments[0] ) ;
		//this.contactdisplay.resize( arguments[0] ) ;

		this.inherited(arguments);
	},
	ViewChangedEvent:function ( new_view )
	{
		if ( new_view == null || new_view == "outlet_view" )
		{
			if ( this.ctrldata.outletid )
			{
				if (ttl.data.utilities.isIndividual(this.ctrldata.outlettypeid)===false)
					this.tabControl.selectChild(this.contactView);
				else
					this.tabControl.selectChild(this.mainView)
			}
		}
		else if ( new_view == "advance_view" )
		{
			this.tabControl.selectChild(this.advanceView);
		}
	},
	_check_outlet_call:function ( response )
	{
		if ( response.has_advancefeatures != null && response.has_advancefeatures != undefined)
		{
			if (PRMAX.utils.settings.advancefeatures)
			{
				if (response.has_advancefeatures==true)
				{
					dojo.style(this.advanceTabButton.domNode,"display","");
					this.advancectrl.Load( this.ctrldata.outletid, this.ctrldata.advancefeatureid ) ;
				}
				else
				{
					if ( this.tabControl.selectedChildWidget == this.advanceView )
						this.tabControl.selectChild(this.contactView);
					dojo.style(this.advanceTabButton.domNode,"display","none");
				}
			}
		}
	}
});
