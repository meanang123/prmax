//-----------------------------------------------------------------------------
// Name:    "prmax.lists.exclusions.view
// Author:  Chris Hoy
// Purpose:
// Created: 30/06/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.lists.exclusions.view");

dojo.declare("prmax.lists.exclusions.view", [ttl.BaseWidget], {
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.lists.exclusions","templates/view.html"),
	constructor:function()
	{
		this.model = new prcommon.data.QueryWriteStore (
			{ url:'/search/exclude/list',
				oncallback: false,
				onError:ttl.utilities.globalerrorchecker
		});

		this.model_unsub = new dojox.data.QueryReadStore (
			{ url:'/search/exclude/list_unsub',
				oncallback: false,
				onError:ttl.utilities.globalerrorchecker
		});

		this._delete_call_back = dojo.hitch(this, this._delete_call);
	},
	postCreate:function()
	{
		this.grid.set("structure",this.view );
		this.grid._setStore ( this.model ) ;

		this.unsub_grid.set("structure",this.view_unsub );
		this.unsub_grid._setStore ( this.model_unsub ) ;

		this.grid.onCellClick = dojo.hitch(this,this._on_cell_click);

		this.inherited(arguments);
	},
	view:{
		cells: [[
			{name: 'Outlet Name',width: "200px",field:"outletname"},
			{name: 'Job Title',width: "200px",field:"job_title"},
			{name: 'Contact Name',width: "200px",field:"contactname"},
			{name: ' ',width: "15px",styles: 'text-align: center;', width: "20px",formatter:ttl.utilities.deleteRowCtrl}
			]]
	},
	view_unsub:{
		cells: [[
			{name: 'Email Address',width: "300px",field:"emailaddress"}
			]]
	},
	_delete_call_back:function(response)
	{
		if (response.success == "OK")
		{
			this.model.deleteItem(this._row);
		}
	},
	_on_cell_click:function(e)
	{
		this._row = this.grid.getItem(e.rowIndex);
		if ( e.cellIndex == 3)
		{
			if ( confirm("Remove Exclusion?"))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._DeleteCallBack,
						url:'/search/exclude/exclusion_delete',
						content:{exclusionlistid:this._row.i.exclusionlistid}
					}));
			}
		}
	},
	resize:function()
	{
		this.inherited(arguments);
	},
	Clear:function()
	{
		this.grid.setQuery(ttl.utilities.getPreventCache());
		this.unsub_grid.setQuery(ttl.utilities.getPreventCache());
	}
});
