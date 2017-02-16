//-----------------------------------------------------------------------------
// Name:    prmax.collateral.view.js
// Author:  Chris Hoy
// Purpose:
// Created: 28/06/2008
//
// To do:
// Update file will be required
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.collateral.view");


dojo.require("ttl.GridHelpers");
dojo.require("ttl.BaseWidget");
dojo.require("dijit.form.Form");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dojox.form.BusyButton");
dojo.require("dijit.form.Button");

dojo.require("prmax.collateral.adddialog");

formatRowDelete = function(inDatum) {
	return isNaN(inDatum) ? '...' : '<img height="18px" width="18px" style="padding:0x;margin:0px" src="/static/images/delete.gif" title="Delete" ></img>';
};

formatRowCtrl = function(inDatum) {
	return isNaN(inDatum) ? '...' : '<img height="10px" width="10px" style="padding:0x;margin:0px" src="/static/images/rowctrl.gif"></img>';
	}

dojo.declare("prmax.collateral.view",
	[ ttl.BaseWidget ],
	{
		templatePath: dojo.moduleUrl( "prmax.collateral","templates/view.html"),
		constructor: function()
		{
			this.model= new prcommon.data.QueryWriteStore ( {url:'/icollateral/collateral_grid',
				tableid:7,
				oncallback: dojo.hitch(this,this._selection_changed),
				onError:ttl.utilities.globalerrorchecker,
				oncallbackparams: dojo.hitch(this,this._get_context)
			} );

			this.emailtemplateid_store = new dojox.data.QueryReadStore (
				{url:'/emails/templates_list?include_sent=1&include_no_select&is_combo=1',
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				urlPreventCache:true
				});

			this._client_data = new dojox.data.QueryReadStore (
			{	url:'/clients/combo?include_no_select',
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				urlPreventCache:true
			});

			dojo.subscribe(PRCOMMON.Events.Collateral_Add , dojo.hitch(this, this._AddCollateralEvent));

			this._DeleteCollateralCallBack = dojo.hitch(this, this._DeleteCollateral);
			this._getModelItemCall = dojo.hitch(this,this._getModelItem);
			this._UpdateCollateralCallBack = dojo.hitch(this,this._UpdateCollateralCall);
			this._on_delete_collateral_call_back = dojo.hitch(this,this._on_delete_collateral_call);

		},
		postCreate:function()
		{
			this.grid.set("structure",this.view);

			this.baseonCellClick = this.grid['onCellClick'];

			this.grid['onStyleRow'] = dojo.hitch(this,this._OnStyleRow);
			this.grid['onCellClick'] = dojo.hitch(this,this.onCellClick);

			this.grid._setStore(this.model);

			this.emailtemplateid.store = this.emailtemplateid_store;
			this.emailtemplateid.set("value",-1);
			this.clientid.set("store",this._client_data);
			this.clientid.set("value",-1)

		},
		_OnStyleRow:function(inRow)
		{
			ttl.GridHelpers.onStyleRow(inRow);
		},
		onCellClick : function(e)
		{
			if (e.cellIndex == 0 )
			{
				var row = this.grid.getItem(e.rowIndex);
				this.model.setValue(  row, "selected" , !row.i.selected, true );
			}
			else
			{
				// user click on a general display row
				this.grid.selection.clickSelectEvent(e);
				this._row = this.grid.getItem(e.rowIndex);
				this._ShowDetails();
			}
		},
		_ShowDetails:function()
		{
			dojo.removeClass(this.display_pane,"prmaxhidden");
			dojo.attr(this.filename,"innerHTML", this._row.i.filename ) ;
			dojo.attr(this.prmaxid,"innerHTML", this._row.i.collateralid ) ;

			this.collateralid.set("value", this._row.i.collateralid ) ;
			this.code.set("value", this._row.i.collateralcode ) ;
			this.description.set("value", this._row.i.collateralname ) ;
			console.log (	this._row.i.emailtemplateid )  ;
			this.emailtemplateid.set("value", this._row.i.emailtemplateid==null? -1: this._row.i.emailtemplateid) ;
			this.clientid.set("value", this._row.i.clientid==null? -1: this._row.i.clientid) ;

		},
		_getModelItem:function()
		{
			console.log("_getModelItem",arguments);
			this.tmp_row = arguments[0];
		},
		_DeleteCollateral:function( response )
		{
			if (response.success=="OK")
			{
				var item  = {identity:response.collateralid,
							onItem:  this._getModelItemCall};
				this.tmp_row = null;
				this.model.fetchItemByIdentity(item);
				if (this.tmp_row)
					this.model.deleteItem(this.tmp_row);
				this._row = null;
				dojo.addClass(this.display_pane,"prmaxhidden");
				dojo.attr(this.filename,"innerHTML", "") ;
				dojo.attr(this.prmaxid,"innerHTML", "" ) ;

				this.emailtemplateid.set("value", "-1" ) ;
				this.clientid.set("value", "-1" ) ;
				this.code.set("value", "") ;
				dojo.attr(this.description,"description", "") ;

				dojo.removeClass(this.display_pane,"prmaxhidden");

			}
			else
			{
				alert("Problem Deleting Collateral");
			}
		},
		_AddCollateralEvent:function( collateral )
		{
			var tmp = this.model.newItem(collateral);
		},
		view: {
			cells: [[
			{name: ' ',width: "15px",styles: 'text-align: center;', width: "20px",field:'selected',formatter:ttl.utilities.formatButtonCell},
			{name: 'Code',width: "100px",field:"collateralcode"},
			{name: 'Description',width: "200px",field:"collateralname"},
			{name: 'Client',width: "150px",field:"clientname"},
			{name: 'Releases',width: "auto",field:"emailtemplatename"}
			]]
		},
		destroy:function()
		{
			try
			{
				this.inherited(arguments);
			}
			catch(e) {};
			delete this.model;
		},
		Clear:function()
		{
			this.grid.setQuery(ttl.utilities.getPreventCache({}));
			this.addctrl.Clear();
		},
		resize:function()
		{
			this.borderControl.resize(arguments[0]);
		},
		_Delete:function()
		{
			if (confirm ("Delete Collateral (" +  this._row.i.collateralname+")?"))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: dojo.hitch(this,this._DeleteCollateralCallBack),
				url:'/icollateral/collateral_delete',
				content:{collateralid:this._row.i.collateralid}
				}));
			}
		},
		_Preview:function()
		{
			ttl.utilities.gotoDialogPageStatic("/collateral/"+ this._row.i.collateralid+this._row.i.ext);
		},
		_AddCollateral:function()
		{
			this.addctrl.show();
		},
		_UpdateCollateralCall:function ( response )
		{
			if (response.success=="OK")
			{
				alert("Collateral Updated");
				this.update_form_btn.cancel();
				this.model.setValue(  this._row, "collateralcode" , this.code.get("value"), true );
				this.model.setValue(  this._row, "collateralname" , this.description.get("value"), true );
				this.model.setValue(  this._row, "clientname" , response.data.clientname, true );
				this.model.setValue(  this._row, "clientid" ,  response.data.clientid, true );
				this.model.setValue(  this._row, "emailtemplatename" , response.data.emailtemplatename, true );
				this.model.setValue(  this._row, "emailtemplateid" ,  response.data.emailtemplateid, true );
			}
			else if ( response.success == "DU")
			{
				alert("Collateral Already Exists");
				this.update_form_btn.cancel();
			}

			else
			{
				alert("Problem updating Collateral");
				this.update_form_btn.cancel();
			}
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
				dojo.xhrPost(
					ttl.utilities.makeParams({
						load: dojo.hitch(this,this._UpdateCollateralCallBack),
				url:'/icollateral/collateral_update',
				content: this.update_form.get("value")
				}));
			}
		},
	_selection_changed:function( response )
	{

	},
	_get_context:function()
	{
		return { };
	},
	_delete:function()
	{
		if (confirm("Delete Selected Collateral"))
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._on_delete_collateral_call_back,
					url:"/icollateral/collateral_delete_selection"}));
		}
	},
	_on_delete_collateral_call:function(response)
	{
		if ( response.success == "OK")
		{
			alert("Collateral Deleted");
			this.grid.setQuery(ttl.utilities.getPreventCache({}));
		}
		else
		{
			alert("Problem Deleting Selected Collateral");
		}
	}
});





