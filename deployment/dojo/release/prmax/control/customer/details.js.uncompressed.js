require({cache:{
'url:control/customer/templates/details.html':"<div>\r\n\t<div style=\"margin:5px;width:600px;height:95%;overflow:auto\" class=\"common_prmax_layout\">\r\n\t\t<form data-dojo-attach-point=\"customer_form\" onsubmit=\"return false\" data-dojo-type=\"dijit/form/Form\">\r\n\t\t\t<h1 class=\"heading\">Edit Details</h1>\r\n\t\t\t<input data-dojo-attach-point=\"icustomerid\" data-dojo-props='name:\"icustomerid\",type:\"hidden\",value:\"\"' data-dojo-type=\"dijit/form/TextBox\" />\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Business Name</label><input data-dojo-attach-point=\"customername\" data-dojo-props='name:\"customername\",type:\"text\",trim:true,required:true,invalidMessage:\"Please Enter the name of the business\",style:\"width:29em\"' data-dojo-type=\"dijit/form/ValidationTextBox\" ><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Is Individual</label><input data-dojo-attach-point=\"individual\" data-dojo-props='name:\"individual\"' data-dojo-type=\"dijit/form/CheckBox\" ><br/>\r\n\t\t\t<h1 class=\"heading\">Contact Name</h1>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Title</label><input data-dojo-attach-point=\"contact_title\" data-dojo-props='name:\"contact_title\",type:\"text\",trim:true,style:\"width:2em\"' data-dojo-type=\"dijit/form/TextBox\"><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">First Name</label><input data-dojo-attach-point=\"contact_firstname\" data-dojo-props='name:\"contact_firstname\",type:\"text\",trim:true,style:\"width:8em\"' data-dojo-type=\"dijit/form/TextBox\"><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Surname</label><input name=\"contact_surname\" data-dojo-attach-point=\"contact_surname\" data-dojo-props='type:\"text\",trim:true,style:\"width:12em\"' data-dojo-type=\"dijit/form/TextBox\"><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Job Title</label><input  data-dojo-attach-point=\"contactjobtitle\" data-dojo-props='name:\"contactjobtitle\",type:\"text\",trim:true,maxlength:\"80\"' data-dojo-type=\"dijit/form/TextBox\"><br/>\r\n\t\t\t<h1 class=\"heading\">Address</h1>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Address:</label><input data-dojo-attach-point=\"address1\" data-dojo-props='name:\"address1\",type:\"text\",size:\"40\",required:true,trim:true,style:\"width:29em\"' data-dojo-type=\"dijit/form/TextBox\"/><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Address 2:</label><input data-dojo-attach-point=\"address2\" data-dojo-props='name:\"address2\",type:\"text\",size:\"40\",maxlength:\"80\",trim:true,style:\"width:29em\"' data-dojo-type=\"dijit/form/TextBox\"/><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Town</label><input  data-dojo-attach-point=\"townname\" data-dojo-props='name:\"townname\",type:\"text\",size:\"30\",trim:true' data-dojo-type=\"dijit/form/TextBox\"/><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">County</label><input  data-dojo-attach-point=\"county\" data-dojo-props='name:\"county\",type:\"text\",trim:true' data-dojo-type=\"dijit/form/TextBox\"/><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Postcode:</label><input  data-dojo-attach-point=\"postcode\" data-dojo-props='name:\"postcode\",type:\"text\",style:\"width:10em\",maxlength:\"10\"' data-dojo-type=\"dijit/form/TextBox\"/><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Email:</label><input  data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"email\",type:\"text\",size:\"40\",maxlength:\"80\",trim:true,required:true,pattern:dojox.validate.regexp.emailAddress,invalidMessage:\"invalid email address\"'/><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Tel:</label><input  data-dojo-attach-point=\"tel\" data-dojo-props='name:\"tel\",type:\"text\",size:\"25\",maxlength:\"40\"' data-dojo-type=\"dijit/form/TextBox\"/><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Country</label><select data-dojo-props='name:\"countryid\",style:\"width:15em\"' data-dojo-attach-point=\"countryid\" data-dojo-type=\"dijit/form/Select\"></select><br/>\r\n\t\t\t<label class=\"label_size_1 label_tag label_align_r\">Vat No</label><input data-dojo-attach-point=\"vatnumber\" data-dojo-props='trim:true,name:\"vatnumber\",type:\"text\",size:\"25\",maxlength:\"40\",style:\"width:10em\"' data-dojo-type=\"dijit/form/TextBox\" /><br/>\r\n\t\t\t<button data-dojo-attach-point=\"savebtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-event=\"onClick:_customer_save\" data-dojo-props='busyLabel:\"Please Wait Saving...\",type:\"button\",label:\"Save\",style:\"float:right;margin-right:20px\"'></button><br/>\r\n\t\t</form>\r\n\t</div>\r\n</div>\r\n\r\n"}});
define("control/customer/details", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/details.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/form/Select",
	"dojox/validate/regexp",
	"dijit/form/ValidationTextBox",
	"dojox/form/BusyButton"
	], function(declare, BaseWidgetAMD, template, BorderContainer,ContentPane,request,utilities2,lang,topic,domclass,ItemFileReadStore){

 return declare("control.customer.details",
	[BaseWidgetAMD,ContentPane],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._countries = new ItemFileReadStore ( { url:"/common/lookups?searchtype=countries"});
		this._save_call_back = lang.hitch(this, this._save_call);
	},
	postCreate:function()
	{
		this.countryid.set("store",this._countries);

		this.inherited(arguments);
	},
	load:function(customer)
	{
		this.icustomerid.set("value",customer.cust.customerid);
		this.customername.set("value", customer.cust.customername);
		this.contact_title.set("value", customer.cust.contact_title);
		this.contact_firstname.set("value", customer.cust.contact_firstname);
		this.contact_surname.set("value", customer.cust.contact_surname);
		this.individual.set("checked",customer.cust.individual);
		this.contactjobtitle.set("value", customer.cust.contactjobtitle);
		this.address1.set("value", customer.address.address1);
		this.address2.set("value", customer.address.address2);
		this.townname.set("value", customer.address.townname);
		this.county.set("value", customer.address.county);
		this.postcode.set("value", customer.address.postcode);
		this.email.set("value", customer.cust.email);
		this.tel.set("value", customer.cust.tel);
		this.countryid.set("value", customer.cust.countryid );
		this.vatnumber.set("value", customer.cust.vatnumber );
		this.savebtn.cancel();

	},
	_customer_save:function()
	{
		if (utilities2.form_validator(this.customer_form) == false)
		{
			alert("Please Enter Details");
			this.savebtn.cancel();
			return false;
		}

		request.post("c/update_customer",
			utilities2.make_params({ data : this.customer_form.get("value")})).
			then(this._save_call_back);
	},
	_save_call:function(response)
	{
		if (response.success=="OK")
		{
			topic.publish("/customer/p_upd", response.data);
			alert("Customer Details Updated");
		}

		this.savebtn.cancel();
	}
});
});
