dojo.provide("prmax.iadmin.Privateimport");

dojo.declare("prmax.iadmin.Privateimport",
	[dijit._Widget, dijit._Templated, dijit._Container],{
		widgetsInTemplate: true,
		templatePath: dojo.moduleUrl( "prmax.iadmin","templates/Privateimport.html"),
	constructor: function()
	{
		this.icustomerid_data = new dojox.data.QueryReadStore (
			{url:'/iadmin/customers_combo',
			onError:ttl.utilities.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			});

		this._AddedCallback = dojo.hitch(this,this._Added);

	},
	postCreate:function()
	{
		this.icustomerid.store = this.icustomerid_data;
	},
	_Added:function( response )
	{
		this.progressNode.style.display = "none";
		if (response.success=="OK")
		{
			alert("Private Data Added");
			this._Close();
		}
		else if (response.success=="FA")
		{
			alert(response.message);
		}
		else
		{
			alert("Problem Adding Private Data");
		}
	},
	_Add:function()
	{
		this.private_cache.value = new Date().valueOf();
		this.progressNode.style.display = "block";

		dojo.io.iframe.send(
		{
			url: "/iadmin/import_customer_outlets",
			handleAs:"json",
	        load: this._AddedCallback,
	        form: this.private_form
		});
	}
});