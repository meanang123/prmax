require({cache:{
'url:research/outletdesk/templates/DeskEdit.html':"<div >\r\n\t<div data-dojo-props='region:\"top\",style:\"width:100%;height:28px\",\"class\":\"prmaxrowdisplaytitle\"' data-dojo-attach-point=\"blank_cont_view\" data-dojo-type=\"dijit/layout/ContentPane\" >\r\n\t\t<p style=\"color:white;padding:0px;margin:0px;text-align:middle\" data-dojo-attach-point=\"desk_details_view\"></p>\r\n\t</div>\t\r\n\t<div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-attach-point=\"outlet_container\" data-dojo-props='region:\"center\"' >\r\n\t\t<div data-dojo-attach-point=\"desk_details_ctrl\" data-dojo-type=\"research/outletdesk/DeskDetails\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Details\"' ></div>\r\n\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"contact_grid\" data-dojo-props='title:\"Contacts\",style:\"width:100%;height:100%\",gutters:\"false\"' >\r\n\t\t\t<div data-dojo-attach-point=\"outlet_contact_no_edit_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%;border:1px solid black\",region:\"center\"'></div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-attach-point=\"outlet_contact_view\" data-dojo-props='style:\"width:100%;height:100%\",gutters:\"false\"' >\r\n\t\t\t\t<div data-dojo-attach-point=\"outlet_contact_grid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:30%;border:1px solid black\",splitter:true,region:\"center\"'></div>\r\n\t\t\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"contact_edit_container\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:70%\",splitter:true' >\r\n\t\t\t\t\t<div data-dojo-props='title:\"blank_cont_view\"' data-dojo-attach-point=\"blank_cont_view\" data-dojo-type=\"dijit/layout/ContentPane\" ></div>\r\n\t\t\t\t\t<div data-dojo-props='title:\"contact_edit\",\"class\":\"scrollpanel\"' data-dojo-attach-point=\"contact_edit\" data-dojo-type=\"research/employees/EmployeeEdit\"></div>\r\n\t\t\t\t</div>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t\r\n\t\t<div data-dojo-attach-point=\"outlet_research_ctrl\" data-dojo-type=\"research/outletdesk/ResearchDetails\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Research\"' ></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_delete_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Delete Outlet Contact\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_delete_ctrl\" data-dojo-type=\"research/employees/EmployeeDelete\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_change_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Add Contact\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_change_ctrl\" data-dojo-type=\"research/employees/EmployeeEdit\" data-dojo-props='style:\"width:600px;height:500px\"' ></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_set_primary_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Set Primary Contact\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_set_primary_ctrl\" data-dojo-type=\"research/outlets/OutletSetPrimary\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_move_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Move Contact to another Outlet\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_move_ctrl\" data-dojo-type=\"research/outlets/OutletMoveContact\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_copy_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Copy Contact to Outlet\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_copy_ctrl\" data-dojo-type=\"research/outlets/OutletCopyContact\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"employee_merge_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title :\"Merge selected Contact to\"'>\r\n\t\t<div data-dojo-attach-point=\"employee_merge_ctrl\" data-dojo-type=\"research/employees/EmployeeMerge\"></div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:   DeskEdit.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: Jan 2020
//
// To do:
//
//-----------------------------------------------------------------------------

define("research/outletdesk/DeskEdit", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outletdesk/templates/DeskEdit.html",
	"dijit/layout/BorderContainer",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"ttl/grid/Grid",	
	"dojo/data/ItemFileReadStore",
	"ttl/store/JsonRest",
	"dojo/store/Observable",	
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-attr",	
	"dijit/Dialog",
	"dijit/layout/ContentPane",
	"dijit/layout/StackContainer",
	"dijit/layout/TabContainer",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"dojox/validate",
	"dijit/form/Textarea",
	"dojox/form/BusyButton",
	"dijit/form/NumberTextBox",
	"research/audit/AuditViewer",
	"research/ResearchDetails",
	"prcommon2/web/WebButton",
	"prcommon2/web/WebButton",
	"research/employees/EmployeeEdit",
	"research/outletdesk/ResearchDetails",
	"research/outlets/OutletSetPrimary",
	"research/employees/EmployeeDelete",
	"research/outlets/OutletDesks",
	"research/outlets/OutletMoveContact",
	"research/outlets/OutletCopyContact",
	"research/employees/EmployeeMerge",
	"research/employees/ContactMerge",	
	"research/outletdesk/DeskDetails"
	], function(declare, BaseWidgetAMD, template, BorderContainer, request, utilities2, json, Grid, ItemFileReadStore, JsonRest, Observable, lang, topic, domattr ){
 return declare("research.outletdesk.DeskEdit",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._saved_call_back = lang.hitch(this,this._saved);
		this._load_call_back= lang.hitch(this,this._loaded);
		this._deleted_call_back= lang.hitch(this, this._deleted_call);
		
		this._outletdeskid = -1 ;
		this._researchprojectitemid = null;
		this.private_menu = null;
		this.std_menu = null;
		this.private_menu_limited = null;
		this.deleted_menu = null;
		this._outletdesks = 0;
		this._data = null;

		this.outlet_contact_model = new Observable( new JsonRest( {target:'/research/admin/employees/contactlist_rest', idProperty:"employeeid"}));

		topic.subscribe(PRCOMMON.Events.Employee_Deleted, lang.hitch(this,this._employee_deleted_event));
		topic.subscribe(PRCOMMON.Events.Employee_Add, lang.hitch(this,this._employee_add_event));
		topic.subscribe(PRCOMMON.Events.Employee_Updated, lang.hitch(this,this._employee_update_event));
		topic.subscribe("/emp/set_primary", lang.hitch(this, this._employee_set_primary_event));
		topic.subscribe("/coding/update", lang.hitch(this, this._outlet_update_event));
		topic.subscribe("/employee/delete_request", lang.hitch(this, this._employee_deleted_request_event));
	},
	postCreate:function()
	{
		var cells =
		[
			{label: " ", className:"grid-field-icon-view",field:"prn_primary",formatter:this._row_button_small},
			{label: 'Contact', className:"dgrid-column-contact",field:"contactname"},
			{label: 'Job Title', className:"dgrid-column-contact",field:"job_title"},
			{label: 'Desk Name', className:"dgrid-column-status",field:"deskname"},
			{label: 'Source', className:"dgrid-column-status-small", field:"sourcename"},
			{label:'Status', className:"dgrid-column-status-small", field:"prmaxstatusid", formatter:utilities2.format_deleted_ctrl}
		];

		var cells_no_edit =
		[
			{label: " ", className:"grid-field-icon-view",field:"prn_primary",formatter:this._row_button_small, editable:false},
			{label: 'Contact', className:"dgrid-column-contact",field:"contactname", editable:false},
			{label: 'Job Title', className:"dgrid-column-contact",field:"job_title", editable:false},
			{label: 'Desk Name', className:"dgrid-column-status",field:"deskname", editable:false},
			{label: 'Source', className:"dgrid-column-status-small", field:"sourcename", editable:false},
			{label:'Status', className:"dgrid-column-status-small", field:"prmaxstatusid", formatter:utilities2.format_deleted_ctrl, editable:false}
		];

		this.outlet_contact_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.outlet_contact_model
		});

		this.outlet_contact_no_edit_grid = new Grid({
			columns: cells_no_edit,
			selectionMode: "single",
			store: this.outlet_contact_model,
			editable: false
		});

		this.outlet_contact_grid_view.set("content", this.outlet_contact_grid);
		this.outlet_contact_no_edit_view.set("content", this.outlet_contact_no_edit_grid);
		this.outlet_contact_grid.on(" .dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		this.outlet_contact_grid.on(".dgrid-row:contextmenu", lang.hitch(this,this.on_row_context_menu));

		this.employee_delete_ctrl.set("dialog", this.employee_delete_dlg);
		this.employee_change_ctrl.set("dialog", this.employee_change_dlg);
		this.employee_set_primary_ctrl.set("dialog",this.employee_set_primary_dlg);

		this.inherited(arguments);
	},
	_saved:function(response)
	{
		if (response.success=="OK")
		{
			alert("Freelance Updated");
			if (response.data.comm.tel != this.tel.get("value"))
			{
				this.tel.set("value", response.data.comm.tel)
			}
			if (response.data.comm.fax != this.fax.get("value"))
			{
				this.fax.set("value", response.data.comm.fax)
			}
			this._clear_reason();
		}
		else
		{
			alert("Failed to update ");
		}
		this.savenode.cancel();
	},
	_clear_reason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
	},
	_update:function()
	{
		if ( utilities2.form_validator(this.requirednode)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}
		
		var data = this.requirednode.get("value");
		data['outletid'] = this.outletid;
		request.post('/research/admin/outlets/research_freelance_check',
			utilities2.make_params({ data : data})).
			then(this._deleted_call_back);	
	},
	_deleted_call:function(response)
	{
		if (response.success == "DEL")
		{
			if (confirm("Freelance '" + response.data.outlet_name + "' has previously asked to be deleted.\nDo you want to proceed?"))
			{
				data = 	this.requirednode.get("value");
				data["reasoncodeid"] = this.reasoncodeid.get("value");
				data['outletid'] = this.outletid;
				request.post('/research/admin/outlets/freelance_research_update',
					utilities2.make_params( {data:data})).then
					(this._saved_call_back);			
			}
		}
		else
		{
			data = 	this.requirednode.get("value");
			data["reasoncodeid"] = this.reasoncodeid.get("value");
			data['outletid'] = this.outletid;
			request.post('/research/admin/outlets/freelance_research_update',
				utilities2.make_params( {data:data})).then
				(this._saved_call_back);			
		}
		this.savenode.cancel();	
	},
	clear:function()
	{
		this.savenode.cancel();
		this.selectcontact.clear();
		this.outletid = -1;
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.www.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.mobile.set("value","");
		this.interests.set("value","");
		this.profile.set("value","");
		this.countryid.set("value",1);
		this.twitter.set("value","");
		this.facebook.set("value","");
		this.linkedin.set("value","");
		this.instagram.set("value","");
		this.blog.set("value","");
		this.prmax_outlettypeid.set("value",42);
		this._clear_reason();
	},
	load:function(outletdeskid, prefix, researchprojectitemid)
	{
		this._outletdeskid = outletdeskid;
		this._researchprojectitemid = researchprojectitemid;
		
		if (prefix != "" && prefix != undefined)
		{
			this.prefix = prefix;
		}
		request.post('/research/admin/outlets/desks/get',
//		request.post('/research/admin/outlets/outletdesk_get_for_load',
				utilities2.make_params({ data : {outletdeskid: outletdeskid}})).
				then ( this._load_call_back);
	},
	_loaded:function( response )
	{
		if  ( response.success == "OK" )
		{
			var data = response.data;
			this._data = data;

			this.desk_details_ctrl.load(data, this._researchprojectitemid);
			
			this.outlet_research_ctrl.load(data);
//			this._clear_reason();
			
			this._outletdesks = data.outletdesks;
			if (data.outlet.parentoutletid != null)
			{
				this.contact_grid.selectChild(this.outlet_contact_no_edit_view);
				this.outlet_contact_no_edit_grid.set("query", {outletid: data.outlet.outletid, outletdeskid: data.outletdesk.outletdeskid});
			}
			else
			{
				this.contact_grid.selectChild(this.outlet_contact_view);
				this.outlet_contact_grid.set("query", {outletid: data.outlet.outletid, outletdeskid: data.outletdesk.outletdeskid, extended:1});
			}
			this.contact_edit_container.selectChild(this.blank_cont_view);
			this.contact_edit.clear();
			var title = data.outlet.outletid+" - " + data.outletdesk.deskname;
			domattr.set(this.desk_details_view,"innerHTML", title);
		}
		else
		{
			alert("Problem Loading desk");
		}
	},
	_delete:function()
	{
		this.delete_ctrl.load ( this.outletid ,this._name);
		this.delete_dlg.show();
	},
	
//------------------------------------------------------------------

	_on_cell_call : function(e)
	{
		var cell = this.outlet_contact_grid.cell(e);
		if ( cell != null)
		{
			this._row = cell.row.data;

			if ( cell.column.field == "prn_primary" )
			{
				this._menu(e);
			}
			else
			{
				this.contact_edit.load( this._row.employeeid, this._row.outletid, -1, this._outletdesks);
				this.contact_edit_container.selectChild(this.contact_edit);
			}
		}
	},
	on_row_context_menu:function(e)
	{
		this._menu(e);

		e.preventDefault();
	},
	_menu:function(e)
	{
		this._row = this.outlet_contact_grid.row(e).data;

		if (this.std_menu === null)
		{
			this.std_menu = new dijit.Menu();
			this.std_menu.addChild(new dijit.MenuItem({label:"Add Contact", onClick:lang.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.std_menu.startup();
		}
		if (this.deleted_menu === null)
		{
			this.deleted_menu = new dijit.Menu();
			this.deleted_menu.addChild(new dijit.MenuItem({label:"Add Contact", onClick:lang.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.deleted_menu.addChild(new dijit.MenuItem({label:"Delete Contact", onClick:lang.hitch(this,this._delete_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.deleted_menu.startup();
		}



		if (this.private_menu===null)
		{
			this.private_menu = new dijit.Menu();
			this.private_menu.addChild(new dijit.MenuItem({label:"Delete Contact", onClick:lang.hitch(this,this._delete_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.private_menu.addChild(new dijit.MenuItem({label:"Add Contact", onClick:lang.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.private_menu.addChild(new dijit.MenuItem({label:"Set Primary Contact", onClick:lang.hitch(this,this._primary_contact),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			this.private_menu.addChild(new dijit.MenuItem({label:"Move to Publication", onClick:lang.hitch(this,this._move_to_other_outlet)}));
			this.private_menu.addChild(new dijit.MenuItem({label:"Copy to Publication", onClick:lang.hitch(this,this._copy_to_other_outlet)}));
			this.private_menu.addChild(new dijit.MenuItem({label:"Merge Contact to ", onClick:lang.hitch(this,this._merge_contact)}));

			this.private_menu.startup();
		}

		if (this.private_menu_limited===null)
		{
			this.private_menu_limited = new dijit.Menu();
			this.private_menu_limited.addChild(new dijit.MenuItem({label:"Add Contact", onClick:lang.hitch(this,this._add_employee),iconClass:"dijitPrmaxIcon dijitPrmaxEmployee"}));
			//this.private_menu_limited.addChild(new dijit.MenuItem({label:"Move to Publication", onClick:lang.hitch(this,this._move_to_other_outlet)}));
			this.private_menu_limited.addChild(new dijit.MenuItem({label:"Copy to Publication", onClick:lang.hitch(this,this._copy_to_other_outlet)}));
			this.private_menu_limited.startup();
		}

		if ( this._row.prmaxstatusid == 2 )
		{
			this.deleted_menu._openMyself(e);
		}
		else
		{
			if ( this._row.prn_primary)
				this.private_menu_limited._openMyself(e);
			else
				this.private_menu._openMyself(e);
		}
	},
	_merge_contact:function()
	{
		this.employee_merge_ctrl.load(
			this._row.employeeid,
			this._data.outlet.outletid,
			this._row.job_title,
			this._row.contactname,
			this.employee_merge_dlg);
	},
	_move_to_other_outlet:function()
	{
		this.employee_move_ctrl.load(this._row.employeeid, this._row.job_title +":" + this._row.contactname, this.employee_move_dlg, this._data.outlet.outletid);
		this.employee_move_dlg.show();
	},
	_copy_to_other_outlet:function()
	{
		this.employee_copy_ctrl.load(this._row.employeeid, this._row.job_title +":" + this._row.contactname, this.employee_copy_dlg, this._data.outlet.outletid);
		this.employee_copy_dlg.show();
	},
	_primary_contact:function()
	{
		this.employee_set_primary_ctrl.load (  this._row.employeeid ,   this._row.contactname, this._row.job_title, this.employee_set_primary_dlg) ;
		this.employee_set_primary_dlg.show();
	},
	_delete_employee:function()
	{
		this.employee_delete_ctrl.load ( this._row.employeeid, this._row.job_title, this._row.contactname, this.employee_delete_dlg);
		this.employee_delete_dlg.show();
	},
	_add_employee:function()
	{
		this.employee_change_ctrl.load (-1, this._data.outlet.outletid, '', this._outletdesks);
		this.employee_change_dlg.show();
	},
	_employee_deleted_event:function ( employee )
	{
		if (employee.has_deleted)
		{
			this.outlet_contact_model.remove(employee.employeeid);
		}
		else
		{
			this.outlet_contact_grid.set("query", {outletid: this._data.outlet.outletid, outletdeskid:this._data.outletdesk.outletdeskid, extended:1});
		}
		this.contact_edit_container.selectChild(this.blank_cont_view);
	},

	_employee_update_event:function ( employee )
	{
		if ( employee == null )
		{
			this.outlet_contact_grid.set("query",{outletid: this._data.outlet.outletid, outletdeskid:this._data.outletdesk.outletdeskid, extended:1});
		}
		else
		{
			this.outlet_contact_model.put ( employee);
		}
	},
	_employee_add_event:function ( employee )
	{
		employee.sourcename="PRmax";
		this.outlet_contact_model.add(employee);
	},
	_outlet_deleted_event:function( outlet )
	{
		this.clear();
	},
	_employee_deleted_request_event:function( employeeid, sourcelistid )
	{
		//if ( this.id == sourcelistid )
			this._delete_employee();
	},
	_employee_set_primary_event:function()
	{
		this.outlet_contact_no_edit_grid.set("query", {outletid: this._data.outlet.outletid, outletdeskid:this._data.outletdesk.outletdeskid});
		this.outlet_contact_grid.set("query", {outletid: this._data.outlet.outletid, outletdeskid:this._data.outletdesk.outletdeskid, extended:1});
	},
	_row_button_small:function ( prn_primary )
	{

		if ( prn_primary == null )
			return "...";

		if (prn_primary)
			return '<p style="background-color:red;padding:0x;margin:0px">&nbsp; </p>';

		return '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/prcommon/images/rowctrl.gif"></img>';

	},
	

	
});
});
