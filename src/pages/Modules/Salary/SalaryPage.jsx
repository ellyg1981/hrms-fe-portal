import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import html2pdf from 'html2pdf.js';
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
    const fmt2 = (n) => n.toLocaleString('en-TZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.innerHTML = `<style>
      .slip-wrap{font-family:'Courier New',Courier,monospace;font-size:11pt;padding:32px 40px;color:#111;line-height:1.45;background:#fff;width:210mm}
      .hdr-table{width:100%;border-collapse:collapse;font-size:11pt;margin-bottom:2px}
      .hdr-table td{padding:0;white-space:nowrap}
      .hdr-left{text-align:left}
      .hdr-right{text-align:right;font-weight:bold}
      .hdr-row2{width:100%;border-collapse:collapse;font-size:11pt;margin-bottom:4px}
      .hdr-row2 td{padding:0;white-space:nowrap}
      .hdr-row2 .hdr-left{text-align:left}
      .hdr-row2 .hdr-right{text-align:right}
      .hdr-rule{width:100%;height:0.5px;background:#D8D8D8;border:none;margin:10px 0 40px}
      table{width:100%;border-collapse:collapse;font-size:11pt}
      th{text-align:left;padding:3px 0 1px;border-bottom:1px solid #111;font-weight:normal}
      td{padding:1px 0;vertical-align:top;white-space:nowrap}
      .desc{width:100%;white-space:normal}
      .bal{text-align:right;padding-right:24px}
      .amt{text-align:right}
      .sep{font-size:10pt;letter-spacing:2px;margin:4px 0 3px}
      .net td{padding-top:3px;font-weight:bold}
    </style>
    <div class="slip-wrap">
      <table class="hdr-table"><tr><td class="hdr-left">93 1000 10000000</td><td class="hdr-right">GOODLUCK E MSUYA</td></tr></table>
      <table class="hdr-row2"><tr><td class="hdr-left">93-000 20/08/2041</td><td class="hdr-right">TGP SW/5/2</td></tr></table>
      <hr class="hdr-rule">
      <table>
        <thead><tr><th class="desc">DESCRIPTION</th><th class="bal">BALANCE</th><th class="amt">AMOUNT</th></tr></thead>
        <tbody>
          <tr><td class="desc">Basic Salary</td><td class="bal"></td><td class="amt">${fmt2(d.basic)}</td></tr>
          <tr><td class="desc">Housing Allowances</td><td class="bal"></td><td class="amt">${fmt2(d.allowances.house)}</td></tr>
          <tr><td class="desc">Professional Allowances</td><td class="bal"></td><td class="amt">${fmt2(307200)}</td></tr>
          <tr><td class="desc">Special Skills Allowance (Immigration)</td><td class="bal"></td><td class="amt">${fmt2(245760)}</td></tr>
          <tr><td class="desc">Public Service Social Security Fund</td><td class="bal"></td><td class="amt">-${fmt2(d.deductions.pspf)}</td></tr>
          <tr><td class="desc">Pay As You Earn (PAYE)</td><td class="bal"></td><td class="amt">-${fmt2(d.deductions.paye)}</td></tr>
          <tr><td class="desc">UHAMIAJI SACCOS CONTR</td><td class="bal"></td><td class="amt">-${fmt2(50000)}</td></tr>
          <tr><td class="desc">UHAMIAJI SACCOS LOAN</td><td class="bal">${fmt2(13027579.92)}</td><td class="amt">-${fmt2(d.deductions.loan)}</td></tr>
          <tr><td class="desc">National Health Insurance Fund Employer for Police</td><td class="bal"></td><td class="amt">-${fmt2(0)}</td></tr>
        </tbody>
      </table>
      <div class="sep">******************************************************************************************</div>
      <table class="net"><tr><td class="desc">NET AMOUNT DUE</td><td class="bal">30/06/2026</td><td class="amt">${fmt2(d.net)}</td></tr></table>
      <div class="sep">******************************************************************************************</div>
    </div>`;
    document.body.appendChild(container);

    const opt = {
      margin: 0,
      filename: `SalarySlip_CH-78432_${selMonth}_${selYear}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(container.querySelector('.slip-wrap')).save().then(() => {
      document.body.removeChild(container);
    });
  };

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar title="Salary Slip" subtitle="View and download your monthly payslip" color="#0B2E59">
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
        </ModuleTitleBar>

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
                    <tr><td>PAYE</td><td className="sal-amount gold">TZS {fmt(d.deductions.paye)}</td></tr>
                    <tr><td>PSPF (6.5%)</td><td className="sal-amount gold">TZS {fmt(d.deductions.pspf)}</td></tr>
                    <tr><td>NHIF</td><td className="sal-amount gold">TZS {fmt(d.deductions.nhif)}</td></tr>
                    <tr><td>Loan Repayment</td><td className="sal-amount gold">TZS {fmt(d.deductions.loan)}</td></tr>
                    <tr className="sal-total-row"><td>TOTAL DEDUCTIONS</td><td className="sal-amount gold">TZS {fmt(totalDeduct)}</td></tr>
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
