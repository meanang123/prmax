//-----------------------------------------------------------------------------
// Name:    prcommon.messages.view
// Author:  Chris Hoy
// Purpose:
// Created: 28/05/2010
//
// To do:
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.messages.view");

dojo.require("ttl.BaseWidget");
dojo.require("prcommon.messages.message");
dojo.require("prcommon.messages.view_message");

function replyFormatter ( )
{
	if ( arguments[1] != null )
	{
		if ( arguments[1].i.touserid != null )
			return '<img height="10px" width="10px" class="prmaxdefault" src="/prcommon/images/rowctrl.gif"></img>';
	}
	else
		return "...";
}

dojo.declare("ttl.BaseWidget",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.messages","templates/view.html"),
	constructor: function()
	{
		this.filter_db = new prcommon.data.QueryWriteStore (
			{url:'/message/view',
				nocallback:true,
				onError:ttl.utilities.globalerrorchecker,
				nocallback:true
		});

		dojo.subscribe(PRCOMMON.Events.Message_Sent, dojo.hitch(this,this._MessageSentEvent));
		dojo.subscribe(PRCOMMON.Events.Dialog_Close, dojo.hitch(this,this._CloseEvent));

		this._DeleteCallBack = dojo.hitch ( this , this._DeleteCall ) ;

	},
	view:{
		cells: [[
			{name: 'Sent',width: "120px",field:'sent'},
  			{name: 'Subject',width: "240px",field:'subject'},
			{name: 'Type',width: "100px",field:'messagetypedescription'},
  			{name: 'From',width: "auto",field:'display_name'},
  			{name: ' ',width: "20px", field:'touserid',format:replyFormatter},
  			{name: ' ',width: "20px",format:ttl.utilities.deleteRowCtrl}
			]]
	},
	postCreate:function()
	{
		this.viewer_grid.attr("structure", this.view);
		this.viewer_grid._setStore(this.filter_db);
		this.viewer_grid['onRowClick'] = dojo.hitch(this,this._OnSelectRow);


		this.inherited(arguments);

	},
	_Send_Message:function()
	{
		this.sendDialog.show();
	},
	resize:function()
	{
		this.borderControl.resize(arguments);
		this.inherited(arguments);
	},
	// Open the Send Dialog
	_Send:function()
	{
		this.message.Send();
	},
	// Close the dialog
	_Close:function()
	{
		this.message.Clear();
		this.sendDialog.hide();
	},
	// Close Dialog event response
	_CloseEvent:function( criteria )
	{
		if ( criteria == "mess_close" )
			this._Close();
	},
	// New Message has been sent add too list
	_MessageSentEvent:function( criteria )
	{
		var t = criteria.d;
		t.messagetypedescription = criteria.l.messagetypedescription;
		t.sent = t.created.slice(0,t.created.lastIndexOf(":"));
		t.display_name = criteria.u.display_name;

		this.filter_db.newItem(t);

	},
	_DeleteCall:function( response )
	{
		if ( response.success == "OK" )
		{
			this.viewer_grid.deleteItem( this._selectedRow );
			alert("Message Delete");
		}
		else
		{
			alert("Problem Deleting Message");
		}
	},
	_OnSelectRow:function ( e )
	{
		var row = this.viewer_grid.getItem(e.rowIndex);

		if ( e.cellIndex  == 4 )
		{

		}
		else if ( e.cellIndex  == 5 )
		{
			this._selectedRow = row;

			if ( confirm("Delete Message?" ))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._DeleteCallBack,
						url:"/message/delete_message" ,
						content: {messageid:row.i.messageid}
			}));
			}
		}

		this.viewer_grid.selection.clickSelectEvent(e);
	},
	_Close2:function()
	{
	},
	_Reply:function()
	{
	}
});





