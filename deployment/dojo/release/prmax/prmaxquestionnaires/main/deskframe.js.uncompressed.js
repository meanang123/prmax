require({cache:{
'url:prmaxquestionnaires/main/templates/deskframe.html':"<div>\r\n\t<div data-dojo-type=\"prmaxquestionnaires/main/deskbanner\" data-dojo-props='region:\"top\",style:\"width:100%;height:62px\",title:\"Banner\"'></div>\r\n\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-attach-point=\"zone_cont\" data-dojo-props='region:\"center\",doLayout:true'>\r\n\t\t<div  data-dojo-props='style:\"width:100%;height:100%\",title:\"maindetails\"' data-dojo-attach-point=\"maindetails\" data-dojo-type=\"prmaxquestionnaires/pages/DeskDetails\" ></div>\r\n\t\t<div  data-dojo-props='style:\"width:100%;height:100%\",title:\"journalists\"' data-dojo-attach-point=\"journalists\" data-dojo-type=\"prmaxquestionnaires/pages/Journalists\" ></div>\r\n\t\t<div  data-dojo-props='style:\"width:100%;height:100%\",title:\"Related Outlets\"' data-dojo-attach-point=\"related_outlets\" data-dojo-type=\"prmaxquestionnaires/pages/RelatedOutlets\" ></div>\r\n\t</div>\r\n\t<div  data-dojo-props='region:\"bottom\",style:\"height:55px;width:100%;overflow:hidden\"' data-dojo-attach-point=\"bottom_panel\" data-dojo-type=\"dijit/layout/ContentPane\">\r\n\t\t<table style=\"width:100%;border-collapse:collapse;\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\">\r\n\t\t\t<tr>\r\n\t\t\t\t<td><img src=\"/prmax_common_s/images/prmax_logo.png\" height=\"51px\" width=\"118px\"></td>\r\n\t\t\t\t<td><p class=\"footer_text\">Contact PRmax. Email <a data-dojo-attach-point=\"support_email_address\" href=\"mailto:updates@prmax.co.uk\" target=\"_blank\">updates@prmax.co.uk</a></p></td>\r\n\t\t\t\t<td><p class=\"footer_text\"><a href=\"http://app.prmax.co.uk/static2/html/prmax-data-use-policy.html\" target=\"_blank\">Data Protection statement</a></p></td>\r\n\t\t\t\t<td><p class=\"footer_text\"><a href=\"http://app.prmax.co.uk/static2/html/prmax-copyright-statement.html\" target=\"_blank\">Copyright statement</a></p></td>\r\n\t\t\t\t<td align=\"right\">\r\n\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_update_save\" data-dojo-attach-point=\"savebtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='float:\"right\",type:\"button\",busyLabel:\"Please Wait\",label:\"Save\"'></button>\r\n\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_update_prev\" data-dojo-attach-point=\"prevbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='\"class\":\"prmaxhidden\",float:\"right\",type:\"button\",busyLabel:\"Please Wait\",label:\"Prev\"'></button>\r\n\t\t\t\t\t<button data-dojo-attach-event=\"onClick:_update_next\" data-dojo-attach-point=\"nextbtn\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-props='float:\"right\",type:\"button\",busyLabel:\"Please Wait\",label:\"Next\"'></button>\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t</table>\r\n\t</div>\r\n</div>\r\n"}});
define("prmaxquestionnaires/main/deskframe", [
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/topic",
	"dojo/text!../main/templates/deskframe.html",
	"dijit/layout/BorderContainer",
	"dojo/_base/lang",
	"dojo/dom-class",
	"dojo/dom-attr",
	"dojox/collections/Dictionary",
	"dijit/layout/ContentPane",
	"dijit/layout/StackContainer",
	"prmaxquestionnaires/main/deskbanner",
	"prmaxquestionnaires/pages/DeskDetails"
], function(declare, BaseWidgetAMD, topic, template, BorderContainer, lang, domclass, domattr, Dictionary){

 return declare("prmaxquestionnaires.main.deskframe",
	[BaseWidgetAMD, BorderContainer],{
	questionnaireid:-1,
	gutters:true,
	templateString: template,
	constructor: function()
	{
		topic.subscribe("/show_page", lang.hitch(this, this._show_page_call));
		this._current_page = "title";
		this._pages_control = new Dictionary();
		this._save_sequence= null;
		this.reset_controls_back = lang.hitch(this, this.reset_controls);
	},
	postCreate:function()
	{
		// setup page control
		this._pages_control.add("title", {next:"journalists", prev:null,save:true, ctrl: this.maindetails, saves:new Array()});
		this._pages_control.add("journalists", {next:"related_outlets", prev:"title",save:true, ctrl: this.journalists, saves:new Array()});
		this._pages_control.add("related_outlets", {next:null, prev:"journalists",save:true, ctrl: this.related_outlets, saves:new Array()});

		var page = this._pages_control.item("title");
		page.saves.push(this._pages_control.item("related_outlets"));

		page = this._pages_control.item("related_outlets");
		page.saves.push(this._pages_control.item("title"));

		page = this._pages_control.item("journalists");
		page.saves.push(this._pages_control.item("title"));
		page.saves.push(this._pages_control.item("related_outlets"));

		if ( PRMAX.questionnaire.outlet.outlet.countryid == 119)
		{
			domattr.set(this.support_email_address,"href","mailto:researchgroup@prmax.co.uk");
			domattr.set(this.support_email_address,"innerHTML","researchgroup@prmax.co.uk");
		}

		this.inherited(arguments);

	},
	_show_page_call:function ( pagename )
	{
		switch ( pagename)
		{
		case "title":
			this.zone_cont.selectChild( this.maindetails);
			this._current_page = "title";
			break;
		case "journalists":
			this.zone_cont.selectChild( this.journalists);
			this._current_page = "journalists";
			break;
		case "related_outlets":
			this.zone_cont.selectChild( this.related_outlets);
			this._current_page = "related_outlets";
			break;
		}
		this._enable_controls();

		topic.publish("/shop_page_tab",pagename);
	},
	_update_next:function()
	{
		var page_details = this._pages_control.item(this._current_page);

		if (page_details.save != null)
		{
			page_details.ctrl.save_move(
			lang.hitch(this, this.move_page_next, page_details),
			this.reset_controls_back);
		}
		else
		{
			this._show_page_call(page_details.next);
			throw "N";
		}
	},
	move_page_next:function( page_ctrl )
	{
		this._show_page_call(page_ctrl.next);
	},
	move_page_prev:function( page_ctrl )
	{
		this._show_page_call(page_ctrl.prev);
	},
	_update_prev:function()
	{
		var page_details = this._pages_control.item(this._current_page);

		if (page_details.save != null)
		{
			page_details.ctrl.save_move(
			lang.hitch(this, this.move_page_prev, page_details),
			this.reset_controls_back);
		}
		else
		{
			this._show_page_call(page_details.prev);
			throw "N";
		}
	},
	_save_completed:function()
	{
		var page_details = this._save_sequence.pop();
		if (page_details)
		{
			page_details.ctrl.save_move(
					lang.hitch(this, this._save_completed, page_details),this.reset_controls_back);
		}
		else
		{
			this.savebtn.cancel();
			alert("Saved");
		}
	},
	_update_save:function()
	{
		var page_details = this._pages_control.item(this._current_page);

		if (page_details.save != null)
		{
			this._save_sequence = new Array();
			for ( var key in page_details.saves)
				this._save_sequence.push(page_details.saves[key]);

			page_details.ctrl.save_move(
				lang.hitch(this, this._save_completed, page_details),this.reset_controls_back);
		}
	},
	_enable_controls:function()
	{
		var page_details = this._pages_control.item(this._current_page);

		if ( page_details.next == null )
			domclass.add(this.nextbtn.domNode,"prmaxhidden");
		else
			domclass.remove(this.nextbtn.domNode,"prmaxhidden");

		if ( page_details.prev == null )
			domclass.add(this.prevbtn.domNode,"prmaxhidden");
		else
			domclass.remove(this.prevbtn.domNode,"prmaxhidden");

		if ( page_details.save == null )
			domclass.add(this.savebtn.domNode,"prmaxhidden");
		else
			domclass.remove(this.savebtn.domNode,"prmaxhidden");


		this.reset_controls();

	},
	reset_controls:function()
	{
		this.nextbtn.cancel();
		this.prevbtn.cancel();
		this.savebtn.cancel();
	}
});
});
