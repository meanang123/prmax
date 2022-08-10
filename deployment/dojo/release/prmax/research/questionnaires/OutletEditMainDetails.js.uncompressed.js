require({cache:{
'url:research/questionnaires/templates/OutletEditMainDetails.html':"<div >\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"overflow:auto;overflow-x:hidden\",region:\"center\"' >\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"researchprojectitemid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"researchprojectitemid\">\r\n\t\t\t<table width=\"98%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Outlets Name</td><td><input data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"outletname\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter outletname\"' data-dojo-attach-point=\"outletname\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"outletname_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Sort Name</td><td><input data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"sortname\",type:\"text\",trim:true,required:true,invalidMessage:\"Please enter outlet sort name\",uppercase:true' data-dojo-attach-point=\"sortname\" data-dojo-type=\"dijit/form/ValidationTextBox\" ></input></td><td></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Sub Title</td><td ><div class=\"framesmall\" ><textarea data-dojo-attach-point=\"subtitle\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"subtitle\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"subtitle_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Official Journal of</td><td ><div class=\"framesmall\" ><textarea data-dojo-attach-point=\"officialjournalof\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"officialjournalof\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"officialjournalof_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Incorporating</td><td ><div class=\"framesmall\" ><textarea data-dojo-attach-point=\"incorporating\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"incorporating\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"incorporating_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">House/Street</td><td><input data-dojo-attach-point=\"address1\" data-dojo-props='name:\"address1\",type:\"text\",trim:true,required:false,style:\"width:70%\"' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"address1_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Street/District</td><td><input data-dojo-attach-point=\"address2\"data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"address2\",type:\"text\",trim:true,style:\"width:70%\"'></input></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"address2_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Town</td><td><input data-dojo-attach-point=\"townname\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"townname\",type:\"text\",trim:true,style:\"width:70%\"' ></input></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"townname_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">County</td><td><input data-dojo-attach-point=\"county\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"county\",type:\"text\",trim:true,style:\"width:70%\"' ></input></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"county_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Post Code</td><td><input data-dojo-attach-point=\"postcode\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"postcode\",type:\"text\",trim:true,style:\"width:10em\"' ></input></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"postcode_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Country</td><td><select data-dojo-props='style:\"width:90%\",\"class\":\"prmaxrequired\",name:\"countryid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select Country Name\",labelType:\"html\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"countryid\"></select></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"countryid_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Www</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"www\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"www\",type:\"text\",maxlength:\"120\",pattern:dojox.validate.regexp.url,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"www_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"www_modified\"></div></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Email</td><td><input data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"email\",type:\"text\",pattern:dojox.validate.regexp.emailAddress, trim:true,invalidMessage:\"invalid email address\",size:20,maxlength:70,style:\"width:90%\"'></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"email_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Tel</td><td><input data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"tel\",type:\"text\",maxlength:40,trim:true,style:\"width:60%\"' /></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"tel_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Fax</td><td><input data-dojo-attach-point=\"fax\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"fax\",type:\"text\",maxlength:40, trim:true,style:\"width:60%\"'/></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"fax_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Twitter</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='name:\"twitter\",pattern:dojox.validate.regexp.url,type:\"text\",maxlength:80,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"twitter_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"twitter_modified\"></div></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Facebook</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"facebook\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"'/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"facebook_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"facebook_modified\"></div></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Linkedin</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"linkedin\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"linkedin\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"linkedin_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"linkedin_modified\"></div></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Instagram</td>\r\n\t\t\t\t\t<td><span><input data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"instagram\",type:\"text\",maxlength:80,pattern:dojox.validate.regexp.url,trim:true,style:\"width:90%\"' /></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"instagram_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t\t<td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"instagram_modified\"></div></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Circulation</td><td><input data-dojo-attach-point=\"circulation\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"circulation\",type:\"text\",value:0,constraints:{min:0,max:99999999}, trim:true,style:\"width:8em\"'/></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"circulation_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Circulation Source</td><td><select data-dojo-props='style:\"width:15em\",name:\"circulationsourceid\",autoComplete:true,searchAttr:\"circulationsourcedescription\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"circulationsourceid\"></select></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"circulationsourceid_modified\"></div></td><tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Circulation Date</td><td><select data-dojo-props='style:\"width:15em\",name:\"circulationauditdateid\",autoComplete:true,searchAttr:\"circulationauditdatedescription\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"circulationauditdateid\"></select></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"circulationauditdateid_modified\"></div></td><tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Frequency</td><td><select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"frequencyid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select frequency\",labelType:\"html\"' data-dojo-attach-point=\"frequencyid\"></select></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"frequencyid_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Frequency Notes</td><td ><div class=\"stdtextframe\" ><textarea data-dojo-attach-point=\"frequencynotes\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"frequencynotes\",style:\"width:99%;height:99%\"'  ></textarea></div></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"frequencynotes_modified\"></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Cost</td><td><select data-dojo-props='style:\"width:10em\",name:\"outletpriceid\",autoComplete:true,searchAttr:\"name\",required:true,placeHolder:\"\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"outletpriceid\"></select></td><td><div data-dojo-type=\"research/questionnaires/UserModified\" data-dojo-attach-point=\"outletpriceid_modified\"></div></td></tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"bottom\",style:\"width:100%;height:3em;padding-right:3px;\"'>\r\n\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\"><button data-dojo-attach-point=\"updatebtn\" data-dojo-attach-event=\"onClick:_update\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='type:\"button\",busyLabel:\"Please Wait Updating Outlet...\",label:\"Update Outlet\"'></button></td>\r\n\t\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"circulationsource_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Circulation Source Add\"'>\r\n\t\t<div data-dojo-attach-point=\"circulationsource_add_ctrl\" data-dojo-type=\"prcommon2/circulation/CirculationSourcesAdd\"></div>\r\n\t</div>\r\n\t<div data-dojo-attach-point=\"circulationdates_add_dlg\" data-dojo-type=\"dijit/Dialog\" data-dojo-props='title:\"Circulation Dates Add\"'>\r\n\t\t<div data-dojo-attach-point=\"circulationdates_add_ctrl\" data-dojo-type=\"prcommon2/circulation/CirculationDatesAdd\"></div>\r\n\t</div>\r\n</div>\r\n"}});
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
define("research/questionnaires/OutletEditMainDetails", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../questionnaires/templates/OutletEditMainDetails.html",
	"dijit/layout/BorderContainer",
	"dojo/topic",
	"dojo/_base/lang",
	"ttl/utilities2",
	"dojo/request",
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
	"research/questionnaires/UserModified",
	"prcommon2/circulation/CirculationSourcesAdd",
	"prcommon2/circulation/CirculationDatesAdd",
	"prcommon2/web/WebButton"	
	], function(declare, BaseWidgetAMD, template, BorderContainer, topic,  lang, utilities2, request, JsonRestStore, ItemFileReadStore ){
 return declare("research.questionnaires.OutletEditMainDetails",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:true,
	constructor: function()
	{
		this._circulationsources = new JsonRestStore( {target:'/research/admin/circulationsources/list', labelAttribute:"circulationsourcedescription", idProperty:"circulationsourceid"});
		this._circulationauditdates = new JsonRestStore( {target:'/research/admin/circulationdates/list', labelAttribute:"circulationauditdatedescription", idProperty:"circulationauditdateid"});
		this._costs = new ItemFileReadStore ({ url:"/common/lookups?searchtype=outletprices"});

		this._updated_call_back = lang.hitch ( this , this._updated_call );
	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.frequencyid.set("store",PRCOMMON.utils.stores.Frequency());
		this.countryid.set("store",PRCOMMON.utils.stores.Countries());

		this.circulationsource_add_ctrl.set("dialog", this.circulationsource_add_dlg);
		this.circulationsourceid.set("store", this._circulationsources);
		this.circulationdates_add_ctrl.set("dialog", this.circulationdates_add_dlg);
		this.circulationauditdateid.set("store", this._circulationauditdates);

		this.outletpriceid.set("store", this._costs);

		this.www_show.set("source", this.www);
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.linkedin_show.set("source",this.linkedin);		
		this.instagram_show.set("source",this.instagram);		
	},
	_updated_call: function( response)
	{
		if ( response.success=="OK")
		{
			alert("Updated");
			topic.publish(PRCOMMON.Events.Outlet_Updated,response.data);
		}
		else
		{
			alert("Failed to updated");
		}
		this.updatebtn.cancel();
	},
	clear:function()
	{
		this.updatebtn.cancel();
		this._reset_fields();
	},
	_reset_fields:function()
	{
		this.outletname_modified.clear();
		this.email_modified.clear();
		this.tel_modified.clear();
		this.fax_modified.clear();
		this.address1_modified.clear();
		this.address2_modified.clear();
		this.townname_modified.clear();
		this.county_modified.clear();
		this.postcode_modified.clear();
		this.www_modified.clear();
		this.twitter_modified.clear();
		this.facebook_modified.clear();
		this.linkedin_modified.clear();
		this.instagram_modified.clear();
		this.subtitle_modified.clear();
		this.officialjournalof_modified.clear();
		this.incorporating_modified.clear();
		this.outletpriceid_modified.clear();
		this.countryid_modified.clear();
		this.frequencyid_modified.clear();
		this.circulationauditdateid_modified.clear();
		this.circulationsourceid_modified.clear();
		this.circulation_modified.clear();
		this.frequencynotes_modified.clear();

	},
	load:function( projectitem, outlet, user_changes)
	{
		this._reset_fields();

		this.outletname.set("value", outlet.outlet.outletname ) ;
		this.sortname.set("value", outlet.outlet.sortname );
		this.frequencyid.set("value", outlet.outlet.frequencyid ) ;
		this.address1.set("value",outlet.address.address1);
		this.address2.set("value",outlet.address.address2);
		this.townname.set("value",outlet.address.townname);
		this.county.set("value",outlet.address.county);
		this.postcode.set("value",outlet.address.postcode);
		this.countryid.set("value",outlet.outlet.countryid);
		this.circulation.set("value",outlet.outlet.circulation);

		this.www.set("value",outlet.outlet.www);
		this.email.set("value",outlet.communications.email);
		this.tel.set("value",outlet.communications.tel);
		this.fax.set("value",outlet.communications.fax);
		this.linkedin.set("value",outlet.communications.linkedin);
		this.twitter.set("value",outlet.communications.twitter);
		this.facebook.set("value",outlet.communications.facebook);
		this.instagram.set("value",outlet.communications.instagram);

		if (outlet.profile.profile)
		{
			this.subtitle.set("value", outlet.profile.profile.subtitle);
			this.officialjournalof.set("value", outlet.profile.profile.officialjournalof);
			this.incorporating.set("value", outlet.profile.profile.incorporating);
			this.frequencynotes.set("value", outlet.profile.profile.frequencynotes);
		}
		else
		{
			this.subtitle.set("value", "");
			this.officialjournalof.set("value", "");
			this.incorporating.set("value", "");
			this.frequencynotes.set("value","");
		}

		this.researchprojectitemid.set("value",projectitem.researchprojectitemid);

		var circulationauditdateid_set = false;
		var circulationsourceid_set = false;
		var outletpriceid_set = false;

		for (var key in user_changes)
		{
			var  change_record = user_changes[key]

			switch (change_record.fieldid)
			{
				case 9: // outletname
					this.outletname_modified.load(change_record.value, outlet.outlet.outletname, this.outletname);
					break;
				case 4 : // email
					this.email_modified.load(change_record.value, outlet.communications.email, this.email);
					break;
				case 5: // tel
					this.tel_modified.load(change_record.value, outlet.communications.tel, this.tel);
					break;
				case 6: //fax
					this.fax_modified.load(change_record.value, outlet.communications.fax, this.fax);
					break;
				case 12: // address 1
					this.address1_modified.load(change_record.value, outlet.address.address1, this.address1);
					break;
				case 13: // address 2
					this.address2_modified.load(change_record.value, outlet.address.address2, this.address2);
					break;
				case 14: // townname
					this.townname_modified.load(change_record.value, outlet.address.townname, this.townname);
					break;
				case 15: // county
					this.county_modified.load(change_record.value, outlet.address.county, this.county);
					break;
				case 16: // post code
					this.postcode_modified.load(change_record.value, outlet.address.postcode, this.postcode);
					break;
				case 17: // www
					this.www_modified.load(change_record.value, outlet.outlet.www, this.www);
					break;
				case 18: // circulation
					this.circulation_modified.load(change_record.value, outlet.outlet.circulation, this.circulation);
					break;
				case 19: // frequency
					this.frequencyid_modified.load(change_record.value, outlet.outlet.frequencyid, this.frequencyid);
					break;
				case 25: // twitter
					this.twitter_modified.load(change_record.value, outlet.communications.twitter, this.twitter);
					break;
				case 26: // facebook
					this.facebook_modified.load(change_record.value, outlet.communications.facebook, this.facebook);
					break;
				case 27: // Country Id
					this.countryid_modified.load(change_record.value, outlet.outlet.countryid, this.countryid);
					break;
				case 28: // linkedin
					this.linkedin_modified.load(change_record.value, outlet.communications.linkedin, this.linkedin);
					break;
				case 72: // instagram
					this.instagram_modified.load(change_record.value, outlet.communications.instagram, this.instagram);
					break;
				case 30: // Circulation_Source
					this.circulationsourceid_modified.load(change_record.value, outlet.outlet.circulationsourceid, this.circulationsourceid);
					circulationsourceid_set = true;
					break;
				case 31: // Circulation Date
					this.circulationauditdateid_modified.load(change_record.value, outlet.outlet.circulationauditdateid, this.circulationauditdateid);
					circulationauditdateid_set = true;
					break;
				case 37: // price
					this.outletpriceid_modified.load(change_record.value, outlet.outlet.outletpriceid, this.outletpriceid);
					outletpriceid_set = true ;
					break;
				case 33 : //sub-title
					subtitle = "";
					if (outlet.profile.profile)
						subtitle = outlet.profile.profile.subtitle;
					this.subtitle_modified.load(change_record.value, subtitle, this.subtitle);
					break;
				case 34: //incorporating
					incorporating = "";
					if (outlet.profile.profile)
						incorporating = outlet.profile.profile.incorporating;
					this.incorporating_modified.load(change_record.value, incorporating, this.incorporating);
					break;
				case 35: // officialjournalof
					officialjournalof = "";
					if (outlet.profile.profile)
						officialjournalof = outlet.profile.profile.officialjournalof;
					this.officialjournalof_modified.load(change_record.value, officialjournalof, this.officialjournalof);
					break;
				case 39: // frequency notes
					frequencynotes = "";
					if (outlet.profile.profile)
						frequencynotes = outlet.profile.profile.frequencynotes;
					this.frequencynotes_modified.load(change_record.value, frequencynotes, this.frequencynotes);
					break;
			}
		}

		//set default for drop down if not et in overrides
		if (circulationauditdateid_set == false )
			this.circulationauditdateid.set("value", outlet.outlet.circulationauditdateid);
		if (circulationsourceid_set == false )
			this.circulationsourceid.set("value",outlet.outlet.circulationsourceid);
		if ( outletpriceid_set == false )
		{
			if ( outlet.outlet.outletpriceid==null)
				this.outletpriceid.set("value", 1);
			else
				this.outletpriceid.set("value", outlet.outlet.outletpriceid);
		}
	},
	_update: function()
	{
		if (utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			return;
		}

		this.updatebtn.makeBusy();

		request.post('/research/admin/projects/user_feed_accept_main',
				utilities2.make_params({ data : this.form.get("value")})).
				then (this._updated_call_back);
	}

});
});





