//-----------------------------------------------------------------------------
// Name:    prmax.pressrelease.attachments
// Author:  Chris Hoy
// Purpose:
// Created: 05/04/2011
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.pressrelease.attachments");

dojo.declare("prmax.pressrelease.attachments",
	[ ttl.BaseWidget ],
	{
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.pressrelease","templates/attachments.html"),
	constructor: function()
	{
		this._loaded = false;
		this._AddFileCallBack = dojo.hitch ( this , this._AddFileCall );
		this._DeleteAttCallBack = dojo.hitch ( this, this._DeleteAttCall );
		this._AddCollCallBack = dojo.hitch( this, this._AddCollCall);
		this._ErrorCallBack = dojo.hitch(this,this._Error);
	},
	Load:function(emailtemplateid)
	{
		if (this._loaded == false )
		{
			this.model = new prcommon.data.QueryWriteStore ( {url:'/emails/attachement_list?emailtemplateid=' + emailtemplateid, onError:ttl.utilities.globalerrorchecker, nocallback:true });
			this.attgrid.setStore ( this.model);
		}
		else
		{
			this.attgrid.setQuery( ttl.utilities.getPreventCache({emailtemplateid:emailtemplateid}));
		}
		this.emailtemplateid1.set("value", emailtemplateid);
		this.emailtemplateid2.set("value", emailtemplateid);
		this.coll_store = new dojox.data.QueryReadStore({  url:"/icollateral/collateral_list?emailtemplateid="+emailtemplateid, onError:ttl.utilities.globalerrorchecker});
		this.collateralcodes.set("store", this.coll_store);
	},
	postCreate:function()
	{
		this.attgrid.set("structure",this.view);
		this.attgrid["onCellClick"] = dojo.hitch(this, this._OnCellClick);

		this.inherited(arguments);
	},
	view:{
		cells: [[
			{name: 'Name',width: "auto",field:"filename"},
			{name: 'Size',width: "50px",field:"size", formatter:ttl.utilities.formatMb},
			{name: ' ',width: "13px",styles: 'text-align: center;', width: "20px",formatter:ttl.utilities.deleteRowCtrl}
			]]
	},
	_DeleteAttCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.model.deleteItem( this._Row );
			alert("Attachment Removed");
		}
		else
		{
			alert("Problem removing Attachment");
		}
	},
	_OnCellClick:function( e )
	{
		if ( e.cellIndex == 2 )
		{
			this._Row = this.attgrid.getItem(e.rowIndex);
			if ( confirm ( "Remove Attachment?"))
			{
				dojo.xhrPost(
					ttl.utilities.makeParams(
					{
						load: this._DeleteAttCallBack,
						url:'/emails/attachement_delete',
						content: { emailtemplateid: this.emailtemplateid,
						emailtemplatesattachementid: this._Row.i.emailtemplatesattachementid}
					} ));
			}
		}
	},
	resize:function()
	{
		this.frame.resize ( arguments[0] ) ;
		this.inherited(arguments);
	},
	_AddCollateral:function()
	{
		this.attcollbtn.cancel();
		this.attcolldlg.show();
	},
	_AddFile:function()
	{
		this.attfilebtn.cancel();
		this.attfiledlg.show();
	},
	_AddFileCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			this.model.newItem( response.data);
			this.attfiledlg.hide();
			this._ClearAttForm();
		}
		else
		{
			alert("Problem Adding file");
			this.attfilebtn.cancel();
		}
	},
	_ClearAttForm:function()
	{
		this.attfilebtn.cancel();
		dojo.attr(this.attfilename,"value","");
	},
	_CloseAttFileDlg:function()
	{
		this.attfiledlg.hide();
	},
	_CloseAttCollDlg:function()
	{
		this.attcolldlg.hide();
	},
	_UploadFile:function()
	{
		if ( confirm("Upload Attachment"))
		{
			dojo.io.iframe.send(
			{
				url: "/emails/attachement_add_file",
				contentType: "multipart/form-data",
				method: "post",
				handleAs:"json",
				load: this._AddFileCallBack,
				form : this.attfileform,
				error:this._ErrorCallBack,
				preventCache:true,
				timeout:600000
			});
		}
	},
	_UploadCollateral:function()
	{
		if ( ttl.utilities.formValidator( this.attcollform ) == false)
		{
			alert("Not all required field filled in");
			this.attcollbtn.cancel();
			return;
		}
		dojo.xhrPost(
			ttl.utilities.makeParams(
			{
				load: this._AddCollCallBack,
				url:'/emails/attachement_add_coll',
				content: this.attcollform.get("value")
			}));
	},
	_AddCollCall:function (response )
	{
		if ( response.success == "OK" )
		{
			this.model.newItem( response.data);
			this.attcollbtn.cancel();
			this.attcolldlg.hide();
		}
		else
		{
			alert("Problem Adding Collateral");
			this.attcollbtn.cancel();
		}
	},
	isValid:function()
	{
		var amount_allocated = 0;

		if (this.model)
		{
			for (var c = 0 ;  c < this.model._items.length; c++)
			{
				if ( this.model._items[c] == null ) continue;

				console.log ( this.model._items[c]);
				amount_allocated += parseFloat(this.model._items[c].i.size);
			}
		}
		console.log ( amount_allocated ) ;
		if (amount_allocated> 5000000)
		{
			alert("Attachments limited to less than 5MB");
			return false;
		}
		else
			return true;
	},
	_Error:function(response, ioArgs)
	{
		alert("Problem Uploading Attachment");
		this.attfilebtn.cancel();
	}
});
