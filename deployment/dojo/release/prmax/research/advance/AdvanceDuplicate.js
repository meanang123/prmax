//>>built
require({cache:{"url:research/advance/templates/AdvanceDuplicate.html":"<div style=\"width:600px;height:200px;\" >\r\n\t<form  data-dojo-attach-point=\"form\" data-dojo-type=\"dijit/form/Form\" data-dojo-props='onsubmit:\"return false;\",\"class\":\"prmaxdefault\"' >\r\n\t\t<input data-dojo-attach-point=\"advancefeatureid\" data-dojo-props='name:\"advancefeatureid\",type:\"hidden\"' data-dojo-type=\"dijit/form/TextBox\" >\r\n\t\t<table width=\"100%\" class=\"prmaxtable\" cellpadding=\"0\" cellspacing=\"0\"  border =\"0\">\r\n\t\t\t<tr><td  align=\"center\" data-dojo-attach-point=\"heading\" class=\"prmaxrowdisplaylarge\" colspan=\"2\" ></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">New Feature</td><td ><input\r\n\t\t\tdata-dojo-attach-point=\"feature\" data-dojo-props='style:\"width:95%\",name:\"feature\",type:\"text\",required:true' data-dojo-type=\"dijit/form/ValidationTextBox\"></td></tr>\r\n\t\t\t<tr><td align=\"right\" class=\"prmaxrowtag\" width=\"20%\">Reason</td><td ><select data-dojo-attach-point=\"reasoncodes\" data-dojo-type =\"dijit/form/FilteringSelect\" data-dojo-props='name:\"reasoncodeid\",searchAttr:\"name\",labelType:\"html\",style:\"width:98%\",class:\"prmaxrequired\"'/></td></tr>\r\n\t\t</table>\r\n\t</form>\r\n\t<br/><br/>\r\n\t<button data-dojo-type=\"dijit/form/Button\" data-dojo-props='style:\"float:right;\",type:\"button\",name:\"submit\"' data-dojo-attach-event=\"onClick:_duplicate_button\" >Duplicate Feature</button>\r\n</div>\r\n"}});define("research/advance/AdvanceDuplicate",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../advance/templates/AdvanceDuplicate.html","dojo/request","ttl/utilities2","dojo/json","dojo/_base/lang","dojo/topic","dojo/dom-attr","dojo/dom-class","dijit/layout/ContentPane","dijit/form/Button"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){return _1("research.advance.AdvanceDuplicate",[_2],{templateString:_3,constructor:function(){this._duplicate_call_back=dojo.hitch(this,this._duplicate_call);},postCreate:function(){this.reasoncodes.set("store",PRCOMMON.utils.stores.Research_Reason_Add_Codes());this.reasoncodes.set("value",PRCOMMON.utils.stores.Reason_Add_Default);this.inherited(arguments);},_duplicate_button:function(){if(_5.form_validator(this.form)==false){alert("Not all required fields filled in");throw "N";}if(confirm("Duplicate Feature "+dojo.attr(this.heading,"innerHTML")+"?")){_4.post("/advance/research_duplicate",_5.make_params({data:this.form.get("value")})).then(this._duplicate_call_back);}},_duplicate_call:function(_b){if(_b.success=="OK"){_8.publish(PRCOMMON.Events.Feature_Added,_b.data);alert("Feature Duplicate");this._dialog.hide();this.clear();}else{alert("Problem Duplicating Feature");}},_setDialogAttr:function(_c){this._dialog=_c;},clear:function(){this.advancefeatureid.set("value",-1);this.feature.set("value","");this.reasoncodes.set("value",PRCOMMON.utils.stores.Reason_Add_Default);_9.set(this.heading,"innerHTML","");},load:function(_d,_e){this.advancefeatureid.set("value",_d);_9.set(this.heading,"innerHTML",_e);}});});