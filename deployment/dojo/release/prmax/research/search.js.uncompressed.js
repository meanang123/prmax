require({cache:{
'url:research/templates/search.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/BorderContainer\"  data-dojo-props='style:\"width:100%;height:55%; border: 1\",region:\"top\",gutters:false'>\r\n\t\t<div data-dojo-attach-point=\"search_form_pane\" data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"' >\r\n\t\t\t<div data-dojo-attach-point=\"std_search_smart\" data-dojo-type=\"prcommon2/search/SmartSearch\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Smart\",\"class\":\"scrollpanel\"'  ></div>\r\n\t\t\t<div data-dojo-attach-point=\"std_search_outlet\" data-dojo-type=\"prcommon2/search/OutletSearch\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Outlet\",selected:\"selected\",\"class\":\"scrollpanel\"'  ></div>\r\n\t\t\t<div data-dojo-attach-point=\"std_search_employee\" data-dojo-type=\"prcommon2/search/EmployeeSearch\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Contact\",\"class\":\"scrollpanel\"' ></div>\r\n\t\t\t<div data-dojo-attach-point=\"std_search_freelance\" data-dojo-type=\"prcommon2/search/FreelanceSearch\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Freelance\",\"class\":\"scrollpanel\"'  ></div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:40px\"'>\r\n\t\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse: collapse;\" >\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td ><button data-dojo-attach-event=\"onClick:_clear_search\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxbutton\",label:\"Clear Search Criteria\",iconClass:\"fa fa-undo\"' ></button></td>\r\n\t\t\t\t\t<td ><button data-dojo-attach-event=\"onClick:_clear_search_results\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxbutton\",label:\"Clear Search Results\",iconClass:\"fa fa-undo\"' ></button></td>\r\n\t\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"searchbutton\" data-dojo-attach-event=\"onClick:_search\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='iconClass:\"fa fa-search-plus fa-2x\",busyLabel:\"Searching...\",label:\"Search\"' ></button></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='region:\"center\",splitter:true, gutters: false' >\r\n\t\t<div data-dojo-attach-point=\"searchgrid_view\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\"' ></div>\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:2em\"'>\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_contact_interests\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxbutton\" '>Batch Contact Keywords</button>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"contact_interest_dlg\" data-dojo-type=\"dijit/Dialog\" title =\"Modify the Keywords on the Contacts In the Search Results\">\r\n\t\t<div data-dojo-attach-point=\"contact_interest_ctrl\" data-dojo-type=\"research/employees/ContactInterests\"></div>\r\n\t\t<input data-dojo-type=\"dijit/form/TextBox\"  data-dojo-attach-point=\"search_partial\" data-dojo-props='type:\"hidden\",value:\"2\"' />\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    search.js
// Author:  Chris Hoy
// Purpose:
// Created: 26/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
define("research/search", [
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
		this.searchbutton.makeBusy();
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





