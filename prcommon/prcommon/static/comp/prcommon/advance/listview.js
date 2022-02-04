//-----------------------------------------------------------------------------
// Name:    prcommon.advance.listview
// Author:  Chris Hoy
// Purpose:	View the advance features for a specific outlet
// Created: 21/11/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.advance.listview");

dojo.declare("prcommon.advance.listview",
	[ ttl.BaseWidget],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.advance","templates/listview.html"),
	constructor: function()
	{
		this.model = new prcommon.data.QueryWriteStore(
			{	url:'/advance/listoutlet',
				nocallback: false,
				onError:ttl.utilities.globalerrorchecker
			});

		this._LoadAdvanceCallBack = dojo.hitch ( this , this._LoadAdvanceCall);
	},
	postCreate:function()
	{
		this.grid.set("structure",this.view );
		this.grid._setStore ( this.model ) ;

		this.grid["onRowClick"] = dojo.hitch(this, this._OnSelectRow ) ;
		this.grid["onCellClick"] = dojo.hitch(this, this._OnSelectRow ) ;
		this.grid['onStyleRow'] = dojo.hitch(this,ttl.GridHelpers.onStyleRow);

		this.inherited(arguments);
	},
	Load:function ( outletid , advancefeatureid )
	{
		this.grid.setQuery(ttl.utilities.getPreventCache({ outletid : outletid}));

		if ( advancefeatureid  && advancefeatureid != -1 )
		{
			this.LoadAdvance ( advancefeatureid ) ;
		}
		else
		{
			dojo.addClass(this.innerframe,"prmaxhidden");
		}
	},
	_OnSelectRow : function(e)
	{
		var rowData = this.grid.getItem(e.rowIndex);
		this.grid.selection.clickSelectEvent(e);
		this.LoadAdvance( rowData.i.advancefeatureid ) ;
	},

	_LoadAdvanceCall:function( response )
	{
		if ( response.success == "OK" )
		{
			var contactdisplay = '';
			var editorialdisplay = '';
			var coverdisplay = '';
			var publicationdisplay = '';
			dojo.attr(this.feature, "innerHTML" , response.data.advance.feature );
//			dojo.attr(this.editorial_date, "innerHTML" , response.data.advance.editorial_date_display);
//			dojo.attr(this.cover_date, "innerHTML" , response.data.advance.cover_date_display);
//			dojo.attr(this.publicationdate, "innerHTML" , response.data.advance.pub_date_display);
			if (response.data.advance.editorial_date_display)
			{
				editorialdisplay = 'Editorial Deadline ' + response.data.advance.editorial_date_display;
				dojo.attr(this.editorialdisplay,"innerHTML", editorialdisplay);
			};
			if (response.data.advance.cover_date_display)
			{
				coverdisplay = 'Cover Date ' + response.data.advance.cover_date_display;
				dojo.attr(this.coverdisplay,"innerHTML", coverdisplay);
			};
			if (response.data.advance.contactname)
			{
				contactdisplay = 'Contact ' + response.data.advance.contactname + ' ' + response.data.advance.contactemail;
				dojo.attr(this.contactdisplay,"innerHTML", contactdisplay);
			};
			if (response.data.advance.pub_date_display)
			{
				publicationdisplay = 'Puiblication Date ' + response.data.advance.pub_date_display;
				dojo.attr(this.publicationdisplay,"innerHTML", publicationdisplay);
			};
			
			
//			dojo.attr(this.interests, "innerHTML" , response.data.interests_text );
//			dojo.attr(this.featuredescription,"innerHTML", response.data.advance.featuredescription);
			dojo.removeClass(this.innerframe,"prmaxhidden");
		}
		else
		{
			alert("Load Features Problem" ) ;
		}
	},
	ShowFeature:function ( advancefeatureid )
	{
		this.LoadAdvance ( advancefeatureid );
	},
	LoadAdvance:function ( advancefeatureid )
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadAdvanceCallBack,
			url:"/advance/get_ext",
			content:{advancefeatureid : advancefeatureid }
		}));
	},
	view:{
		cells: [[
			{name: 'Publication Date',width: "220px",field:"pub_date_display"},
			{name: 'Feature',width: "auto",field:"feature"}
			]]
	},
	resize:function()
	{
		this.frame.resize ( arguments[0] ) ;

		this.inherited(arguments);

	}
});





