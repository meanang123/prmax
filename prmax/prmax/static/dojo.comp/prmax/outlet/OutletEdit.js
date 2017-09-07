//-----------------------------------------------------------------------------
// Name:    prmax.outlet.OutletEdit
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.outlet.OutletEdit");

dojo.require("prcommon.interests.Interests");
dojo.require("ttl.utilities");

formatRowCtrlLocal = function(inDatum) {
	return isNaN(inDatum) ? '...' :  inDatum==true?"":'<img  style="padding:0x;margin:0px" src="/static/images/rowctrl.gif" title="Outlet Options" >';
	}


PRMAX.outlet = {view1:{
		cells: [[
			{name: 'Job Title',width: "150px",field:"job_title"},
			{name: 'Contact',width: "175px",field:"contactname"},
			{name: ' ',width: "15px",formatter:formatRowCtrlLocal, field:"prn_primary"}
			]]
	}};

dojo.declare("prmax.outlet.OutletEdit",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.outlet","templates/outlet_edit.html"),
	constructor: function() {
		this._SavedCallBack = dojo.hitch(this,this._Saved);
		this._LoadCallBack = dojo.hitch(this,this._Load);
		this._DeleteCallBack = dojo.hitch(this,this._DeleteCall);
		this._GetContactEntryCallBack = dojo.hitch (this, this._GetContactEntry);

		this.outletid = -1 ;
		this.std_menu = null;
		this.std_menu2 = null;
		this.baseonCellClick=null;
		this.modelemployees= new prcommon.data.QueryWriteStore (
			{url:'/employees/contactlist',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			});

		this.modelemployees.SetNoCallBackMode(true);

		dojo.subscribe(PRCOMMON.Events.Employee_Updated, dojo.hitch(this,this._EmployeeUpdateEvent));
		dojo.subscribe(PRCOMMON.Events.Employee_Add, dojo.hitch(this,this._EmployeeAddEvent));

		this._prmax_freq_store = new dojo.data.ItemFileReadStore ( {url:'/common/lookups?searchtype=frequencies',onError:ttl.utilities.globalerrorchecker, clearOnClose:true, urlPreventCache:true });
	},
	postCreate:function()
	{
		if ( this.baseonCellClick == null )
		{
			this.contactgrid.setStore( this.modelemployees ) ;
			this.baseonCellClick = this.contactgrid['onCellClick'];
			this.contactgrid['onCellClick'] = dojo.hitch(this,this.onCellClick);
			this.contactgrid['onRowClick'] = dojo.hitch(this,this.onSelectRow);
		}
		this.outlettypes.store = PRCOMMON.utils.stores.OutletTypes();
		this.countryid.store = PRCOMMON.utils.stores.Countries()
		this.frequencyNode.store = this._prmax_freq_store;

		this.inherited(arguments);
	},
	_Saved:function(response)
	{
		if (response.success=="OK")
		{
			this.outletid = response.data.outlet.outletid;
			this.layout();
			this.contactgrid.setQuery( ttl.utilities.getPreventCache({outletid:this.outletid}));
			dojo.attr(this.headingNode,"innerHTML", "Editing (  " + this.outletname.get("value") + " )");
			dojo.publish(PRCOMMON.Events.Outlet_Updated,[response.data]);
			ttl.utilities.showMessageStd("Saved",1000);
			alert("Saved");
		}
		else
		{
			alert("Failed");
		}
		this.saveNode.cancel();
	},
	Load:function(outletid)
	{
		this.newNode.set("disabled" , true);
		this.saveNode.set("disabled" , true);
		dojo.attr(this.headingNode,"innerHTML","");

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._LoadCallBack,
						url:'/outlets/outlet_edit_get',
						content: {outletid:outletid}
						})	);
	},
	Save:function()
	{
		if ( ttl.utilities.formValidator(this.requiredNode)==false)
		{
			this.accRegNode.set("open",true);
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		if ( ttl.utilities.formValidator(this.outletDetailsFrom)==false)
		{
			this.accOtherNode.set("open",true);
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		if (ttl.utilities.formValidator(this.contactDetailsFrom)==false)
		{
			this.accContactNode.set("open",true);
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		// At this point form is valid
		var content = this.requiredNode.get("value");
		content.outletid = this.outletid ;
		content = dojo.mixin(content,this.outletDetailsFrom.get("value"));
		content = dojo.mixin(content,this.contactDetailsFrom.get("value"));

		ttl.utilities.showMessageStd("Saving ..............",1000);

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._SavedCallBack,
						url:'/outlets/outlet_save',
						content: content
						})	);
	},
	New:function()
	{
		this.Clear();
		this.layout();
	},
	layout:function()
	{
		this.accRegNode.set("open",true);
		this.accContactNode.set("open",false);
		this.accOtherNode.set("open",false);
		this.extraContactPane.set("open",this.outletid==-1?false:true);
		this.newEmployeeNode.set("disabled",this.outletid==-1?true:false);
	},
	Clear:function()
	{
		this.outletid = -1 ;
		this.saveNode.cancel();
		this.newEmployeeNode.set("disabled",true);
		this.contactgrid.setQuery( ttl.utilities.getPreventCache({outletid:this.outletid}));
		this.saveNode.set("disabled" , false);
		this.newNode.set("disabled" , false);
		dojo.attr(this.headingNode,"innerHTML","Adding Outlet");

		this.outlettypes.set("value",1);
		this.frequencyNode.set("value",1);
		this.outletname.set("value","");
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.outlet_www.set("value","");
		this.outlet_email.set("value","");
		this.outlet_tel.set("value","");
		this.outlet_fax.set("value","");
		this.outlet_interest.clear_private();
		this.outlet_circulation.set("value",0);
		this.outlet_profile.set("value","");
		this.contact_jobtitle.set("value","");
		this.contact_email.set("value","");
		this.contact_tel.set("value","");
		this.contact_fax.set("value","");
		this.contact_mobile.set("value","");
		this.contact_interest.clear_private();
		this.prefix.set("value","");
		this.firstname.set("value","");
		this.familyname.set("value","");
		this.countryid.set("value",1);
		this.outlet_twitter.set("value","");
		this.outlet_facebook.set("value","");
		this.outlet_linkedin.set("value","");
		this.outlet_instagram.set("value","");
		this.contact_twitter.set("value","");
		this.contact_facebook.set("value","");
		this.contact_linkedin.set("value","");
		this.contact_instagram.set("value","");

	},
	_Load:function(response)
	{
		console.log(response);

		this.outletid = response.outlet.outlet.outletid;
		this.layout();
		this.contactgrid.setQuery( ttl.utilities.getPreventCache({outletid:this.outletid}));
		dojo.attr(this.headingNode,"innerHTML","Editing (  " + response.outlet.outlet.outletname + " )");
		this.countryid.set("value", response.outlet.outlet.countryid);
		this.outlettypes.set("value", response.outlet.outlet.prmax_outlettypeid );
		this.frequencyNode.set("value", response.outlet.outlet.frequencyid );
		this.outletname.set("value", response.outlet.outlet.outletname);
		this.outlet_www.set("value", response.outlet.outlet.www);
		this.outlet_circulation.set("value", response.outlet.outlet.circulation);
		this.outlet_profile.set("value", response.outlet.outlet.profile);

		this.outlet_email.set("value", response.outlet.communications.email);
		this.outlet_tel.set("value", response.outlet.communications.tel);
		this.outlet_fax.set("value", response.outlet.communications.fax);
		this.outlet_twitter.set("value", response.outlet.communications.twitter);
		this.outlet_facebook.set("value", response.outlet.communications.facebook);
		this.outlet_linkedin.set("value", response.outlet.communications.linkedin);
		this.outlet_instagram.set("value", response.outlet.communications.instagram);

		this.outlet_interest.set("value",response.outlet.interests);

		this.address1.set("value", response.outlet.address.address1);
		this.address2.set("value", response.outlet.address.address2);
		this.townname.set("value",  response.outlet.address.townname);
		this.county.set("value",response.outlet.address.county);
		this.postcode.set("value",response.outlet.address.postcode);

		this.prefix.set("value",response.primary.contact.prefix)
		this.firstname.set("value",response.primary.contact.firstname)
		this.familyname.set("value",response.primary.contact.familyname)

		this.contact_jobtitle.set("value", response.primary.employee.job_title);
		this.contact_email.set("value",  response.primary.communications.email);
		this.contact_tel.set("value", response.primary.communications.tel);
		this.contact_fax.set("value", response.primary.communications.fax);
		this.contact_mobile.set("value", response.primary.communications.mobile);
		this.contact_twitter.set("value", response.primary.communications.twitter);
		this.contact_facebook.set("value", response.primary.communications.facebook);
		this.contact_linkedin.set("value", response.primary.communications.linkedin);
		this.contact_instagram.set("value", response.primary.communications.instagram);

		this.contact_interest.set("value",response.primary.interests);

		this.newEmployeeNode.set("disabled",false);
		this.saveNode.set("disabled" , false);
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);

		this.inherited(arguments);
	},
	_AddEmployee:function()
	{
		if ( this.outletid != -1 )
		{
			PRMAX.search.largeDialog.set("content",'<div dojoType="prmax.employee.EmployeeEdit" employeeid="-1" parentcontrol="'+this.id + '"'  + ' outletid="'+this.outletid +'"></div>');
			PRMAX.search.largeDialog.show("Add Contact to Outlet ("+this.outletname.get("value")+")");
		}
	},
	_ChangeEmployee:function()
	{
		PRMAX.search.largeDialog.set("content",'<div dojoType="prmax.employee.EmployeeEdit" employeeid="' + this._context_row.i.employeeid + '" parentcontrol="'+this.id + '"'  + ' outletid="'+this.outletid +'"></div>');
		PRMAX.search.largeDialog.show("Edit Contact to Outlet ("+this.outletname.get("value")+")");
	},
	_DeleteCall:function( response )
	{
		if (response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.Employee_Deleted, [this._context_row.i]);
			this.contactgrid.store.deleteItem( this._context_row );
			alert("Contact Deleted");
		}
		else
		{
			alert("Problem deleting Contact");
		}
	},
	_DeleteEmployee:function()
	{
		if ( confirm ("Delete Contact "+this._context_row.i.job_title + " " + this._context_row.i.contactname + " ? "))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._DeleteCallBack,
					url:'/employees/employee_delete',
					content: {'employeeid':this._context_row.i.employeeid}
					})	);
		}
	},
	_PrimaryEmployee:function()
	{
		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._DeleteCallBack,
						url:'/outlet/set_primary_employee',
						content: {
							'employeeid':this._context_row.i.employeeid,
							'outletid':this._context_row.i.outletid	}
						})	);
	},
	onCellClick : function(e)
	{
		console.log("onCellClick",e);

		var  row = this.contactgrid.getItem(e.rowIndex);

		// cannot edit primary contact
		if (row && row.prn_primary ) return ;

		if ( e.cellIndex >0 &&  e.cellIndex<2) {
			this.onSelectRow(e);
		}
		else if ( e.cellIndex == 2 )
		{
			this.onSelectRow(e);
			this.onRowContextMenu(e);
		}
		else
		{
			console.log(this.baseonCellClick);
			this.baseonCellClick(e);
		}
	},
	onRowContextMenu:function(e)
	{
		this._context_row =this.contactgrid.getItem(e.rowIndex);
		var menu = null;

		if (!this._context_row.i.prn_primary)
			menu = this._std_record_context_menu();
		else
		menu = this._std_record_min_context_menu();

		menu._openMyself(e);
	},
	_std_record_context_menu:function()
	{
		if (this.std_menu ==null)
		{
            this.std_menu = new dijit.Menu();
            this.std_menu.addChild(new dijit.MenuItem({label:"Edit Contact", onClick:dojo.hitch(this,this._ChangeEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
            this.std_menu.addChild(new dijit.MenuItem({label:"Delete Contact", onClick:dojo.hitch(this,this._DeleteEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
            this.std_menu.addChild(new dijit.MenuItem({label:"Set as Primary Contact", onClick:dojo.hitch(this,this._PrimaryEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
            this.std_menu.addChild(new dijit.MenuItem({label:"Add Contact", onClick:dojo.hitch(this,this._AddEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
            this.std_menu.startup();
		}
		return this.std_menu;
	},
	_std_record_min_context_menu:function()
	{
		if (this.std_menu2 ==null)
		{
            this.std_menu2 = new dijit.Menu();
            this.std_menu2.addChild(new dijit.MenuItem({label:"Add Contact", onClick:dojo.hitch(this,this._AddEmployee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
            this.std_menu2.startup();
		}
		return this.std_menu2;
	},
	onSelectRow : function(e) {
		this.contactgrid.selection.clickSelectEvent(e);
	},

	// Employee has been added
	_EmployeeAddEvent:function ( employee )
	{
		console.log("AddEmployee", employee);
		if ( this.outletid == employee.outletid )
		{
			employee.prn_primary=false;
			var item = this.modelemployees.newItem( employee );
			gHelper.AddRowToQueryWriteGrid(this.contactgrid,item);
		}
	},
	_GetContactEntry:function()
	{
		this.content = arguments[0];
	},
	// employee has been changed
	_EmployeeUpdateEvent:function (employee)
	{
		console.log("OutletEdit_EmployeeUpdateEvent");

		this.content = null;
		var item  =	{	identity:employee.employeeid,
									onItem: this._GetContactEntryCallBack};
		this.modelemployees.fetchItemByIdentity(item);
		if (this.content!=null)
		{
			this.modelemployees.setValue(  this.content, "job_title" , employee.job_title);
			this.modelemployees.setValue(  this.content, "contactname" , employee.contactname);
		}
	}
});
