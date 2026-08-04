const buUpdates = [
  { code: 'OPS', name: 'Custodial Operations', head: 'Head of Operations', riskLevel: 'Critical', staffCount: 45 },
  { code: 'SNR', name: 'Settlement & Reconciliation', head: 'Head of Settlements', riskLevel: 'Critical', staffCount: 35 },
  { code: 'CSM', name: 'Client Services / Relationship Mgmt', head: 'Head of Client Services', riskLevel: 'Medium', staffCount: 20 },
  { code: 'ITD', name: 'Information Technology', head: 'Head of IT', riskLevel: 'High', staffCount: 18 },
  { code: 'FIN', name: 'Financial Control', head: 'Chief Financial Officer', riskLevel: 'High', staffCount: 15 },
  { code: 'INV', name: 'Investment Administration', head: 'Head of Investment Admin', riskLevel: 'High', staffCount: 12 },
  { code: 'CRM', name: 'Compliance and Risk Management', head: 'Chief Risk Officer', riskLevel: 'Critical', staffCount: 8 },
  { code: 'ICA', name: 'Internal Control and Audit', head: 'Chief Audit Executive', riskLevel: 'High', staffCount: 8 },
  { code: 'HRD', name: 'Human Resources', head: 'Head of HR', riskLevel: 'Medium', staffCount: 6 },
  { code: 'EXM', name: 'Executive Management', head: 'Managing Director/CEO', riskLevel: 'Medium', staffCount: 5 },
  { code: 'LEG', name: 'Legal & Company Secretariat', head: 'Company Secretary', riskLevel: 'Medium', staffCount: 4 },
  { code: 'CCD', name: 'Corporate Communications', head: 'Head of Corporate Comms', riskLevel: 'Low', staffCount: 3 }
];

async function updateBusinessUnits() {
  const url = 'https://uhzosq0g0i.execute-api.eu-west-1.amazonaws.com/prod/api/business-units';
  
  const res = await fetch(url);
  const currentBus = await res.json();
  
  for (const update of buUpdates) {
    const existing = currentBus.find(bu => bu.code === update.code);
    if (existing) {
      const putUrl = `${url}/${existing.id}`;
      console.log(`Updating ${update.code}...`);
      await fetch(putUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: update.name,
          head: update.head,
          code: update.code,
          riskLevel: update.riskLevel,
          staffCount: update.staffCount
        })
      });
    } else {
      console.log(`Creating ${update.code}...`);
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: update.name,
          head: update.head,
          code: update.code,
          riskLevel: update.riskLevel,
          staffCount: update.staffCount
        })
      });
    }
  }
  console.log("Done!");
}

updateBusinessUnits();
