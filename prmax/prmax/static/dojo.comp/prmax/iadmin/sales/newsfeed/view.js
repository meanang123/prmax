//-----------------------------------------------------------------------------
// Name:    prmax.iadmin.sales.newsfeed.view
// Author:  Chris Hoy
// Purpose:
// Created: 06/01/2012
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.iadmin.sales.newsfeed.view");

dojo.require( "ttl.BaseWidget");
dojo.require( "ttl.utilities");

dojo.require( "dijit.form.Button");
dojo.require( "dijit.Toolbar");

dojo.require( "dojox.grid.EnhancedGrid");
dojo.require( "dojox.data.JsonRestStore");

dojo.require( "prmax.iadmin.sales.newsfeed.add");
dojo.require( "prmax.iadmin.sales.newsfeed.edit");

dojo.declare("prmax.iadmin.sales.newsfeed.view", [ ttl.BaseWidget ], {
	templateString: dojo.cache( "prmax","iadmin/sales/newsfeed/templates/view.html"),
	constructor:function()
	{
		this._news = new dojox.data.JsonRestStore( {target:"/iadmin/newsfeed/news", idAttribute:"newsfeedid"});

		this._show_call_back = dojo.hitch(this, this._show_call);
		this._delete_news_call_back = dojo.hitch(this, this._delete_news_call);
	},
	postCreate:function()
	{
		this.grid.set("structure", this.view1);
		this.grid._setStore( this._news);
		this.grid.setQuery(this._DefaultQuery());
		this.grid["onCellClick"] = dojo.hitch(this,this._SelectRow);
		this.inherited(arguments);
	},
	view1:{
		cells: [[
			{name: 'Id',width: "40px",field:"newsfeedid", styles:"text-align:right;"},
			{name: 'Subject',width: "150px",field:"subject"},
			{name: 'Summary',width: "250px",field:"summary"},
			{name: 'Type',width: "80px",field:"newsfeedtypedescription"},
			{name: 'Active',width: "80px",field:"embargo_display"},
			{name: 'Expire',width: "80px",field:"expire_display"},
			{name: ' ',width: "2em",field:'tasktagid',formatter:ttl.utilities.deleteRowCtrl}
			]]
	},
	_show_call:function( option, news)
	{
		switch(option)
		{
			case 1:
				this.newszone.selectChild(this.edit_ctrl);
				break;
			case 2:
				this._news.setValue( this._row, "subject", news.subject);
			  this._news.setValue( this._row, "summary",news.summary);
			  this._news.setValue( this._row, "newsfeedtypedescription",news.newsfeedtypedescription);
				this._news.setValue( this._row, "embargo_display", news.embargo_display);
				this._news.setValue( this._row, "expire_display", news.expire_display);
				break;
		}
	},
	_delete_news_call:function(response)
	{
		if (response.success == "OK")
		{
			this._news.deleteItem(this._row);
			this._row = null;
			alert("News Item Deleted");
		}
		else
		{
			alert("Problem Deleting News");
		}
	},
	_SelectRow:function(e)
	{
		var rowData = this.grid.getItem(e.rowIndex);
		this.grid.selection.clickSelectEvent(e);
		this._row = rowData;
		if (e.cellIndex == 6)
		{
			if (confirm("Delete News Item ()" + this._row.subject +")"))
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._delete_news_call_back,
				url:'/iadmin/newsfeed/delete',
				content:{newsfeedid:this._row.newsfeedid}}));
		}
		else
		{
			this.edit_ctrl.Load( rowData.newsfeedid , this._show_call_back);
		}
	},
	resize:function()
	{
		this.borderCtrl.resize ( arguments[0] )

		this.inherited(arguments);
	},
	_DefaultQuery:function()
	{
		return {};
	},
	_NewNewsFeed:function()
	{
		this.newsctrl.Load(this.newsdialog, this._news );
	}
});
