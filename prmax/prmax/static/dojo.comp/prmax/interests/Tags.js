dojo.provide("prmax.interests.Tags");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.declare("prmax.interests.Tags",
	[dijit._Widget, dijit._Templated, dijit._Container],{
		widgetsInTemplate: true,
		parentid:"",
		templatePath: dojo.moduleUrl( "prmax.interests","templates/Tags.html"),
	constructor: function()
	{
		this._LoadCall = dojo.hitch(this,this._Load);
		this._DeletedCall = dojo.hitch(this,this._DeleteResponse);
		this._RenameCall = dojo.hitch(this,this._RenameResponse);
	},
	postCreate:function()
	{
		dojo.connect(this.select,"onchange", dojo.hitch(this,this._onSelectChange));
		this.Load();
		this.addtag.setAdded(dojo.hitch(this,this._AddedTags));
	},
	_AddedTags:function(interest)
	{
		this.select.options[this.select.options.length] = new Option(interest.interestname,interest.interestid);
	},
	_RenameResponse:function(response)
	{
		console.log(response);

		if (response.success=="OK")
		{
			for ( var c = 0; c<this.select.options.length;c++)
			{
				if ( this.select.options[c].value==response.data.interestid)
				{
					this.select.options[c].text = response.data.interestname;
					break;
				}
			}
			dojo.publish(PRCOMMON.Events.Display_ReLoad, []);
		}
		else if (response.success=="DU")
		{
			alert("Tag already exists");
		}
		this._EnableControls();

	},
	_DeleteResponse:function(response)
	{
		if (response.success=="OK")
		{
			for ( var c = 0; c<this.select.options.length;c++)
			{
				if ( this.select.options[c].value==response.data.interestid)
				{
					this.select.options[c] = null;
					break;
				}
			}
		}
		this._EnableControls();
	},
	_onSelectChange:function()
	{
		this._EnableControls();
	},
	_EnableControls:function()
	{
		this.renameButton.attr("disabled",this.select.selectedIndex!=-1?false:true);
		this.deleteButton.attr("disabled",this.select.selectedIndex!=-1?false:true);
	},
	_Rename:function()
	{
		// ask question
		var replay = prompt("Rename Tag " + this.select.options[this.select.selectedIndex].text + " to","");
		if (replay)
		{
			dojo.xhrPost(
						ttl.utilities.makeParams({
							load: this._RenameCall,
							url:"/interests/updatetag" ,
							content: {interestid:this.select.options[this.select.selectedIndex].value,
							interestname:replay }
							})	);
		}

	},
	_Delete:function()
	{
		if (confirm ("Delete Tag "+this.select.options[this.select.selectedIndex].text))
		{
			dojo.xhrPost(
						ttl.utilities.makeParams({
							load: this._DeletedCall,
							url:"/interests/deletetag" ,
							content: {interestid:this.select.options[this.select.selectedIndex].value}
							})	);
		}
	},
	_Load:function(response)
	{
		console.log(response)
		for ( var key in response.data)
		{
			var interest = response.data[key];
			this.select.options[this.select.options.length] = new Option(interest.interestname,interest.interestid);
		}
	},
	Load:function()
	{
		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._LoadCall,
						url:"/interests/tags"
						}));

	},
	Clear:function()
	{
		this.addTag.cancel();
		this.select.options.length = 0 ;
		this.interestname.attr("value","");
		this._EnableControls();
	},
	destroy: function()
	{
		this.inherited(arguments);
	},
	_Close:function()
	{
		dojo.publish(PRCOMMON.Events.Dialog_Close);
	}
});