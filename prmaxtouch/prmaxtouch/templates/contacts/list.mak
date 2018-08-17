# -*- coding: utf-8 -*-
	<table class="list-panel">
		%if employeeid1:
			<tr onmousedown="${location1}" height="15.8%" class="${rowclass1} inset-content">
				<td class="item-icon item-clip fa-fw ${colour1}">${icon1}</td>
				<td>
					% if familyname1 or firstname1:
						<span class="item-main">${firstname1} ${familyname1}
							%if jobtitle1:
								(${jobtitle1})
							%endif
						</span>
					% endif
					% if outletname1:
 						<span class="item-main">${outletname1.replace('poundsymbol', unichr(163))}</span>
					% endif
				</td>
			</tr>	
		%else:
			<tr class="list-empty">
				<td><i class="fa fa-minus-circle fa-4x"></i><br/>No contacts found</td>
			</tr>		
		%endif
		%if employeeid2:
			<tr onmousedown="${location2}" height="15.8%" class="${rowclass2} inset-content">
				<td class="item-icon item-clip fa-fw ${colour2}">${icon2}</td>
				<td>
					% if familyname2 or firstname2:
						<span class="item-main">${firstname2} ${familyname2}
							%if jobtitle2:
								(${jobtitle2})
							%endif
						</span>
					% endif
					% if outletname2:
 						<span class="item-main">${outletname2.replace('poundsymbol', unichr(163))}</span>
					% endif
				</td>
			</tr>	
		%endif
		%if employeeid3:
			<tr onmousedown="${location3}" height="15.8%" class="${rowclass3} inset-content">
				<td class="item-icon item-clip fa-fw ${colour3}">${icon3}</td>
				<td>
					% if familyname3 or firstname3:
						<span class="item-main">${firstname3} ${familyname3}
							%if jobtitle3:
								(${jobtitle3})
							%endif
						</span>
					% endif
					% if outletname3:
 						<span class="item-main">${outletname3.replace('poundsymbol', unichr(163))}</span>
					% endif
				</td>
			</tr>	
		%endif
		%if employeeid4:
			<tr onmousedown="${location4}" height="15.8%" class="${rowclass4} inset-content">
				<td class="item-icon item-clip fa-fw ${colour4}">${icon4}</td>
				<td>
					% if familyname4 or firstname4:
						<span class="item-main">${firstname4} ${familyname4}
							%if jobtitle4:
								(${jobtitle4})
							%endif
						</span>
					% endif
					% if outletname4:
						<span class="item-main">${outletname4.replace('poundsymbol', unichr(163))}</span>
					% endif
				</td>
			</tr>	
		%endif
		%if employeeid5:
			<tr onmousedown="${location5}" height="15.8%" class="${rowclass5} inset-content">
				<td class="item-icon item-clip fa-fw ${colour5}">${icon5}</td>
				<td>
					% if familyname5 or firstname5:
						<span class="item-main">${firstname5} ${familyname5}
							%if jobtitle:
								(${jobtitle5})
							%endif
						</span>
					% endif
					% if outletname5:
						<span class="item-main">${outletname5.replace('poundsymbol', unichr(163))}</span>
					% endif
				</td>
			</tr>	
		%endif
		%if employeeid6:
			<tr onmousedown="${location6}" height="15.8%" class="${rowclass6} inset-content">
				<td class="item-icon item-clip fa-fw ${colour6}">${icon6}</td>
				<td>
					% if familyname6 or firstname6:
						<span class="item-main">${firstname6} ${familyname6}
							%if jobtitle6:
								(${jobtitle6})
							%endif
						</span>
					% endif
					% if outletname6:
						<span class="item-main">${outletname6.replace('poundsymbol', unichr(163))}</span>
					% endif
				</td>
			</tr>	
		%endif

	</table>
