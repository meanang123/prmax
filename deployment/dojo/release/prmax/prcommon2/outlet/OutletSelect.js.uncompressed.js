require({cache:{
'url:prcommon2/outlet/templates/OutletSelect.html':"<div class=\"dijit dijitReset dijitInline dijitLeft dijitTextBox dijitValidationContainer dijitInputField dijitTextBox\">\r\n\t<p style=\"float:left;position:relative;top:3px;white-space: nowrap;overflow:hidden;width:60%\" class=\"PlaceHolder dijitReset\" data-dojo-attach-point=\"display\"></p>\r\n\t<button data-dojo-attach-event=\"onClick:_select\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Select an outlet\",style:\"float:right;padding:0px;margin:0px\",iconClass:\"fa fa-search\",showLabel: false',\"class\",\"dijitReset\"></button>\r\n\t<button data-dojo-attach-point=\"clearbtn\" data-dojo-attach-event=\"onClick:_clear\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='style:\"float:right;padding:0px;margin:0px\",type:\"button\",label:\"Clear current selection\",\"class\":\"prmaxhidden dijitReset\",iconClass:\"fa fa-eraser\",showLabel: false'></button>\r\n\t<button data-dojo-attach-point=\"parentbtn\" data-dojo-attach-event=\"onClick:_load_parent_outlet\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='style:\"float:right;padding:0px;margin:0px\",type:\"button\",label:\"Load Parent Outlet\",\"class\":\"prmaxhidden dijitReset\",iconClass:\"fa fa-level-up fa-fw\",showLabel: false'></button>\r\n\t<div data-dojo-attach-point=\"select_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Select Publication\",style:\"height:590px;width:650px;overflow:hidden\"'>\r\n\t\t<div data-dojo-props='style:\"width:100%;height:250px\"' data-dojo-type=\"dijit/layout/ContentPane\">\r\n\t\t\t<div data-dojo-props='style:\"width:100%:height:250px\",\"class\":\"scrollpanel\",searchtypeid:6' data-dojo-attach-point=\"search_form_pane\" data-dojo-type=\"prcommon2/search/OutletSearch\"></div>\r\n\t\t</div>\r\n\t\t<div data-dojo-props='style:\"width:100%;height:250px;overflow:hidden\"' data-dojo-attach-point=\"select_search_view\" data-dojo-type=\"dijit/layout/ContentPane\"></div>\r\n\t\t<div data-dojo-props='style:\"width:100%;height:50px;overflow:hidden\"'  data-dojo-type=\"dijit/layout/ContentPane\">\r\n\t\t\t<button data-dojo-attach-event=\"onClick:_close\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"'></button>\r\n\t\t\t<button data-dojo-attach-point=\"searchbutton\" data-dojo-attach-event=\"onClick:_search\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='style:\"float:right;padding-right:20px\",\"class\":\"prmaxbutton\",busyLabel:\"Searching...\",label:\"Search\"' ></button>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"selectdetails_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Publication Details\",style:\"width:600px;height:520px\"'>\r\n\t\t<div data-dojo-attach-point=\"selectdetails_ctrl\" data-dojo-type=\"prcommon2/outlet/OutletSelectDetails\" data-dojo-props='style:\"width:590px;height:490px\"'></div>\r\n\t</div>\r\n\r\n</div>\r\n\r\n\r\n\r\n"}});
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
define("prcommon2/outlet/OutletSelect", [
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
	"prcommon2/outlet/OutletSelectDetails",
	"dijit/layout/ContentPane",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, json, request, utilities2, JsonRest, Observable, lang, topic, Grid, domattr, domclass, array){
 return declare("prcommon2.outlet.OutletSelect",
	[BaseWidgetAMD],{
	templateString: template,
	name:"",
	value:"",
	mode:"outlet",
	searchtypeid:6,
	placeHolder:"Select Outlet",
	source_url:"/search/list_rest",
	constructor: function()
	{
		this._outletid = null;
		this._circulation = 0;
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
			{label: 'Id',className:"dgrid-column-accountnbr", field:"outletid"},
			{label: ' ',name:'edit', className:"dgrid-column-type-boolean",field:'outletid',formatter:utilities2.format_row_ctrl},
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
		this.searchgrid.on(".dgrid-cell:click", lang.hitch(this,this._on_cell_call));

		domclass.add(this.clearbtn.domNode,"prmaxhidden");
		domclass.add(this.parentbtn.domNode,"prmaxhidden");
		domattr.set(this.display,"innerHTML",this.placeHolder);

		this.inherited(arguments);

		this.selectdetails_ctrl.set("dialog", lang.hitch(this, this._show_details_function));
	},
	_show_details_function:function(command)
	{
		if (command =="show")
		{
			this.selectdetails_dlg.show();
//			this.selectdetails_ctrl.load(this.outletid);
		}
		else
		{
			this.selectdetails_dlg.hide();
		}
	},
	_load_call:function(response)
	{
		if (response.outlet)
		{
			outletid = response.outlet.outlet.outletid;
			sourcetypeid = response.outlet.outlet.sourcetypeid;
			prmax_grouptypeid = "";
//			this.selectdetails_ctrl.set("outletid", outletid);
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
			topic.publish('/outlet/circulation', [this._circulation]);
		}
	},
	_setParentbtnvalueAttr:function(value)
	{
		if (value)
		{
			this.show_parentbtn = value;
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
		//this.select_dlg.startup();
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

		var cell = this.searchgrid.cell(e);

		if ( cell.row == null || cell.row == undefined )
			return;

		this._row = cell.row.data;
		this._outletid = this._row.outletid;
		this._circulation = this._row.circulation;
		if ( cell.column.id  == 5)
		{
			this.selectdetails_dlg.startup();
			this.selectdetails_dlg.show();
			this.selectdetails_ctrl.load(this._outletid,this.mode);
		}
		else
		{
			domattr.set(this.display,"innerHTML",this._row.outletname);
			this.select_dlg.hide();
			this._set_view();
			topic.publish('/outlet/circulation', [this._circulation]);
		}

//		this._outletid = e.rows[0].data.outletid;
//		domattr.set(this.display,"innerHTML",e.rows[0].data.outletname);
//		this.select_dlg.hide();
//		this._set_view();
	},
});
});
