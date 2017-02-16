dojo.provide("prmax.iadmin.support.seo.Complaints");

dojo.declare("prmax.iadmin.support.seo.Complaints",
	[ttl.BaseWidget],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.iadmin.support.seo","templates/Complaints.html"),
	constructor: function()
	{
		this.seo_model = new prcommon.data.QueryWriteStore(
			{	url:'/iadmin/seo/complaints_list',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
		});	},
	postCreate:function()
	{
		this.grid.set("structure",this.view );
		this.grid._setStore ( this.seo_model ) ;
		this.grid["onCellClick"] = dojo.hitch ( this, this._OnCellClick2);
		thi
		this.inherited(arguments);
	},
	_OnCellClick2:function ( e )
	{
		this.grid.selection.clickSelectEvent(e);
		this._row2 = this.grid.getItem(e.rowIndex);

	},
	view:{
		cells: [[
			{name: 'Seo Name',width: "auto", field:"headline"}
			]]
	},
	resize:function()
	{
		this.borderControl.resize( arguments[0] );
	}
});