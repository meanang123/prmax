define([
	"dojo/_base/declare", // declare
	"ttl/BaseWidgetAMD",
	"dojo/text!../prmaxtouch/templates/keyboard.html",
	"dojo/dom-class",
	"dojo/topic",
	"dijit/Dialog"
	],
	function(declare, BaseWidgetAMD, template, domclass, topic){
return declare("prmaxtouch.keyboard",
	[BaseWidgetAMD],{
	templateString:template,
	shifton:false,
	lockon:false,
	inputstring:"",
	inputstart:0,
	inputend:0,
	isend:true,
	focuscontrol:null,
	prevcontrol:null,
	nextcontrol:null,
	constructor: function()
	{
	},

	postCreate:function()
	{
		this.inherited(arguments);
	},

	hold_focus:function()
	{
		topic.publish("dialog/hold_focus");
	},

	push_focus:function(focuscontrol,prevcontrol,nextcontrol,hasreturn,direction)
	{
		this.focuscontrol = focuscontrol;
		this.prevcontrol = prevcontrol;
		this.nextcontrol = nextcontrol;

		if (hasreturn)
		{
			domclass.remove(this.alphareturn, "pprhidden");
			domclass.remove(this.numberreturn, "pprhidden");
			domclass.remove(this.symbolreturn, "pprhidden");
		}
		else
		{
			domclass.add(this.alphareturn, "pprhidden");
			domclass.add(this.numberreturn, "pprhidden");
			domclass.add(this.symbolreturn, "pprhidden");
		}
		if (direction == 1 || direction == 3)
		{
			domclass.remove(this.nav_prev,"fa-arrow-circle-up");
			domclass.add(this.nav_prev,"fa-arrow-circle-left");
		}
		else
		{
			domclass.add(this.nav_prev,"fa-arrow-circle-up");
			domclass.remove(this.nav_prev,"fa-arrow-circle-left");
		}
		if (direction == 2 || direction == 3)
		{
			domclass.remove(this.nav_next,"fa-arrow-circle-down");
			domclass.add(this.nav_next,"fa-arrow-circle-right");
		}
		else
		{
			domclass.add(this.nav_next,"fa-arrow-circle-down");
			domclass.remove(this.nav_next,"fa-arrow-circle-right");
		}
	},

	push_string:function(pushstring)
	{
		this.inputstring = this.focuscontrol.value;
		this.inputstart = this.focuscontrol.selectionStart;
		this.inputend = this.focuscontrol.selectionEnd;

		if (!this.shifton)
			pushstring = pushstring.toLowerCase();
		if (!this.lockon)
		{
			domclass.remove(this.shiftpanelalpha,"input-button-on");
			domclass.remove(this.shiftpanelnumber,"input-button-on");
			domclass.remove(this.shiftpanelsymbol,"input-button-on");
			this.shifton = false;
			this._shift_off();
		}

		var currentlength = this.inputstring.length - (this.inputend - this.inputstart);
		if (this.focuscontrol)
		{
			if (this.inputstart < this.inputend && (currentlength < this.focuscontrol.maxLength || this.focuscontrol.maxLength == -1))
			{
				this.inputstring = this.inputstring.substring(0,this.inputstart) + this.inputstring.substring(this.inputend);
			}
			if (pushstring == "del")
			{
				if (this.inputstart == this.inputend)
				{
					if (this.inputstart == 0)
						this.inputstring = this.inputstring.substring(1);
					else
					{
						this.inputstring = this.inputstring.substring(0,this.inputstart - 1) + this.inputstring.substring(this.inputstart);
						this.inputstart -= 1;
					}
				}
			}
			else if (currentlength < this.focuscontrol.maxLength || this.focuscontrol.maxLength == -1)
			{
				this.inputstring = this.inputstring.substring(0,this.inputstart) + pushstring + this.inputstring.substring(this.inputstart);
				this.inputstart += 1;
			}

			topic.publish("keyboard/push_string",this.focuscontrol,this.inputstring,this.inputstart,this.inputstart);
			this.focuscontrol.focus();
		}
	},

	_close:function()
	{
		topic.publish("input/push_close");
	},

	move_up:function()
	{
		this.focuscontrol = this.prevcontrol;
		this.focuscontrol.focus();
		this.focuscontrol.click();
	},

	move_down:function()
	{
		this.focuscontrol = this.nextcontrol;
		this.focuscontrol.focus();
		this.focuscontrol.click();
	},

	move_left:function()
	{
		this.inputstring = this.focuscontrol.value;
		this.inputstart = this.focuscontrol.selectionStart;
		this.inputend = this.focuscontrol.selectionEnd;
		if (this.shifton)
		{
			if (this.inputstart == this.inputend)
			{
				if (this.inputstart > 0)
				{
					this.inputstart -= 1;
					this.isend = false;
				}
			}
			else
			{
				if (this.isend)
				{
					if (this.inputend > 0)
						this.inputend -= 1;
				}
				else
				{
					if (this.inputstart > 0)
						this.inputstart -= 1;
				}
			}
		}
		else
		{
			if (this.isend)
			{
				if (this.inputend > 0)
					this.inputend -= 1;
				this.inputstart = this.inputend;
			}
			else
			{
				if (this.inputstart > 0)
					this.inputstart -= 1;
				this.inputend = this.inputstart;
			}
			this.isend = true;
		}
		topic.publish("keyboard/push_string",this.focuscontrol,this.inputstring,this.inputstart,this.inputend);
		this.focuscontrol.focus();
	},

	move_right:function()
	{
		this.inputstring = this.focuscontrol.value;
		this.inputstart = this.focuscontrol.selectionStart;
		this.inputend = this.focuscontrol.selectionEnd;
		var xend = this.inputstring.length;
		if (this.shifton)
		{
			if (this.inputstart == this.inputend)
			{
				if (this.inputend < xend)
				{
					this.inputend += 1;
					this.isend = true;
				}
			}
			else
			{
				if (this.isend)
				{
					if (this.inputend < xend)
						this.inputend += 1;
				}
				else
				{
					if (this.inputstart < xend)
						this.inputstart += 1;
				}
			}
		}
		else
		{
			if (this.isend)
			{
				if (this.inputend < xend)
					this.inputend += 1;
				this.inputstart = this.inputend;
			}
			else
			{
				if (this.inputstart < xend)
					this.inputstart += 1;
				this.inputend = this.inputstart;
			}
			this.isend = true;
		}
		topic.publish("keyboard/push_string",this.focuscontrol,this.inputstring,this.inputstart,this.inputend);
		this.focuscontrol.focus();
	},

	switch_alpha:function()
	{
		domclass.remove(this.alphakeys,"pprhidden");
		domclass.add(this.numberkeys,"pprhidden");
		domclass.add(this.symbolkeys,"pprhidden");
		if (this.focuscontrol)
			this.focuscontrol.focus();
	},

	switch_number:function()
	{
		domclass.add(this.alphakeys,"pprhidden");
		domclass.remove(this.numberkeys,"pprhidden");
		domclass.add(this.symbolkeys,"pprhidden");
		if (this.focuscontrol)
			this.focuscontrol.focus();
	},

	switch_symbol:function()
	{
		domclass.add(this.alphakeys,"pprhidden");
		domclass.add(this.numberkeys,"pprhidden");
		domclass.remove(this.symbolkeys,"pprhidden");
		if (this.focuscontrol)
			this.focuscontrol.focus();
	},

	_shift_on:function()
	{
		this.a_btn.innerHTML = "A";
		this.b_btn.innerHTML = "B";
		this.c_btn.innerHTML = "C";
		this.d_btn.innerHTML = "D";
		this.e_btn.innerHTML = "E";
		this.f_btn.innerHTML = "F";
		this.g_btn.innerHTML = "G";
		this.h_btn.innerHTML = "H";
		this.i_btn.innerHTML = "I";
		this.j_btn.innerHTML = "J";
		this.k_btn.innerHTML = "K";
		this.l_btn.innerHTML = "L";
		this.m_btn.innerHTML = "M";
		this.n_btn.innerHTML = "N";
		this.o_btn.innerHTML = "O";
		this.p_btn.innerHTML = "P";
		this.q_btn.innerHTML = "Q";
		this.r_btn.innerHTML = "R";
		this.s_btn.innerHTML = "S";
		this.t_btn.innerHTML = "T";
		this.u_btn.innerHTML = "U";
		this.v_btn.innerHTML = "V";
		this.w_btn.innerHTML = "W";
		this.x_btn.innerHTML = "X";
		this.y_btn.innerHTML = "Y";
		this.z_btn.innerHTML = "Z";
	},

	_shift_off:function()
	{
		this.a_btn.innerHTML = "a";
		this.b_btn.innerHTML = "b";
		this.c_btn.innerHTML = "c";
		this.d_btn.innerHTML = "d";
		this.e_btn.innerHTML = "e";
		this.f_btn.innerHTML = "f";
		this.g_btn.innerHTML = "g";
		this.h_btn.innerHTML = "h";
		this.i_btn.innerHTML = "i";
		this.j_btn.innerHTML = "j";
		this.k_btn.innerHTML = "k";
		this.l_btn.innerHTML = "l";
		this.m_btn.innerHTML = "m";
		this.n_btn.innerHTML = "n";
		this.o_btn.innerHTML = "o";
		this.p_btn.innerHTML = "p";
		this.q_btn.innerHTML = "q";
		this.r_btn.innerHTML = "r";
		this.s_btn.innerHTML = "s";
		this.t_btn.innerHTML = "t";
		this.u_btn.innerHTML = "u";
		this.v_btn.innerHTML = "v";
		this.w_btn.innerHTML = "w";
		this.x_btn.innerHTML = "x";
		this.y_btn.innerHTML = "y";
		this.z_btn.innerHTML = "z";
	},

	press_shift:function()
	{
		if (this.shifton)
		{
			domclass.remove(this.shiftpanelalpha,"input-button-on");
			domclass.remove(this.shiftpanelnumber,"input-button-on");
			domclass.remove(this.shiftpanelsymbol,"input-button-on");
			this.shiftbtnalpha.innerHTML = "&#8679;";
			this.shiftbtnnumber.innerHTML = "&#8679;";
			this.shiftbtnsymbol.innerHTML = "&#8679;";
			this.lockon = false;
			this.shifton = false;
			this._shift_off();
		}
		else
		{
			domclass.add(this.shiftpanelalpha,"input-button-on");
			domclass.add(this.shiftpanelnumber,"input-button-on");
			domclass.add(this.shiftpanelsymbol,"input-button-on");
			this.shifton = true;
			this._shift_on();
		}
		if (this.focuscontrol)
			this.focuscontrol.focus();
	},

	press_lock:function()
	{
		domclass.add(this.shiftpanelalpha,"input-button-on");
		domclass.add(this.shiftpanelnumber,"input-button-on");
		domclass.add(this.shiftpanelsymbol,"input-button-on");
		this.shiftbtnalpha.innerHTML = "&#8682;";
		this.shiftbtnnumber.innerHTML = "&#8682;";
		this.shiftbtnsymbol.innerHTML = "&#8682;";
		this.lockon = true;
		this.shifton = true;
		this._shift_on();

		if (this.focuscontrol)
			this.focuscontrol.focus();
	},

	press_q:function()
	{
		this.push_string("Q");
	},

	press_w:function()
	{
		this.push_string("W");
	},

	press_e:function()
	{
		this.push_string("E");
	},

	press_r:function()
	{
		this.push_string("R");
	},

	press_t:function()
	{
		this.push_string("T");
	},

	press_y:function()
	{
		this.push_string("Y");
	},

	press_u:function()
	{
		this.push_string("U");
	},

	press_i:function()
	{
		this.push_string("I");
	},

	press_o:function()
	{
		this.push_string("O");
	},

	press_p:function()
	{
		this.push_string("P");
	},

	press_a:function()
	{
		this.push_string("A");
	},

	press_s:function()
	{
		this.push_string("S");
	},

	press_d:function()
	{
		this.push_string("D");
	},

	press_f:function()
	{
		this.push_string("F");
	},

	press_g:function()
	{
		this.push_string("G");
	},

	press_h:function()
	{
		this.push_string("H");
	},

	press_j:function()
	{
		this.push_string("J");
	},

	press_k:function()
	{
		this.push_string("K");
	},

	press_l:function()
	{
		this.push_string("L");
	},

	press_z:function()
	{
		this.push_string("Z");
	},

	press_x:function()
	{
		this.push_string("X");
	},

	press_c:function()
	{
		this.push_string("C");
	},

	press_v:function()
	{
		this.push_string("V");
	},

	press_b:function()
	{
		this.push_string("B");
	},

	press_n:function()
	{
		this.push_string("N");
	},

	press_m:function()
	{
		this.push_string("M");
	},

	press_1:function()
	{
		this.push_string("1");
	},

	press_2:function()
	{
		this.push_string("2");
	},

	press_3:function()
	{
		this.push_string("3");
	},

	press_4:function()
	{
		this.push_string("4");
	},

	press_5:function()
	{
		this.push_string("5");
	},

	press_6:function()
	{
		this.push_string("6");
	},

	press_7:function()
	{
		this.push_string("7");
	},

	press_8:function()
	{
		this.push_string("8");
	},

	press_9:function()
	{
		this.push_string("9");
	},

	press_0:function()
	{
		this.push_string("0");
	},

	press_exclaim:function()
	{
		this.push_string("!");
	},

	press_question:function()
	{
		this.push_string("?");
	},

	press_b_open:function()
	{
		this.push_string("(");
	},

	press_b_close:function()
	{
		this.push_string(")");
	},

	press_pound:function()
	{
		this.push_string("\u00A3");
	},

	press_amp:function()
	{
		this.push_string("&");
	},

	press_percent:function()
	{
		this.push_string("%");
	},

	press_minus:function()
	{
		this.push_string("-");
	},

	press_slash:function()
	{
		this.push_string("/");
	},

	press_dot:function()
	{
		this.push_string(".");
	},

	press_comma:function()
	{
		this.push_string(",");
	},

	press_colon:function()
	{
		this.push_string(":");
	},

	press_semi:function()
	{
		this.push_string(";");
	},

	press_apos:function()
	{
		this.push_string("'");
	},

	press_quote:function()
	{
		this.push_string('"');
	},

	press_at:function()
	{
		this.push_string("@");
	},

	press_s_open:function()
	{
		this.push_string("[");
	},

	press_s_close:function()
	{
		this.push_string("]");
	},

	press_c_open:function()
	{
		this.push_string("{");
	},

	press_c_close:function()
	{
		this.push_string("}");
	},

	press_less:function()
	{
		this.push_string("<");
	},

	press_more:function()
	{
		this.push_string(">");
	},

	press_under:function()
	{
		this.push_string("_");
	},

	press_plus:function()
	{
		this.push_string("+");
	},

	press_times:function()
	{
		this.push_string("*");
	},

	press_equal:function()
	{
		this.push_string("=");
	},

	press_grave:function()
	{
		this.push_string("`");
	},

	press_pipe:function()
	{
		this.push_string("|");
	},

	press_acute:function()
	{
		this.push_string("\u00B4");
	},

	press_not:function()
	{
		this.push_string("\u00AC");
	},

	press_copy:function()
	{
		this.push_string("\u00A9");
	},

	press_reg:function()
	{
		this.push_string("\u00AE");
	},

	press_tilde:function()
	{
		this.push_string("~");
	},

	press_caret:function()
	{
		this.push_string("^");
	},

	press_back:function()
	{
		this.push_string("\\");
	},

	press_euro:function()
	{
		this.push_string("\u20AC");
	},

	press_dollar:function()
	{
		this.push_string("$");
	},

	press_yen:function()
	{
		this.push_string("\u00A5");
	},

	press_cent:function()
	{
		this.push_string("\u00A2");
	},

	press_currency:function()
	{
		this.push_string("\u00A4");
	},

	press_degree:function()
	{
		this.push_string("\u00B0");
	},

	press_hash:function()
	{
		this.push_string("#");
	},

	press_space:function()
	{
		this.push_string(" ");
	},

	press_return:function()
	{
		this.push_string("\u000A");
	},

	press_del:function()
	{
		this.push_string("del");
	}

});
});

