//-----------------------------------------------------------------------------
// Name:    Customer.js
// Author:  Chris Hoy
// Purpose:
// Created: 14/10/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
dojo.provide("prmax.customer.Customer");

dojo.declare("prmax.customer.Customer",
	[ ttl.BaseWidget ],{
		widgetsInTemplate: true,
		parentid:"",
		templatePath: dojo.moduleUrl( "prmax.customer","templates/Customer.html"),
	constructor: function()
	{
		this._LoadCallBack = dojo.hitch(this,this._Load);
		this._SavedCallBack = dojo.hitch(this,this._Saved);
	},
	startup:function()
	{
		dojo.connect(this.customerForm,"onSubmit",dojo.hitch(this,this._onCustomerSubmit));
		this.Load();
		this.inherited(arguments);
	},
	_Load:function(response)
	{
		console.log(response);
		this.customername.set('value',response.data.customername);
		this.contact_title.set('value', response.data.contact_title);
		this.contact_firstname.set('value', response.data.contact_firstname);
		this.contact_surname.set('value', response.data.contact_surname);
		this.address1.set('value', response.data.address1);
		this.address2 .set('value', response.data.address2);
		this.townname.set('value', response.data.townname);
		this.county.set('value', response.data.county);
		this.postcode.set('value', response.data.postcode);
		this.email.set('value', response.data.email);
		this.tel.set('value', response.data.tel);
		this.licence_expire.set('value', response.data.licence_expire);
		this.logins.set('value', response.data.logins);
		this.customername.focus();
		this.saveNode.set('disabled',false);
	},
	_Saved:function(response)
	{
		this.saveNode.cancel();
	},
	_CustomerSave:function()
	{
		this.customerForm.submit();
	},
	_onCustomerSubmit:function()
	{
		try
		{
		if ( ttl.utilities.formValidator(this.customerForm)==false)
		{
			alert("Not all required field filled in");
			this.saveNode.cancel();
			return;
		}
		var content = this.customerForm.get("value");

		ttl.utilities.showMessageStd("Saving .........",1000);

		dojo.xhrPost(
					ttl.utilities.makeParams({
						load: this._SavedCallBack,
						url:'/customers/update' ,
						content: content
						})	);
			}
		catch(e) { alert(e);}

	},
	Load:function()
	{
		dojo.xhrPost(
				ttl.utilities.makeParams({
					load: this._LoadCallBack,
					url:'/customers/get'})	);
	},
	Clear:function()
	{
		this.saveNode.cancel();
	},
	_Close:function()
	{
		this.Clear();
		dojo.publish(PRCOMMON.Events.Dialog_Close, ["customer"]);
	}
});