//>>built
define("control/customer/extendedsettings",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../admin/templates/extendedsettings.html","ttl/utilities2","dojo/request","dojo/_base/lang","dojo/dom-style","dojo/dom-attr","dojo/dom-class","dojo/data/ItemFileReadStore","dijit/ProgressBar"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){return _1("control.admin.extendedsettings",[_2],{templateString:_3,constructor:function(){this._update_call_back=_6.hitch(this,this._update_call);},load:function(_b,_c){this.search_show_job_roles.set("checked",_b.search_show_job_roles);this.search_show_coverage.set("checked",_b.search_show_coverage);this.search_show_profile.set("checked",_b.search_show_profile);this.search_show_smart.set("checked",_b.search_show_smart);this.view_outlet_results_colours.set("checked",_b.view_outlet_results_colours);this.no_distribution.set("checked",_b.no_distribution);this.no_export.set("checked",_b.no_export);this.has_clickthrought.set("checked",_b.has_clickthrought);this.customerid.set("value",_b.customerid);this.distributionistemplated.set("checked",_b.distributionistemplated);this.cla.set("checked",false);this.nla.set("checked",false);this.extended_security.set("checked",_b.extended_security);this.required_client.set("checked",_b.required_client);this.valid_ips.set("value",_b.valid_ips);if(_c!=null&&_c.length>0){for(var i=0;i<_c.length;i++){if(_c[i]==2){this.cla.set("checked",true);}if(_c[i]==3){this.nla.set("checked",true);}}}},_update:function(){var _d=this.form.get("value");_5.post("/extendedsettings/update_extendedsettings",_4.make_params({data:_d})).then(this._update_call_back);},_update_call:function(_e){if(_e.success=="OK"){dojo.publish("extended_settings",[_e.data]);alert("Updated");}else{alert("Problem");}this.updatebtn.cancel();}});});