//-----------------------------------------------------------------------------
// Name:    "prmax.lists.exclusions.emailview
// Author:  Chris Hoy
// Purpose:
// Created: 10/12/2014
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.lists.exclusions.emailview");

dojo.declare("prmax.lists.exclusions.emailview", [ttl.BaseWidget], {
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.lists.exclusions","templates/emailview.html"),
	constructor:function()
	{
		this.model = new prcommon.data.QueryWriteStore (
			{ url:'/search/exclude/email_list',
				oncallback: false,
				onError:ttl.utilities.globalerrorchecker
		});
		this._delete_call_back = dojo.hitch(this, this._delete_call);
	},
	postCreate:function()
	{
		this.grid.set("structure",this.view );
		this.grid._setStore ( this.model ) ;
		this.grid.onCellClick = dojo.hitch(this,this._on_cell_click);
		this.inherited(arguments);
	},
	view:{
		cells: [[
			{name: 'Email',width: "200px",field:"email"},
			{name: ' ',width: "15px",styles: 'text-align: center;', width: "20px",formatter:ttl.utilities.deleteRowCtrl}
			]]
	},
	_delete_call:function(response)
	{
		if (response.success == "OK")
		{
			this.model.deleteItem(this._row);
		}
	},
	_on_cell_click:function(e)
	{
		this._row = this.grid.getItem(e.rowIndex);
		if ( e.cellIndex == 1)
		{
			if ( confirm("Remove Exclusion?"))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._DeleteCallBack,
						url:'/search/exclude/email_exclusion_delete',
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
	}
});
