//-----------------------------------------------------------------------------
// Name:    prmax.lists.SaveToList
// Author:  Chris Hoy
// Purpose:
// Created: 22/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.lists.SaveToList");

dojo.declare("prmax.lists.SaveToList",
	[ ttl.BaseWidget ],
	{
	selected:-1,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.lists","templates/savetolist.html"),
	constructor: function()
	{
		this.store = new dojox.data.QueryReadStore(
		{	url:"/lists/lists?listtypeid=1",
			onError:ttl.utilities.globalerrorchecker
		});
		this._SavedListCall= dojo.hitch(this,this._SavedListed);
		this._SavedResultCall= dojo.hitch(this,this._SavedResult);
	},

	_SaveList:function()
	{
		console.log("_SaveList");
		this.saveform.submit();
	},
	_SaveNewList:function()
	{
		console.log("_SaveNewList");
		this.addform.submit();
	},
	postCreate:function()
	{
		this.lists._setStore(this.store ) ;
		dojo.connect(this.saveform,"onSubmit",dojo.hitch(this,this._SubmitList));
		dojo.connect(this.addform,"onSubmit",dojo.hitch(this,this._SubmitAdd));
		dojo.connect(this.addpane,"toggle",dojo.hitch(this,this._OpenSave));

		this.label_overwrite["for"] = this.override_button.id;
		this.label_append["for"] = this.append_button.id;

	},
	startup:function()
	{
		this.source.setOptions(this.selected);
		this.inherited(arguments);
	},
	_SubmitList:function()
	{
		console.log("_SubmitList");

		if ( ttl.utilities.formValidator(this.saveform)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._SavedResultCall,
					url:"/lists/savetolist" ,
					content: this.saveform.get("value")
			})	);
	},
	_SavedResult:function(response)
	{
		console.log("_SavedResult",response);
		if (response.success=="OK")
		{
			alert("Result Saved to List");
			PRMAX.search.closeStdDialog();
		}
		else
		{
			alert("Problem with List");
			this.lists.focus();
		}
		this.saveNode.cancel();
	},
	_SubmitAdd:function()
	{
		console.log("_SubmitAdd");

		if ( ttl.utilities.formValidator(this.addform)==false)
		{
			alert("Not all required field filled in");
			this.addNode.cancel();
			return;
		}

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._SavedListCall,
						url:"/lists/addnew" ,
						content: this.addform.get("value")
						})	);
	},
	_SavedListed:function(response)
	{
		console.log("_AddListCall",response);

		if (response.success=="OK")
		{
			this.lists.set("value",response.list.listid);
			this.listnamenew.set("value","");
			this.saveNode.focus();
			this.addpane.set("open",false);
		}
		else if (response.success=="DU")
		{
			alert("List Name Already Exists");
			this.listnamenew.focus();
		}
		else if (response.success=="VF")
		{
			alert( "List Name: " + response.error_message[0][1]);
			this.listnamenew.focus();
		}
		else
		{
			alert("Problem with List");
			this.listnamenew.focus();
		}

		this.addNode.cancel();
	},
	_OpenSave:function()
	{
		if (this.addpane.get("open"))
			this.listnamenew.focus();
	},
	 destroy: function()
	 {
		console.log("destroy called");
		this.inherited(arguments);
		delete this.store;
	},
	_ShowCreateList:function()
	{
		this.addpane.set("open", true ) ;
		this.listnamenew.focus();
	}
});
