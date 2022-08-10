//>>built
require({cache:{"url:research/advance/templates/researchadvance.html":"<div>\r\n\t<form data-dojo-type=\"dijit/form/Form\" data-dojo-attach-point=\"form\" data-dojo-props='onsubmit:\"return false;\"'>\r\n\t\t<input data-dojo-props='type:\"hidden\",name:\"outletid\",value:\"-1\"' data-dojo-type=\"dijit/form/TextBox\" data-dojo-attach-point=\"outletid\">\r\n\t\t<table style=\"width:100%;border-style:collapsed\" cellpadding=\"0\" cellspacing=\"0\">\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"120px\">Outlet Status</td><td><select data-dojo-attach-point=\"advancefeaturestatusid\" data-dojo-type=\"dijit/form/FilteringSelect\"  data-dojo-props='name:\"advancefeaturestatusid\",autoComplete:true,searchAttr:\"name\",labelAttr:\"name\",pageSize:20,required:true,labelType:\"html\"'>/select></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Research Date</td><td><input data-dojo-attach-point=\"advance_last_contact\" data-dojo-ptops='type:\"text\",name:\"advance_last_contact\",required:true,style:\"width:10em\"' data-dojo-type=\"dijit/form/DateTextBox\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">url</td><td><input data-dojo-attach-point=\"advance_url\" data-dojo-type=\"dijit/form/ValidationTextBox\" data-dojo-props='\"class\":\"prmaxinput\",name:\"advance_url\",type:\"text\",maxlength:\"120\",pattern:dojox.validate.regexp.url,style:\"width:98%\"'/></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\">Research Info</td><td>&nbsp;\t</td></tr>\r\n\t\t\t<tr><td colspan=\"2\"><div class=\"stdframe\" style=\"height:300px\"><textarea data-dojo-attach-point=\"advance_notes\" data-dojo-type=\"dijit/form/Textarea\" data-dojo-props='name:\"advance_notes\",style:\"height:300px;width:99%\"'></textarea></div></td></tr>\r\n\t\t\t<tr><td align=\"right\" colspan=\"2\"><button data-dojo-attach-point=\"savenode\" data-dojo-type=\"dojox/form/BusyButton\" data-dojo-attach-event=\"onClick:_save\" data-dojo-props='type:\"button\",\"class\":\"prmaxbutton\",busyLabel:\"Please Wait Saving ...\",label:\"Save\"'></button></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n</div>"}});define("research/advance/researchadvance",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../advance/templates/researchadvance.html","dijit/layout/ContentPane","ttl/grid/Grid","ttl/store/JsonRest","dojo/store/Observable","dojo/request","ttl/utilities2","dojo/json","dojo/data/ItemFileReadStore","dojo/_base/lang","dojo/topic"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a,_b,_c,_d){return _1("research.advance.researchadvance",[_2,_4],{templateString:_3,constructor:function(){this._save_call_back=_c.hitch(this,this._save_call);this._load_call_back=_c.hitch(this,this._load_call);this._advancefeaturestatusid=new _b({url:"/common/lookups?searchtype=advancefeaturestatus"});},postCreate:function(){this.advancefeaturestatusid.set("store",this._advancefeaturestatusid);this.inherited(arguments);},_save_call:function(_e){if(_e.success=="OK"){alert("Research Details Updated");}else{alert("Problem saving Research Details");}this.savenode.cancel();},_save:function(){if(_9.form_validator(this.form)==false){alert("Not all required field filled in");throw "N";}var d=this.advance_last_contact.get("value");var _f=this.form.get("value");_f["advance_last_contact"]=d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();_8.post("/advance/research_details_save",_9.make_params({data:_f})).then(this._save_call_back);},load:function(_10){this.outletid.set("value",_10);_8.post("/advance/getResearchExt",_9.make_params({data:{outletid:_10}})).then(this._load_call_back);},_load_call:function(_11){if(_11.success=="OK"){this.advance_last_contact.set("value",new Date(_11.data.advance_last_contact.year,_11.data.advance_last_contact.month-1,_11.data.advance_last_contact.day));this.advance_url.set("value",_11.data.advance_url);this.advance_notes.set("value",_11.data.advance_notes);this.advancefeaturestatusid.set("value",_11.data.advancefeaturestatusid);}else{alert("Problem Loading Research Details");}}});});