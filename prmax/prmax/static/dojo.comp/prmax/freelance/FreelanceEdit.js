//-----------------------------------------------------------------------------
// Name:    prmax.freelance.FreelanceEdit
// Author:  Chris Hoy
// Purpose: Global Control for the Groups interface
// Created: 23/05/2008
//
// To do:
//
//-----------------------------------------------------------------------------

dojo.provide("prmax.freelance.FreelanceEdit");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.require("prcommon.interests.Interests");
dojo.require("ttl.utilities");


dojo.declare("prmax.freelance.FreelanceEdit",
	[dijit._Widget, dijit._Templated, dijit._Container],
	{
	widgetsInTemplate: true,
	mode:0,
	templatePath: dojo.moduleUrl( "prmax.freelance","templates/freelance_edit.html"),
	constructor: function() {
		this._SavedCallBack = dojo.hitch(this,this._Saved);
		this._LoadCallBack= dojo.hitch(this,this._Loaded);
		this.outletid = -1 ;

	},
	postCreate:function()
	{
		this.save_url = (this.mode==0)? '/outlets/freelance_save': '/outlets/freelance_update';
		this.borderControl.startup();
		this.borderControl.resize(arguments[0]);

		this.countryid.store = PRCOMMON.utils.stores.Countries();

		this.inherited(arguments);
	},
	startup:function()
	{
		if (this.mode==1) {
			this.headingNode.innerHTML="Updating Freelance";
			this.newNode.set("disabled",true);
		}
		this.inherited(arguments);
	},
	_Loaded:function(response)
	{
		this.Clear();
		console.log(response.data);

		this.countryid.set("value", response.data.outlet.countryid);
		this.outletNode.set("value",response.data.outlet.outletid);
		this.title.set("value",response.data.contact.prefix);
		this.firstname.set("value",response.data.contact.firstname);
		this.familyname.set("value", response.data.contact.familyname);
		this.address1.set("value", response.data.address.address1);
		this.address2.set("value", response.data.address.address2);
		this.townname.set("value", response.data.address.townname);
		this.county.set("value", response.data.address.county);
		this.postcode.set("value", response.data.address.postcode);
		this.www.set("value", response.data.outlet.www);
		this.email.set("value", response.data.comm.email);
		this.tel.set("value", response.data.comm.tel);
		this.fax.set("value", response.data.comm.fax);
		this.mobile.set("value", response.data.comm.mobile);
		this.twitter.set("value", response.data.comm.twitter);
		this.facebook.set("value", response.data.comm.facebook);
		this.linkedin.set("value", response.data.comm.linkedin);
		this.instagram.set("value", response.data.comm.instagram);
		this.interests.set("value", response.data.interests);
		this.profile.set("value", response.data.outlet.profile);

		// chnage name and disable n
		dojo.attr(this.headingNode,"innerHTML","Editing Freelance");
		this.saveNode.set("disabled",false);
		this.newNode.set("disabled" , true);

	},
	_Saved:function(response)
	{
		if (response.success=="OK")
		{
			ttl.utilities.showMessageStd("Saved",1000);
			if (this.outletNode.get("value") == -1 )
				this.New();
			else
			{
				// this is an update to a freelance
				// we need to sent an event as such
				dojo.publish(PRCOMMON.Events.Outlet_Updated,[response.data]);
			}
		}
		else
		{
			ttl.utilities.hideMessage();
			alert("Failed");
		}

		this.saveNode.cancel();

	},
	Load:function(outletid)
	{
		this.saveNode.cancel();
		this.saveNode.set("disabled",true);
		this.outletNode.set("value", outletid);
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._LoadCallBack,
				url:'/outlets/freelance_load',
				content: {outletid:outletid}
			})	);

	},
	Save:function()
	{
		if ( ttl.utilities.formValidator(this.requiredNode)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}

		ttl.utilities.showMessageStd("Saving .........",1000);

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._SavedCallBack,
						url:this.save_url ,
						content: this.requiredNode.get("value")
						})	);
	},
	New:function()
	{
		this.Clear();
	},
	Clear:function()
	{
		this.saveNode.cancel();
		this.countryid.set("value",1);
		this.newNode.set("disabled" , false);
		this.outletNode.set("value",-1);
		this.title.focus();
		this.title.set("value","");
		this.firstname.set("value","");
		this.familyname.set("value","");
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.www.set("value","");
		this.email.set("value","");
		this.tel.set("value","");
		this.fax.set("value","");
		this.mobile.set("value","");
		this.interests.set("value","");
		this.profile.set("value","");
		this.twitter.set("value", "");
		this.facebook.set("value", "");
		this.linkedin.set("value", "");
		this.instagram.set("value", "");
		dojo.attr(this.headingNode,"innerHTML","Adding Freelance");
	},
	resize:function()
	{
		this.borderControl.resize(arguments[0]);
	}
});
