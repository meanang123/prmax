require({cache:{
'url:research/outlets/templates/OutletEditMainDetails.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"overflow:auto;overflow-x:hidden\",region:\"center\"' >\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"outletid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"outletid\">\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"searchtypeid\",value:\"3\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t\t<table width=\"98%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td width=\"120px\" align=\"right\" class=\"prmaxrowtag\">Outlets Name</td><td><input data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"outletname\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter outletname\"' data-dojo-attach-point=\"outletname\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Sort Name</td><td><input data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"sortname\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter sortname\",uppercase:true' data-dojo-attach-point=\"sortname\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Sub Title</td><td ><div class=\"framesmall\" ><textarea data-dojo-attach-point=\"subtitle\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"subtitle\",style:\"width:99%;height:99%\"'  ></textarea></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Official Journal of</td><td ><div class=\"framesmall\" ><textarea data-dojo-attach-point=\"officialjournalof\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"officialjournalof\",style:\"width:99%;height:99%\"'  ></textarea></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Incorporating</td><td ><div class=\"framesmall\" ><textarea data-dojo-attach-point=\"incorporating\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"incorporating\",style:\"width:99%;height:99%\"'  ></textarea></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">House/Street</td><td><input data-dojo-attach-point=\"address1\" data-dojo-props='name:\"address1\",type:\"text\",trim:true,required:false,style:\"width:70%\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Street/District</td><td><input data-dojo-attach-point=\"address2\"data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true,style:\"width:70%\"'></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true,style:\"width:70%\"' ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true,style:\"width:70%\"' ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Post Code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"' ></input></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Country</td><td><select data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"countryid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select Country Name\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",maxlength:40,trim:true,style:\"width:60%\"' /></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"fax\",type:\"text\",maxlength:40, trim:true,style:\"width:60%\"'/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress, trim:true,invalidMessage:\"invalid email address\",size:20,maxlength:70,style:\"width:90%\"'></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Www</td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<span><input data-dojo-attach-point=\"www\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"www\",type:\"text\",maxlength:\"120\",pattern:dojox.validate.regexp.url,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"www_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"twitter\",pattern:dojox.validate.regexp.url,type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"twitter_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"facebook_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"linkedin_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"instagram_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Circulation</td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<span><input data-dojo-attach-point=\"circulation\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"circulation\",type:\"text\",value:0,constraints:{min:0,max:999999999}, trim:true'/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"circulation_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Circulation Source</td><td><select data-dojo-props='style:\"width:15em\",name:\"circulationsourceid\",autoComplete:true,searchAttr:\"circulationsourcedescription\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"circulationsourceid\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Circulation Date</td><td><select data-dojo-props='style:\"width:15em\",name:\"circulationauditdateid\",autoComplete:true,searchAttr:\"circulationauditdatedescription\",required:false,placeHolder:\"No Selection\",pageSize:20' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"circulationauditdateid\"></select></td></tr>\r\n\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Web Browsers</td><td><input data-dojo-attach-point=\"webbrowsers\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"webbrowsers\",type:\"text\",value:0,constraints:{min:0,max:999999999}, trim:true'/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Web Source</td><td><select data-dojo-props='style:\"width:15em\",name:\"websourceid\",autoComplete:true,searchAttr:\"websourcedescription\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"websourceid\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Web Date</td><td><select data-dojo-props='style:\"width:15em\",name:\"webauditdateid\",autoComplete:true,searchAttr:\"webauditdatedescription\",required:false,placeHolder:\"No Selection\",pageSize:20' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"webauditdateid\"></select></td></tr>\r\n\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Frequency</td><td>\t<select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"frequencyid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select frequency\",labelType:\"html\"' data-dojo-attach-point=\"frequency\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Frequency Notes</td><td ><div class=\"stdtextframe\" ><textarea data-dojo-attach-point=\"frequencynotes\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"frequencynotes\",style:\"width:99%;height:99%\"'  ></textarea></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Cost</td><td><select data-dojo-props='style:\"width:10em\",name:\"outletpriceid\",autoComplete:true,searchAttr:\"name\",required:false,placeHolder:\"\"' data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"outletpriceid\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Media Access Type</td><td><select data-dojo-props='style:\"width:10em\",name:\"mediaaccesstypeid\",autoComplete:true,searchAttr:\"name\",required:false,placeHolder:\"\"' data-dojo-type=\"dijit/form/Select\" data-dojo-attach-point=\"mediaaccesstypeid\"></select></td></tr>\r\n\t\t\t\t\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Do not synchronise</td><td><p data-dojo-attach-point=\"no_sync\" data-dojo-type=\"dijit/form/CheckBox\" data-dojo-props='type:\"checkbox\"' ></p></td></tr>\r\n\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:3em;padding-right:3px;\"'>\r\n\t\t<table width=\"99%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick:_delete\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Delete Outlet\"'></button></td>\r\n\t\t\t\t\t<td align=\"left\"><button data-dojo-attach-event=\"onClick:_synchronise\" data-dojo-attach-point='synchrbtn' data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",\"class\":\"prmaxhidden\",label:\"Synchronise\"'></button></td>\r\n\t\t\t\t\t\t<div data-dojo-attach-point=\"synchronise_dlg\" data-dojo-type=\"dijit/Dialog\" title=\"Synchronise Employees\" data-dojo-props='style:\"width:350px\"'>\r\n\t\t\t\t\t\t\t<div data-dojo-type=\"prcommon2/dialogs/SynchroniseDialog\" data-dojo-attach-point=\"synchronise_node\"></div>\r\n\t\t\t\t\t\t</div>\t\t\t\t\t\t\r\n\t\t\t\t\t\r\n\t\t\t\t\t<td align=\"right\"><label class=\"prmaxrowtag\">Reason</label><select data-dojo-attach-point=\"reasoncodeid\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",\"class\":\"prmaxrequired\",style:\"width:120px\"'></select></td>\r\n\t\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"updatebtn\" data-dojo-attach-event=\"onClick:_update\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Saving Outlet...\",label:\"Save\"'></button></td>\r\n\t\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"outlet_delete_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Delete Outlet\"'>\r\n\t\t<div data-dojo-attach-point=\"outlet_delete_ctrl\" data-dojo-type=\"research/outlets/OutletDelete\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"circulationsource_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Circulation Source Add\"'>\r\n\t\t<div data-dojo-attach-point=\"circulationsource_add_ctrl\" data-dojo-type=\"prcommon2/circulation/CirculationSourcesAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"circulationdates_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Circulation Dates Add\"'>\r\n\t\t<div data-dojo-attach-point=\"circulationdates_add_ctrl\" data-dojo-type=\"prcommon2/circulation/CirculationDatesAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"websource_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Web Source Add\"'>\r\n\t\t<div data-dojo-attach-point=\"websource_add_ctrl\" data-dojo-type=\"prcommon2/web/WebSourcesAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"webdates_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Web Dates Add\"'>\r\n\t\t<div data-dojo-attach-point=\"webdates_add_ctrl\" data-dojo-type=\"prcommon2/web/WebDatesAdd\"></div>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    OutletEditMainDetails.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/02/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("research/outlets/OutletEditMainDetails", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlets/templates/OutletEditMainDetails.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
	"dojo/dom-attr",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/ValidationTextBox",
	"dijit/form/FilteringSelect",
	"dojox/validate/regexp",
	"dijit/form/Button",
	"dijit/form/NumberTextBox",
	"prcommon2/interests/Interests",
	"prcommon2/geographical/Geographical",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dojox/validate",
	"research/outlets/OutletDelete",
	"prcommon2/web/WebSourcesAdd",
	"prcommon2/web/WebDatesAdd",
	"prcommon2/circulation/CirculationSourcesAdd",
	"prcommon2/circulation/CirculationDatesAdd",
	"prcommon2/web/WebButton",
	"prcommon2/dialogs/SynchroniseDialog"
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request, domattr, JsonRestStore, ItemFileReadStore ){
 return declare("research.outlets.OutletEditMainDetails",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._updated_call_back = lang.hitch ( this , this._updated_call );
		this._media_only_call_back = lang.hitch(this, this._media_only_call );
		this._synchronise_call_back = lang.hitch ( this, this._synchronise_call);
		this._complete_call_back = lang.hitch(this, this._complete_call);
		this._deleted_call_back = lang.hitch(this,this._deleted_call);

		this._circulationsources = new JsonRestStore( {target:'/research/admin/circulationsources/list', labelAttribute:"circulationsourcedescription",idProperty:"circulationsourceid"});
		this._circulationauditdates = new JsonRestStore( {target:'/research/admin/circulationdates/list', labelAttribute:"circulationauditdatedescription",idProperty:"circulationauditdateid"});
		this._websources = new JsonRestStore( {target:'/research/admin/websources/list', labelAttribute:"websourcedescription",idProperty:"websourceid"});
		this._webauditdates = new JsonRestStore( {target:'/research/admin/webdates/list', labelAttribute:"webauditdatedescription",idProperty:"webauditdateid"});
		this._costs = new ItemFileReadStore ({ url:"/common/lookups?searchtype=outletprices"});
		this._mediaaccesstypes = new ItemFileReadStore ({ url:"/common/lookups?searchtype=mediaaccesstypes"});

		topic.subscribe(PRCOMMON.Events.Outlet_Updated, lang.hitch(this,this._outlet_update_event));

	},
	postCreate:function()
	{
		this.frequency.set("store",PRCOMMON.utils.stores.Frequency());
		this.reasoncodeid.set("store",PRCOMMON.utils.stores.Research_Reason_Update_Codes());
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());

		this.circulationsource_add_ctrl.set("dialog", this.circulationsource_add_dlg);
		this.circulationsourceid.set("store", this._circulationsources);
		this.circulationdates_add_ctrl.set("dialog", this.circulationdates_add_dlg);
		this.circulationauditdateid.set("store", this._circulationauditdates);

		this.websource_add_ctrl.set("dialog", this.websource_add_dlg);
		this.websourceid.set("store", this._websources);
		this.webdates_add_ctrl.set("dialog", this.webdates_add_dlg);
		this.webauditdateid.set("store", this._webauditdates);

		this.outletpriceid.set("store", this._costs);
		this.mediaaccesstypeid.set("store", this._mediaaccesstypes);

		this.www_show.set("source", this.www);
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.linkedin_show.set("source",this.linkedin);
		this.instagram_show.set("source",this.instagram);
		this.circulation_show.set("source", "https://www.abc.org.uk/");

		this.inherited(arguments)
	},

	_deleted_call:function(response)
	{
		if (response.success == "DEL")
		{
			if (confirm("Outlet '" + response.data.outlet_name + "' with domain '" + response.data.domain + "' has previously asked to be deleted.\nDo you want to proceed?"))
			{
				var data = this.form.get("value");
				data["reasoncodeid"] = this.reasoncodeid.get("value");
				data["no_sync"] = this.no_sync.get("checked");
				request.post('/research/admin/outlets/research_main_update',
					utilities2.make_params({ data : data})).
					then ( this._updated_call_back);			
			}
		}
		else
		{
			var data = this.form.get("value");
			data["reasoncodeid"] = this.reasoncodeid.get("value");
			data["no_sync"] = this.no_sync.get("checked");
			request.post('/research/admin/outlets/research_main_update',
				utilities2.make_params({ data : data})).
				then ( this._updated_call_back);			
		}
		this.updatebtn.cancel();
	},

	
	_updated_call: function( response)
	{
		if ( response.success=="OK")
		{
			alert("Updated");
			topic.publish(PRCOMMON.Events.Outlet_Updated,response.data);
			this._clear_reason();
		}
		else
		{
			alert("Failed to updated");
		}
		this.updatebtn.cancel();
	},
	_outlet_update_event:function(data)
	{
		if (data.comm.tel != this.tel.get("value"))
		{
			this.tel.set("value", data.comm.tel)
		}
		if (data.comm.fax != this.fax.get("value"))
		{
			this.fax.set("value", data.comm.fax)
		}
	},
	clear:function()
	{
	},
	_clear_reason:function()
	{
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
		this.updatebtn.cancel();
	},
	load:function( outletid, outlet, profile )
	{
		this._clear_reason();
		this._outletid = outletid;
		this.outletname.set("value", outlet.outlet.outletname ) ;
		this.sortname.set("value",outlet.outlet.sortname);
		this.countryid.set("value",outlet.outlet.countryid);
		this.address1.set("value",outlet.address.address1);
		this.address2.set("value",outlet.address.address2);
		this.townname.set("value",outlet.address.townname);
		this.county.set("value",outlet.address.county);
		this.postcode.set("value",outlet.address.postcode);

		this.circulation.set("value", outlet.outlet.circulation ) ;
		this.webbrowsers.set("value", outlet.outlet.webbrowsers ) ;
		this.frequency.set("value", outlet.outlet.frequencyid ) ;

		this.www.set("value",outlet.outlet.www);
		this.email.set("value",outlet.communications.email);
		this.tel.set("value",outlet.communications.tel);
		this.fax.set("value",outlet.communications.fax);
		this.linkedin.set("value",outlet.communications.linkedin);
		this.twitter.set("value",outlet.communications.twitter);
		this.facebook.set("value",outlet.communications.facebook);
		this.instagram.set("value",outlet.communications.instagram);

		this.circulationsourceid.set("value", outlet.outlet.circulationsourceid );
		this.circulationauditdateid.set("value",outlet.outlet.circulationauditdateid);
		this.websourceid.set("value", outlet.outlet.websourceid );
		this.webauditdateid.set("value",outlet.outlet.webauditdateid);
		if (outlet.outlet.outletpriceid==null)
			this.outletpriceid.set("value", 1);
		else
			this.outletpriceid.set("value", outlet.outlet.outletpriceid);
		if (outlet.outlet.mediaaccesstypeid==null)
			this.mediaaccesstypeid.set("value", 1);
		else
			this.mediaaccesstypeid.set("value", outlet.outlet.mediaaccesstypeid);

		if (profile.profile)
		{
			this.subtitle.set("value", profile.profile.subtitle);
			this.officialjournalof.set("value", profile.profile.officialjournalof);
			this.incorporating.set("value", profile.profile.incorporating);
			this.frequencynotes.set("value", profile.profile.frequencynotes);
		}
		else
		{
			this.subtitle.set("value", "");
			this.officialjournalof.set("value", "");
			this.incorporating.set("value", "");
			this.frequencynotes.set("value", "");
		}
		this.no_sync.set("value", outlet.researchdetails.no_sync);


		this.outletid.set("value",outlet.outlet.outletid);
		this.reasoncodeid.set("value", PRCOMMON.utils.stores.Reason_Upd_Default);
	},
	_setCheckedAttr:function( value )
	{
		this.no_sync.set("checked",value);
	},
	_update: function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			this.updatebtn.cancel();
			throw "N"
		}

		var data = this.form.get("value");
		data["no_sync"] = this.no_sync.get("checked");
		request.post('/research/admin/outlets/research_check',
			utilities2.make_params({ data : data})).
			then(this._deleted_call_back);


		// add the reason code
//		var tmp_data = this.form.get("value");
//		tmp_data["reasoncodeid"] = this.reasoncodeid.get("value");
//		tmp_data["no_sync"] = this.no_sync.get("checked");

//		 request.post('/research/admin/outlets/research_main_update',
//			utilities2.make_params({ data : tmp_data})).
//			then (this._updated_call_back);
	},
	_delete:function()
	{
			this.outlet_delete_ctrl.load ( this._outletid, this.outletname.get("value") , this.outlet_delete_dlg);
			this.outlet_delete_dlg.show();
	},
	_media_only_call:function ( response )
	{
		if ( response.success == "OK" )
		{
			alert("Social Media Only Updated");
		}
		else
		{
			alert("Problem Updating Social Media Only");
		}
	},
	_update_media_only:function()
	{
		if ( this.twitter.isValid() == false ||
				this.facebook.isValid() == false ||
				this.instagram.isValid() == false ||
				this.linkedin.isValid() == false )
		{
			alert("Invalid Data");
			return false;
		}

		request.post("/research/admin/outlets/research_update_media",
			utilities2.make_params({ data : this.form.get("value")})).then
			(this._media_only_call_back);
	},
	_new_circulation_source:function()
	{
		this.circulationsource_add_ctrl.clear();
		this.circulationsource_add_dlg.show();

	},
	_new_circulation_date:function()
	{
		this.circulationdates_add_ctrl.clear();
		this.circulationdates_add_dlg.show();
	},
	_add_circulation_source_event:function( circulationsource )
	{
		this.circulationsourceid.set("value", circulationsource.circulationsourceid);
	},
	_add_circulation_dates_event:function( circulationdates )
	{
		this.circulationauditdateid.set("value", circulationdates.circulationauditdateid);
	},

	_new_web_source:function()
	{
		this.websource_add_ctrl.clear();
		this.websource_add_dlg.show();
	},
	_new_web_date:function()
	{
		this.webdates_add_ctrl.clear();
		this.webdates_add_dlg.show();
	},
	_add_web_source_event:function( websource )
	{
		this.websourceid.set("value", websource.websourceid);
	},
	_add_web_dates_event:function( webdates )
	{
		this.webauditdateid.set("value", webdates.webauditdateid);
	},
	_synchronise:function()
	{
		var content = {};
		var parent_outletid =  this._outletid;
		content['outletid'] = parent_outletid;

		this.synchronise_dlg.show();
		this.synchronise_node.SetCompleted(this._complete_call_back);
		this.synchronise_node.start(content);

	},
	_synchronise_call:function( response )
	{
		if ( response.success=="OK")
		{
			alert("Employees Synchronised");
			this._complete_call();
		}
		else
		{
			alert("Employees Synchronisation Failed");
		}
	},
	_complete_call:function()
	{
		this.synchrbtn.cancel();
		this.synchronise_dlg.hide();
	}

});
});





