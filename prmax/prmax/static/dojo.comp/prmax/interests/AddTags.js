dojo.provide("prmax.interests.AddTags");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.declare("prmax.interests.AddTags",
	[dijit._Widget, dijit._Templated, dijit._Container],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.interests","templates/AddTags.html"),
	constructor: function()
	{
		this._SavedCall = dojo.hitch(this,this._Saved);
		this._completecall = null;
	},
	postCreate:function()
	{
		dojo.connect(this.addForm,"onSubmit",dojo.hitch(this,this._Submit));
	},
	setAdded:function(func)
	{
		this._completecall = func;
	},
	_Saved:function(response)
	{
		if (response.success=="OK")
		{
			if (this._completecall!=null)
				this._completecall(response.data);
			this._Clear();
		}
		else if (response.success=="DU")
		{
			alert("Tag already exists");
			this.interestname.focus();
		}
		else if (response.success=="FA")
		{
			alert("A Problem occured saving the tag");
		}
		this.addTag.cancel();
	},
	_Save:function()
	{
		this.addForm.submit();
	},
	_Submit:function()
	{
		if ( ttl.utilities.formValidator(this.addForm)==false)
		{
			alert("Not all required field filled in");
			this.addTag.cancel();
			return;
		}
		ttl.utilities.showMessageStd("Saving .........",1000);

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._SavedCall,
						url:"/interests/addtag" ,
						content: this.addForm.getValues()
						})	);

	},
	_Clear:function()
	{
		this.addTag.cancel();
		this.interestname.attr("value","");
	},
	focus:function()
	{
		this.interestname.focus();
	},
	 destroy: function()
	 {
		console.log("destroy called");
		this.inherited(arguments);
	}
});