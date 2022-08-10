require({cache:{
'url:research/advance/templates/view.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='region:\"left\",style:\"width:50%;height:100%\",gutters:false' >\r\n\t\t<div data-dojo-type=\"dijit/layout/BorderContainer\" data-dojo-props='style:\"width:100%;height:55%; border: 0; padding: 0; margin: 0\",region:\"top\",gutters:false'>\r\n\t\t\t<div data-dojo-attach-point=\"search_form_pane\" data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"' >\r\n\t\t\t\t<div data-dojo-attach-point=\"std_search_advance\" data-dojo-type=\"prcommon2/search/AdvanceSearch\" data-dojo-props='title:\"Features\",style:\"overflow:auto\"' ></div>\r\n\t\t\t</div>\r\n\t\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:35px\"'>\r\n\t\t\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"border-collapse: collapse;\" >\r\n\t\t\t\t\t<tr>\r\n\t\t\t\t\t\t<td><button data-dojo-attach-event=\"onClick:_clear_search\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxbutton\",label:\"Clear Search Criteria\",iconClass:\"fa fa-eraser\"' ></button></td>\r\n\t\t\t\t\t\t<td><button data-dojo-attach-event=\"onClick:_clear_search_results\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='\"class\":\"prmaxbutton\",label:\"Clear Search Results\",iconClass:\"fa fa-eraser\"' ></button></td>\r\n\t\t\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"searchbutton\" data-dojo-attach-event=\"onClick:_search\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='\"class\":\"prmaxbutton\",busyLabel:\"Searching...\",label:\"Search\",iconClass:\"fa fa-search-plus fa-2x\"' ></button></td>\r\n\t\t\t\t\t</tr>\r\n\t\t\t\t</table>\r\n\t\t\t</div>\r\n\t\t</div>\r\n\t\t<div  data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"center\",splitter:true' data-dojo-attach-point=\"searchgrid_view\" ></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"outlet_advance_ctrl\" data-dojo-type=\"prcommon2/advance/advance\" data-dojo-props='region:\"center\"'></div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose:
// Created: 13/01/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/advance/view", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../advance/templates/view.html",
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
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/on",
	"dojo/_base/array",
	"dijit/registry",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"prcommon2/advance/advance",
	"dijit/layout/BorderContainer",
	"dijit/layout/TabContainer",
	"dijit/layout/ContentPane",
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"prcommon2/search/AdvanceSearch"
	], function(declare, BaseWidgetAMD, template, BorderContainer, Grid, JsonRest, Observable, request, utilities2, json, ItemFileReadStore,lang,topic, domattr, domclass, on, array, registry){
 return declare("research.advance.view",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	constructor: function()
	{

		this.results = new Observable( new JsonRest( {target:'/advance/viewpage_rest', idProperty:"advancefeatureid"}));
		this._load_call_back = lang.hitch(this, this._load_call);
		this._clear_all_call_back = lang.hitch(this, this._clear_all_call);

	},
	postCreate:function()
	{
		var cells =
		[
			{label: 'Outlet Name',className:"dgrid-column-title ",field:"outletname"},
			{label: 'Publication Date',className:"dgrid-column-date",field:"pub_date_display"},
			{label: 'Feature',className:"dgrid-column-contact",field:"feature"}
		];

		this.searchgrid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.results,
			sort: [{ attribute: "pub_date_display", descending: false }],
			query: utilities2.EMPTYGRID
		});

		this.searchgrid_view.set("content", this.searchgrid);
		this.searchgrid.on("dgrid-select", lang.hitch(this,this._on_cell_call));
		on(this.search_form_pane,"onLoad", lang.hitch(this,this._connect_pane));

		this.inherited(arguments);
	},
	_on_cell_call : function(e)
	{
		var row=e.rows[0].data;

		this.outlet_advance_ctrl.load( row.advancefeatureid, row.outletid );
		domclass.remove(this.outlet_advance_ctrl.domNode,"prmaxhidden");
	},
	_connect_pane:function( )
	{
		on( registry.byId(this.form_name),"onSubmit",lang.hitch(this,this._submit));
	},
	_submit:function()
	{
		this._do_search();
	},
	_clear_search:function()
	{
		var form = this._get_form();
		array.every(form.getChildren(),
			function(widget)
			{
				if ( widget.clear != null)
				{
					widget.clear();
				}
				if ( widget.Clear != null)
				{
					widget.Clear();
				}

				return true;
			});

		this.searchbutton.cancel();
	},
	_clear_search_results:function()
	{
		request.post('/advance/delete_list_all',
			utilities2.make_params({})).then
			(this._clear_all_call_back);
	},
	_clear_all_call:function( response )
	{
		this.searchgrid.set("query", {});
		domclass.add(this.outlet_advance_ctrl.domNode,"prmaxhidden");
	},
	_search:function()
	{
		this._do_search();
	},
	_do_search:function()
	{
		var form = this._get_form();
		form.setExtendedMode(false);
		var content = form.get("value");

		content["mode"] = 1 ;
		content['search_partial'] = 2;
		content['searchtypeid'] = 3 ;
		content['research'] = 1;

		request.post('/search/dosearch',
			utilities2.make_params({data:content})).then
			(this._load_call_back);
	},
	_load_call:function( response )
	{
		this.searchgrid.set("query",{});
		this.searchbutton.cancel();
	},
	_get_form:function()
	{
		return this.std_search_advance.get("form");
	}
});
});
