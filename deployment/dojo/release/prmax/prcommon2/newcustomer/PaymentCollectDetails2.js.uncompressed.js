require({cache:{
'url:prcommon2/newcustomer/templates/PaymentCollectDetails2.html':"<div>\r\n\t<form class=\"prmaxdefault\" data-dojo-attach-point=\"form\" onSubmit=\"return false;\" data-dojo-type=\"dijit.form.Form\">\r\n\t\t<input class=\"prmaxinput\" data-dojo-attach-point=\"nbrofloginsid\" name=\"nbrofloginsid\" type=\"hidden\" data-dojo-type=\"dijit.form.TextBox\"  value=\"1\"/>\r\n\t\t<input class=\"prmaxinput\" data-dojo-attach-point=\"isprofessional_field\" name=\"isprofessional\" type=\"hidden\" data-dojo-type=\"dijit.form.TextBox\"  value=\"0\"/>\r\n\t\t<table width=\"100%\" border=\"0\" cellspacing = \"1\" >\r\n\t\t\t<tr><td >&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan=\"3\" align=\"center\" class=\"prmaxrowdisplaylarge\">Please Confirm Payment Details</td></tr>\r\n\t\t\t<tr><td colspan=\"3\"><hr/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Company Name</td><td width=\"70%\">${companyname}</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Card Holder Surname</td><td  ><input data-dojo-attach-point=\"card_surname\" class=\"prmaxrequired\" name=\"surname\" type=\"text\" style=\"width:20em\" maxlength=\"40\" required =\"true\" invalidMessage=\"Please Enter Card Holders Surname\" data-dojo-type=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Card Holder First Name</td><td  ><input class=\"prmaxrequired\" name=\"firstname\" type=\"text\" style=\"width:20em\" maxlength=\"40\" required =\"true\" invalidMessage=\"Please Enter Card Holders First Name\" data-dojo-type=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowdisplaylarge\" colspan=\"2\" align=\"left\">Card Holder's Address</td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Address 1 </td><td><input class=\"prmaxrequired\" name=\"address1\" type=\"text\" required=\"true\" invalidMessage=\"Please Enter first line of address\" data-dojo-type=\"dijit.form.ValidationTextBox\" style=\"width:25em\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Address 2 </td><td ><input class=\"prmaxinput\" name=\"address2\" type=\"text\" size=\"40\" maxlength=\"80\" data-dojo-type=\"dijit.form.TextBox\"  style=\"width:25em\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Town</td><td  ><input class=\"prmaxrequired\" name=\"townname\" type=\"text\" size=\"30\" required=\"true\" invalidMessage=\"Please Enter postal Town\" data-dojo-type=\"dijit.form.ValidationTextBox\"/></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" width=\"30%\">Post Code</td><td  ><input class=\"prmaxrequired\" name=\"postcode\" type=\"text\" style=\"width:10em\" maxlength=\"10\" required =\"true\" invalidMessage=\"Please Enter a post code \" data-dojo-type=\"dijit.form.ValidationTextBox\" /></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" >Confirmation Email:</td><td><input class=\"prmaxrequired\" name=\"email\" type=\"text\"  trim=\"true\" required=\"true\" data-dojo-type=\"dijit.form.ValidationTextBox\" lowercase=\"true\" regExpGen=\"dojox.validate.regexp.emailAddress\" trim=\"true\" invalidMessage=\"invalid email address\" size=\"40\" maxlength=\"80\"/></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"advancefeatures_row_view\"><td class=\"prmaxrowtag\" >Advance Features</td><td  ><input data-dojo-attach-point=\"advancefeatures_view\" name=\"advancefeatures\" type=\"checkbox\" data-dojo-type=\"dijit.form.CheckBox\" data-dojo-attach-event=\"onChange:_ChangeCost\"/></td></tr>\r\n\t\t\t<tr data-dojo-attach-point=\"term_view\"><td class=\"prmaxrowtag\">Term</td><td><select data-dojo-attach-point=\"payment_start_termid\" class=\"prmaxinput\" name=\"termid\" style=\"width:9em\" data-dojo-type=\"dijit.form.FilteringSelect\" autoComplete=\"true\" searchAttr=\"name\" labelType=\"html\" data-dojo-attach-event=\"onChange:_ChangeCost\"></select></td><td></td></tr>\r\n\t\t\t<tr><td class=\"prmaxrowtag\" >Cost (including Vat)</td><td><input data-dojo-attach-point =\"payment_cost\" class=\"prmaxinput\" data-dojo-type=\"dijit.form.TextBox\" readonly=\"readonly\" value=\"£\" /></td></tr>\r\n\t\t\t<tr><td colspan=\"3\">&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan=\"3\">&nbsp;</td></tr>\r\n\t\t\t<tr><td colspan=\"3\" align=\"right\"><input class=\"prmaxrowdisplaylarge\" type=\"button\" data-dojo-attach-event=\"onClick:_Proceed\" name=\"Proceed\" data-dojo-type=\"dijit.form.Button\" label=\"Continue\" value=\"Proceed\"/></td></tr>\r\n\t\t\t<tr><td colspan=\"3\">&nbsp;</td></tr>\r\n\t\t</table>\r\n\t</form>\r\n\t<table width=\"100%\" border=\"0\">\r\n\t\t<tr><td  width=\"70%\">&nbsp;</td><td align=\"right\"><input class=\"prmaxbutton\" type=\"button\" data-dojo-attach-event=\"onClick:_ProForma\" name=\"proforma\" data-dojo-type=\"dijit.form.Button\" label=\"Send Proforma\" value=\"proforma\"/></td></tr>\r\n\t</table>\r\n</div>\r\n"}});
define("prcommon2/newcustomer/PaymentCollectDetails2", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../newcustomer/templates/PaymentCollectDetails2.html",
	"dijit/layout/BorderContainer",
	"dojo/dom-geometry",
	"dojo/_base/lang",
	"ttl/store/JsonRest",
	"dojo/store/Observable",
	"ttl/grid/Grid",
	"ttl/utilities2",
	"dojo/topic",
	"dojo/request",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",		
	"dojox/data/JsonRestStore",
	"dijit/layout/StackContainer",
	"dijit/layout/ContentPane",
	"dijit/layout/TabContainer",
	"dijit/Toolbar",
	"dijit/form/Button",
	"dijit/form/ValidationTextBox",
	"dijit/form/DateTextBox",
	"dijit/form/NumberTextBox",
	"dijit/form/CurrencyTextBox",
	"dijit/form/CheckBox",
	"dijit/form/Textarea",
	"dijit/form/Form",
	"dijit/form/FilteringSelect"
	], function(declare, BaseWidgetAMD, template, BorderContainer, domgeom, lang, JsonRest, Observable, Grid, utilities2, topic, request, domattr, domclass, ItemFileReadStore){
 return declare("prcommon2.newcustomer.PaymentCollectDetails2",
	[BaseWidgetAMD],{
	templateString: template,
	gutters:false,
		widgetsInTemplate: true,
		isprofessional_only:false,
		termid:-1,
		cost:1000.00,
		companyname:"",
		advancefeatures:false,
	constructor: function()
	{
		this.terms = new ItemFileReadStore({ url:"/common/lookups?searchtype=terms"});

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
			domclass.add(this.advancefeatures_row_view,"prmaxhidden");
			domclass.add(this.term_view,"prmaxhidden");
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
		request.post('/eadmin/cost_modules',
			utilities2.make_params({data: this.form.get("value")})).
			then(this._CostCallback);				

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
		request.post('/eadmin/proforma',
			utilities2.make_params({data: this.form.get("value")})).
			then(this._ProformaCallBack);			
	}
});
});