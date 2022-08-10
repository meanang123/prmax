require({cache:{
'url:control/customer/templates/partner_add.html':"<div>\r\n\t<h1>Add New customer</h1>\r\n\t<form  data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='\"class\":\"prmaxdefault\",onsubmit:\"return false;\"'>\r\n\t\t<table width=\"600px\" border=\"0\">\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Title</td><td><input data-dojo-attach-point=\"contact_title\" data-dojo-type=\"dijit/form/TextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"contact_title\",type:\"text\",trim:true,style:\"width:2em;\"'></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">First Name</td><td><input data-dojo-props='\"class\":\"prmaxrequired\",name:\"contact_firstname\",type:\"text\",trim:true,required:true' data-dojo-attach-point=\"contact_firstname\" data-dojo-type=\"dijit/form/ValidationTextBox\" style=\"width: 8em;\"></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\">Surname</td><td><input data-dojo-props='\"class\":\"prmaxrequired\",name:\"contact_surname\",type:\"text\",trim:true,required:true' data-dojo-attach-point=\"contact_surname\" data-dojo-type=\"dijit/form/ValidationTextBox\" style=\"width: 12em;\"></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Job Title</td><td><input data-dojo-attach-point=\"contactjobtitle\" data-dojo-props='\"class\":\"prmaxinput\",name:\"contactjobtitle\",type:\"text\",trim:true,maxlength:\"80\",style:\"width:100%\"' data-dojo-type=\"dijit/form/TextBox\"></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Business Name</td><td><input data-dojo-attach-point=\"customername\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"customername\",type:\"text\",trim:true,required:true,maxlength:\"80\",invalidMessage:\"Please Enter the name of the business\",style:\"width:100%\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email:</td><td><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"email\",type:\"text\",size:\"40\",maxlength:\"80\",trim:true,required:true,lowercase:true,pattern:dojox.validate.regexp.emailAddress,trim:true,invalidMessage:\"invalid email address\",style:\"width:100%\",maxlength:\"79\"'/></td></tr>\r\n\t\t\t<tr><td colspan=\"2\">\r\n\t\t\t\t<div data-dojo-type=\"dojox/form/PasswordValidator\" data-dojo-props='name:\"password\",\"class\":\"prmaxrowtag\"' data-dojo-attach-point=\"password\">\r\n\t\t\t\t\t<table class=\"prmaxtable\" width=\"100%\">\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"30%\">Password:</td><td><input class=\"prmaxrequired\" type=\"password\" pwType=\"new\" /></td></tr>\r\n\t\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Verify:</td><td><input class=\"prmaxrequired\" type=\"password\" pwType=\"verify\" /></td></tr>\r\n\t\t\t\t\t</table>\r\n\t\t\t\t</div>\r\n\t\t\t</td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address:</td><td><input data-dojo-attach-point=\"address1\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"address1\",type:\"text\",required:true,invalidMessage:\"Please Enter first line of address\",style:\"width:100%\"' data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Address 2:</td><td><input data-dojo-attach-point=\"address2\" data-dojo-props='\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",maxlength:\"80\",style:\"width:100%\"' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-props='name:\"townname\",type:\"text\",maxLength:\"40\"' data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" class=\"prmaxinput\" name=\"county\" type=\"text\" data-dojo-type=\"dijit/form/TextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Postcode:</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"postcode\",type:\"text\",style:\"width:10em\",maxlength:\"10\",required:true,invalidMessage:\"Please Enter a post code\"' data-dojo-type=\"dijit/form/ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Country</td><td><select data-dojo-attach-point=\"countryid\" data-dojo-props='autoComplete:true,\"class\":\"prmaxinput\",name:\"countryid\",style:\"width:15em\"' data-dojo-attach-event=\"onChange:_show_vat\" data-dojo-type=\"dijit/form/Select\" ></select></td></tr>\r\n\t\t\t<tr class=\"prmaxhidden\" data-dojo-attach-point=\"vatnumber_view\"><td align=\"right\" class=\"prmaxrowtag\">Vat No</td><td><input data-dojo-attach-point=\"vatnumber\" data-dojo-props='\"class\":\"prmaxrequired\",trim:true,name:\"vatnumber\",type:\"text\",size:25,maxlength:40' data-dojo-type=\"dijit/form/TextBox\" /></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel:</td><td><input class=\"prmaxrequired\" data-dojo-attach-point=\"tel\" data-dojo-props='name:\"tel\",type:\"text\",size:\"25\",maxlength:\"40\",required:true,invalidMessage:\"Please enter a contact telephone number\"' data-dojo-type=\"dijit/form/ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Features</td><td><input data-dojo-attach-point=\"advancefeatures\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"advancefeatures\",value:\"1\"'/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Nbr Logins</td><td><input data-dojo-type=\"dijit/form/NumberTextBox\" type=\"text\" name=\"maxnbrofusersaccounts\" required=\"true\" value=\"3\" data-dojo-props=\"constraints:{min:1,max:11,places:0},invalidMessage:'Please enter a numeric value.',rangeMessage:'Invalid elevation.',style:'width:2em'\" data-dojo-attach-point=\"maxnbrofusersaccounts\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Concurrent Users</td><td><input data-dojo-type=\"dijit/form/NumberTextBox\" type=\"text\" name=\"logins\" required=\"true\" value=\"1\" data-dojo-props=\"constraints:{min:1,max:5,places:0},invalidMessage:'Please enter a numeric value.',rangeMessage:'Invalid elevation.',style:'width:2em'\" data-dojo-attach-point=\"logins\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Is Demo</td><td><input data-dojo-attach-point=\"isdemo\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"isdemo\"' data-dojo-attach-event=\"onChange:_demo_active\"/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Start Date</td><td><input data-dojo-props='type:\"text\",name:\"startdate\",required:true,style:\"width:8em\"' data-dojo-attach-point=\"startdate\" data-dojo-type=\"dijit/form/DateTextBox\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">End Date</td><td><input data-dojo-props='type:\"text\",name:\"enddate\",required:true,style:\"width:8em\"' data-dojo-attach-point=\"enddate\" data-dojo-type=\"dijit/form/DateTextBox\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Notes</td><td><div class=\"stdframe\" style=\"height:150px;\" ><textarea data-dojo-attach-point=\"details\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"details\",trim:true,required:true,style:\"width:99%;height:80%\"' ></textarea></div></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" colspan=\"2\" align=\"right\"><button data-dojo-attach-point=\"save_node\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-event=\"onClick:_customer_save\" data-dojo-props='busyLabel:\"Please Wait Creating...\",label:\"Create Account\",\"class\":\"prmaxbutton\"'></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>\r\n\r\n\r\n\r\n"}});
define("control/customer/partner_add", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../customer/templates/partner_add.html",
	"dijit/layout/ContentPane",
	"dojo/request",
	"ttl/utilities2",
	"dojo/_base/lang",
	"dojo/topic",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dijit/form/ValidationTextBox",
	"dojox/form/PasswordValidator",
	"dijit/form/FilteringSelect",
	"dijit/form/CheckBox",
	"dojox/validate/regexp",
	"dojox/form/BusyButton",
	"dijit/form/Textarea",
	"dijit/form/DateTextBox",
	"dijit/form/NumberTextBox"
	], function(declare, BaseWidgetAMD, template, ContentPane,request,utilities2,lang,topic,domclass,ItemFileReadStore){

 return declare("controls.customer.partner_add",
	[BaseWidgetAMD,ContentPane],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
	 this.countries = new ItemFileReadStore ({url:"/common/lookups?searchtype=countries"});
	 this._save_call_back = lang.hitch(this, this._save_call);
	},
	postCreate:function()
	{
		this.countryid.set("store",this.countries);
		this.countryid.set("value",1);
		this._setup_dates();

	},
	_setup_dates:function()
	{
	 this.startdate.set("value", new Date());

	 var tmp = new Date();
	 tmp.setFullYear(new Date().getFullYear() + 1);
	 this.enddate.set("value", tmp );

	},
	_show_vat:function()
	{

	},
	_customer_save:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required fields filled in");
			throw "N";
		}

		if (confirm("Add Account"))
		{
			var content = this.form.get("value");

			content["enddate"] = utilities2.to_json_date(this.enddate.get("value"));
			content["startdate"] = utilities2.to_json_date(this.startdate.get("value"));

			request.post('/customer/add_partner_customer',
					utilities2.make_params({data:content})).then
					(this._save_call_back);
		}
	},
	_save_call:function(response)
	{
		if (response.success == "OK")
		{
			topic.publish("/customer/p_add", response.data);
			this._clear();
		}
		else if (response.success=="DU")
		{
			alert(response.message);
		}

		this.save_node.cancel();
	},
	_clear:function()
	{
		this.countryid.set("value",1);
		this.isdemo.set("checked",false);
		this._setup_dates();
	},
	_demo_active:function(isChecked)
	{
		var tmp = new Date();

		if ( isChecked == true)
		{
			tmp.setDate(tmp.getDate() + 7);
			this.enddate.constraints.max = tmp ;
		}
		else
		{
			tmp.setFullYear(new Date().getFullYear() + 1);
			delete this.enddate.constraints.max;
		}
		this.enddate.set("value", tmp );
	}
});
});
