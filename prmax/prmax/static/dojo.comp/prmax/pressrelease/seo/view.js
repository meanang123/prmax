//-----------------------------------------------------------------------------
// Name:    view.js
// Author:  Chris Hoy
// Purpose:
// Created: 16/10/2011
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.pressrelease.seo.view");

dojo.require("prmax.pressrelease.seo.add");
dojo.require("prmax.pressrelease.seo.edit");

dojo.declare("prmax.pressrelease.seo.view",
	[ ttl.BaseWidget ],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease.seo","templates/view.html"),
	isinternal: false,
	constructor: function()
	{
		this.seo_model = new prcommon.data.QueryWriteStore(
			{	url:'/emails/seorelease/list',
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
		});
		this._DeleteCallBack = dojo.hitch(this, this._DeleteCall);
		this._WithdrawCallBack = dojo.hitch(this, this._WithdrawCall);
		this._PublishCallBack = dojo.hitch(this, this._PublishCall);
		this._CallBack = dojo.hitch(this, this._Call_Back);
		this._seostatus_data = new dojo.data.ItemFileReadStore({ url:"/common/lookups?searchtype=seostatus&nofilter="} );
	},
	postCreate:function()
	{
		this.grid.set("structure",this.view );
		this.grid._setStore ( this.seo_model ) ;
		this.grid["onCellClick"] = dojo.hitch ( this, this._OnCellClick2);
		this.filter_seostatusid.set("store", this._seostatus_data);
		this.filter_seostatusid.set("value", -1 );
		this.seo_add_ctrl.Load( dojo.hitch(this, this._seo_added));

		this.inherited(arguments);
	},
	_seo_added:function( data )
	{

		this.seo_model.newItem ( data ) ;
		this.seopanel.selectChild (this.seopanel_blank );
	},
	view:{
		cells: [[
			{name: 'Seo Name',width: "auto", field:"headline"},
			{name: 'Client',width: "120px", field:"clientname"},
			{name: 'Status',width: "70px", field:"seostatusdescription"},
			{name: 'Published',width: "80px", field:"published_display"},
			{name: 'Views',width: "30px", field:"viewed"}
			]]
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	},
	_Add:function()
	{
		this.seo_add_ctrl.Clear();
		this.seopanel.selectChild (this.seo_add_ctrl );
	},
	_ExecuteFilter:function()
	{
		var query = {};
		if ( arguments[0].headline.length > 0 )
			query["headline"] = arguments[0].headline;

		if ( arguments[0].seostatusid != "-1" )
			query["seostatusid"] = arguments[0].seostatusid;

		this.grid.setQuery(ttl.utilities.getPreventCache( query ));
	},
	_ClearFilter:function()
	{
		this.filter_headline.set("value","");
		this.filter_seostatusid.set("value",-1);

		this.grid.setQuery(ttl.utilities.getPreventCache( {} ));
	},
	_DeleteCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.seopanel.selectChild (this.seopanel_blank );
			this.seo_model.deleteItem ( this._row2 );
		}
		else
		{
			alert("Problem deleting SEO " + PRMAX.utils.settings.distribution_description);
		}
	},
	_Delete:function()
	{
		if ( confirm("Delete the Seo " +PRMAX.utils.settings.distribution_description));
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._DeleteCallBack,
					url: "/emails/seorelease/delete" ,
					content: {seoreleaseid:this._row2.i.seoreleaseid}
			}));
		}
	},
	_WithdrawCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.seopanel.selectChild (this.seopanel_blank );
			this.seo_model.setValue(  this._row2, "seostatusdescription" , 'Customer Withdrawn', true );
			this.seo_model.setValue(  this._row2, "seostatusid" , 3, true );
			dojo.removeClass(this.publishbtn.domNode,"prmaxhidden");
			dojo.addClass(this.withdrawbtn.domNode,"prmaxhidden");
			alert("SEO Withdrawn");
		}
	},
	_Withdraw:function()
	{
		if ( confirm("Withdraw SEO"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._WithdrawCallBack,
					url: "/emails/seorelease/withdraw" ,
					content: {seoreleaseid:this._row2.i.seoreleaseid}
			}));
		}
	},
	_Update:function()
	{
		this.seo_edit_ctrl.Save();
	},
	_Call_Back:function( data )
	{
		this.seo_model.setValue(  this._row2, "headline" , data.headline , true );
	},
	_OnCellClick2:function ( e )
	{
		this.grid.selection.clickSelectEvent(e);
		this._row2 = this.grid.getItem(e.rowIndex);
		this.EnableControl();

		this.seo_edit_ctrl.LoadSeo(this._row2.i.seoreleaseid, this._CallBack ) ;
		this.seopanel.selectChild (this.seopanel_edit );
	},
	EnableControl:function()
	{
		if ( this._row2.i.seostatusid == 3 ||
				( this._row2.i.seostatusid == 4 && this.isinternal ))
		{
			dojo.removeClass(this.publishbtn.domNode,"prmaxhidden");
			dojo.addClass(this.withdrawbtn.domNode,"prmaxhidden");
		}
		else
		{
			if (this._row2.i.seostatusid == 2 )
			{
				dojo.removeClass(this.withdrawbtn.domNode,"prmaxhidden");
				dojo.addClass(this.publishbtn.domNode,"prmaxhidden");
			}
			else
			{
				dojo.addClass(this.withdrawbtn.domNode,"prmaxhidden");
				dojo.removeClass(this.publishbtn.domNode,"prmaxhidden");
			}
		}
	},
	_PublishCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			dojo.addClass(this.publishbtn.domNode,"prmaxhidden");
			dojo.removeClass(this.withdrawbtn.domNode,"prmaxhidden");
			this.seo_model.setValue(  this._row2, "seostatusdescription" , 'Live', true );
			this.seo_model.setValue(  this._row2, "seostatusid" , 2, true );
			this.seo_model.setValue(  this._row2, "published_display" , response.data.published_display, true );
			this.EnableControl();
			alert("Published");
		}
	},
	_Publish:function()
	{
		// Problem is it need to update as well
		// 1 need to verify
		// need then too pass details as well to do an update
		if ( this.seo_edit_ctrl.isValid() == false)
			return;

		if ( confirm("Publish SEO"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._PublishCallBack,
					url: "/emails/seorelease/republish" ,
					content: this.seo_edit_ctrl.seoform({})
			}));
		}
	},
	refresh:function()
	{
		this._ClearFilter();
	}
});
