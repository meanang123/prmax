dojo.provide("prmax.customer.RequestDemo");

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

dojo.declare("prmax.customer.RequestDemo",
	[dijit._Widget, dijit._Templated, dijit._Container],{
		widgetsInTemplate: true,
		customertypeid:20,
		customersourceid:5,
		templatePath: dojo.moduleUrl( "prmax.customer","templates/RequestDemo.html"),
	constructor: function()
	{
	},
	postCreate:function()
	{
		this.field_customertypeid.set("value", this.customertypeid);
		this.field_customersourceid.set("value", this.customersourceid);

		this.inherited(arguments);

	},
	startup:function()
	{
		this.contact_title.focus();
		this.inherited(arguments);
	},
	_CustomerSave:function()
	{
			if (this.tcaccept.get("checked")==false )
			{
				alert("T & C not accepted, Please accept before continuing");
				return false;
			}

			if ( ttl.utilities.formValidator(this.form)==false)
			{
				alert("Not all required field filled in");
				return false;
			}

		this.form.domNode.submit();
	},
	_do_submit:function()
	{
		return true;
	}
});
