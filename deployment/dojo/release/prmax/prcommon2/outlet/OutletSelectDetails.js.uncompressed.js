require({cache:{
'url:prcommon2/outlet/templates/OutletSelectDetails.html':"<div>\r\n\t<div data-dojo-type=\"dijit/layout/TabContainer\" data-dojo-props='region:\"center\"'>\r\n\t\t<div data-dojo-attach-point=\"details\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Outlet Details\",\"class\":\"scrollpanel\"'>\r\n\t\t\t<table cellspacing=\"0\" cellpadding=\"1\" width=\"99%\" style=\"margin-top:5px\">\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Outlet Name</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"outletname\",type:\"text\", disabled:true, style:\"width:400px;\"' data-dojo-attach-point=\"outletname\" data-dojo-type=\"dijit/form/TextBox\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Web</td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<span><input data-dojo-props='name:\"www\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"www\" data-dojo-type=\"dijit/form/TextBox\"/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"www_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Address</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"address\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"address\" data-dojo-type=\"dijit/form/TextBox\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Country</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"country\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"country\" data-dojo-type=\"dijit/form/FilteringSelect\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Tel</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"tel\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"tel\" data-dojo-type=\"dijit/form/TextBox\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Email</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"email\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"email\" data-dojo-type=\"dijit/form/TextBox\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Twitter</td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<span><input data-dojo-props='name:\"twitter\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"twitter\" data-dojo-type=\"dijit/form/TextBox\"/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"twitter_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Facebook</td>\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<span><input data-dojo-props='name:\"facebook\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"facebook\" data-dojo-type=\"dijit/form/TextBox\"/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"facebook_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Instagram</td>\r\n\r\n\t\t\t\t\t<td>\r\n\t\t\t\t\t\t<span><input data-dojo-props='name:\"instagram\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"instagram\" data-dojo-type=\"dijit/form/TextBox\"/></span>\r\n\t\t\t\t\t\t<span><div data-dojo-attach-point=\"instagram_show\" data-dojo-type=\"prcommon2/web/WebButton\"></div></span>\r\n\t\t\t\t\t</td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Circulation</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"circulation\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"circulation\" data-dojo-type=\"dijit/form/TextBox\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Frequency</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"frequency\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"frequency\" data-dojo-type=\"dijit/form/FilteringSelect\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Cost</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"cost\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"cost\" data-dojo-type=\"dijit/form/FilteringSelect\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Sqcm</td>\r\n\t\t\t\t\t<td><input data-dojo-props='sqcm:\"type\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"sqcm\" data-dojo-type=\"dijit/form/TextBox\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Type</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"prmax_outlettypeid\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"prmax_outlettypeid\" data-dojo-type=\"dijit/form/FilteringSelect\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" class=\"prmaxrowtag\" width=\"20%\">Keywords</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"keywords\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"keywords\" data-dojo-type=\"dijit/form/Textarea\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t\t<div data-dojo-attach-point=\"profile\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%\",title:\"Outlet Profile\",\"class\":\"scrollpanel\"'>\r\n\t\t\t<table cellspacing=\"0\" cellpadding=\"1\" width=\"99%\" style=\"margin-top:5px\">\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" class=\"prmaxrowtag\" width=\"20%\">Profile</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"profile\",type:\"text\", disabled:true, style:\"width:400px;\"' data-dojo-attach-point=\"profile\" data-dojo-type=\"dijit/form/Textarea\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" class=\"prmaxrowtag\" width=\"20%\">Publisher</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"publisherid\", type:\"text\", disabled:true, style:\"width:400px;\"' data-dojo-attach-point=\"publisherid\" data-dojo-type=\"dijit/form/FilteringSelect\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" class=\"prmaxrowtag\" width=\"20%\">Editorial Profile</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"editorialprofile\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"editorialprofile\" data-dojo-type=\"dijit/form/Textarea\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" class=\"prmaxrowtag\" width=\"20%\">Language</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"language\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"language\" data-dojo-type=\"dijit/form/FilteringSelect\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" class=\"prmaxrowtag\" width=\"20%\">Readership/Audience</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"readership\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"readership\" data-dojo-type=\"dijit/form/Textarea\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" class=\"prmaxrowtag\" width=\"20%\">PAMco</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"nrsreadership\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"nrsreadership\" data-dojo-type=\"dijit/form/Textarea\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" class=\"prmaxrowtag\" width=\"20%\">JICREG Readership</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"jicregreadership\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"jicregreadership\" data-dojo-type=\"dijit/form/Textarea\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" class=\"prmaxrowtag\" width=\"20%\">Coverage</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"coverage\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"coverage\" data-dojo-type=\"dijit/form/Textarea\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" class=\"prmaxrowtag\" width=\"20%\">Broadcast Times</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"broadcasttimes\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"broadcasttimes\" data-dojo-type=\"dijit/form/Textarea\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t\t<tr>\r\n\t\t\t\t\t<td align=\"right\" valign=\"top\" class=\"prmaxrowtag\" width=\"20%\">Series Members</td>\r\n\t\t\t\t\t<td><input data-dojo-props='name:\"serieschildren\",type:\"text\",disabled:true, style:\"width:400px\"' data-dojo-attach-point=\"serieschildren\" data-dojo-type=\"dijit/form/Textarea\"/></td>\r\n\t\t\t\t</tr>\r\n\t\t\t</table>\r\n\t\t</div>\r\n\t</div>\r\n\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:40px\",region:\"bottom\"'>\r\n\t\t<table cellspacing=\"0\" cellpadding=\"1\" width=\"99%\">\r\n\t\t\t<tr>\r\n\t\t\t\t<td width=\"33%\" align=\"left\" data-dojo-attach-point=\"close_button\"><button data-dojo-type=\"dijit/form/Button\" data-dojo-props='type:\"button\",label:\"Close\"' data-dojo-attach-event=\"onClick:_close\"></button></td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n</div>\r\n"}});
//-----------------------------------------------------------------------------
// Name:    prcommon2.outlet.OutletSelect
// Author:  Chris Hoy
// Purpose:
// Created: 09/11/2012
//
// To do:
//
//-----------------------------------------------------------------------------
// Main control
define("prcommon2/outlet/OutletSelectDetails", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../outlet/templates/OutletSelectDetails.html",
	"dijit/layout/BorderContainer",
	"dojo/json",
	"dojo/request",
	"ttl/utilities2",
	"ttl/store/JsonRest",
	"dojox/data/JsonRestStore",
	"dojo/store/Observable",
	"dojo/_base/lang",
	"dojo/topic",
	"ttl/grid/Grid",
	"dojo/dom-attr",
	"dojo/dom-class",
	"dojo/data/ItemFileReadStore",
	"dojo/_base/array",
	"dijit/form/TextBox",
	"dijit/form/Button",
	"dijit/Dialog",
	"prcommon2/search/OutletSearch",
	"dijit/layout/ContentPane",
	"dojox/form/BusyButton",
	"prcommon2/web/WebButton",
	"dijit/layout/TabContainer",
	"dijit/form/Textarea"
	], function(declare, BaseWidgetAMD, template, BorderContainer, json, request, utilities2, JsonRest, JsonRestStore, Observable, lang, topic, Grid, domattr, domclass, ItemFileReadStore, array){
 return declare("prcommon2.outlet.OutletSelectDetails",
	[BaseWidgetAMD, BorderContainer],{
	templateString: template,
	constructor: function()
	{
		this._dialog = null;
		this._load_call_back = lang.hitch(this, this._load_call);
		this._costs = new ItemFileReadStore ({ url:"/common/lookups?searchtype=outletprices"});
		this._languages = new ItemFileReadStore ({ url:"/common/lookups?searchtype=languages&nofilter=1"});
		this._publishers = new ItemFileReadStore({url:"/common/lookups?searchtype=publishers"});

		this.outletid = '';

	},
	postCreate:function()
	{
		this.country.set("store",PRCOMMON.utils.stores.Countries());
		this.frequency.set("store",PRCOMMON.utils.stores.Frequency());
		this.prmax_outlettypeid.set("store",PRCOMMON.utils.stores.OutletTypes());
		this.cost.set("store", this._costs);
		this.language.set("store", this._languages);
		this.publisherid.set("store", this._publishers);

		this.www_show.set("source",this.www);
		this.facebook_show.set("source",this.facebook);
		this.twitter_show.set("source",this.twitter);
		this.instagram_show.set("source",this.instagram);

		this.inherited(arguments);
	},
	_setDialogAttr:function (dialog)
	{
		this._dialog = dialog;
	},
	load:function(outletid, mode)
	{
		var url = '/research/admin/outlets/research_outlet_edit_get';
		if (mode == "clippings")
		{
			url = '/outlets/research_outlet_edit_get'
		}
		request.post(url,
				utilities2.make_params({ data : {outletid: outletid}})).
				then ( this._load_call_back);

	},
	_load_call:function(response)
	{
		this._dialog("show");

		if (response.success == 'OK')
		{
			var address = '';
			var interests = '';
			var coverage = '';
			var serieschildren = '';

			//address
			if (response.outlet.address.address1){ address = response.outlet.address.address1};
			if (response.outlet.address.address2){ address += ', ' + response.outlet.address.address2};
			if (response.outlet.address.townname){ address += ', ' + response.outlet.address.townname};
			if (response.outlet.address.postcode){ address += ', ' + response.outlet.address.postcode};
			//keywords
			if (response.outlet.interests.data.length > 0){
				for (var i=0; i<response.outlet.interests.data.length; i++)	{
					interests = interests + response.outlet.interests.data[i].interestname + ", ";
				}
				interests = interests.substring(0, interests.length-2);
			};
			//coverage
			if (response.outlet.coverage.length > 0){
				for (var i=0; i<response.outlet.coverage.length; i++)	{
					coverage = coverage + response.outlet.coverage[i].geographicalname + ", ";
				}
				coverage = coverage.substring(0, coverage.length-2);
			};
			//serieschildren
			if (response.outlet.serieschildren.length > 0){
				for (var i=0; i<response.outlet.serieschildren.length; i++)	{
					serieschildren = serieschildren + response.outlet.serieschildren[i].outletname + ", ";
				}
				serieschildren = serieschildren.substring(0, serieschildren.length-2);
			};

			this.outletname.set("value", response.outlet.outlet.outletname);
			this.www.set("value", response.outlet.outlet.www);
			this.address.set("value", address);
			this.country.set("value", response.outlet.outlet.countryid);
			this.tel.set("value", response.outlet.communications.tel);
			this.email.set("value", response.outlet.communications.email);
			this.twitter.set("value", response.outlet.communications.twitter);
			this.facebook.set("value", response.outlet.communications.facebook);
			this.instagram.set("value", response.outlet.communications.instagram);
			this.circulation.set("value", response.outlet.outlet.circulation);
			this.frequency.set("value", response.outlet.outlet.frequencyid);
			this.prmax_outlettypeid.set("value", response.outlet.outlet.prmax_outlettypeid);
			this.cost.set("value", response.outlet.outlet.outletpriceid);
			this.sqcm.set("value", response.outlet.outlet.mp_sqcm);
			this.keywords.set("value", interests);

			this.publisherid.set("value", response.outlet.outlet.publisherid );
			this.language.set("value", response.outlet.languages.language1id);
			this.profile.set("value", response.outlet.outlet.profile);
			if (response.outlet.profile.profile != null)
			{
				this.editorialprofile.set("value", response.outlet.profile.profile.editorialprofile);
				this.readership.set("value", response.outlet.profile.profile.readership);
				this.nrsreadership.set("value", response.outlet.profile.profile.nrsreadership);
				this.jicregreadership.set("value", response.outlet.profile.profile.jicregreadership);
				this.broadcasttimes.set("value", response.outlet.profile.profile.broadcasttimes);
			}

			this.coverage.set("value", coverage);
			this.serieschildren.set("value", serieschildren);
		}
	},
	_close:function()
	{

		if ( this._dialog)
			this._dialog("hide");
		this._clear();
	},
	_clear:function()
	{
		this.outletname.set("value", "");
		this.www.set("value", "");
		this.address.set("value", "");
		this.country.set("value", "");
		this.tel.set("value", "");
		this.email.set("value", "");
		this.twitter.set("value", "");
		this.facebook.set("value", "");
		this.instagram.set("value", "");
		this.circulation.set("value", "");
		this.frequency.set("value", "");
		this.prmax_outlettypeid.set("value", "");
		this.cost.set("value", "");
		this.sqcm.set("value", "");
		this.keywords.set("value", "");

		this.publisherid.set("value", "" );
		this.language.set("value", "");
		this.profile.set("value", "");
		this.editorialprofile.set("value", "");
		this.readership.set("value", "");
		this.nrsreadership.set("value", "");
		this.jicregreadership.set("value", "");
		this.broadcasttimes.set("value", "");
		this.coverage.set("value", "");
		this.serieschildren.set("value", "");
	}
});
});
