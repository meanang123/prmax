require({cache:{
'url:control/support/templates/PrivateData.html':"<div>\r\n\t<form  data-dojo-attach-point=\"private_form\" method=\"post\" name=\"private_form\" enctype=\"multipart/form-data\"  onSubmit=\"return false;\">\r\n\t\t<input class=\"prmaxinput\" type=\"hidden\" data-dojo-attach-point=\"private_cache\" name=\"private_cache\" value=\"-1\"></input>\r\n\t\t<table width=\"50%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" >\r\n\t\t\t<tr>\r\n\t\t\t\t<td class=\"prmaxrowtag\">File Name</td>\r\n\t\t\t\t<td>\r\n\t\t\t\t\t<input size=\"30\" class=\"prmaxinput\" type=\"file\" data-dojo-attach-point=\"private_file\" name=\"private_file\"></input>\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t\t\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Customer</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"icustomerid\",autoComplete:true,labelType:\"html\",searchAttr:\"customername\"' data-dojo-attach-point=\"icustomerid\"></select></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\">Add to existing Outlets</td><td><input type=\"checkbox\" name=\"no_add_outlet\" data-dojo-type=\"dijit/form/CheckBox\"></td></tr>\r\n\t\t\t<tr><td colspan = \"2\" >&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan = \"2\" ><span data-dojo-attach-point=\"progressNode\" style=\"display:none;\"><div data-dojo-type=\"dijit/ProgressBar\" data-dojo-attach-point=\"progressControl\" data-dojo-props='style:\"width:200px\", indeterminate:\"true\"'></div></span></td></tr>\r\n\t\t\t<tr><td colspan=\"2\" align=\"right\"><button class=\"prmaxbutton\"  data-dojo-attach-point=\"saveNode\" type=\"button\"  data-dojo-type=\"dijit/form/Button\" label=\"Upload Private Data\" data-dojo-attach-event=\"onClick:_Add\"></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n"}});
define("control/support/PrivateData", [
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