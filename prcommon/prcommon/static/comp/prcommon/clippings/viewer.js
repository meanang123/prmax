//-----------------------------------------------------------------------------
// Name:    prcommon.clippings.viewer
// Author:  Chris Hoy
// Purpose:
// Created: 28/04/2015
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.clippings.viewer");

dojo.require("ttl.BaseWidget");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuBar");
dojo.require("dijit.MenuBarItem");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dojox.data.JsonRestStore");
dojo.require("prcommon.clippings.searchext");
dojo.require("dijit.Dialog");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.layout.StackContainer");
dojo.require("prcommon.clippings.edit");
dojo.require("prcommon.clippings.analysis.edit");
dojo.require("prcommon.clippings.edit_private");
dojo.require("prcommon.clippings.questions.viewer");
dojo.require("prcommon.clippings.clippingoutput");
dojo.declare("prcommon.clippings.viewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	basic_details_page:"/clippings/display_page?clippingid=${clippingid}",
	templatePath: dojo.moduleUrl( "prcommon.clippings","templates/viewer.html"),
	constructor: function()
	{
		this._clippings = new dojox.data.JsonRestStore(
			{	target:'/clippings/list_clippings',
				idAttribute:'clippingid' });

		this._load_call_back = dojo.hitch(this, this._load_call);
		this._load_add_call_back = dojo.hitch(this, this._load_add_call);

		this._clients_model = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
		this._do_search_ext_call_back=dojo.hitch(this,this._do_search_ext_call);

		dojo.subscribe("/clipping/update", dojo.hitch(this, this._update_event));
		dojo.subscribe("/clipping/private_add", dojo.hitch(this, this._private_add_event));
	},
	view1:{noscroll: false,
		cells: [[
			{name: ' ',styles: 'text-align: center;', width: "15px",formatter:ttl.utilities.formatRowCtrl},
			{name: 'Date',width: "50px",field:'clip_source_date_display'},
			{name: 'Type', styles: 'text-align: center;', width: "30px", field:"clippingstypedescription", formatter:ttl.utilities.fonticon},
			{name: 'Title',width: "250px",field:"clip_title"},
			{name: 'Outlet',width: "250px",field:"outletname"},
			{name: 'Source',width: "80px",field:"clippingsourcedescription"},
			{name: 'Tone',width: "80px",field:"clippingstonedescription"}
			]]
	},
	postCreate:function()
	{
		this.clientid.set("store", this._clients_model);
		this.clientid.set("value",  "-1");

		this.viewer_grid.set("structure",this.view1 );
		this.viewer_grid._setStore ( this._clippings ) ;
		this.viewer_grid["onRowClick"] = dojo.hitch(this, this._on_row_click );

		this.inherited(arguments);

		this.issue_label_1.set("label", PRMAX.utils.settings.issue_description+"s");
	},
	startup:function()
	{
		this.inherited(arguments);

		this.clipping_edit_view.controlButton.domNode.style.display = "none";
		this.clipping_edit_private_view.controlButton.domNode.style.display = "none";
	},
	_on_row_click:function(event)
	{
		var row = this.viewer_grid.getItem(event.rowIndex);
		if ( row )
		{
			this._row = row;
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._load_call_back,
				url:'/clippings/get_for_edit',
				content: {clippingid:row.clippingid}}));
		}
	},
	_load_call:function(response)
	{
		this._show_clipping(response.data,null);
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

		this.clipping_view_ctrl.selectChild(this.clippings_view);
		if (start_tab=="analysis")
		{
			this.clippings_view.selectChild(this.clipping_analysis_view);
		}
		else
		{
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
	_hide_clipping:function()
	{
		this.clipping_view_ctrl.selectChild(this.blank_view);
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
	},
	load:function( outletid )
	{

	},
	_add_clipping:function()
	{
		this.add_clipping_ctrl.clear();
		this.add_clipping_dlg.show();
	},
	_clients:function()
	{
		dijit.byId("std_banner_control")._Clients();
	},
	_issues:function()
	{
		dijit.byId("std_banner_control")._issues();
	},
	_questions:function()
	{
		dijit.byId("std_banner_control")._question();
	},
	_search_ext:function()
	{
		this.search_ctrl.load(this._do_search_ext_call_back);
		this.search_dlg.show();
	},
	_change_filter:function()
	{
		var query = {};

		var clientid = this.clientid.get("value");
		if (clientid != null && clientid != -1 )
		{
			query['clientid'] = clientid;
		}

		this.viewer_grid.setQuery(ttl.utilities.getPreventCache(query));
		this._hide_clipping();

	},
	_reporting:function()
	{
		this.output_clipping_dlg.show();
	},
	_do_search_ext_call:function(search_object)
	{
		this.viewer_grid.setQuery(ttl.utilities.getPreventCache(search_object));
		this._hide_clipping();
		this.search_dlg.hide();

	},
	_update_event:function(clipping)
	{
		if (this._row)
		{
			this._clippings.setValue(this._row,"clip_source_date_display",clipping.clip_source_date_display);
			this._clippings.setValue(this._row,"clip_title",clipping.clip_title);
			this._clippings.setValue(this._row,"outletname",clipping.outletname);
			this._clippings.setValue(this._row,"clippingsourcedescription",clipping.clippingsourcedescription);

			this.clipping_analysis_view.load(clipping.clippingid);
			this.clipping_view.set("href",dojo.string.substitute(this.basic_details_page,{clippingid:clipping.clippingid}));

		}
	},
	_private_add_event:function(clipping)
	{
		this._row = null;
		this._clippings.newItem(clipping);
		dojo.xhrPost(
					ttl.utilities.makeParams({
				load: this._load_add_call_back,
				url:'/clippings/get_for_edit',
				content: {clippingid:clipping.clippingid}}));

		this.add_clipping_dlg.hide();
		this.add_clipping_ctrl.clear();

	}
});
