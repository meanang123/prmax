//-----------------------------------------------------------------------------
// Name:    add.js
// Author:  Chris Hoy
// Purpose:
// Created: 25/07/2012
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.iadmin.sales.prospects.gather.add");

dojo.require("ttl.BaseWidget");
dojo.require("dojox.validate.regexp");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.FilteringSelect");
dojo.require("dijit.form.Button");
dojo.require("dojox.form.BusyButton");
dojo.require("prmax.iadmin.sales.prospects.companies.add");
dojo.require("dijit.Dialog");
dojo.require("dojox.validate");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("prmax.iadmin.sales.prospects.sources.add");
dojo.require("prmax.iadmin.sales.prospects.types.add");
dojo.require("prmax.iadmin.sales.prospects.regions.add");

dojo.declare("prmax.iadmin.sales.prospects.gather.add",
	[ ttl.BaseWidget ],
	{
	url:"/iadmin/prospects/prospect/add_prospect",
	mode:"add",
	templateString: dojo.cache( "prmax","iadmin/sales/prospects/gather/templates/add.html"),
	constructor: function()
	{
		this._dialog = null;
		this._store = new dojox.data.JsonRestStore( {target:"/iadmin/prospects/companies/list", idAttribute:"prospectcompanyid"});
		this._prospectsources = new dojox.data.JsonRestStore( {target:"/iadmin/prospects/sources/list", idAttribute:"prospectsourceid"});
		this._prospecttypes = new dojox.data.JsonRestStore( {target:"/iadmin/prospects/types/list", idAttribute:"prospecttypeid"});
		this._prospectregions = new dojox.data.JsonRestStore( {target:"/iadmin/prospects/regions/list", idAttribute:"prospectregionid"});

		dojo.subscribe("/prospect/comp/add", dojo.hitch(this, this._add_event));
		dojo.subscribe("/prospect/sources/add", dojo.hitch(this, this._add_sources_event));
		dojo.subscribe("/prospect/types/add", dojo.hitch(this, this._add_types_event));
		dojo.subscribe("/prospect/regions/add", dojo.hitch(this, this._add_region_event));
		this._update_call_back = dojo.hitch(this, this._update_call);
		this._domain_call_back = dojo.hitch(this, this._domain_call);
	},
	postCreate:function()
	{
		this.inherited(arguments);
		this.prospectcompanyid.set("store", this._store);
		this.prospectsourceid.set("store", this._prospectsources);
		this.prospecttypeid.set("store", this._prospecttypes);
		this.prospectregionid.set("store", this._prospectregions);
		this.prospectsourceid.set("value", 1);
		this.prospecttypeid.set("value", 5);
		this.prospectregionid.set("value", null);

		if (this.mode == "edit")
		{
			dojo.addClass(this.closebtn.domNode,"prmaxhidden");
		}
	},
	_close:function()
	{
		if (this._dialog)
			this._dialog.hide();
	},
	_update:function()
	{
		if (ttl.utilities.formValidator( this.form ) == false )
		{
			alert("Please Enter Details");
			this.addbtn.cancel();
			return false;
		}

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._domain_call_back,
			url:"/iadmin/prospects/prospect/check_prospect_domain",
			content:this.form.get("value")}));
	},
	_domain_call:function( response )
	{
		var do_add = false ;

		if ( response.success == "OK")
		{
			do_add = true;
		}
		else if ( response.success == "DU")
		{
			alert("Email Address already exists");
		}
		else if ( response.success == "SA")
		{
			if (confirm("Domain is already in the database Continue?"))
				do_add = true ;
		}
		else
		{
			if (response.message != null)
				alert(response.message);
			else
				alert("Problem adding Entry");
		}

		if ( do_add == true )
		{
			dojo.xhrPost(
				ttl.utilities.makeParams({
				load: this._update_call_back,
				url:this.url,
				content:this.form.get("value")}));
		}
		else
		{
			this.addbtn.cancel();
		}
	},
	_update_call:function( response )
	{
		if ( response.success == "OK")
		{
			if (this.mode == "add")
			{
				dojo.publish("/prospect/prospect/add", [response.data] );
				alert("Prospect Added");
				this._close();
				this.clear();
			}
			else
			{
				dojo.publish("/prospect/prospect/updated", [response.data] );
				alert("Prospect Updated");
			}
		}
		else if ( response.success == "DU")
		{
			alert("Email Address already exists");
		}
		else
		{
			if (response.message != null)
				alert(response.message);
			else
				alert("Problem adding Entry");
		}
		this.addbtn.cancel();
	},
	_setDialogAttr:function( dialog)
	{
		this._dialog = dialog;
	},
	load:function(prospect)
	{
		this.prospectid.set("value",prospect.prospectid);
		this.email.set("value",prospect.email);
		this.familyname.set("value",prospect.familyname);
		this.firstname.set("value",prospect.firstname);
		this.title.set("value",prospect.title);
		this.prospectcompanyid.set("value",prospect.prospectcompanyid);
		this.prospectsourceid.set("value",prospect.prospectsourceid);
		this.prospecttypeid.set("value",prospect.prospecttypeid);
		this.web.set("value",prospect.web);
		this.telephone.set("value",prospect.telephone);
		this.prospectregionid.set("value", prospect.prospectregionid);
	},
	clear:function()
	{
		this.email.set("value","");
		this.familyname.set("value","");
		this.firstname.set("value","");
		this.title.set("value","");
		this.prospectcompanyid.set("value",null);
		this.addbtn.cancel();
		this.prospectsourceid.set("value", 1);
		this.prospecttypeid.set("value", 5);
		this.web.set("value","");
		this.telephone.set("value","");
		this.prospectregionid.set("value", "" );
	},
	_add_company:function()
	{
		this.addctrl.clear();
		this.addctrl.load( this.adddialog );
		this.adddialog.show();
	},
	_add_source:function()
	{
		this.addsourcectrl.clear();
		this.addsourcectrl.load( this.addsourcedialog );
		this.addsourcedialog.show();
	},
	_add_type:function()
	{
		this.addtypectrl.clear();
		this.addtypectrl.load( this.addtypedialog );
		this.addtypedialog.show();
	},
	_add_region:function()
	{
		this.addregionctrl.clear();
		this.addregionctrl.load( this.addregiondialog );
		this.addregiondialog.show();
	},
	_add_event:function( company )
	{
		this.prospectcompanyid.set("value", company.prospectcompanyid);
	},
	_add_sources_event:function( source )
	{
		this.prospectsourceid.set("value", source.prospectsourceid);
	},
	_add_types_event:function( type )
	{
		this.prospecttypeid.set("value", type.prospecttypeid);
	},
	_add_region_event:function( region )
	{
		this.prospectregionid.set("value", region.prospectregionid);
	}
});





