# -*- coding: utf-8 -*-
	<table class="list-panel">
		%if contacthistoryid1:
			<tr onmousedown="${location1}" height="15.8%" class="${rowclass1} inset-content">
				<td class="item-icon item-clip fa-fw ${colour1}">${icon1}</td>
				<td>
					% if familyname1 or firstname1:
						<span class="item-main">${firstname1} ${familyname1}</span>
					% endif
					% if subject1:
 						<span class="item-main">${subject1.replace('poundsymbol', unichr(163))}</span>
					% endif
					<span class="item-main">Status: ${status1} - Taken date: ${taken1._to_date()}</span>
				</td>
			</tr>	
		%else:
			<tr class="list-empty">
				<td><i class="fa fa-minus-circle fa-4x"></i><br/>No enquiries found</td>
			</tr>		
		%endif
		%if contacthistoryid2:
			<tr onmousedown="${location2}" height="15.8%" class="${rowclass2} inset-content">
				<td class="item-icon item-clip fa-fw ${colour2}">${icon2}</td>
				<td>
					% if familyname2 or firstname2:
						<span class="item-main">${firstname2} ${familyname2}</span>
					% endif
					% if subject2:
 						<span class="item-main">${subject2.replace('poundsymbol', unichr(163))}</span>
					% endif
					<span class="item-main">Status: ${status2} - Taken date: ${taken2._to_date()}</span>
				</td>
			</tr>	
		%endif
		%if contacthistoryid3:
			<tr onmousedown="${location3}" height="15.8%" class="${rowclass3} inset-content">
				<td class="item-icon item-clip fa-fw ${colour3}">${icon3}</td>
				<td>
					% if familyname3 or firstname3:
						<span class="item-main">${firstname3} ${familyname3}</span>
					% endif
					% if subject3:
 						<span class="item-main">${subject3.replace('poundsymbol', unichr(163))}</span>
					% endif
					<span class="item-main">Status: ${status3} - Taken date: ${taken3._to_date()}</span>
				</td>
			</tr>	
		%endif
		%if contacthistoryid4:
			<tr onmousedown="${location4}" height="15.8%" class="${rowclass4} inset-content">
				<td class="item-icon item-clip fa-fw ${colour4}">${icon4}</td>
				<td>
					% if familyname4 or firstname4:
						<span class="item-main">${firstname4} ${familyname4}</span>
					% endif
					% if subject4:
						<span class="item-main">${subject4.replace('poundsymbol', unichr(163))}</span>
					% endif
					<span class="item-main">Status: ${status4} - Taken date: ${taken4._to_date()}</span>
				</td>
			</tr>	
		%endif
		%if contacthistoryid5:
			<tr onmousedown="${location5}" height="15.8%" class="${rowclass5} inset-content">
				<td class="item-icon item-clip fa-fw ${colour5}">${icon5}</td>
				<td>
					% if familyname5 or firstname5:
						<span class="item-main">${firstname5} ${familyname5}</span>
					% endif
					% if subject5:
						<span class="item-main">${subject5.replace('poundsymbol', unichr(163))}</span>
					% endif
					<span class="item-main">Status: ${status5} - Taken date: ${taken5._to_date()}</span>
				</td>
			</tr>	
		%endif
		%if contacthistoryid6:
			<tr onmousedown="${location6}" height="15.8%" class="${rowclass6} inset-content">
				<td class="item-icon item-clip fa-fw ${colour6}">${icon6}</td>
				<td>
					% if familyname6 or firstname6:
						<span class="item-main">${firstname6} ${familyname6}</span>
					% endif
					% if subject6:
						<span class="item-main">${subject6.replace('poundsymbol', unichr(163))}</span>
					% endif
					<span class="item-main">Status: ${status6} - Taken date: ${taken6._to_date()}</span>
				</td>
			</tr>	
		%endif

	</table>
