//-----------------------------------------------------------------------------
// Name:    prmax.outlet.OutletOverride
// Author:  Chris Hoy
// Purpose:
// Created: 22/10/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.outlet.OutletOverride");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.declare("prmax.outlet.OutletOverride",
	[dijit._Widget, dijit._Templated, dijit._Container],
	{
	outletid:-1,
	outlettypeid:1,
	widgetsInTemplate: true,
	templatePath: dojo.moduleUrl( "prmax.outlet","templates/outlet_override.html"),
	constructor: function()
	{
		this._LoadCall = dojo.hitch(this,this._Load);
		this._SavedCall = dojo.hitch(this,this._Saved);
	},
	postCreate:function()
	{
		if (this.outlettypeid==PRCOMMON.Constants.Freelance)
			dojo.addClass(this.primarycontactrow,"prmaxhidden");

		// for pro version show extra options
		if (PRMAX.utils.settings.productid==PRCOMMON.Constants.PRMAX_Pro)
		{
			dojo.removeClass(this.interests.domNode,"prmaxhidden");
		}


		dojo.connect(this.overrideNode,"onSubmit",dojo.hitch(this,this._Save));

		if (this.outlettypeid==1)
		{
			this.modelemployees= new dojox.data.QueryReadStore (
				{url:'/employees/listcombo?extended=1&outletid='+this.outletid,
				onError:ttl.utilities.globalerrorchecker,
				clearOnClose:true,
				urlPreventCache:true
				});
			this.primaryemployeeid.store = this.modelemployees;
		}
		this.Load();
	},
	_SaveCtrl:function()
	{
		this.overrideNode.submit();
	},
	Load:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadCall,
			url:'/outlets/outlet_override_get',
			content: {outletid:this.outletid}}));
	},
	_Load:function(response)
	{
		console.log(response);
		if (response.data.outlet != null )
		{
			with(response.data.outlet)
			{
				this.tel.set("value",tel);
				this.email.set("value",email);
				this.fax.set("value",fax);
				this.profile.set("value",profile);
				this.address1.set("value",address1);
				this.address2.set("value",address2);
				this.townname.set("value",townname);
				this.county.set("value",county);
				this.postcode.set("value",postcode);

				// primary contact
				if ( this.outlettypeid==1)
				{
					var primaryemployeeid1 = (response.data.outlet.primaryemployeeid>0)?primaryemployeeid:-1;
					this.use_primary.set("checked",primaryemployeeid1==-1?true:false);
					this.primaryemployeeid.set("disabled",primaryemployeeid1==-1?true:false);
					this.primaryemployeeid.set('value',primaryemployeeid1);
				}
			}
		}
		else
		{
			if ( this.outlettypeid==1)
			{
				this.use_primary.set("checked",true);
				this.primaryemployeeid.set("disabled",true);
				this.primaryemployeeid.set('value',-1);
			}
		}
		if (this.outlettypeid==19)
		{
			this.use_primary.set("disabled",true);
			this.primaryemployeeid.set("disabled",true);
		}

		this.interests.set("value",response.data.interests);
		this.saveNode.set("disabled",false);
		// fill fields
	},
	Clear:function()
	{
		// emptry fields
	},
	_Saved:function(response)
	{
		console.log("saved",response);
		console.log("outletid",this.outletid);
		if (response.success=="OK")
		{
			dojo.publish(PRCOMMON.Events.Outlet_Overrides, [{outlet:{outletid:this.outletid}}]);
			alert("Changes Saved");
			this.saveNode.cancel();
			PRMAX.search.stdDialog.hide();
		}
		else
		{
			alert("Problem saving changes" );
		}
	},
	_Save:function()
	{
	try{
		if ( ttl.utilities.formValidator(this.overrideNode)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}
		// Check to see if address must have a first line
		if (  this.address1.get("value").length == 0 &&
			( this.address2.get("value").length>0 ||
			this.townname.get("value").length>0 ||
			this.county.get("value").length>0 ||
			this.postcode.get("value").length>0))
		{
			alert("Address must have a first line ");
			this.address1.focus();
			this.saveNode.cancel();
			return;

		}

		var content = this.overrideNode.get("value");
		content['outletid'] = this.outletid;
		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SavedCall,
			url: (this.outlettypeid==1) ? '/outlets/outlet_override_save':'/outlets/freelance_override_save',
			content: content}));
		}
	catch(e) { alert(e);}
	},
	_ChangePrimaryMode:function()
	{
		var usep = this.use_primary.get("checked");
		if (usep)
			this.primaryemployeeid.set('value',-1);

		this.primaryemployeeid.set("disabled",usep);

	},
	_Close:function()
	{
		this.Clear();
		PRMAX.search.stdDialog.hide();
	},
	destroy: function()
	{
		this.inherited(arguments);
	}
});
