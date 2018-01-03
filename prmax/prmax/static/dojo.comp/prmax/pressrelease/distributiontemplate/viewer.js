//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.distributiontemplate.viewer.js
// Author:  Chris Hoy
// Purpose:
// Created: 29/01/2016
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressrelease.distributiontemplate.viewer");

dojo.require("prmax.pressrelease.distributiontemplate.template_add");
dojo.require("prmax.pressrelease.distributiontemplate.template_update");

dojo.declare("prmax.pressrelease.distributiontemplate.viewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease.distributiontemplate","templates/viewer.html"),
	constructor: function()
	{
		this._templates_store = new dojox.data.JsonRestStore({target:'/emails/distributiontemplates/templates_list', idAttribute:'distributiontemplateid'});

		this._show_update_call_back=dojo.hitch(this, this._show_update_call);
		this._show_add_call_back=dojo.hitch(this, this._show_add_call);

	},
	view:{
		cells: [[
			{name: 'Description',width: "auto",field:'description'},
			{name: 'Type',width: "auto",field:'distributiontemplatesdescription'}
			]]
	},
	postCreate:function()
	{
		this.viewer_grid.set("structure", this.view);
		this.viewer_grid._setStore(this._templates_store);
		this.viewer_grid.onRowClick = dojo.hitch(this,this._on_select_row);

		this.inherited(arguments);
	},
	_on_select_row:function(e)
	{
		var row=this.viewer_grid.getItem(e.rowIndex);

		if (row)
		{
			this._row = row;
			this.update_template_ctrl.load(row.distributiontemplateid, this._show_update_call_back);
			this.viewer_grid.selection.clickSelectEvent(e);

		}
	},
	_show_update_call:function(command)
	{
		switch(command)
		{
		case "show":
			this.clipping_view_ctrl.selectChild(this.update_template_ctrl);
			break;
		case "hide":
			this.clipping_view_ctrl.selectChild(this.blank_view);
			this.update_template_ctrl.clear();
			break;
		case "delete":

			this.clipping_view_ctrl.selectChild(this.blank_view);
			this.update_template_ctrl.clear();
			this._templates_store.deleteItem(this._row);
			break;
		}
	},
	_show_add_call:function(command, data)
	{
		switch(command)
		{
		case "show":
			this.clipping_view_ctrl.selectChild(this.blank_view);
			this.update_template_ctrl.clear();
			this.add_template_ctrl.clear();
			this.add_template_dlg.show();
			break;
		case "hide":
			this.add_template_dlg.hide();
			this.add_template_ctrl.clear();
			if (data)
			{
				this._templates_store.newItem(data);
			}
			break;
		}
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
	},
	_add_template_footer:function()
	{
		this.add_template_dlg.set("title","Add Footer");
		this.add_template_ctrl.load(this._show_add_call_back,2);
		this._show_add_call("show");
	},
	_add_template_header:function()
	{
		this.add_template_dlg.set("title","Add Header");
		this.add_template_ctrl.load(this._show_add_call_back,1);
		this._show_add_call("show");
	}
});






