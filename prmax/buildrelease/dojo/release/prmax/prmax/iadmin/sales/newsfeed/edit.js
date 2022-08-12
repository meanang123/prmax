/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/


if(!dojo._hasResource["prmax.iadmin.sales.newsfeed.edit"]){dojo._hasResource["prmax.iadmin.sales.newsfeed.edit"]=true;dojo.provide("prmax.iadmin.sales.newsfeed.edit");dojo.require("ttl.BaseWidget");dojo.declare("prmax.iadmin.sales.newsfeed.edit",[ttl.BaseWidget],{templateString:dojo.cache("prmax","iadmin/sales/newsfeed/templates/edit.html","<div>\r\n\t<div data-dojo-attach-point=\"frame\" data-dojo-type=\"dijit.layout.BorderContainer\" data-dojo-props='gutters:false,style:\"width:100%;height:100%\", \"class\":\"bordered\"'>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"top\",style:\"overflow:auto;width:100%;height:30%\",splitter:true'>\r\n\t\t\t<form data-dojo-attach-point=\"form\" data-dojo-type=\"dijit.form.Form\" data-dojo-props='\"class\":\"prmaxdefault\",onsubmit:\"return false\"'>\r\n\t\t\t\t<input data-dojo-type=\"dijit.form.TextBox\" data-dojo-attach-point=\"newsfeedid\" data-dojo-props='type:\"hidden\", name:\"newsfeedid\"'>\r\n\t\t\t\t<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t\t\t<tr><td width=\"120px\" align=\"right\" class=\"prmaxrowtag\">Subject</td><td><input data-dojo-type=\"dijit.form.ValidationTextBox\" data-dojo-attach-point=\"subject\" data-dojo-props='\"class\":\"prmaxrequired\",name:\"subject\",required:true,trim:true,maxLength:120,type:\"text\",style:\"width:99%\"' ></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" valign=\"top\" class=\"prmaxrowtag\">Summary</td><td><textarea data-dojo-props='maxLength:254, \"class\":\"prmaxrequired\",name:\"summary\",rows:2,required:true,style:\"width:99%\"' data-dojo-type=\"ttl.form.ValidationTextarea\" data-dojo-attach-point=\"summary\"></textarea></td></tr>\r\n\t\t\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">News Type</td><td><select data-dojo-props='name:\"newsfeedtypeid\",autoComplete:\"true\",labelType:\"html\", required:true, style:\"width:15em\"' data-dojo-type=\"dijit.form.FilteringSelect\" data-dojo-attach-point=\"newsfeedtypeid\"></select></td></tr>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Valid From Date</td><td><input data-dojo-props='type:\"text\",name:\"embargo\",required:\"true\"' data-dojo-attach-point=\"embargo\" data-dojo-type=\"dijit.form.DateTextBox\" ></td>\r\n\t\t\t\t\t<tr><td class=\"prmaxrowtag\" align=\"right\" >Valid to Date</td><td><input data-dojo-props='type:\"text\",name:\"expire\",required:\"true\"' data-dojo-attach-point=\"expire\" data-dojo-type=\"dijit.form.DateTextBox\" ></td>\r\n\t\t\t\t</table>\r\n\t\t\t</form>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"center\",splitter:true'>\r\n\t\t\t<div data-dojo-type=\"dijit.Editor\" data-dojo-attach-point=\"newscontent\" data-dojo-props='name:\"newscontent\", \"class\":\"bordered\",extraPlugins:[{name:\"dijit._editor.plugins.FontChoice\",command:\"fontName\", generic:false},\"fontSize\",\"createLink\",\"viewsource\",\"preview\",\"ttlinsertimage\",\"insertCollateral\"],style:\"width:100%;height:100%\"' ></div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit.layout.ContentPane\" data-dojo-props='region:\"bottom\",style:\"overflow:auto;width:100%;height:12m\",splitter:true'>\r\n\t\t\t<button data-dojo-attach-point=\"updbtn\" data-dojo-type=\"dojox.form.BusyButton\" data-dojo-props='style:\"float:right;padding-right:20px\", busyLabel:\"Please Wait Updating News\", label:\"Update News Item\", \"class\":\"prmaxbutton\"' data-dojo-attach-event=\"onClick:_UpdateNews\" ></button>\r\n\t\t</div>\r\n\t</div>\r\n</div>\r\n"),constructor:function(){this._load_news_call_back=dojo.hitch(this,this._load_news_call);this._update_news_call_back=dojo.hitch(this,this._update_news_call);this._newsfeedtypes=new dojo.data.ItemFileReadStore({url:"/common/lookups?searchtype=newsfeedtypes",onError:ttl.utilities.globalerrorchecker,clearOnClose:true,urlPreventCache:true});},postCreate:function(){this.inherited(arguments);this.newsfeedtypeid.set("store",this._newsfeedtypes);this.newsfeedtypeid.set("value",1);},_load_news_call:function(_1){if(_1.success=="OK"){with(_1){this.newsfeedid.set("value",news.newsfeedid);this.subject.set("value",news.subject);this.summary.set("value",news.summary);this.newsfeedtypeid.set("value",news.newsfeedtypeid);this.embargo.set("value",ttl.utilities.fromObjectDate(news.embargo));this.expire.set("value",ttl.utilities.fromObjectDate(news.expire));this.newscontent.set("value",news.newscontent);}this._show_call(1,null);}},Load:function(_2,_3){this._show_call=_3;this.Clear();dojo.xhrPost(ttl.utilities.makeParams({load:this._load_news_call_back,url:"/iadmin/newsfeed/get",content:{newsfeedid:_2}}));},Clear:function(){this.updbtn.cancel();this.subject.set("value","");this.summary.set("value","");this.newsfeedtypeid.set("value",1);this.embargo.set("value",new Date());this.expire.set("value",new Date());this.newscontent.set("value","");},_update_news_call:function(_4){if(_4.success=="OK"){this._show_call(2,_4.news);alert("News Item Updated");}else{alert("Problem Updating");}this.updbtn.cancel();},_UpdateNews:function(){if(ttl.utilities.formValidator(this.form)==false){alert("Please Enter Details");this.updbtn.cancel();return false;}var _5=this.form.get("value");_5["embargo"]=ttl.utilities.toJsonDate(this.embargo.get("value"));_5["expire"]=ttl.utilities.toJsonDate(this.expire.get("value"));_5["newscontent"]=this.newscontent.get("value");dojo.xhrPost(ttl.utilities.makeParams({load:this._update_news_call_back,url:"/iadmin/newsfeed/update",content:_5}));},resize:function(){this.frame.resize(arguments[0]);this.inherited(arguments);}});}