//>>built
require({cache:{"url:research/questionnaires/templates/UserModified.html":"<div><img data-dojo-attach-event=\"onclick:_swap_data_view\" data-dojo-attach-point=\"change_view\" class=\"prmaxhidden\" src=\"prcommon/images/view_emphasised.png\"></img></div>"}});define("research/questionnaires/UserModified",["dojo/_base/declare","ttl/BaseWidgetAMD","dojo/text!../questionnaires/templates/UserModified.html","dojo/request","ttl/utilities2","dojo/json","dojo/_base/lang","dojo/topic","dojo/dom-attr","dojo/dom-class"],function(_1,_2,_3,_4,_5,_6,_7,_8,_9,_a){return _1("research.questionnaires.UserModified",[_2],{templateString:_3,constructor:function(){this._user_data=null;this._research_data=null;this._parent_control=null;this._mode=0;},postCreate:function(){this.inherited(arguments);},load:function(_b,_c,_d){this._parent_control=_d;this._parent_control.set("value",_b);this._user_data=_b;this._research_data=_c;this._mode=0;_a.remove(this.change_view,"prmaxhidden");},clear:function(){_a.add(this.change_view,"prmaxhidden");_9.set(this.change_view,"src","prcommon/images/view_emphasised.png");this._user_data=null;this._research_data=null;this._mode=0;},_swap_data_view:function(){if(this._mode==0){_9.set(this.change_view,"src","prcommon/images/view.png");this._parent_control.set("value",this._research_data);this._mode=1;}else{_9.set(this.change_view,"src","prcommon/images/view_emphasised.png");this._parent_control.set("value",this._user_data);this._mode=0;}}});});