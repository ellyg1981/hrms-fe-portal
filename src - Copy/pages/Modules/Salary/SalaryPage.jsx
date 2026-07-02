import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import './SalaryPage.css';

const SALARY_DATA = {
  basic: 2500000,
  allowances: { house: 500000, transport: 300000, medical: 200000 },
  deductions: { paye: 450000, pspf: 162500, nhif: 50000, loan: 125000 },
  net: 2382500,
};

function fmt(n) { return n.toLocaleString('en-TZ'); }

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function SalaryPage() {
  const [selMonth, setSelMonth] = useState('Jun');
  const [selYear, setSelYear] = useState('2026');
  const [showSlip, setShowSlip] = useState(false);
  const d = SALARY_DATA;

  const totalEarn = d.basic + Object.values(d.allowances).reduce((a,b)=>a+b,0);
  const totalDeduct = Object.values(d.deductions).reduce((a,b)=>a+b,0);

  const downloadSlip = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Salary Slip</title><style>
      body{font-family:Arial,sans-serif;font-size:11pt;margin:0;padding:24px;color:#111}
      .hdr{text-align:center;border-bottom:2px solid #0B2E59;padding-bottom:12px;margin-bottom:16px}
      .hdr h1{font-size:13pt;text-transform:uppercase;color:#0B2E59;margin:0 0 3px}
      .meta{display:flex;justify-content:space-between;margin-bottom:16px;font-size:10pt}
      table{width:100%;border-collapse:collapse;font-size:10pt;margin-bottom:14px}
      th{background:#0B2E59;color:white;padding:7px 10px;text-align:left}
      td{padding:6px 10px;border-bottom:1px solid #E5E7EB}
      .net{background:#0B2E59;color:white;padding:12px 16px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;font-size:12pt;font-weight:700}
    </style></head><body>
    <div class="hdr"><h1>Tanzania Immigration Services Department</h1><h2>Wizara ya Mambo ya Ndani ya Nchi</h2><h3>EMPLOYEE SALARY SLIP &mdash; ${selMonth.toUpperCase()} ${selYear}</h3></div>
    <div class="meta"><span>Name: <strong>John Doe</strong></span><span>Check No: <strong>CH-78432</strong></span></div>
    <table><thead><tr><th>Earnings</th><th>Amount (TZS)</th><th>Deductions</th><th>Amount (TZS)</th></tr></thead><tbody>
    <tr><td>Basic Salary</td><td>${fmt(d.basic)}</td><td>PAYE</td><td>${fmt(d.deductions.paye)}</td></tr>
    <tr><td>House Allowance</td><td>${fmt(d.allowances.house)}</td><td>PSPF (6.5%)</td><td>${fmt(d.deductions.pspf)}</td></tr>
    <tr><td>Transport Allowance</td><td>${fmt(d.allowances.transport)}</td><td>NHIF</td><td>${fmt(d.deductions.nhif)}</td></tr>
    <tr><td>Medical Allowance</td><td>${fmt(d.allowances.medical)}</td><td>Loan Repayment</td><td>${fmt(d.deductions.loan)}</td></tr>
    <tr><td><strong>Total Earnings</strong></td><td><strong>${fmt(totalEarn)}</strong></td><td><strong>Total Deductions</strong></td><td><strong>${fmt(totalDeduct)}</strong></td></tr>
    </tbody></table>
    <div class="net"><span>NET PAY</span><span>TZS ${fmt(d.net)}</span></div>
    </body></html>`;
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 500);
  };

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar title="Salary Slip" subtitle="View and download your monthly payslip" color="#0B2E59" />

        <div className="sal-controls">
          <div className="sal-select-group">
            <label className="form-label">Month</label>
            <select className="form-input form-select" value={selMonth} onChange={e => setSelMonth(e.target.value)}>
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="sal-select-group">
            <label className="form-label">Year</label>
            <select className="form-input form-select" value={selYear} onChange={e => setSelYear(e.target.value)}>
              {['2024','2025','2026'].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <button className="btn btn-primary sal-view-btn" onClick={() => setShowSlip(true)}>View Payslip</button>
        </div>

        {showSlip && (
          <div className="sal-slip-card">
            <Card hover={false}>
              <div className="sal-slip-header">
                <h3 className="sal-slip-title">Salary Slip &mdash; {selMonth} {selYear}</h3>
                <button className="btn btn-secondary sal-download-btn" onClick={downloadSlip}>Download PDF</button>
              </div>

              <div className="sal-emp-band">
                <div className="sal-emp-field"><span className="sal-emp-label">Employee Name</span><span className="sal-emp-value">John Doe</span></div>
                <div className="sal-emp-field"><span className="sal-emp-label">Check Number</span><span className="sal-emp-value">CH-78432</span></div>
                <div className="sal-emp-field"><span className="sal-emp-label">Department</span><span className="sal-emp-value">Immigration Services</span></div>
              </div>

              <div className="sal-tables">
                <div className="sal-table-wrap">
                  <div className="sal-table-head earn">EARNINGS</div>
                  <table className="modern-table sal-table"><tbody>
                    <tr><td>Basic Salary</td><td className="sal-amount">TZS {fmt(d.basic)}</td></tr>
                    <tr><td>House Allowance</td><td className="sal-amount">TZS {fmt(d.allowances.house)}</td></tr>
                    <tr><td>Transport Allowance</td><td className="sal-amount">TZS {fmt(d.allowances.transport)}</td></tr>
                    <tr><td>Medical Allowance</td><td className="sal-amount">TZS {fmt(d.allowances.medical)}</td></tr>
                    <tr className="sal-total-row"><td>TOTAL EARNINGS</td><td className="sal-amount">TZS {fmt(totalEarn)}</td></tr>
                  </tbody></table>
                </div>
                <div className="sal-table-wrap">
                  <div className="sal-table-head deduct">DEDUCTIONS</div>
                  <table className="modern-table sal-table"><tbody>
                    <tr><td>PAYE</td><td className="sal-amount red">TZS {fmt(d.deductions.paye)}</td></tr>
                    <tr><td>PSPF (6.5%)</td><td className="sal-amount red">TZS {fmt(d.deductions.pspf)}</td></tr>
                    <tr><td>NHIF</td><td className="sal-amount red">TZS {fmt(d.deductions.nhif)}</td></tr>
                    <tr><td>Loan Repayment</td><td className="sal-amount red">TZS {fmt(d.deductions.loan)}</td></tr>
                    <tr className="sal-total-row"><td>TOTAL DEDUCTIONS</td><td className="sal-amount red">TZS {fmt(totalDeduct)}</td></tr>
                  </tbody></table>
                </div>
              </div>

              <div className="sal-net-bar">
                <span>NET PAY</span>
                <span className="sal-net-amount">TZS {fmt(d.net)}</span>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

export default SalaryPage;
