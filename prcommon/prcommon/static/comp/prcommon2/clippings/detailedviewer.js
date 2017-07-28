define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../clippings/templates/detailedviewer.html",
	"dijit/layout/BorderContainer",
	"dojo/dom-geometry",
	"dojo/_base/lang",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"ttl/grid/Grid",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dijit/Menu",
	"dijit/MenuItem",
	'dojo/dom-construct',
	"dojox/data/JsonRestStore",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/TabContainer",
	"dijit/Toolbar",
	"dijit/form/Button",
	"prcommon2/clippings/edit",
	"prcommon2/clippings/analysis/edit",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/Textarea",
	"dijit/form/RadioButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer, domgeom, lang, JsonRest, Observable, Grid, utilities2, topic, request, lang, domAttr,Menu,MenuItem,domconstruct){
 return declare("prcommon2.clippings.detailedviewer",
	[BaseWidgetAMD,BorderContainer],{
	templateString: template,
	basic_details_page:"/clippings/display_page?clippingid=${clippingid}",
	gutters:false,
	constructor: function()
	{
		this._clippings = new Observable(new JsonRest ({target:'/clippings/list_clippings', idProperty:'clippingid'}));
//		this._selected_clippings = new Observable(new JsonRest ({target:'/clippings/list_selected_clippings', idProperty:'clippingid'}));
		this._load_call_back = lang.hitch(this, this._load_call,"view");
		this._load2_call_back = lang.hitch(this, this._load_call,"edit");
		this._delete_call_back = lang.hitch(this, this._delete_call);
		this._selection_call_back = lang.hitch(this, this._selection_call);
		this._clear_selection_call_back = lang.hitch(this, this._clear_selection_call);
		this._clear_selection2_call_back = lang.hitch(this, this._clear_selection2_call);
		this._std_menu = null;
		this._loaded=false;
		this.selected_clippings = [];
		this.userid = PRMAX.utils.settings.uid;

		topic.subscribe("/clipping/update", lang.hitch(this, this._update_event));
		topic.subscribe("/clipping/private_add", lang.hitch(this, this._private_add_event));
		topic.subscribe("/clipping/refresh_details", lang.hitch(this, this._section_view_event));
		topic.subscribe("/clipping/deleted", lang.hitch(this, this._clipping_delete_event));

	},
	postCreate:function()
	{
		this.inherited(arguments);

		var cells=
		[
			{label: ' ', className:"grid-field-image-view",field:'selected',formatter:utilities2.check_cell},
			{label: ' ', sortable:false,className:"grid-field-image-view", field:"menu", formatter:utilities2.format_row_icon,
			renderHeaderCell: function(node){
								node.title = "Menu Options";
								return domconstruct.create("div",{style: {height: "100%", width: "100%"}, innerHTML: '<i class=" fa fa-bars aria-hidden="true"></i>'});
						}},
			{label: 'T', className:"grid-field-image-view", field:"icon_name", formatter:utilities2.fonticon2},
			{label: 'Date',className:"dgrid-column-status-small", field:'clip_source_date_display'},
			{label: 'Title', className:"dgrid-column-title", field:"clip_title"},
			{label: 'Outlet', className:"dgrid-column-companyname", field:"outletname"},
			{label: 'Tone', className:"dgrid-column-status-small", field:"clippingstonedescription"},
			{label: 'Source', className:"dgrid-column-status-small", field:"clippingsourcedescription"}
		];

		this.clippings_grid = new Grid({
			columns: cells,
			selectionMode: "single",
			store: this._clippings,
			sort: [{attribute: 'clip_source_date_display',descending: true}],
			query: {default_time_frame:1},
			minRowsPerPage:100,
			loadingMessage: "<i class='fa fa-spinner fa-spin fa-3x fa-fw'></i><p>Loading Data</p>",
			noDataMessage: "<span class='fa-stack fa-lg'><i class='fa fa-ban fa-3x fa-stack-2x text-danger'></i></span><p>No Results</p>"
		});

		this.clippings_grid_view.set("content", this.clippings_grid);
		this.clippings_grid.on(".dgrid-cell:click", lang.hitch(this,this._on_row_click));
		this.clippings_grid.on("dgrid-refresh-complete", lang.hitch(this,this._first_clipping_call));

		this.filter_view.set("Updateevent", lang.hitch(this, this._refresh_details_event));
		
		this.inherited(arguments);
	},
	_first_clipping_call:function(event)
	{
		this.event_first_clip = event;
		request.post('/clippings/clear_user_selection',
			utilities2.make_params({ data : {userid:this.userid}})).
			then(this._clear_selection2_call_back);
	},
	_clear_selection2_call:function(response)
	{
		if (response.success=="OK")
		{
			if ( this._loaded == true )
				return;
			if (this.event_first_clip.results.results && this.event_first_clip.results.results[0].length>0)
			{
				var row = this.clippings_grid.row(this.event_first_clip.results.results[0][0]);
				this.clippings_grid.select(row);
				this._load_clipping(this.event_first_clip.results.results[0][0]);
			}
			this._loaded = true ;
		}
		else
		{
			alert("Problem");
		}
	},
	_load_clipping:function(data)
	{
		request.post('/clippings/get_for_edit',
				utilities2.make_params({ data : {clippingid:data.clippingid}})).
				then (this._load_call_back);
	},
	_selection_call:function(response)
	{
		if (response.success=="OK")
		{
			this._clippings.put(this._row);

			if (this._row.selected == true )
			{
				this.selected_clippings.push(this._row);
			}
			else
			{
//				this._selected_clippings.remove(this._row);
				var index = this.selected_clippings.indexOf(this._row);
				if (index > -1)
				{
					this.selected_clippings.splice(index, 1);
				}
			}
		}
		else
		{
			alert("Problem");
		}
	},
	_on_row_click:function(evt)
	{
		var cell = this.clippings_grid.cell(evt);

		if (cell == null || cell.row == null ) return;

		this._row = cell.row.data;

		// user click on the selection row
		if (cell.column.field == "selected")
		{
			var selected = !this._row.selected;
			this._row.selected = !this._row.selected;
			var userid = PRMAX.utils.settings.uid;
			request.post('/clippings/user_select',
				utilities2.make_params({ data : {clippingid:this._row.clippingid, userid:userid, selected:selected}})).
				then(this._selection_call_back);
		}
		else if ( cell.column.field =="menu")
		{
			if (this._std_menu === null)
			{
				this._std_menu = new Menu();
				this._std_menu.addChild(new MenuItem({label:"&nbsp;Delete", iconClass:"fa fa-trash fa-2x fa-fw", onClick:lang.hitch(this,this._delete_clipping)}));
				this._std_menu.addChild(new MenuItem({label:"&nbsp;Edit", iconClass:"fa fa-pencil-square-o fa-2x fa-fw", onClick:lang.hitch(this,this._edit_clipping,"edit")}));
				this._std_menu.addChild(new MenuItem({label:"&nbsp;View", iconClass:"fa fa-eye fa-2x fa-fw", onClick:lang.hitch(this,this._edit_clipping,"view")}));
				this._std_menu.addChild(new MenuItem({label:"&nbsp;New", iconClass:"fa fa-plus fa-2x fa-fw",onClick:lang.hitch(this,this._new_clipping,"view")}));
				this._std_menu.startup();
			}
			if ( this._std_menu != null )
				this._std_menu._openMyself(evt);
		}
		else
		{
			this._edit_clipping("view");
		}
	},
	_new_clipping:function()
	{
		topic.publish("/clipping/change_view","newclipping");
	},
	_edit_clipping:function(mode)
	{
		response = mode == "view" ? this._load_call_back : this._load2_call_back;
		request.post('/clippings/get_for_edit',
				utilities2.make_params({ data : {clippingid:this._row.clippingid}})).
				then(response);
	},
	_delete_clipping:function()
	{
		if (confirm("Delete Clipping"))
		{
			request.post('/clippings/delete_clipping',
				utilities2.make_params({data : {clippingid : this._row.clippingid}})).
				then(this._delete_call_back);
		}
	},
	_delete_call:function(response)
	{
		if (response.success=="OK")
		{
			topic.publish("/clipping/deleted", response.data);
		}
		else
		{
			alert("Problem");
		}
	},
	_load_call:function(mode,response)
	{
		this._show_clipping(response.data,mode);
		this._clippingid = response.data.clippingid;
	},
	_load_add_call:function(response)
	{
		this._show_clipping(response.data,"analysis");
	},
	_show_clipping:function(clipping,start_tab)
	{
		this._set_options(clipping);
		this.clipping_analysis_view.load(clipping.clippingid);
		this.clipping_view.set("href",dojo.string.substitute(this.basic_details_page,{clippingid:clipping.clippingid}));

		if (clipping.clippingsourceid == 2)
			this.clipping_edit_private_view.load(clipping);
		else
			this.clipping_edit_view.load(clipping);

		this.clippings_view_ctrl.selectChild(this.clippings_view);
		switch (start_tab)
		{
			case "analysis":
				this.clippings_view.selectChild(this.clipping_analysis_view);
				break;
			case "edit":
				if (clipping.clippingsourceid == 2)
					this.clippings_view.selectChild(this.clipping_edit_private_view);
				else
					this.clippings_view.selectChild(this.clipping_edit_view);
				break;
			default:
				this.clippings_view.selectChild(this.clipping_view);
		}
	},
	_set_options:function(clipping)
	{
		if (clipping.clippingsourceid == 2)
		{
			this.clipping_edit_view.controlButton.domNode.style.display = "none";
			this.clipping_edit_private_view.controlButton.domNode.style.display = "";
		}
		else
		{
			this.clipping_edit_view.controlButton.domNode.style.display = "";
			this.clipping_edit_private_view.controlButton.domNode.style.display = "none";
		}
	},
	_update_event:function(clipping)
	{
		if (this._row)
		{
			this._clippings.put(clipping);

			this.clipping_analysis_view.load(clipping.clippingid);
			this.clipping_view.set("href",dojo.string.substitute(this.basic_details_page,{clippingid:clipping.clippingid}));
		}
	},
	_private_add_event:function(clipping)
	{
		this._clippings.add(clipping);
	},
	refesh_view:function()
	{
		this._loaded = false;
		this.clippings_grid.set("query",this.filter_view.get("filterlimited"));
		this.clippings_view_ctrl.selectChild(this.blank_view);
	},
	_refresh_details_event:function(extra_filter)
	{
		this.filter_par = this.filter_view.get("filterlimited");
		this.extra_filter_par = extra_filter;
		this._loaded = false;

		this.clippings_grid.set("query", lang.mixin(this.filter_par,this.extra_filter_par));
		this.clippings_view_ctrl.selectChild(this.blank_view);
	},
	_clear_selection_call:function(response)
	{
		if (response.success=="OK")
		{
			this.clippings_grid.set("query", lang.mixin(this.filter_par,this.extra_filter_par));
			this.clippings_view_ctrl.selectChild(this.blank_view);
		}
		else
		{
			alert("Problem");
		}
	},
	_section_view_event:function(newfilter)
	{
		this.filter_view.set("newsettings",newfilter);

		this._loaded = false;
		this.clippings_grid.set("query", this.filter_view.get("filterlimited"));

		this.clippings_view_ctrl.selectChild(this.blank_view);
	},
	_clipping_delete_event:function(clippingid)
	{
		this._clippings.remove(clippingid);
		this.clippings_view_ctrl.selectChild(this.blank_view);
	}
});
});
