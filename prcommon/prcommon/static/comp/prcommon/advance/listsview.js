//-----------------------------------------------------------------------------
// Name:    prmax.advance.listsview
// Author:  Chris Hoy
// Purpose:	view and maintain advance lists
// Created: 16/02/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prcommon.advance.listsview");

dojo.require("prcommon.advance.newlist");
dojo.require("prcommon.advance.renamelist");

dojo.declare("prcommon.advance.listsview", [ttl.BaseWidget], {
	widgetsInTemplate: true,
	display:"Feature",
	templatePath: dojo.moduleUrl( "prcommon.advance","templates/listsview.html"),
	constructor: function() {
		this.layoutListList=[ this.view1];
		this.advancefeatureslistid = -1;
		this.onLoadListCall = dojo.hitch(this,this.onLoadDisplayCtrl);
		this.onOpenListCallBack = dojo.hitch(this,this.onOpenListCall);
		this._DetailsCallBack = dojo.hitch(this,this.ListDetailsCallBack);
		this._OnAddListCallBack = dojo.hitch(this,this._AddListCall);
		this._styleCallBack = dojo.hitch(this,this._StyleCallBackFunc);
		this._OnEnableToolbarCallBack = dojo.hitch(this,this._SelectionChanged);
		this._OnDeleteListsCallBack = dojo.hitch(this,this._OnDeleteListsCall);
		this._getModelItemCall = dojo.hitch(this,this._getModelItem);

		// event handling
		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._CloseEvent));
		dojo.subscribe(PRCOMMON.Events.Feature_List_Add, dojo.hitch(this,this._AddEvent));
		dojo.subscribe(PRCOMMON.Events.Feature_List_Update, dojo.hitch(this,this._UpdateEvent));
		dojo.subscribe(PRCOMMON.Events.Feature_List_Delete, dojo.hitch(this,this._DeleteEvent));

		this._store_loaded = false ;

	},
	postCreate:function()
	{
		this.modelList= new prcommon.data.QueryWriteStore (
			{url:'/advance/lists',
				tableid:6,
				oncallback: dojo.hitch(this,this._SelectionChanged),
				onError:ttl.utilities.globalerrorchecker
		});

		this.listGrid.set("structure",this.layoutListList );
		this.listGrid._setStore ( this.modelList ) ;

		this.baseonCellClick = this.listGrid.onCellClick;
		this.listGrid.onCellClick = dojo.hitch(this,this.onCellClick);
		this.listGrid.onCellDblClick = dojo.hitch(this,this._OnRowDblClick);

		this._newlist_callback = dojo.hitch(this,this._newlistcall);

		this._EnableToolbar();

		if (PRMAX.utils.settings.productid==PRCOMMON.Constants.PRMAX_Pro)
		{
			dojo.removeClass(this.svl_reports_full.domNode,"prmaxhidden");
			dojo.removeClass(this.menu_filter.domNode,"prmaxhidden");
		}

		dojo.attr(this.displayNode, "innerHTML" , this.display ) ;

		this.inherited(arguments);
	},
	_AddExistingToList:function()
	{
		this.svl_list_proj_dlg_form.submit();
	},
	_EnableToolbar:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._OnEnableToolbarCallBack,
				url:"/advance/listmaintcount"}));

	},
	onCellClick : function(e) {
		if ( e.cellIndex >0 ) {
			this.onSelectRow(e);
		}
		else if (e.cellIndex == 0 )
		{
			var row = this.listGrid.getItem(e.rowIndex);
			this.modelList.setValue(  row, "selected" , !row.i.selected, true );
		}
		else
		{
			this.baseonCellClick(e);
		}
	},
	_OnRowDblClick:function(e)
	{

		this._row = this.listGrid.getItem(e.rowIndex);
		this.advancefeatureslistid = this._row.i.advancefeatureslistid;
		this.loadListDetails(this.advancefeatureslistid);
		this._OpenLists(1,[this.advancefeatureslistid,0])
	},
	_getModelItemProject:function()
	{
		this.projectid = arguments[0].i.projectid;
	},
	_DeleteSingle:function()
	{
		if (confirm("Delete List (" + this.svl_name_field.innerHTML+")?"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._OnDeleteListsCallBack,
					url:"/advance/deletelist",
					content:{advancefeatureslistid:this.advancefeatureslistid}}));
		}
	},
	_Delete:function()
	{
		if (confirm("Delete Selected Lists"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._OnDeleteListsCallBack,
					url:"/advance/deleteselection"}));
		}
	},
	_OnDeleteListsCall:function(response)
	{
		if (response.success=="OK")
		{
			var lists = [this.advancefeatureslistid];

			if (response.lists != null )
				lists = response.lists;

			this._EnableToolBarCall( false);
			dojo.publish(PRCOMMON.Events.Feature_List_Delete, [lists]);
			this.advancefeatureslistid = -1;
			this._ShowHideDetails();
			this.listGrid.selection.clear();
		}
		else
		{
			alert("Problem");
		}
	},
	onOpenListCall:function(response)
	{
		console.log("onOpenListCall",response);
		dojo.publish(PRCOMMON.Events.Advance_Session_Changed, [ response.data] );
		dijit.byId("std_banner_control").ShowResultList("advance_view", "advancefeatureslistid=" + response.data.listid);
	},
	_OpenSingle:function()
	{
		this._OpenLists(1,[this.advancefeatureslistid,0]);
	},
	_Open:function()
	{
		this._OpenLists(1,[-1,-1]);
	},
	_OpenLists:function(overwrite,lists)
	{
		var content = {
			overwrite:overwrite,
			lists:dojo.toJson(lists),
			selected:-1 } ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this.onOpenListCallBack,
				url:'/advance/open',
				content: content }));
	},
	// List options
	_Rename:function()
	{
		this.adv_rename_ctrl.Load ( this._row.i.advancefeatureslistid ) ;
		this.adv_rename_dlg.set("title","Rename List - " + this._row.i.advancefeatureslistdescription ) ;
		this.adv_rename_dlg.show();

	},
	_New:function()
	{
		this.svl_list_new_ctrl.Load();
		this.svl_list_new_dlg.show();
	},
	refresh:function()
	{
		this.advancefeatureslistid = -1;
		this._EnableSingleListControls(false);
		this.listGrid.selection.clear();
		this._ShowHideDetails();
		this.listGrid.showMessage(this.listGrid.loadingMessage);
		var params = ttl.utilities.getPreventCache();
		this.listGrid.setQuery(params);
		this._EnableToolbar();
	},
	view1:{
		cells: [[
			{name: ' ',width: "15px",styles: 'text-align: center;', width: "20px",field:'selected',formatter:ttl.utilities.formatButtonCell},
			{name: 'Name',width: "auto",field:"advancefeatureslistdescription"},
			{name: 'Qty',width: "50px",field:"qty"}
			]]
	},
	loadListDetails:function(advancefeatureslistid)
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._DetailsCallBack,
				url:'/advance/info',
				content: {advancefeatureslistid:advancefeatureslistid}
		}));
	},
	_EnableSingleListControls:function(enable)
	{
		var enabled = enable?false:true;

		this.svl_list_rename.set('disabled',enabled);
		this.svl_list_delete.set('disabled',enabled);
		this.svl_list_open.set('disabled',enabled);

	},
	ListDetailsCallBack:function(response)
	{
		this._ShowHideDetails();
		this._EnableSingleListControls(true);
		this._ListDisplayBasicDetails(response.data);

	},
	_ListDisplayBasicDetails:function(data)
	{
		this._EnableSingleListControls(true);
		dojo.attr(this.svl_name_field, "innerHTML", data.advance.advancefeatureslistdescription ) ;
		dojo.attr(this.svl_count_field, "innerHTML", (data.qty)? data.qty.toString():"0" );
	},
	onSelectRow : function(e)
	{
		this._row = this.listGrid.getItem(e.rowIndex);
		this.advancefeatureslistid = this._row.i.advancefeatureslistid;
		this.loadListDetails(this.advancefeatureslistid);
		this.listGrid.selection.clickSelectEvent(e);
	},
	// handle the grid sytles for the rows
	onStyleRow: function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
	},
	_StyleCallBackFunc:function( rowData)
	{
		return (rowData.i.advancefeatureslistid== thisadvancefeatureslistid)?true:false;
	},
	_EnableToolBarCall:function( enabled)
	{
		var enable = enabled? false:true;

		this.svl_delete.set("disabled",enable);
		this.svl_open.set("disabled",enable);
	},
	_ShowHideDetails:function()
	{
		var display = this.advancefeatureslistid==-1?"none":"block";

		console.log(display);
		console.log(this.list_info_pane.style);
		this.list_info_pane.domNode.style.display=display;
	},
	_SelectionChanged:function(response)
	{
		console.log(response);
		this._EnableToolBarCall( response.data.selected>0?true:false);
		console.log("_SelectionChanged");
	},
	resize:function()
	{
		console.log ("resize");
		this.borderCtrl.resize( arguments[0] ) ;
	},
	_getModelItem:function()
	{
		console.log("_getModelItem",arguments);
		if ( arguments[0].i.i !=null )
			this.tmp_row = arguments[0].i;
		else
			this.tmp_row = arguments[0];
	},
	_CloseEvent:function()
	{
		this.svl_list_new_dlg.hide();
		this.adv_rename_dlg.hide();
	},
	_AddEvent:function( data )
	{
		this.modelList.newItem( data );
	},
	_UpdateEvent:function( data )
	{
		this.tmp_row = null;
		var item  = {identity:data.advancefeatureslistid,
				onItem: this._getModelItemCall};
		this.modelList.fetchItemByIdentity(item);
		if (this.tmp_row)
		{
			this.modelList.SetNoCallBackMode(true);
			this.modelList.setValue(  this.tmp_row, "advancefeatureslistdescription" , data.advancefeatureslistdescription, true );
			this.modelList.SetNoCallBackMode(false);
		}
		dojo.attr(this.svl_name_field, "innerHTML", data.advancefeatureslistdescription ) ;
	},
	_DeleteEvent:function( lists )
	{
		for ( var key in lists)
		{
			this.tmp_row = null;
			var item  = {identity:lists[key],
					onItem: this._getModelItemCall};

			this.modelList.fetchItemByIdentity(item);
			if (this.tmp_row )
				this.modelList.deleteItem( this.tmp_row );
		}
	}
});


