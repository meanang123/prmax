dojo.provide("prmax.iadmin.support.seo.view");

dojo.require("prmax.pressrelease.seo.edit");

dojo.declare("prmax.iadmin.support.seo.view",
	[ttl.BaseWidget],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.iadmin.support.seo","templates/view.html"),
	constructor: function()
	{
		this.seo_model = new prcommon.data.QueryWriteStore(
			{	url:'/iadmin/seo/seo_list',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
		});
		this._DeleteCallBack = dojo.hitch(this, this._DeleteCall);
		this._WithdrawCallBack = dojo.hitch(this, this._WithdrawCall);
		this._PublishCallBack = dojo.hitch(this, this._PublishCall);
		this._seostatus_data = new dojo.data.ItemFileReadStore({ url:"/common/lookups?searchtype=seostatus&nofilter="} );
		this._icustomerid_data = new dojox.data.QueryReadStore ( {url:'/iadmin/customers_combo', onError:ttl.utilities.globalerrorchecker, clearOnClose:true, urlPreventCache:true});

	},
	postCreate:function()
	{
		this.grid.set("structure",this.view );
		this.grid._setStore ( this.seo_model ) ;
		this.grid["onCellClick"] = dojo.hitch ( this, this._OnCellClick2);
		this.filter_seostatusid.set("store", this._seostatus_data);
		this.filter_seostatusid.set("value", -1 );
		this.filter_icustomerid.set("store",  this._icustomerid_data);
		this.filter_icustomerid.set("value", -2 );

		this.inherited(arguments);
	},
	_OnCellClick2:function ( e )
	{
		this.grid.selection.clickSelectEvent(e);
		this._row2 = this.grid.getItem(e.rowIndex);

		this.seo_edit_ctrl.LoadSeo(this._row2.i.seoreleaseid ) ;
		this.seopanel.selectChild (this.seopanel_edit );

		if ( this._row2.i.seostatusid == 3 || this._row2.i.seostatusid == 4)
		{
			dojo.removeClass(this.publishbtn.domNode,"prmaxhidden");
			dojo.addClass(this.withdrawbtn.domNode,"prmaxhidden");
		}
		else
		{
			dojo.addClass(this.publishbtn.domNode,"prmaxhidden");
			dojo.removeClass(this.withdrawbtn.domNode,"prmaxhidden");
		}
	},
	view:{
		cells: [[
			{name: 'C Id',width: "60px", field:"customerid"},
			{name: 'Customer',width: "120px", field:"customername"},
			{name: 'Seo Name',width: "auto", field:"headline"},
			{name: 'Status',width: "150px", field:"seostatusdescription"},
			{name: 'Published',width: "100px", field:"published_display"}
			]]
	},

	resize:function()
	{
		this.borderControl.resize( arguments[0] );
	},
	_Refresh:function()
	{
		this.grid.setQuery({});
	},
	_ClearFilter:function()
	{
		this.filter_headline.set("value", "");
		this.filter_seostatusid.set("value", "-1");
		this.filter_icustomerid.set("value", "-2" );

		this.grid.setQuery({});
		this.seopanel.selectChild (this.seopanel_blank );

	},
	_ExecuteFilter:function()
	{
		var query_command = {};

		if ( arguments[0].seostatusid != "-2")
			query_command["seostatusid"] = arguments[0].seostatusid;

		if ( arguments[0].headline )
			query_command["headline"] = arguments[0].headline;

		if ( arguments[0].icustomerid && arguments[0].icustomerid != -1)
			query_command["icustomerid"] = arguments[0].icustomerid;


		this.grid.setQuery(query_command);
	},
	_DeleteCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.seopanel.selectChild (this.seopanel_blank );
			this.seo_model.deleteItem( this._row2 );
			dojo.removeClass(this.publishbtn.domNode,"prmaxhidden");
			dojo.addClass(this.withdrawbtn.domNode,"prmaxhidden");
		}
	},
	_Delete:function()
	{
		if ( confirm("Delete SEO"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._DeleteCallBack,
					url: "/iadmin/seo/seo_delete" ,
					content: {seoreleaseid:this._row2.i.seoreleaseid}
			}));
		}
	},
	_WithdrawCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.seopanel.selectChild (this.seopanel_blank );
			this.seo_model.setValue(  this._row2, "seostatusdescription" , 'PRmax Withdrawn', true );
			dojo.removeClass(this.publishbtn.domNode,"prmaxhidden");
			dojo.addClass(this.withdrawbtn.domNode,"prmaxhidden");
		}
	},
	_Withdraw:function()
	{
		if ( confirm("Withdraw SEO"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._WithdrawCallBack,
					url: "/iadmin/seo/seo_withdraw" ,
					content: {seoreleaseid:this._row2.i.seoreleaseid}
			}));
		}
	},
	_Update:function()
	{

	},
	_Publish:function()
	{

	}
});