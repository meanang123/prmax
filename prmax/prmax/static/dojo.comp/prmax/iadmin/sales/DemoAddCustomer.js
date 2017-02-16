dojo.provide("prmax.iadmin.sales.DemoAddCustomer");

dojo.require("ttl.utilities");

dojo.declare("prmax.iadmin.sales.DemoAddCustomer",
	[ ttl.BaseWidget],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.iadmin.sales","templates/DemoAddCustomer.html"),
	constructor: function()
	{
		this._SavedCallBack = dojo.hitch(this,this._Saved);
		this._LoadedCallBack = dojo.hitch(this, this._LoadedCall);

		this._countries = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=countries"});
		this._users = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=users&group=sales"});
	},
	postCreate:function()
	{
		this.countryid.store = this._countries;
		this.assigntoid.store = this._users;
		this.customertypeid.store = PRCOMMON.utils.stores.Customer_Types();

		this.inherited(arguments);
	},
	_Saved:function(response)
	{
		if ( response.success=="OK")
		{
			alert("Demo Created\nCustomer Id : " + response.customerid + " User Id : " + response.userid);
			this._Clear();
			this._ctrl._DeleteDemoRow();
			this._ctrl.senddlg.hide();
		}
		if ( response.success=="DU")
		{
			alert(response.message);
		}
		this.saveNode.cancel();
	},
	_CustomerSave:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
		{
			alert("Not all required fields filled in");
			this.saveNode.cancel();
			return;
		}

		var content = this.form.get("value");

		if (this._sendemail)
			content["sendemail"] = true ;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._SavedCallBack,
			url:'/iadmin/demo_to_customer' ,
			content: content
		}));
	},
	_LoadedCall:function ( response )
	{
		if ( response.success == "OK")
		{
			this.customertypeid.set("value", response.data.customertypeid);
			this.demorequestid.set("value", response.data.demorequestid);
			this.contact_title.set("value", response.data.contact_title );
			this.contact_firstname.set("value", response.data.contact_firstname);
			this.contact_surname.set("value", response.data.contact_surname);
			this.job_title.set("value", response.data.job_title);
			this.customername.set("value", response.data.customername);
			this.email.set("value", response.data.email);
			this.address1.set("value", response.data.address1);
			this.address2.set("value", response.data.address2);
			this.townname.set("value", response.data.townname);
			this.county.set("value", response.data.county);
			this.postcode.set("value", response.data.postcode);
			this.countryid.set("value", response.data.countryid);
			this.telephone.set("value", response.data.telephone);
			this.advancefeatures.set("value",true);
			this.crm.set("value",false);

			this._ctrl.senddlg.set("title", (this._sendemail == true)?"Add Customer & Send Email" : "Add Customer");
			this._ctrl.senddlg.show();
		}
		else
		{
			alert("Problem Loading Demo Details");
		}
	},
	Load:function( data ,sendemail, ctrl)
	{
		this._ctrl = ctrl;
		this._sendemail = sendemail;

		dojo.xhrPost(
			ttl.utilities.makeParams({
			load: this._LoadedCallBack,
			url:'/iadmin/demo_get_customer' ,
			content: { demorequestid : data.demorequestid }
		}));

	},
	_Clear:function()
	{

	}
});