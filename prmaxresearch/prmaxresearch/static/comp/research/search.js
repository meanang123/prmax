//-----------------------------------------------------------------------------
// Name:    search.js
// Author:  Chris Hoy
// Purpose:
// Created: 26/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../research/templates/search.html",
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
	"dojo/_base/array",
	"dijit/registry",
	"dojo/on",
	"dijit/layout/ContentPane",
	"dijit/Toolbar",
	"dijit/form/DropDownButton",
	"dijit/TooltipDialog",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/Form",
	"dojox/form/BusyButton",
	"prcommon2/search/OutletSearch",
	"prcommon2/search/FreelanceSearch",
	"prcommon2/search/EmployeeSearch",
	"prcommon2/search/SmartSearch"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore, lang, topic, array,registry,on){
 return declare("research.search",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	searchtypeid:3,
	form_name:"std_search_outlet_form",
	constructor: function()
	{
		this.model =  new Observable( new JsonRest( {target:'/search/list_rest', idProperty:"sessionsearchid"}));
		this._load_call_back = lang.hitch(this, this._load_call);
		this._clear_all_call_back = lang.hitch(this, this._clear_all_call);

		topic.subscribe(PRCOMMON.Events.SearchSession_Changed, lang.hitch(this,this._search_update_event));
		topic.subscribe(PRCOMMON.Events.Outlet_Updated, lang.hitch(this,this._outlet_update_event));
		topic.subscribe(PRCOMMON.Events.Outlet_Deleted, lang.hitch(this,this._outlet_deleted_event));
	},
	postCreate:function()
	{
		var cells =
		[
			{label: ' ',className:"grid-field-image-view", field:'prmax_outletgroupid',formatter:utilities2.outlet_type},
			{label: 'Name',className:"standard", field:"outletname"},
			{label: 'Contact',className:"standard", field:"contactname"},
			{label: 'Source',className:"dgrid-column-status-small", field:"sourcename"},
			{label: 'Id',className:"dgrid-column-status-small", field:"outletid"}
		];

		this.searchgrid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.model,
			query: utilities2.EMPTYGRID,
			sort: [{ attribute: "prmax_outletgroupid", descending: false }]
		});

		this.searchgrid_view.set("content", this.searchgrid);
		this.searchgrid.on("dgrid-select", lang.hitch(this,this._on_cell_call));

		on(this.search_form_pane,"onLoad", lang.hitch(this,this._connect_pane));

		this.contact_interest_ctrl.set("dialog", this.contact_interest_dlg);

		this.inherited(arguments);
	},
	_connect_pane:function( )
	{
		on(registry.byId(this.form_name),"onSubmit",lang.hitch(this,this._submit));
	},
	_submit:function()
	{
		this._do_search();
	},
	_search:function()
	{
		this._do_search();
	},
	_load_call:function( response )
	{
		topic.publish(PRCOMMON.Events.SearchSession_Changed , [response.data]);
		this.searchbutton.cancel();
	},
	_get_form:function()
	{
		var form = null;
		array.every(this.search_form_pane.selectedChildWidget.getChildren(),
			function(widget)
			{
				if ( widget.formid != null)
					form = widget;
			});
		return form;
	},
	_do_search:function()
	{
		var form = this._get_form();

		form.setExtendedMode(false);
		var content = form.get("value");

		content["mode"] = 1 ;
		content['search_partial'] = 2;
		content['searchtypeid'] = 3 ;
		// allows for full search of all data
		//content['research'] = 1;

		request.post('/search/dosearch',
			utilities2.make_params({data:content})).
			then(this._load_call_back);
	},
	_search_update_event:function( data )
	{
		this.refresh( data );
	},
	refresh:function( data )
	{
		this.searchgrid.set("query",{searchtypeid:this.searchtypeid,research:1});
	},
	_clear_search:function()
	{
		var form = this._get_form();
		array.every(form.getChildren(),
			function(widget){
				if ( widget.Clear != null)
				{
					widget.Clear();
				}
				if ( widget.clear != null)
				{
					widget.clear();
				}
				return true;
			});

		this.searchbutton.cancel();
	},
	_clear_search_results:function()
	{
		request.post('/search/sessionclear',
			utilities2.make_params({ data :{searchtypeid:3}})).
			then ( this._clear_all_call_back);
	},
	_clear_all_call:function( response )
	{
		if ( response.success=="OK")
		{
			this.refresh({ outletid : -1 ,  employeeid: -1, outlettypeid:-1 } );
		}
	},
	_on_cell_call : function(e)
	{
		var row=e.rows[0].data;
		topic.publish(PRCOMMON.Events.Display_Load , row.outletid, row.prmax_outletgroupid, row.sourcetypeid);
	},
	_outlet_update_event:function( outlet )
	{
	},
	_outlet_deleted_event:function( outlet )
	{
		for ( var key in outlet.search )
		{
			this.model.remove(outlet.search[key]);
		}
	},
	_contact_interests:function()
	{
		this.contact_interest_dlg.show();
	}
});
});





