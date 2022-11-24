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
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../projects/templates/edit.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/data/ItemFileReadStore",
	"dojox/layout/ExpandoPane",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"research/projects/outletwizard",
	"research/outlets/OutletEdit",
	"research/freelance/FreelanceEdit",
	"research/questionnaires/OutletUpdate",
	"research/questionnaires/DeskUpdate",
	"research/questionnaires/FreelanceEdit",
	"dijit/form/ValidationTextBox",
	"dojox/validate/regexp",
	"dijit/form/ValidationTextBox",
	"dijit/form/Button",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/FilteringSelect",
	"prcommon2/search/FreelanceSearch",
	"research/outlets/OutletEdit"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, topic,  lang, domattr, ItemFileReadStore){
 return declare("research.projects.edit",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:false,
	prefix:"project",
	constructor: function()
	{
		this.model =  new Observable( new JsonRest( {target:'/research/admin/projects/projects_members', idProperty:"researchprojectitemid"}));
		this.researchprojectstatus = new ItemFileReadStore ({ url:"/common/lookups?searchtype=researchprojectstatus&nofilter=1"});
		this._search_store =  new Observable( new JsonRest( {target:'/search/list_rest?searchtypeid=5&research=1', idProperty:"sessionsearchid"}));
		this._users = new ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=dataadmin&nofilter"});


		this._update_call_back = lang.hitch(this, this._update_call );
		this._resend_call_back = lang.hitch(this, this._resend_call);
		this._load_research_call_back = lang.hitch(this, this._load_research_call);
		this._load_call_back = lang.hitch(this, this._load_call);
		this._append_call_back = lang.hitch(this,this._append_call);
		this._clear_search_call_back = lang.hitch(this, this._clear_search_call);
		this._delete_search_row_call_back = lang.hitch(this, this._delete_search_row_call);
		this._delete_project_item_call_back =lang.hitch(this,this._delete_project_item_call);
		this._load_project_item_call_back = lang.hitch(this,this._load_project_item_call);
		this.std_menu = null;
		this.full_menu = null;
		this.resend_menu = null;
		this.wizard_menu = null;
	},
	postCreate:function()
	{
		var cells =
		[
			{label: ' ', field:"menu", className:"grid-field-image-view", formatter:utilities2.format_row_ctrl},
			{label: 'OutletID',className:"dgrid-column-status-small",field:"outletid"},
			{label: 'Outlet',className:"standard",field:"outletname"},
			{label: 'Desk',className:"standard",field:"deskname"},
			{label: 'Status',className:"standard",field:"researchprojectstatusdescription"},
			{label: 'Firstname', className:"standard",field:"firstname"},
			{label: 'Surname', className:"standard",field:"surname"}
		];
		this.grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.model
		});

		this.grid_view.set("content", this.grid);
		this.grid.on(" .dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		this.researchprojectstatusid.set("store",PRCOMMON.utils.stores.Research_Project_Status());
		this.filter_researchprojectstatusid.set("store", this.researchprojectstatus);
		this.filter_researchprojectstatusid.set("value",-1);
		this.iuserid.set("store",this._users);
		this.iuserid.set("value",-1);

		var cells2 =
		[
		{label: '  ', className:"grid-field-image-view", field:"sessionsearchid",formatter:utilities2.format_row_ctrl},
		{label: 'Name',className:"standard",field:"outletname"},
		{label: 'Desk',className:"standard",field:"deskname"},
		{label: 'Contact',className:"standard",field:"contactname"},
		{label: 'Source',className:"dgrid-column-type-small",field:"sourcename"},
		{label: 'Id', className:"dgrid-column-nbr-right",field:"outletid"}
		];

		this.grid_search = new Grid({
			columns: cells2,
			selectionMode: "none",
			store: this._search_store
		});

		this.grid_append_view.set("content", this.grid_search);
		this.grid_search.on(".dgrid-row:click",lang.hitch(this,this._search_on_cell_call));

		this.inherited(arguments);
	},
	_on_cell_call:function ( e )
	{
		var cell = this.grid.cell(e);

		if ( cell.row == undefined || cell.row.data == undefined) return;

		this._data = cell.row.data;
		if ( cell.column.field == "menu" )
		{
			this._show_menu(e);
		}
		else
		{
			if (this._data.researchprojectstatusid == 3 && this._data.wizard)
			{
				this._wizard();
			}
			else
			{
				this._edit_item();
			}
		}
	},
	_delete_project_item_call:function(response)
	{
		if ( response.success == "OK")
		{
			this.model.remove(response.researchprojectitemid);
			alert("Item Deleted");
			this.zone.selectChild ( this.blank);
		}
		else
		{
			alert("Problem Deleting Item");
		}
	},
	_show_menu:function(evt)
	{
		var menu = null;

		if ( this._data.resend == "R" && (this._data.wizard || this._data.researchprojectstatusid =="3"))
		{
			if (this.full_menu === null)
			{
				this.full_menu = new dijit.Menu();
				this.full_menu.addChild(new dijit.MenuItem({label:"Delete", onClick:lang.hitch(this,this._delete_item)}));
				this.full_menu.addChild(new dijit.MenuItem({label:"Full Edit", onClick:lang.hitch(this,this._edit_item)}));
				this.full_menu.addChild(new dijit.MenuItem({label:"Status", onClick:lang.hitch(this,this._complete)}));
				this.full_menu.addChild(new dijit.MenuItem({label:"Resend", onClick:lang.hitch(this,this._resend)}));
				this.full_menu.addChild(new dijit.MenuItem({label:"Customer Feedback", onClick:lang.hitch(this,this._wizard)}));
				this.full_menu.addChild(new dijit.MenuItem({label:"Show Questionnaire", onClick:lang.hitch(this,this._show_quest)}));
				this.full_menu.startup();
			}
			menu = this.full_menu;
		}
		else if ( this._data.resend == "R" && this._data.wizard=="")
		{
			if (this.resend_menu === null)
			{
				this.resend_menu = new dijit.Menu();
				this.resend_menu.addChild(new dijit.MenuItem({label:"Delete", onClick:lang.hitch(this,this._delete_item)}));
				this.resend_menu.addChild(new dijit.MenuItem({label:"Full Edit", onClick:lang.hitch(this,this._edit_item)}));
				this.resend_menu.addChild(new dijit.MenuItem({label:"Status", onClick:lang.hitch(this,this._complete)}));
				this.resend_menu.addChild(new dijit.MenuItem({label:"Resend", onClick:lang.hitch(this,this._resend)}));
				this.resend_menu.addChild(new dijit.MenuItem({label:"Show Questionnaire", onClick:lang.hitch(this,this._show_quest)}));
				this.resend_menu.startup();
			}
			menu = this.resend_menu;

		}
		else if ( this._data.resend != "R" && (this._data.wizard || this._data.researchprojectstatusid =="3"))
		{
			if (this.wizard_menu === null)
			{
				this.wizard_menu = new dijit.Menu();
				this.wizard_menu.addChild(new dijit.MenuItem({label:"Delete", onClick:lang.hitch(this,this._delete_item)}));
				this.wizard_menu.addChild(new dijit.MenuItem({label:"Full Edit", onClick:lang.hitch(this,this._edit_item)}));
				this.wizard_menu.addChild(new dijit.MenuItem({label:"Status", onClick:lang.hitch(this,this._complete)}));
				this.wizard_menu.addChild(new dijit.MenuItem({label:"Customer Feedback", onClick:lang.hitch(this,this._wizard)}));
				this.wizard_menu.addChild(new dijit.MenuItem({label:"Show Questionnaire", onClick:lang.hitch(this,this._show_quest)}));
				this.wizard_menu.startup();
			}
			menu = this.wizard_menu;
		}
		else
		{
			if (this.std_menu === null)
			{
				this.std_menu = new dijit.Menu();
				this.std_menu.addChild(new dijit.MenuItem({label:"Delete", onClick:lang.hitch(this,this._delete_item)}));
				this.std_menu.addChild(new dijit.MenuItem({label:"Full Edit", onClick:lang.hitch(this,this._edit_item)}));
				this.std_menu.addChild(new dijit.MenuItem({label:"Status", onClick:lang.hitch(this,this._complete)}));
				this.std_menu.addChild(new dijit.MenuItem({label:"Show Questionnaire", onClick:lang.hitch(this,this._show_quest)}));
				this.std_menu.startup();
			}
			menu = this.std_menu;
		}

		menu._openMyself(evt);
	},
	_show_quest:function()
	{
		var tmp = PRMAX.Settings.questionnaireurl + this._data.researchprojectitemid +"/quest";

		window.open(tmp,"_blank");
	},
	_wizard:function()
	{
		if (this._data.wizard)
		{
			if ( this._data.prmax_outletgroupid == "freelance" )
			{
				this.freelancewizard.load (this._data.researchprojectitemid );
				this.zone.selectChild ( this.freelancewizard);
			}
			else
			{
				if ( this._data.outletdeskid)
				{
					this.deskwizard.load(this._data.researchprojectitemid );
					this.zone.selectChild(this.deskwizard);
				}
				else
				{
					this.outletwizard.load(this._data.researchprojectitemid );
					this.zone.selectChild(this.outletwizard);
				}
			}

		}
	},
	_resend:function()
	{
		this.researchprojectitemid2.set("value",this._data.researchprojectitemid);

		request.post('/research/admin/projects/project_item_details',
			utilities2.make_params({ data: {researchprojectitemid:this._data.researchprojectitemid}})).then
			(this._load_research_call_back);

	},
	_delete_item:function()
	{
		if ( confirm("Delete Project Item"))
		{
			request.post('/research/admin/projects/project_item_delete',
				utilities2.make_params({ data: {researchprojectitemid:this._data.researchprojectitemid}})).then
				(this._delete_project_item_call_back);
		}
	},
	_edit_item:function()
	{
		if ( this._data.prmax_outletgroupid == "freelance" )
		{
			this.zone.selectChild ( this.freelanceedit);
			this.freelanceedit.load ( this._data.outletid );
		}
		else
		{
			this.zone.selectChild ( this.outletedit);
			this.outletedit.load ( this._data.outletid, this.prefix );
		}
	},
	_complete:function()
	{
			request.post('/research/admin/projects/project_item_details',
				utilities2.make_params({ data: {researchprojectitemid:this._data.researchprojectitemid}})).then
				(this._load_project_item_call_back);
	},
	_load_project_item_call:function(response)
	{
		if ( response.success=="OK")
		{
			this.researchprojectitemid.set("value", response.data.item.researchprojectitemid );
			this.researchprojectstatusid.set("value", response.data.item.researchprojectstatusid);
//			this.researcheddate.set("checked",false);
//			this.notes.set("value", response.data.item.notes);
			this.zone.selectChild ( this.statusedit);

		}
		else
		{
			alert('Please complete the Research details.')
		}
	},
	_search_on_cell_call:function(e)
	{
		var cell = this.grid_search.cell(e);

		if ( cell.column.id == "0" )
		{
			if ( confirm("Remove from results?"))
			{
				request.post('/search/delete_session_row',
					utilities2.make_params({data:{searchtypeid: 5, sessionsearchid:cell.row.data.sessionsearchid}})).then
					(this._delete_search_row_call_back);
			}
		}
	},
	_delete_search_row_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this._search_store.remove( response.sessionsearchid);

		}
	},
	_load_research_call:function (response )
	{
		if ( response.success == "OK")
		{
			this.subject.set("value", response.data.subject);
			this.email.set("value", response.data.email);
			this.bodytext.set("value", "\n<LINK TO DATABASE>\n");
			this.sendbtn.cancel();
			this.resend_dlg.show();
		}
	},
	load:function( project )
	{
		this.researchprojectid = project.researchprojectid;
		this.grid.set("query", {researchprojectid:project.researchprojectid});

		domattr.set(this.researchprojectname , "innerHTML", project.researchprojectname );
		this.zone.selectChild ( this.blank);

	},
	_clear:function()
	{
		this.researchprojectitemid.set("researchprojectitemid",-1);
		this.researchprojectstatusid.set("value",1);
//		this.researcheddate.set("checked",true);
//		this.notes.set("value","");
	},
	_update_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this.model.put ( response.data );
			alert("Record Updated");
		}
		else
		{
			alert("Problem");
		}
	},
	_update_record:function()
	{
		request.post('/research/admin/projects/project_item_update',
			utilities2.make_params({ data: this.form.get("value") })).then
			(this._update_call_back);
	},
	_update_record_complete:function()
	{
		request.post('/research/admin/projects/project_item_update_complete',
			utilities2.make_params({ data: {researchprojectitemid:this.researchprojectitemid.get("value")}})).then
			(this._update_call_back);

	},
	_send_email_record:function()
	{
			if ( utilities2.form_validator(this.form_resend)==false)
		{
			alert("Not all required field filled in");
			throw "N";
		}

		var tmp = this.bodytext.get("value");
		if (tmp.indexOf("<LINK TO DATABASE>") === -1)
		{
			alert("Missing Link to database");
			this.bodytext.set("value", tmp + "\n<LINK TO DATABASE>");
			throw "N";
		}


		var data = this.form_resend.get("value");

		request.post('/research/admin/projects/project_quest_resend',
			utilities2.make_params({ data: data })).then
			(this._resend_call_back);
	},
	_resend_call:function( response)
	{

		if ( response.success == "OK")
		{
			this.model.put( response.data);
			alert("Questionairre Link Resent");
			this.resend_dlg.hide();
			this.sendbtn.cancel();
		}
		else
		{
			alert("Problem");
		}

		this.sendbtn.cancel();
	},
	_clear_filter:function()
	{
		this.filter_researchprojectstatusid.set("value",-1);
		this.filter_outletname.set("value","");
		this.filter_emailaddress.set("value","");
	},
	_execute_filter:function()
	{
		var query = {researchprojectid:this.researchprojectid};

		if ( arguments[0].researchprojectstatusid != "-1")
			query["researchprojectstatusid"] = arguments[0].researchprojectstatusid;

		if ( arguments[0].outletname != "")
			query["outletname"] = arguments[0].outletname;

		if ( arguments[0].emailaddress != "")
			query["emailaddress"] = arguments[0].emailaddress;

		this.grid.set("query",query);
	},
	_list_of_projects:function()
	{
		topic.publish("/projects/list");
	},
	_show_info:function()
	{
		this.info_page.set("href",'/research/admin/projects/projects_status?researchprojectid=' + this.researchprojectid);
		this.zone.selectChild ( this.info_page);
	},
	_delete_search_row_call:function ( response )
	{
		if ( response.success == "OK")
		{
			this._search_store.remove( response.sessionsearchid);
		}
	},
	_clear_search_call:function( response )
	{
		if ( response.success == "OK")
		{
			this._load_search_call();
		}
	},
	_clear_search:function()
	{
		this.grid_search.set("query",{});

		request.post('/search/sessionclear',
			utilities2.make_params({data:{searchtypeid: 5}})).then
				(this._clear_search_call_back);
	},
	_clear_search_criteria:function()
	{
		this.search_tab_outlet.clear();
		this.search_tab_freelance.clear();
	},
	_get_form:function()
	{
		var form = null;

		dojo.every(this.search_tabcont.selectedChildWidget.getChildren(),
			function(widget)
			{
				if ( widget.formid != null)
					form = widget;
			});
		return form;
	},
	_search:function( )
	{
		var form = this._get_form();

		form.setExtendedMode(false);
		var content = form.get("value");

		content['mode'] = 1;
		content['search_partial'] = 2
		content['searchtypeid'] = 5

		request.post('/search/dosearch',
			utilities2.make_params( {data:content})).then
			(this._load_call_back);
	},
	_load_call:function( response )
	{
		this.searchbutton.cancel();
		this.grid_search.set("query",{});
	},
	_search_append:function()
	{
		if ( confirm("Append to Project"))
		{
				request.post('/research/admin/projects/projects_append',
				utilities2.make_params({data:{researchprojectid:this.researchprojectid}})).then
				(this._append_call_back);
		}
		else
		{
			this.search_append.cancel();
		}
	},
	_append_call:function(response)
	{
		if ( response.success == "OK")
		{
			this.grid.set("query", {researchprojectid:this.researchprojectid} );
			alert("Search Appended");
			this.grid_search.set("query",{});
		}
		else
		{
			alert("Problem");
		}

		this.search_append.cancel();

	},
	_show_add:function()
	{
		this.zone.selectChild ( this.append_select );
	},
	_do_refresh:function()
	{
		this.grid.set("query", {researchprojectid:this.researchprojectid} );
	}
});
});





