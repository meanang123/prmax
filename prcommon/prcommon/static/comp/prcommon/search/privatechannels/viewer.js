//-----------------------------------------------------------------------------
// Name:    prcommon.search.privatechannels.viewer.js
// Author:  Stamatia Vatsi
// Purpose:
// Created: May 2019
//
// To do:
// Update file will be required
//
//
//-----------------------------------------------------------------------------
dojo.provide("prcommon.search.privatechannels.viewer");


dojo.require("ttl.GridHelpers");
dojo.require("ttl.BaseWidget");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojox.form.BusyButton");
dojo.require("dijit.form.Button");
dojo.require("prcommon.data.QueryWriteStore");
dojo.require("prcommon.search.privatechannels.add");
dojo.require("prcommon.search.privatechannels.update");

dojo.declare("prcommon.search.privatechannels.viewer",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prcommon.search.privatechannels","templates/viewer.html"),
	constructor: function()
	{

		this.model = new prcommon.data.QueryWriteStore(
			{	url:'/prmax_outlettypes/get_list_prmax_outlettypes',
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				nocallback:true,
				urlPreventCache:true
			});

		this._UpdatePrivateChannelCallBack = dojo.hitch(this,this._UpdatePrivateChannelCall);
		this._DeletePrivateChannelCallBack = dojo.hitch(this,this._DeletePrivateChannelCall);
		dojo.subscribe('/prmax_outlettypes/add',  dojo.hitch(this, this._AddPrivateChannelEvent));
	},
	postCreate:function()
	{
		this.icustomerid = PRMAX.utils.settings.cid;
		this._prmax_outlettypeid = null;

		this.grid.set("structure",this.view);
		this.grid._setStore(this.model);
		this.grid['onCellClick'] = dojo.hitch(this,this._onCellClick);

		this.tabcont.selectChild(this.details);
	},
	_OnStyleRow:function(inRow)
	{
		ttl.GridHelpers.onStyleRow(inRow);
		this.tabcont.selectChild(this.details);
	},
	view: {
		cells: [[
		{name: 'Description',width: "500px",field:"prmax_outlettypename"}
		]]
	},
	_onCellClick:function ( e )
	{
		this._row = this.grid.getItem(e.rowIndex);
		this._prmax_outlettypeid = this._row.i.prmax_outlettypeid;
		this.prmax_outlettypeid.set("value",this._row.i.prmax_outlettypeid);
		this.prmax_outlettypename.set("value",this._row.prmax_outlettypename);
		this.grid.selection.clickSelectEvent(e);
		this.privatechannels_view_ctrl.selectChild(this.tabcont);
		this.tabcont.selectChild(this.details);

		this._ShowDetails();
	},
	_ShowDetails:function()
	{
		dojo.removeClass(this.display_pane,"prmaxhidden");

		this.prmax_outlettypeid.set("value", this._row.i.prmax_outlettypeid);
		this.prmax_outlettypename.set("value", this._row.i.prmax_outlettypename);
	},
	_AddPrivateChannel:function()
	{
		this.privatechannels_view_ctrl.selectChild(this.blank_view);
		this.addprivatechannelctrl.Load(this.add_privatechannel_dlg);
		this.add_privatechannel_dlg.show();

	},
	_AddPrivateChannelEvent:function(privatechannel)
	{
		this.model.newItem(privatechannel);
	},
	_Update:function()
	{
		if ( ttl.utilities.formValidator(this.update_form)==false)
		{
			alert("Not all required field filled in");
			this.update_form_btn.cancel();
			return;
		}
		if (confirm ("Update?"))
		{
			var content = this.update_form.get("value");
			content['customerid'] = this.icustomerid;
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: dojo.hitch(this,this._UpdatePrivateChannelCallBack),
					url:'/prmax_outlettypes/update',
					content: content
				})
			);
		}
	},
	_UpdatePrivateChannelCall:function ( response )
	{
		if (response.success=="OK")
		{
			alert("Private Media Channel Updated");
			this.update_form_btn.cancel();
			this.model.setValue(this._row, "prmax_outlettypename", response.data.prmax_outlettypename, true );
		}
		else if ( response.success == "DU")
		{
			alert("Private Media Channel Already Exists");
			this.update_form_btn.cancel();
		}

		else
		{
			alert("Problem updating Private Media Channel");
			this.update_form_btn.cancel();
		}
	},
	_deletePrivateChannel:function()
	{
		if (confirm("Delete Selected Private Media Channel?"))
		{
			var content = {};
			content['prmax_outlettypeid'] = this._row.i.prmax_outlettypeid;
			content['customerid'] = this.icustomerid;
			
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: dojo.hitch(this,this._DeletePrivateChannelCallBack),
					url:"/prmax_outlettypes/delete",
					content: content}));
		}
	},
	_DeletePrivateChannelCall:function(response)
	{
		if ( response.success == "OK")
		{
			alert("Private Media Channel Deleted");
			this.grid.setQuery(ttl.utilities.getPreventCache({}));
			this.privatechannels_view_ctrl.selectChild(this.blank_view);
		}
		else
		{
			alert("Problem Deleting Selected Private Media Channel");
		}
	},
	
});





