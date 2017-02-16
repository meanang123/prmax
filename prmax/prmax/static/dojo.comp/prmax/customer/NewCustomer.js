dojo.provide("prmax.customer.NewCustomer");

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
dojo.require("ttl.BaseWidget");

dojo.declare("prmax.customer.NewCustomer",
	[ ttl.BaseWidget ],{
		widgetsInTemplate: true,
		customersourceid:5,
		professional_only:false,
		defaultcost:"Please ring for price",
		templatePath: dojo.moduleUrl( "prmax.customer","templates/NewCustomer.html"),
	constructor: function()
	{
		this._SavedCallBack = dojo.hitch(this,this._Saved);
		this._CostCallBack = dojo.hitch(this,this._ShowCost);
		this._getModelItemCall = dojo.hitch(this,this._getModelItem);

		this._payment =  false;
		this._vatrequired = false;
		this.termmodel = new dojo.data.ItemFileReadStore ( { url:'/common/lookups?searchtype=terms'});
		this.termmodel.fetch();
		this.countries = new dojo.data.ItemFileReadStore ( { url:"/common/lookups?searchtype=countries"});
		this.countries.fetch();

	},
	postCreate:function()
	{
		this.nbroflogins.set("value",1);
		this.term.store = this.termmodel;
		this.term.set("value",4);
		this.countryid.store = this.countries;
		this.countryid.set("value",1);
		this.field_customersourceid.set("value",this.customersourceid);

		if (this.professional_only == true)
		{
			dojo.addClass(this.term_row_view,"prmaxhidden");
			dojo.addClass(this.features_row_view,"prmaxhidden");
		}

		dojo.connect(this.form,"onSubmit",dojo.hitch(this,this._onCustomerSubmit));

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
			// account added pay now to recieve login details
			dijit.byId("customer_control_pane").set( "href", response.page ) ;
			return;
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
			if (this.tcaccept.get("checked")==false )
			{
				alert("T & C not accepted, Please accept before continuing");
				this.saveNode.cancel();
				return;
			}

			if (this._payment==false)
			{
				alert("Cost for required options unknown Please ring");
				this.saveNode.cancel();
				return;
			}

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

			content["password"] = this.password.value;

			dojo.xhrPost(
						ttl.utilities.makeParams({
							load: this._SavedCallBack,
							url:'/eadmin/new' ,
							content: content
							})	);
		}
		catch(e) { alert(e);}
	},
	_LoginChanged:function()
	{
		console.log("_LoginChanged");
		this._GetCost();
	},
	_TermChanged:function()
	{
		console.log("_TermChanged");
		this._GetCost();
	},
	_ModuleChanged:function()
	{
		this._GetCost();
	},
	_ShowCost:function(response)
	{
		console.log("Show Costs", response);
		if (response.success=="OK")
		{
		    if ( response.data[1].length>0)
			{
				this.cost.set("value",response.data[1]);
				this._payment = false ;
			}
			else
			{
				this._payment = true ;
				this.cost.set("value","£"+ ttl.utilities.round_decimals(response.data[0]/100,2) + " excluding vat");
			}
		}
	},
	_GetCost:function()
	{
		var content = { termid: this.term.get("value"),
														nbrofloginsid: this.nbroflogins.get("value"),
														isprofessional:0
														};

		// Professional view only
		if (this.professional_only == true )
			content["isprofessional"] = 1

		if ( this.advancefeatures.get("checked"))
			content["advancefeatures"] = 1;

		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._CostCallBack,
				url:'/eadmin/cost',
				content: content}));
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
	}
});