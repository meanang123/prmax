//-----------------------------------------------------------------------------
// Name:    prcommon.advance.stdview
// Author:  Chris Hoy
// Purpose:	to search and show results for advance features
// Created: 30/10/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.advance.stdview");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.advance.saveas");
dojo.require("prcommon.advance.DeleteFromList");
dojo.require("prcommon.advance.SaveToStanding");
dojo.require("prcommon.advance.ResultsToLists");
dojo.require("prcommon.advance.Output");

dojo.declare("prcommon.advance.stdview",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	advancefeatureslistid:-1,
	templatePath: dojo.moduleUrl( "prcommon.advance","templates/stdview.html"),
	constructor: function()
	{
		try
		{
			this.ctrldisplay = new PRMAX.DisplayObject();
		}
		catch(e)
		{
			alert("missing 3");

			this.ctrldisplay = new Object();
		}
		this._sortorder = 0 ;
		this._listid = -1;
		this._listname = "";
		this._resultview = false;
		this._count = new PRMAX.SearchGridCount();
		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._DialogCloseEvent));
		dojo.subscribe(PRCOMMON.Events.Advance_Session_Changed, dojo.hitch(this,this._AdvanceChangedEvent));
		this._unsaved_class = "advance_unsaved_row";
		this._list_class = "advance_list_row";
		this._unsaved_results_class = "advance_unsaved_results_row";
		this._class_list = [this._unsaved_class, this._list_class, this._unsaved_results_class ];
		this._line_class = this._unsaved_class;
	},
	postCreate:function()
	{
		this.model = new prcommon.data.QueryWriteStore (
		{	url:'/advance/viewpage',
			tableid:5,
			oncallback: dojo.hitch(this,this._SelectionChanged),
			onError:ttl.utilities.globalerrorchecker,
			oncallbackparams: dojo.hitch(this,this._getContext)
		});

		this._listid = this.advancefeatureslistid;
		this.ctrldisplay.listid = this._listid;
		this.grid.set("structure",this.view );
		this.grid._setStore ( this.model ) ;
		this._UpdateCountCall = dojo.hitch(this, this._UpdateCount ) ;
		this.grid._setQuery(	ttl.utilities.getPreventCache({sortorder:this._sortorder,
						advancefeatureslistid: this.advancefeatureslistid}));

		this.grid['onStyleRow'] = dojo.hitch(this,this._OnStyleRow);
		this.grid['onRowClick'] = dojo.hitch(this,this._OnSelectRow);
		this.grid['onCellClick'] = dojo.hitch(this,this._OnCellClick);

		this.UpdateCount()

		this.inherited(arguments);
	},
	_getContext:function()
	{
		return { advancefeatureslistid: ( this._listid != -1 && this.ctrldisplay.listid == -1 ) ? -1 : this._listid };
	},
		// Current selection chnaged need to update totals data
	_SelectionChanged:function(response)
	{
		this._count.Set( response.data ) ;
		this.countinfo.set("value", this._count ) ;
	},
	_OnCellClick:function( e )
	{
		// user click on a general display row
		if ( e.cellIndex == 0 || e.cellIndex>1 )
		{
			this._OnSelectRow(e);
		}
		// user click on the selection row
		else if ( e.cellIndex == 1 )
		{
			var row=this.grid.getItem(e.rowIndex);
			this.model.setValue(  row, "selected" , !row.i.selected, true );
		}
		else
		{
			this.inherited(arguments);
		}
	},
	_OnSelectRow : function(e)
	{
		var row=this.grid.getItem(e.rowIndex);
		this.ctrldisplay.Set(row.i);
		dojo.publish(PRCOMMON.Events.Display_Load , [this.ctrldisplay,"advance"] );
		this.grid.selection.clickSelectEvent(e);
	},
	_OnStyleRow:function(inRow)
	{
		// std grid setting
		if (inRow.selected)
		{
			inRow.customClasses += " prmaxSelectedRow";
			return;
		}
			if (inRow.odd)  inRow.customClasses += (" " + this._line_class);
			if (inRow.over)  inRow.customClasses += " dojoxGridRowOver";
	},
	view:{
		cells: [[
			{name: ' ',width: "6px",styles: 'text-align: center;', width: "6px",field:'prmax_outletgroupid',formatter:ttl.utilities.outletType},
			{name: ' ',width: "15px",styles: 'text-align: center;', width: "20px",field:'selected',formatter:ttl.utilities.formatButtonCell},
			{name: 'Outlet Name',width: "200px",field:"outletname"},
			{name: 'Publication Date',width: "150px",field:"pub_date_display"},
			{name: 'Feature',width: "auto",field:"feature"}
			]]
	},
	// Save to a bnew list or the existing list
	_Save:function()
	{
		if ( this._listid != -1 && this._resultview == true )
		{
			this.dlg_save_results_to_list.set("title", "Save Result to Existing List ("+ this._listname + ")");
			this.resultstolistctrl.Load ( this._listid , this._count.selected, this._listname ) ;
			this.dlg_save_results_to_list.show();
		}
		else
		{
			this.saveas.Load ( this._listid , this._count.selected ) ;
			this.dlg_saveas.show();
		}
	},
	_OutputPrint:function()
	{
		this.outputctrl.Load( this._listid , this._count.selected ) ;
		this.dlg_output.show();
	},
	_Delete:function()
	{
		this.deletectrl.Load( this._listid , this._count.selected ) ;
		this.dlg_delete.show();
	},
	_Save_Standing:function()
	{
		this.savetostandingctrl.Load( this._listid , this._count.selected, this.dlg_save_to_standing ) ;
		this.dlg_save_to_standing.show();
	},
	resize:function()
	{
		this.frame.resize ( arguments[0] );
		this.inherited(arguments);
	},
	_DialogCloseEvent:function(  source )
	{
		this.dlg_saveas.hide();
		this.dlg_save_to_standing.hide();
		this.dlg_save_results_to_list.hide();
		this.dlg_delete.hide();
		this.dlg_output.hide();
	},
	// Enable/disable thhe control bar
	enableControls:function()
	{
		var enabled = this._count.total?false:true;

		this.save.set("disabled",enabled);
		this.delete_option.set("disabled",enabled);

		if ( PRMAX.utils.settings.isdemo == false && PRMAX.utils.settings.isadvancedemo == false)
			this.output.set("disabled",enabled);

		if (this._listid  == -1 )
			dojo.addClass(this.search.domNode, "prmaxhidden");
		else
			dojo.removeClass(this.search.domNode, "prmaxhidden");

	},
	_UpdateCount:function ( response )
	{
		if (response.success == "OK" )
		{
			if ( this.advancefeatureslistid != -1 )
			{
				this._listname = response.data.listname;
				this.advancefeatureslistid = -1;
			}
			this.ctrldisplay.Set(response.data);
			dojo.publish(PRCOMMON.Events.Display_Load, [this.ctrldisplay,"advance"]);
			this._count.Set( response.data ) ;
			this.countinfo.set("value", this._count);
			this.enableControls();
			this._SetStyle();
		}
	},
	// Show Message and colours for different systems
	_SetStyle:function()
	{
		var message = "Unsaved Search Results";
		this._line_class = this._unsaved_class;

		if ( this._listid != -1 )
		{
			if ( this.ctrldisplay.listid == -1 )
			{
				message = "Search result for adding to List : " + this._listname ;
				this._line_class = this._unsaved_results_class;
				this._resultview = true ;
			}
			else
			{
				this._line_class = this._list_class;
				message = this._listname + " list";
			}
		}
		//dojo.style(this.list,"float", "right" );
		dojo.attr(this.list,"innerHTML" , message);

		for ( var key in this._class_list )
		{
			dojo.removeClass(this.list, this._class_list[key] ) ;
		}

		dojo.addClass(this.list, this._line_class ) ;

	},
	// get id of list we are looking at
	_GetListId:function()
	{
		var listid = -1;
		if ( this.ctrldisplay != -1 )
			listid = this.ctrldisplay.listid;

		return listid;
	},
	UpdateCount:function()
	{
			dojo.xhrPost(
			ttl.utilities.makeParams({
				load: dojo.hitch(this,this._UpdateCountCall),
				url:'/advance/count',
				content:{advancefeatureslistid:this._listid}
			}));
	},
	// This comes from search results
	Load:function ( data , advance_mode )
	{
		if ( advance_mode != null && advance_mode == 0 )
		{
			this._listid = -1 ;
		}
		this._resultview = false;
		this._Load ( data ) ;
	},
	_Load:function( data )
	{
		// set sort order but no refresh
		this.grid.sortInfo = 4;
		this.grid.selection.select(0);
		this.ctrldisplay.Set(data);
		this._count.Set( data ) ;
		this.countinfo.set("value", this._count);
		this._SetStyle();
		this.grid.setQuery(
					ttl.utilities.getPreventCache({sortorder:this._sortorder,
					advancefeatureslistid: this._GetListId()}));
		this.enableControls();
		dojo.publish(PRCOMMON.Events.Display_Load, [this.ctrldisplay,"advance"]);
	},
	// List has been loaded
	_AdvanceChangedEvent:function( data , mode , new_search , reset )
	{
		if (reset == true )
			this._resultview = false;

		if ( new_search == 0 )
		{
			this._listid = -1;
		}
		else
		{
			this._listid = data.listid;
			this._listname = data.listname ;
		}
		this._Load ( data ) ;
	},
	_Search_Append:function()
	{
		dijit.byId("std_banner_control").ShowSearchAdvance(1);
	},
	_Search_New:function()
	{
		dijit.byId("std_banner_control").ShowSearchAdvance(0);
	}
});





