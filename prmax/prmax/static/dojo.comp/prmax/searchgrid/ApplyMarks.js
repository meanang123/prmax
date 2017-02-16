//-----------------------------------------------------------------------------
// Name:    prmax.searchgrid.ApplyMarks
// Author:  Chris Hoy
// Purpose:
// Created: 07/01/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.searchgrid.ApplyMarks");

dojo.declare("prmax.searchgrid.ApplyMarks",
	[ttl.BaseWidget],{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.searchgrid","templates/ApplyMarks.html"),
	constructor: function()
	{
		this._MarkedCallBack = dojo.hitch(this, this._MarkedCall);
		this._close_dlg = null;
	},
	_MarkedCall:function( response )
	{
		if ( response.success == "OK" )
		{
			dojo.publish(PRCOMMON.Events.SearchSession_Changed, [ response.data] );
			this._Close();
		}
		else
		{
			alert("Problem Marking Group");
			this.okbtn.cancel();
		}
	},
	_Mark:function()
	{
		if ( confirm("Clear All Existing Marks & mark this group" ) )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: dojo.hitch(this,this._MarkedCallBack),
					url:'/search/sessionmarkgroup',
					content:this.form.getValues()
			}));
		}
		else
		{
			this.okbtn.cancel();
		}
	},
	_Close:function()
	{
		this.okbtn.cancel();
		this._close_dlg.hide();
	},
	_setClosedlgAttr:function( value )
	{
		this._close_dlg = value;
	}
});