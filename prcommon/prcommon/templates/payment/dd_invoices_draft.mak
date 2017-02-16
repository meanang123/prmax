<table border="1">
  <tr>
    <td>Account Nbr</td>
    <td>Name</td>
    <td>Message</td>
    <td>Collection Date</td>
    <td align="right">Core</td>
    <td align="right">Monitoring</td>
    <td align="right">Soe</td>
    <td align="right">Features</td>
    <td align="right">International</td>
    <td align="right">Clip - Core</td>
    <td align="right">Clip - Fee</td>
    <td align="right">Total</td>
    <td align="right">Start Day</td>
    %if len(data) >13:
      <td>Start Date</td>
      <td>End Date</td>
    %endif
  </tr>
  %for row in data:
  <tr>
    <td>${row[0]}</td>
    <td>${row[1]}</td>
    <td>${row[2]}</td>
    <td>${row[3]}</td>
    <td align="right">${row[4]}</td>
    <td align="right">${row[5]}</td>
    <td align="right">${row[6]}</td>
    <td align="right">${row[7]}</td>
    <td align="right">${row[8]}</td>
    <td align="right">${row[9]}</td>
    <td align="right">${row[10]}</td>
    <td align="right">${row[11]}</td>
    <td align="right">${row[12]}</td>
    %if len(data) >13:
      <td align="right">${row[13]}</td>
      <td align="right">${row[14]}</td>
    %endif
  </tr>
  %endfor
</table>