//>>built
require({cache:{"url:prcommon2/clippings/analysis/templates/edit.html":"<div>\r\n\t<div data-dojo-attach-point=\"borderControl\" data-dojo-type=\"dijit/layout/BorderContainer\"  style=\"width:100%;height:100%;overflow: hidden\" data-dojo-props=\"gutters:false\">\r\n\t\t<div data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-attach-point=\"controls\" data-dojo-props='region:\"top\",style:\"height:44px;width:100%;overflow:hidden\"'>\r\n\t\t\t<div data-dojo-type=\"dijit/Toolbar\" data-dojo-props='style:\"height:99%;width:100%;padding:0px;margin:0px\"'>\r\n\t\t\t\t<div data-dojo-attach-point=\"save_analysis_btn\" data-dojo-attach-event=\"onClick:_save\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-floppy-o fa-3x\",label:\"Update Analysis\"'></div>\r\n\t\t\t\t<div data-dojo-attach-point=\"upd_analysis_btn\" data-dojo-attach-event=\"onClick:_update\" data-dojo-type=\"dijit/form/Button\" data-dojo-props='iconClass:\"fa fa-cog fa-3x\",label:\"Setup Analysis\",\"class\":\"prmaxhidden\"'></div>\r\n \t\t\t</div>\r\n\t\t</div>\r\n\t\t<div data-dojo-type=\"dijit/layout/StackContainer\" data-dojo-props='region:\"center\",splitter:false' data-dojo-attach-point=\"analysis_view_ctrl\">\r\n\t\t\t<div data-dojo-attach-point=\"display_zone\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%\",selected:\"selected\"'></div>\r\n\t\t\t<div data-dojo-attach-point=\"edit_zone\" data-dojo-type=\"dijit/layout/ContentPane\" data-dojo-props='style:\"width:100%;height:100%\"'></div>\r\n\t</div>\r\n</div>\r\n"}});define("prcommon2/clippings/analysis/edit",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../analysis/templates/edit.html","dijit/layout/BorderContainer","ttl/utilities2","dojo/topic","dojo/request","dojo/_base/lang","dojo/string"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9){return _1("prcommon2.clippings.analysis.edit",[_2,_4],{templateString:_3,constructor:function(){this._save_call_back=_8.hitch(this,this._save_call);_6.subscribe("/clipping/update",_8.hitch(this,this._update_clipping_event));this._ignore=false;},clear:function(){this.display_zone.set("content","");this.analysis_view_ctrl.selectChild(this.display_zone);},load:function(_a){this.clear();this._clippingid=_a;this.display_zone.set("href",_9.substitute("/clippings/analyse/analysis_clip_view_amd?clippingid=${clippingid}&${cache}",{clippingid:_a,cache:_5.get_prevent_cache_param()}));},_update_clipping_event:function(_b){if(this._ignore==false){this.load(_b.clippingid);}},_save:function(){var _c=dijit.byId("form_clip_"+this._clippingid);if(_5.form_validator(_c)==false){alert("Invalid Value");return;}_7.post("/clippings/analyse/update",_5.make_params({data:_c.get("value")})).then(this._save_call_back);},_save_call:function(_d){if(_d.success=="OK"){this._ignore=true;_6.publish("/clipping/update",_d.data);this._ignore=false;alert("Updated");}else{alert("Problem");}},resize:function(){this.borderControl.resize(arguments[0]);},_update:function(){}});});