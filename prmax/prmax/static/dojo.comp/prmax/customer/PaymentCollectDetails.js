dojo.provide("prmax.customer.PaymentCollectDetails");

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

dojo.require("dojo.data.ItemFileReadStore");

dojo.require("ttl.BaseWidget");
dojo.require("ttl.utilities");

dojo.declare("prmax.customer.PaymentCollectDetails",
	[ ttl.BaseWidget ],{
		widgetsInTemplate: true,
		isprofessional_only:false,
		termid:-1,
		cost:1000.00,
		companyname:"",
		advancefeatures:false,
		templatePath: dojo.moduleUrl( "prmax.customer","templates/PaymentCollectDetails.html"),

	constructor: function()
	{
		this.terms = new dojo.data.ItemFileReadStore (
			{ url:"/common/lookups?searchtype=terms"});

		this._ProformaCallBack = dojo.hitch (this, this._ProformaCall ) ;
		this._CostCallback = dojo.hitch (this, this._CostCall ) ;
	},
	postCreate:function()
	{
		this.payment_start_termid.store = this.terms ;
		this.payment_start_termid.set("value", this.termid);
		this.payment_cost.set("value","£" + this.cost);
		this.advancefeatures_view.set("checked", this.advancefeatures);
		if (this.isprofessional_only==true)
		{
			this.isprofessional_field.set("value",1);
			dojo.addClass(this.advancefeatures_row_view,"prmaxhidden");
			dojo.addClass(this.term_view,"prmaxhidden");
		}
		this.inherited(arguments);
	},
	_CostCall:function( response )
	{
		if ( response.success == "OK" )
		{
			this.payment_cost.set("value", "£" + ttl.utilities.round_decimals(response.data[2]/100,2));
		}
	},
	_ChangeCost:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._CostCallback,
					url:'/eadmin/cost_modules' ,
					content: this.form.get("value")
			})	);

	},
	focus:function()
	{
		this.card_surname();
	},
	_Proceed:function()
	{
		if ( ttl.utilities.formValidator(this.form)==false)
 		{
			alert("Not all required field filled in");
			return;
		}

		var cont = this.form.get("value");

		data = dojo.formToQuery ( this.form.id )

		dijit.byId("payment_restart_pane").set("href","/eadmin/payment_confirmation?"  + data );

	},
	_ProformaCall:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Pro Forma Invoice Generate and Sent");
			window.loc = "";
		}
		else
		{
			alert("Problem generating Pro forma ");

		}
	},
	_ProForma:function()
	{
		dojo.xhrPost(
			ttl.utilities.makeParams({
				load: this._ProformaCallBack,
					url:'/eadmin/proforma' ,
					content: this.form.get("value")
			})	);
	}
});