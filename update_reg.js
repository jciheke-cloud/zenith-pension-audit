async function updateRegulatory() {
  const url = 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod/api/audit/regulatory/REG-2026-04';
  
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'PENCOM Custody & Settlement Operations Review',
      regulatoryBody: 'PENCOM'
    })
  });
  console.log("Updated!");
}
updateRegulatory();
