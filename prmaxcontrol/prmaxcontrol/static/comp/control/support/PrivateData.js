define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../support/templates/PrivateData.html",
	"dijit/layout/BorderContainer",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/dom-style",
	"dojo/request",
	"ttl/utilities2",
	"dojo/data/ItemFileReadStore",	
	"dojox/data/JsonRestStore",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"dijit/form/Button",
	"dijit/ProgressBar",
	"dijit/form/CheckBox",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template,BorderContainer, lang, domattr,domclass,domstyle,request,utilities2, ItemFileReadStore, JsonRestStore, JsonRest, Observable){
 return declare("control.support.PrivateData",
	[BaseWidgetAMD],{
	templateString: template,
	constructor: function()
	{
		this.icustomerid_data2 = new Observable (new JsonRest(
			{target:'/customer/customers_combo',
			idProperty:'customername',
			onError:ttl.utilities2.globalerrorchecker,
			clearOnClose:true,
			urlPreventCache:true
			}));

		this.icustomerid_data = new ItemFileReadStore ( {url:'/customer/customers_combo',onError:utilities2.globalerrorchecker, clearOnClose:true, urlPreventCache:true });
		
		this._AddedCallback = dojo.hitch(this,this._Added);

	},
	postCreate:function()
	{
		this.icustomerid.set("store", this.icustomerid_data);
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
			url: "/customer/import_customer_outlets",
			handleAs:"json",
	        load: this._AddedCallback,
	        form: this.private_form
		});
	}
});
});