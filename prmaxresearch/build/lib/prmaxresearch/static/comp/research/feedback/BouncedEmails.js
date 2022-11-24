//-----------------------------------------------------------------------------
// Name:    BouncedEmails.js
// Author:  Chris Hoy
// Purpose:
// Created: 27/06/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../feedback/templates/BouncedEmails.html",
	"dijit/layout/BorderContainer",
	"ttl/grid/Grid",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/request",
	"ttl/utilities2",
	"dojo/json",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/lang",
	"dojo/topic",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dojox/form/BusyButton",
	"research/outlets/OutletEdit",
	"research/freelance/FreelanceEdit",
	"dijit/Dialog",
		"research/feedback/Completed"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore,lang,topic ){
 return declare("research.feedback.BouncedEmails",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	mainViewString:"/display/outletmain?outletid=${outletid}",
	constructor: function()
	{
		this.results =  new Observable( new JsonRest( {target:'/research/admin/bemails/list_rest', idProperty:"bounceddistributionid"}));
		this._message_load_call_back = dojo.hitch (this, this._message_load_call );
		this._load_call_back = dojo.hitch(this, this._load_call);
		this._completed_call_back = dojo.hitch(this, this._completed_call);

		this.customer_front_id_data =  new Observable( new JsonRest( {target:'/research/admin/customers_combo', idProperty:"icustomerid"}));
		topic.subscribe(PRCOMMON.Events.BouncedEmail_Completed, lang.hitch(this,this._completed_event));
	},
	_completed_event:function( bounceddistributionid )
	{
		this.results.remove( bounceddistributionid);
		this.clear();
	},
	_completed_call:function ( responce )
	{
		if ( responce.success == "OK")
		{
			this.results.remove( this._row.bounceddistributionid );
			this.clear();
			alert("Email marked as Ignored");
		}
		else
		{
			alert("Problem");
		}
	},
	clear:function()
	{
		this.controls.selectChild( this.blank );
		this.msg_display.set("content","");
		this.msg_basic_display.set("content","");
		this.completed_dlg.hide();
	},
	postCreate:function()
	{
		var cells =
		[
			{label: " ",className:"grid-field-image-view",formatter:utilities2.format_row_ctrl},
			{label: " ",className:"grid-field-image-view",formatter:utilities2.delete_row_ctrl},
			{label: 'Source',className:"dgrid-column-status-small",field:"sourcename"},
			{label: 'Date',className:"dgrid-column-date-small",field:"createdate_display"},
			{label: 'Outlet Name',className: "dgrid-column-address-short",field:"outletname"},
			{label: 'Name', className:"dgrid-column-address-short",field:"contactname"},
			{label: 'Job title',className: "dgrid-column-address-short",field:"job_title"},
			{label: 'Subject',className: "dgrid-column-address-short",field:"subject"},
			{label: 'Sent Customer',className: "dgrid-column-address-short",field:"customername"},
			{label: 'Owner',className:"dgrid-column-address-short",field:"ownercustomername"}
		];

		this.result_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.results
		});

		this.result_grid_view.set("content", this.result_grid);
		this.result_grid.on(".dgrid-cell:click", lang.hitch(this,this._on_cell_call));
		this.customers.set("store",this.customer_front_id_data);

		this.inherited(arguments);
	},
	_on_cell_call : function(e)
	{
		var cell = this.result_grid.cell(e);

		if ( cell == null || cell.row == null) return ;

		this._row = cell.row.data;
		this._e = e;

		if ( cell.column.id == "0")
		{
			this.completed_ctrl.load ( this._row.bounceddistributionid);
			this.completed_dlg.show();
		}
		else if ( cell.column.id == "1" )
		{
			if ( confirm("Mark as Ignore"))
			{
				request.post('/research/admin/bemails/mark_as_ignore',
					utilities2.make_params({ data : {bounceddistributionid:this._row.bounceddistributionid}})).then
					( this._completed_call_back );
			}
		}
		else
		{
			request.post('/research/admin/bemails/get_and_lock',
				utilities2.make_params({ data: {bounceddistributionid:this._row.bounceddistributionid}})).then
				(this._load_call_back);
		}
	},
	_load_call:function ( responce )
	{
		if ( responce.success == "OK" )
		{
			this._load_details();
		}
		else if ( responce.success == "LO" )
		{
			alert("This record is locked by " + responce.lock.username ) ;
		}
		else
		{
			alert("Problem accessing record");
		}
	},
	_load_details:function()
	{
		if ( this._row.owneroutletid != -1 || this._row.owneremployeeid != -1 )
		{
			this.isprivate.set("href",dojo.string.substitute(this.mainViewString,{outletid:this._row.outletid}));
			this.controls.selectChild ( this.isprivate );
		}
		else if ( this._row.prmax_outlettypeid == 42 )
		{
			this.controls.selectChild ( this.freelanceedit);
			this.freelanceedit.Load ( this._row.outletid );
		}
		else if ( this._row.prmax_outlettypeid != null )
		{
			this.controls.selectChild ( this.outletedit);
			this.outletedit.load ( this._row.outletid );
		}
		else
		{
			this.controls.selectChild ( this.blank);
		}
		this.tabcont.selectChild ( this.msg_basic_display ) ;
		this.msg_basic_display.set("href",dojo.string.substitute(this.MsgBasicView,{bounceddistributionid:this._row.bounceddistributionid}));
		this.msg_display.set("href",dojo.string.substitute(this.MsgView,{bounceddistributionid:this._row.bounceddistributionid}));
	},
	MsgView:"/research/admin/bemails/msg_display?bounceddistributionid=${bounceddistributionid}",
	MsgBasicView:"/research/admin/bemails/msg_basic_display?bounceddistributionid=${bounceddistributionid}",
	_message_load_call:function ( responce )
	{

	},
	_refresh:function()
	{
		this._clear_filter();
	},
	_clear_filter:function()
	{
		this.autoreply.set("checked", false);
		this.outletname.set("value","");
		this.emailaddress.set("value","");
		this.customers.set("value",null);
		this.result_grid.set("query", filter );
	},
	_execute:function()
	{
		var filter = {};

		if (arguments[0].autoreply == "on")
			filter["autoreply"] = true;
		if (arguments[0].top50 == "on")
			filter["top50"] = true;
		if ( arguments[0].outletname.length > 0 )
			filter["outletname"] = arguments[0].outletname;
		if ( arguments[0].emailaddress.length > 0 )
			filter["emailaddress"] = arguments[0].emailaddress;
		if ( arguments[0].icustomerid > 0 )
			filter["icustomerid"] = arguments[0].icustomerid;

		this.result_grid.set("query", filter);
		this.clear();
	}
});
});





