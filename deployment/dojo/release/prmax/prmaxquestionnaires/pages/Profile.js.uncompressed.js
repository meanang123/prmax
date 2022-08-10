require({cache:{
'url:prmaxquestionnaires/pages/templates/Profile.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"left\",style:\"width:50%;height:100%\"' class=\"scrollpanel\" >\r\n\t\t<form  data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t\t<input data-dojo-props='type:\"hidden\",name:\"questionnaireid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"questionnaireid\">\r\n\t\t\t<table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\">\r\n\t\t\t\t<tr data-dojo-attach-point=\"publisher_std_view\"><td align=\"right\" class=\"prmaxrowtag\" width=\"120px\">Publisher</td><td><select data-dojo-props='style:\"width:25em\",name:\"publisherid\",autoComplete:true,searchAttr:\"publishername\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"publisherid\"></select></td><tr>\r\n\t\t\t\t<tr data-dojo-attach-point=\"publisher_text_view\"><td align=\"right\" class=\"prmaxrowtag\" width=\"120px\">Add New Publisher</td><td><input data-dojo-attach-point=\"publishername\" data-dojo-props='name:\"publishername\",type:\"text\",trim:true,style:\"width:70%\",required:false' data-dojo-type=\"dijit/form/ValidationTextBox\"></input></td><tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Primary Language</td><td><select data-dojo-props='style:\"width:15em\",name:\"language1id\",autoComplete:true,searchAttr:\"name\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"language1id\"></select></td><tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Other Language</td><td><select data-dojo-props='style:\"width:15em\",name:\"language2id\",autoComplete:true,searchAttr:\"name\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"language2id\"></select></td><tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Editorial Profile</td><td ><div class=\"fixedtextframe\" ><textarea data-dojo-attach-point=\"editorialprofile\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"editorialprofile\",style:\"width:99%;height:99%\"'  ></textarea></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Readership/Audience</td><td ><div class=\"fixedtextframe\" ><textarea data-dojo-attach-point=\"readership\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"readership\",style:\"width:99%;height:99%\"'  ></textarea></div></td></tr>\r\n\t\t\t\t<tr data-dojo-attach-point=\"productioncompany_view\"><td align=\"right\" class=\"prmaxrowtag\">Production Company</td><td><select data-dojo-props='style:\"width:15em\",name:\"productioncompanyid\",autoComplete:true,searchAttr:\"productioncompanydescription\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"productioncompanyid\"></select></td><tr>\r\n\t\t\t\t<tr data-dojo-attach-point=\"broadcasttimes_view\"><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Broadcast Times</td><td ><div class=\"fixedsmalltextframe\" ><textarea data-dojo-attach-point=\"broadcasttimes\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"broadcasttimes\",style:\"width:99%;height:99%\"'  ></textarea></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Circulation</td><td><input data-dojo-attach-point=\"circulation\" data-dojo-type=\"dijit/form/NumberTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"circulation\",type:\"text\",value:0,constraints:{min:0,max:99999999}, trim:true'/></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Circulation Source</td><td><select data-dojo-props='style:\"width:15em\",name:\"circulationsourceid\",autoComplete:true,searchAttr:\"circulationsourcedescription\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"circulationsourceid\"></select></td><tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Circulation Date</td><td><select data-dojo-props='style:\"width:15em\",name:\"circulationauditdateid\",autoComplete:true,searchAttr:\"circulationauditdatedescription\",required:false,placeHolder:\"No Selection\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"circulationauditdateid\"></select></td><tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Frequency</td><td>\t<select data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-props='name:\"frequencyid\",autoComplete:true,searchAttr:\"name\",required:true,invalidMessage:\"Please select frequency\",labelType:\"html\"' data-dojo-attach-point=\"frequency\"></select></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Frequency Notes</td><td ><div class=\"fixedsmalltextframe\" ><textarea data-dojo-attach-point=\"frequencynotes\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"frequencynotes\",style:\"width:99%;height:99%\"'  ></textarea></div></td></tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Cost</td><td><select data-dojo-props='style:\"width:10em\",name:\"outletpriceid\",autoComplete:true,searchAttr:\"name\",required:false,placeHolder:\"\"' data-dojo-type=\"dijit/form/FilteringSelect\" data-dojo-attach-point=\"outletpriceid\"></select></td><tr>\r\n\t\t\t</table>\r\n\t\t</form>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='region:\"right\",style:\"width:50%;height:100%\"' class=\"scrollpanel\" >\r\n\t\t<table width=\"100%\" cellspacing=\"2\" cellpadding=\"2\">\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\"width=\"120px\">Related Outlets</td><td data-dojo-attach-point=\"relatedoutlets_view\"></td><tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" valign=\"top\">Changes</td><td ><div class=\"fixedtextframe\" ><textarea data-dojo-attach-point=\"relatedoutlets\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='style:\"width:99%;height:99%\"'></textarea></div></td></tr>\r\n\t\t</table>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    Profile.js
// Author:  Chris Hoy
// Purpose:
// Created: 15/02/2010
//
// To do:
//
//
//-----------------------------------------------------------------------------
define("prmaxquestionnaires/pages/Profile", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../pages/templates/Profile.html",
	"dijit/layout/BorderContainer",
	"dijit/layout/ContentPane",
	"dojo/topic",
	"dojo/_base/lang",
	"dojo/dom-attr",
	"dojo/dom-class",
	"ttl/utilities2",
	"dojo/request",
	"dojox/data/JsonRestStore",
	"dojo/data/ItemFileReadStore",
	"dojo/query",
	"dijit/layout/ContentPane",
	"dijit/form/Form",
	"dijit/form/TextBox",
	"dijit/form/FilteringSelect" ,
	"dijit/form/Button",
	"dojox/form/BusyButton",
	"dijit/Dialog",
	"dijit/form/Textarea",
	"dijit/form/NumberTextBox"
	], function(declare, BaseWidgetAMD, template, BorderContainer, ContentPane, topic,  lang, domattr,domclass, utilities2, request , JsonRestStore, ItemFileReadStore, query){
 return declare("prmaxquestionnaires.pages.Profile",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	gutters:false,
	constructor: function()
	{
		this._publishers = new JsonRestStore({target:'/questionnaire/list_publisher', labelAttribute:"publishername",idProperty:"publisherid"});
		this._circulationsources = new JsonRestStore({target:'/questionnaire/list_circulationsources', labelAttribute:"circulationsourcedescription", idProperty : "circulationsourceid"});
		this._circulationauditdates = new JsonRestStore({target:'/questionnaire/list_circulationdates', labelAttribute:"circulationauditdatedescription", idProperty : "circulationauditdateid"});
		this._productioncompanies = new JsonRestStore({target:'/questionnaire/list_production', idProperty:"productioncompanyid"});


		this._costs = new ItemFileReadStore ({ url:"/common/lookups?searchtype=outletprices"});
		this._languages = new ItemFileReadStore ({ url:"/common/lookups?searchtype=languages&nofilter=1"});

		this._update_call_back = lang.hitch(this, this._update_call);
		this._error_call_back = lang.hitch(this, this._error_handler);
		this._page_ctrl = null;
		this._page_error = null;

	},
	postCreate:function()
	{
		this.inherited(arguments);

		this.outletpriceid.set("store", this._costs);
		this.frequency.set("store",PRCOMMON.utils.stores.Frequency());
		this.circulationsourceid.set("store", this._circulationsources);
		this.circulationauditdateid.set("store", this._circulationauditdates);
		this.publisherid.set("query",{questionnaireid:PRMAX.questionnaire.questionnaireid});
		this.publisherid.set("store", this._publishers);

		this.productioncompanyid.set("store", this._productioncompanies);

		this.language1id.set("store", this._languages);
		this.language2id.set("store", this._languages);

		this._show_fields_by_type();
		this.load(PRMAX.questionnaire);

	},
	load:function( questionnaire )
	{
		with ( questionnaire )
		{
			if (outlet.outlet.outletpriceid==null)
				this.outletpriceid.set("value", 1);
			else
				this.outletpriceid.set("value", outlet.outlet.outletpriceid);
			this.circulation.set("value", outlet.outlet.circulation ) ;
			this.frequency.set("value", outlet.outlet.frequencyid ) ;
			this.circulationsourceid.set("value", outlet.outlet.circulationsourceid );
			this.circulationauditdateid.set("value",outlet.outlet.circulationauditdateid);
			this.publisherid.set("value", outlet.outlet.publisherid );
			this.language1id.set("value", outlet.language1id);
			this.language2id.set("value", outlet.language2id);
			this.relatedoutlets.set("value", outlet.relatedoutlets);
			//this.publishername.set("value", outlet.publishername);

			if (outlet.outletprofile.profile)
			{
				if (outlet.outletprofile.profile.editorialprofile != null)
					this.editorialprofile.set("value", outlet.outletprofile.profile.editorialprofile.replace(/<br\/>/gi, "\n"));
				this.readership.set("value",outlet.outletprofile.profile.readership);
				this.broadcasttimes.set("value",outlet.outletprofile.profile.broadcasttimes);
				this.frequencynotes.set("value", outlet.outletprofile.profile.frequencynotes);
				this.productioncompanyid.set("value", outlet.outletprofile.profile.productioncompanyid);
			}
			else
			{
				this.editorialprofile.set("value", "");
				this.readership.set("value", "");
				this.broadcasttimes.set("value","");
				this.frequencynotes.set("value", "");
				this.productioncompanyid.set("value",-1);
			}


			if ( outlet.outlet.countryid == 119 )
			{
				domclass.add(this.publisher_std_view,"prmaxhidden");
				domclass.remove(this.publisher_text_view,"prmaxhidden");
			}
		}

		domattr.set(this.relatedoutlets_view,"innerHTML",questionnaire.relatedoutlets_view);
		this.questionnaireid.set("value",questionnaire.questionnaireid);
	},
	_update_profile:function()
	{
		if ( utilities2.form_validator(this.form)==false)
		{
			alert("Not all required field filled in");
			if (this._page_error)
				this._page_error();
			throw "n";
		}

		var content=this.form.get("value");
		content["relatedoutlets"] = this.relatedoutlets.get("value");

		request.post('/questionnaire/update_profile',
			utilities2.make_params({ data : content })).
			then(this._update_call_back, this._error_call_back);
	},
	_update_call:function( response)
	{
		if ( response.success == "OK")
		{
			if (this._page_ctrl)
			{
				this._page_ctrl();
			}
			else
				alert("Profile Updated");
		}
		else
		{
			alert("Changes Failed to Apply");
			if ( this._page_error)
				this._page_error();
		}
	},
	_error_handler:function(response, ioArgs)
	{
		utilities2.xhr_post_error(response, ioArgs);
		if (this._page_error)
			this._page_error();
	},
	save_move:function( page_ctrl, error_ctrl )
	{
		this._page_ctrl = page_ctrl;
		this._page_error = error_ctrl;
		this._update_profile();
	},
	_show_fields_by_type:function()
	{
		if (PRMAX.questionnaire.outlet.outlet.isbroadcast==false)
		{
			domclass.add(this.productioncompany_view,"prmaxhidden");
			domclass.add(this.broadcasttimes_view,"prmaxhidden");
		}
	}
});
});





