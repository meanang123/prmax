# -*- coding: utf-8 -*-
	<table class="list-panel">
		%if contacthistoryid1:
			<tr height="15.8%" class="${rowclass1} inset-content">
				<td class="item-icon item-clip fa-fw ${colour1}">${icon1}</td>
				<td>
					% if familyname1 or firstname1:
						<span class="item-main">${firstname1} ${familyname1}</span>
					% endif
					% if subject1:
						<span class="item-main">${subject1}</span>
					% endif
				</td>
			</tr>	
		%endif
		%if contacthistoryid2:
			<tr height="15.8%" class="${rowclass2} inset-content">
				<td class="item-icon item-clip fa-fw ${colour2}">${icon2}</td>
				<td>
					% if familyname2 or firstname2:
						<span class="item-main">${firstname2} ${familyname2}</span>
					% endif
					% if subject2:
						<span class="item-main">${subject2}</span>
					% endif
				</td>
			</tr>	
		%endif
		%if contacthistoryid3:
			<tr height="15.8%" class="${rowclass3} inset-content">
				<td class="item-icon item-clip fa-fw ${colour3}">${icon3}</td>
				<td>
					% if familyname3 or firstname3:
						<span class="item-main">${firstname3} ${familyname3}</span>
					% endif
					% if subject3:
						<span class="item-main">${subject3}</span>
					% endif
				</td>
			</tr>	
		%endif
		%if contacthistoryid4:
			<tr height="15.8%" class="${rowclass4} inset-content">
				<td class="item-icon item-clip fa-fw ${colour4}">${icon4}</td>
				<td>
					% if familyname4 or firstname4:
						<span class="item-main">${firstname4} ${familyname4}</span>
					% endif
					% if subject4:
						<span class="item-main">${subject4}</span>
					% endif
				</td>
			</tr>	
		%endif
		%if contacthistoryid5:
			<tr height="15.8%" class="${rowclass5} inset-content">
				<td class="item-icon item-clip fa-fw ${colour5}">${icon5}</td>
				<td>
					% if familyname5 or firstname5:
						<span class="item-main">${firstname5} ${familyname5}</span>
					% endif
					% if subject5:
						<span class="item-main">${subject5}</span>
					% endif
				</td>
			</tr>	
		%endif
		%if contacthistoryid6:
			<tr height="15.8%" class="${rowclass6} inset-content">
				<td class="item-icon item-clip fa-fw ${colour6}">${icon6}</td>
				<td>
					% if familyname6 or firstname6:
						<span class="item-main">${firstname6} ${familyname6}</span>
					% endif
					% if subject6:
						<span class="item-main">${subject6}</span>
					% endif
				</td>
			</tr>	
		%endif

	</table>
