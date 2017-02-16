dojo.provide("prmax.customer.InternalAddCustomer");


dojo.require("dojo.data.ItemFileReadStore");

dojo.require("dijit._Templated");
dojo.require("dijit._Widget");
dojo.require("dijit._Container");

dojo.require("dijit.form.Form");
dojo.require("dijit.TitlePane");
dojo.require("dijit.form.ValidationTextBox");
dojo.require("dijit.form.TextBox");
dojo.require("dijit.form.CheckBox");
dojo.require("dojox.validate.regexp");
dojo.require("dojox.form.BusyButton");
dojo.require("dijit.form.FilteringSelect");

dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");

dojo.require("ttl.utilities");
dojo.require("dojox.form.PasswordValidator");

dojo.declare("prmax.customer.InternalAddCustomer",
	[ ttl.BaseWidget],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.customer","templates/InternalAddCustomer.html"),
	constructor: function()
	{
		this._SavedCallBack = dojo.hitch(this,this._Saved);
		this._CostCallBack = dojo.hitch(this,this._ShowCost);
		this._getModelItemCall = dojo.hitch(this,this._getModelItem);

		this._payment =  false;
		this._vatrequired = false;
		this.countries = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=countries"});
		this.termmodel = new dojo.data.ItemFileReadStore ( { url:'/common/lookups?searchtype=terms'});
		this.customerstatus_model = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=customerstatus"});
	},
	postCreate:function()
	{
		this.countryid.store = this.countries;
		this.customertypeid.store  = PRCOMMON.utils.stores.Customer_Types();
		this.term.store = this.termmodel;
		this.customerstatusid.store = this.customerstatus_model;
		dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._onCustomerSubmit));

		this._Clear();

		this.inherited(arguments);

	},
	startup:function()
	{
		this.contact_title.focus();
		this.inherited(arguments);
	},
	_Saved:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Account Created\nCustomer Id : " + response.data.cust.customerid + " User Id : " + response.data.user.user_id);
			this._Clear();
		}
		if ( response.success=="DU")
		{
			alert(response.message);
		}
		this.saveNode.cancel();
	},
	_CustomerSave:function()
	{
		this.form.submit();
	},
	_onCustomerSubmit:function()
	{
		try
		{
			if (this.password._inputWidgets[1].get("value").length<6 )
			{
				alert("Password not long enough miminum length is 6 characters");
				this.saveNode.cancel();
				this.password.focus();
				return;
			}
			if ( ttl.utilities.formValidator(this.form)==false)
			{
				alert("Not all required fields filled in");
				this.saveNode.cancel();
				return;
			}

			if ( this._vatrequired == true && this.vatnumber.get("value").length == 0 )
			{
				alert("Vat number required");
				this.saveNode.cancel();
				this.vatnumber.focus();
				return;

			}
			var content = this.form.get("value");

			var d = this.licence_expired.get("value");
			if ( d == null )
			{
				alert("Expiry Date required");
				this.saveNode.cancel();
				return;

			}
			content["licence_expire"]  = d.getFullYear() + "-" + (d.getMonth() + 1 )  + "-" + d.getDate();
			content["password"] = this.password.value;

			dojo.xhrPost(
						ttl.utilities.makeParams({
							load: this._SavedCallBack,
							url:'/iadmin/new' ,
							content: content
							})	);
		}
		catch(e) { alert(e);}
	},
	_getModelItem:function()
	{
			if (arguments[0].vatnbrequired[0] == true )
			{
				this._vatrequired = true;
				dojo.removeClass(this.vatnumber_view,"prmaxhidden");
				this.vatnumber.focus();
			}
			else
			{
				dojo.addClass(this.vatnumber_view,"prmaxhidden");
				this._vatrequired = false;
			}
	},
	_ShowVat:function()
	{
		this.countries.fetchItemByIdentity(
			{	identity: this.countryid.get("value"),
				onItem:  this._getModelItemCall
			} );
	},
	_Clear:function()
	{
		this.nbroflogins.set("value",1);
		this.customertypeid.set("value",1);
		this.countryid.set("value",1);
		this.customerstatusid.set("value",1);
		this.term.set("value",4);
		this.contact_title.set("value","");
		this.contact_firstname.set("value","");
		this.contact_surname.set("value","");
		this.contactjobtitle.set("value","");
		this.customername.set("value","");
		this.email.set("value","");
		this.address1.set("value","");
		this.address2.set("value","");
		this.townname.set("value","");
		this.county.set("value","");
		this.postcode.set("value","");
		this.vatnumber.set("value","");
		this.tel.set("value","");
		this.password.set("value","");
	}
});