//-----------------------------------------------------------------------------
// Name:    AdvanceView.js
// Author:  Chris Hoy
// Purpose:
// Created: 04/10/2010
//
// To do:
//-----------------------------------------------------------------------------

dojo.provide("prmax.dataadmin.outlets.AdvanceView");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.advance.advance");
dojo.require("prmax.dataadmin.advance.researchadvance");
dojo.require("prmax.dataadmin.advance.AdvanceDelete");
dojo.require("prmax.dataadmin.advance.AdvanceDuplicate");

dojo.declare("prmax.dataadmin.outlets.AdvanceView",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.dataadmin.outlets","templates/AdvanceView.html"),
	constructor: function()
	{
		this.advance_feature_model = new prcommon.data.QueryWriteStore (
			{	url:"/advance/listoutlet?showall=1",
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
			});
		this._outletid = -1;

		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));
		dojo.subscribe(PRCOMMON.Events.Feature_Added, dojo.hitch(this,this._AdvanceAddEvent));
		dojo.subscribe(PRCOMMON.Events.Feature_Deleted, dojo.hitch(this,this._AdvanceDeleteEvent));
		dojo.subscribe(PRCOMMON.Events.Feature_Update, dojo.hitch(this,this._AdvanceUpdateEvent));

		this._getModelItemCall = dojo.hitch(this,this._getModelItem);

	},
	postCreate:function()
	{
		this.outlet_advance_grid.set("structure",this.View);
		this.outlet_advance_grid._setStore(this.advance_feature_model);
		this.outlet_advance_grid['onCellClick'] = dojo.hitch(this,this._onCellClick);

		this.newfeature.newmode();

		this.inherited(arguments);
	},
	_getModelItem:function()
	{
		if ( arguments[0].i.i !=null )
			this.tmp_row = arguments[0].i;
		else
			this.tmp_row = arguments[0];
	},
	_onCellClick:function(e)
	{
		var row=this.outlet_advance_grid.getItem(e.rowIndex);

		if ( e.cellIndex == 0 || e.cellIndex == 1 || e.cellIndex == 2)
		{
			this.viewfeature.Load ( row.i.advancefeatureid , this._outletid ) ;
		}
		if ( e.cellIndex == 3 )
		{
			this.advance_delete_ctrl.Load ( row.i.advancefeatureid, row.i.feature );
			this.advance_delete_dlg.show();
		}
		if ( e.cellIndex == 4 )
		{
			this.advance_duplicate_ctrl.Load ( row.i.advancefeatureid, row.i.feature );
			this.advance_duplicate_dlg.show();
		}
	},
	View:{
		cells: [[
			{name: 'Description',width: "200px",field:"feature"},
			{name: 'Publication Date',width: "200px",field:"pub_date_display"},
			{name: " ",width: "15px",field:"",formatter:ttl.utilities.formatRowCtrl},
			{name: ' ',width: "20px",field:"", formatter:ttl.utilities.deleteRowCtrl},
			{name: " ",width: "15px",field:"",formatter:ttl.utilities.formatCopyCtrl}
		]]
	},
	resize:function()
	{
		this.frame.resize(arguments[0]);
		this.inherited(arguments);
	},
	Load:function( outletid )
	{
		this._outletid = outletid;
		this.viewfeature.Load(-1, outletid ) ;
		this.newfeature.Load(-1, outletid ) ;
		this.researchadvance.Load ( outletid ) ;
		this.outlet_advance_grid.setQuery(ttl.utilities.getPreventCache({outletid:this._outletid}));
	},
	_DialogCloseEvent:function(  source )
	{
		if ( source == "feature_del" )
			this.advance_delete_dlg.hide();
		if ( source == "feature_dup" )
			this.advance_duplicate_dlg.hide();
	},
	_AdvanceAddEvent:function ( newdata)
	{
		this.advance_feature_model.newItem ( newdata.advance ) ;
	},
	_AdvanceDeleteEvent:function( deleteData )
	{
		this.tmp_row = null;
		var item  = {identity:deleteData.advancefeatureid,
					onItem:  this._getModelItemCall};
			this.advance_feature_model.fetchItemByIdentity(item);
			if (this.tmp_row)
				this.advance_feature_model.deleteItem(this.tmp_row);
	},
	_AdvanceUpdateEvent:function ( advdata )
	{
		this.tmp_row = null;
		var item  = {identity:advdata.advance.advancefeatureid,
					onItem:  this._getModelItemCall};
			this.advance_feature_model.fetchItemByIdentity(item);
			if (this.tmp_row)
			{
				this.advance_feature_model.setValue(  this.tmp_row, "feature" , advdata.advance.feature, true );
				this.advance_feature_model.setValue(  this.tmp_row, "pub_date_display" , advdata.advance.pub_date_display, true );
			}
	}
});
