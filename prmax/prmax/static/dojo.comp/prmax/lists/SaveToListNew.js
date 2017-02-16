//-----------------------------------------------------------------------------
// Name:    prmax.lists.SaveToListNew
// Author:  Chris Hoy
// Purpose:
// Created: 22/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.lists.SaveToListNew");

dojo.declare("prmax.lists.SaveToListNew",
	[ ttl.BaseWidget ],
	{
	selected:-1,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.lists","templates/savetolistnew.html"),
	constructor: function()
	{
		this.store = new dojox.data.QueryReadStore(
		{	url:"/lists/lists?listtypeid=1",
			onError:ttl.utilities.globalerrorchecker
		});
		this._SavedListCall= dojo.hitch(this,this._SavedListed);
		this._SavedResultCall= dojo.hitch(this,this._SavedResult);
		this._clients = new dojox.data.JsonRestStore( {target:"/clients/rest_combo", idAttribute:"id"});
	},

	_SaveList:function()
	{
		this.saveNode.focus();
		this.saveform.submit();
	},
	_SaveNewList:function()
	{
		this.addform.submit();
	},
	postCreate:function()
	{
		this.lists.store = this.store;
		dojo.connect(this.saveform,"onSubmit",dojo.hitch(this,this._SubmitList));
		dojo.connect(this.addform,"onSubmit",dojo.hitch(this,this._SubmitAdd));
		dojo.connect(this.addpane,"toggle",dojo.hitch(this,this._OpenSave));

		this.label_overwrite["for"] = this.override_button.id;
		this.label_append["for"] = this.append_button.id;

		dojo.subscribe(this.tabController.id+"-selectChild", dojo.hitch(this,this.onSelectTab));

		this.clientid.set("store", this._clients);
		this.clientid.set("value",  "-1");

		this.inherited(arguments);
	},
	startup:function()
	{
		this.source.setOptions(this.selected);
		this.source2.setOptions(this.selected);
		this.lists.focus();

		//this.tabController.startup();
		this.inherited(arguments);

	},
	onSelectTab:function(button)
	{

		if (button.id == this.savetolisttab.id )
			this.lists.focus();
		else
			this.listnamenew.focus();
	},
	_SubmitList:function()
	{
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
						url:"/lists/addsavetolist" ,
						content: this.addform.get("value")
						})	);
	},
	_SavedListed:function(response)
	{
		console.log("_AddListCall",response);

		if (response.success=="OK")
		{
			alert("Result Saved to List New List");
			PRMAX.search.closeStdDialog();
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
		this.inherited(arguments);
		delete this.store;
	},
	resize:function()
	{
		console.log("save resize" , arguments);
		//this.borderCtrl.resize( {h:435,width:400} ) ;
		this.tabController.resize( {h:435,width:400}  ) ;
	}
});
