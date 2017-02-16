//-----------------------------------------------------------------------------
// Name:    prmax.lists.NewListDlg
// Author:  Chris Hoy
// Purpose:
// Created: 22/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.lists.NewListDlg");


dojo.declare("prmax.lists.NewListDlg",
	[ ttl.BaseWidget ],
	{
	selected:-1,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.lists","templates/NewListDlg.html"),
	constructor: function()
	{
		this.callback = null;
		this._listid = -1;
		this._SavedCall = dojo.hitch(this,this._Saved);
		this._load_call_back = dojo.hitch(this, this._load_call);

		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});

	},
	postCreate:function()
	{
		dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._SubmitAdd));
		this.clientid.set("store", this._clients);
		this.clientid.set("value",  "-1");
	},
	_setCallbackAttr:function(value)
	{
		this.callback = value;
	},
	_Save:function()
	{
		this.form.submit();
	},
	_Cancel:function()
	{
		this.dlg.hide();
		this._Clear();
	},
	_Clear:function()
	{
		this.listname.set("value","");
		this.clientid.set("value", "-1");
		this._listid = -1;
	},
	_SubmitAdd:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		var content = this.form.getValues();
		if (this._listid != -1 )
			content['listid'] = this._listid;

		console.log(content);

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._SavedCall,
						url:this._ListModeUrl() ,
						content: content
						})	);
	},
	_Saved:function(response)
	{
		console.log("_AddListCall",response);

		if (response.success=="OK")
		{
			if (this.callback!=null)
			{
				this.callback(response);
				this.hide();
				this._Clear();
			}
		}
		else if (response.success=="DU")
		{
			alert("List Name Already Exists");
			this.listname.focus();
		}
		else if (response.success=="VF")
		{
			alert( "List Name: " + response.error_message[0][1]);
			this.listname.focus();
		}
		else
		{
			alert("Problem with List");
			this.listname.focus();
		}

		this.saveNode.cancel();
	},
	 destroy: function()
	 {
		this.inherited(arguments);
	},
	_load_call:function(response)
	{
		if (response.success == "OK")
		{
			this.clientid.set("value", response.list.clientid);
			this.dlg.show();
		}
	},
	show:function(list_mode,listid)
	{
		this._listid = listid;
		this.list_mode = list_mode;
		this._ListSetModeButton();
		this.saveNode.cancel();

		if (list_mode != 1 && list_mode != 2)
		{
			this.dlg.show();
		}
		else
		{
			dojo.xhrPost(
						ttl.utilities.makeParams({
							load: this._load_call_back,
							url:"/lists/info" ,
							content: {listid:listid}
							})	);
		}
	},
	_ListSetModeButton:function()
	{
		var ret2 = "Enter New List Name";

		if (this.list_mode==1)
		{
			ret2 = "Enter Replacement list Name";
		}
		if (this.list_mode==2)
		{
			ret2 = "Enter Duplicate List Name";
		}

		this.dlg.set("title",ret2);
	},

	_ListModeUrl:function()
	{
		var ret = '/lists/addnew';

		if (this.list_mode==1)
			ret = '/lists/rename';
		if (this.list_mode==2)
			ret = '/lists/duplicate';
		return ret;
	},

	hide:function()
	{
		this.dlg.hide();
		this.saveNode.cancel();
	}
});
