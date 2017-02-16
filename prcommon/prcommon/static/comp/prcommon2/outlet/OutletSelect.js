//-----------------------------------------------------------------------------
// Name:    prcommon2.outlet.OutletSelect
// Author:  Chris Hoy
// Purpose:
// Created: 09/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
// Main control
define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlet/templates/OutletSelect.html",
	"dojo/json",
	"dojo/request",
	"ttl/utilities2",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dojo/_base/lang",
	"dojo/topic",
	"ttl/grid/Grid",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/_base/array",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/Dialog",
	"dijit/layout/BorderContainer",
	"prcommon2/search/OutletSearch",
	"dijit/layout/ContentPane",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, json, request, utilities2, JsonRest, Observable, lang, topic, Grid, domattr, domclass, array){
 return declare("prcommon2.outlet.OutletSelect",
	[BaseWidgetAMD],{
	templateString: template,
	name:"",
	value:"",
	searchtypeid:6,
	placeHolder:"Select Outlet",
	source_url:"/search/list_rest",
	constructor: function()
	{
		this._outletid = null;
		this._load_call_back = lang.hitch(this, this._load_call);
		this.show_parentbtn = false;

	},
	postCreate:function()
	{
		var cells =
		[
			{label: ' ',className:"grid-field-image-view", field:'prmax_outletgroupid',formatter:utilities2.outlet_type},
			{label: 'Name',className:"standard", field:"outletname"},
			{label: 'Contact',className:"standard", field:"contactname"},
			{label: 'Source',className:"dgrid-column-status-small", field:"sourcename"},
			{label: 'Id',className:"dgrid-column-accountnbr", field:"outletid"}
		];

		this.model = new Observable(new JsonRest( {target:this.source_url, idProperty:"sessionsearchid"}));
		this.searchgrid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this.model,
			sort: [{ attribute: "outletname", descending: false }],
			query:utilities2.EMPTYGRID
		});

		this.select_search_view.set("content", this.searchgrid);
		this.searchgrid.on("dgrid-select", lang.hitch(this,this._on_cell_call));

		domclass.add(this.clearbtn.domNode,"prmaxhidden");
		domclass.add(this.parentbtn.domNode,"prmaxhidden");
		domattr.set(this.display,"innerHTML",this.placeHolder);

		this.inherited(arguments);
	},
	_load_call:function(response)
	{
		if (response.outlet)
		{
			outletid = response.outlet.outlet.outletid;
			sourcetypeid = response.outlet.outlet.sourcetypeid;
			prmax_grouptypeid = "";
			if (response.outlet.outlet.outlettypeid == 19)
			{
				prmax_grouptypeid = "freelance";
			};
			
			topic.publish("LoadParentOutlet", outletid, prmax_grouptypeid, sourcetypeid);		
		}
		this.refresh();
		this.searchbutton.cancel();
	},
	_setValueAttr:function(value)
	{
		this._outletid = value ;
		this._set_view();
	},
	_setDisplayvalueAttr:function(value)
	{
		if (value == "" || value == null )
		{
			domattr.set(this.display,"innerHTML",this.placeHolder);
			domclass.add(this.display,"PlaceHolder");
		}
		else
		{
			domattr.set(this.display,"innerHTML",value);
			domclass.remove(this.display,"PlaceHolder");
		}
	},
	_setParentbtnvalueAttr:function(value)
	{
		if (value)
		{
			this.show_parentbtn = true;
		}
	},
	_getValueAttr:function()
	{
		return this._outletid;
	},
	_clear:function()
	{
		this.clear();
	},
	_load_parent_outlet:function()
	{
		request.post('/research/admin/outlets/research_outlet_edit_get',
				utilities2.make_params({ data : {outletid: this._outletid}})).
				then ( this._load_call_back);
	},
	_set_view:function()
	{
		if (this._outletid == null)
		{
			domclass.add(this.clearbtn.domNode,"prmaxhidden");
			domclass.add(this.parentbtn.domNode,"prmaxhidden");
			domclass.add(this.display,"PlaceHolder");
		}
		else
		{
			domclass.remove(this.clearbtn.domNode,"prmaxhidden");
			domclass.remove(this.display,"PlaceHolder");
			if (this.show_parentbtn) {
				domclass.remove(this.parentbtn.domNode,"prmaxhidden");
			}
		}
	},
	_select:function()
	{
		this.select_dlg.startup();
		this.select_dlg.show();
	},
	clear:function()
	{
		this._outletid = null;
		domattr.set(this.display,"innerHTML",this.placeHolder);
		this._set_view();
	},
	_close:function()
	{
		this.select_dlg.hide();
	},
	_get_form:function()
	{
		var form = null;
		array.every(this.search_form_pane.getChildren(),
			function(widget)
			{
				if ( widget.formid != null)
					form = widget;
			});
		return form;
	},
	_search:function()
	{
		var form = this._get_form();

		form.setExtendedMode(false);
		var content = form.get("value");

		content["mode"] = 1 ;
		content['search_partial'] = 2;
		content['searchtypeid'] = this.searchtypeid ;

		this.searchbutton.makeBusy();

		request.post('/search/dosearch',
			utilities2.make_params({data:content})).
			then(this._load_call_back);
	},
	refresh:function( )
	{
		this.searchgrid.set("query",{searchtypeid:this.searchtypeid});
	},
	_clear_search:function()
	{
		var form = this._get_form();
		array.every(form.getDescendants(),
			function(widget){
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
		request.post('/search/sessionclear',
			utilities2.make_params({ data :{searchtypeid:this.searchtypeid}})).
			then ( this._clear_all_call_back);
	},
	_search_update_event:function( data )
	{
		this.refresh( data );
	},
	_on_cell_call:function (e)
	{
		this._outletid = e.rows[0].data.outletid;
		domattr.set(this.display,"innerHTML",e.rows[0].data.outletname);
		this.select_dlg.hide();
		this._set_view();
	}
});
});
