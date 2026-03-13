import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ParkingSession } from '../models';

@Injectable({ providedIn: 'root' })
export class ReceiptService {
  generateReceipt(session: ParkingSession) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // #4f46e5 Indigo-600
    doc.text('ParkFlow', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Slate 500
    doc.text('Parking Management System', pageWidth / 2, 28, { align: 'center' });
    doc.text('123 Tech Park, Silicon Valley, CA 94025', pageWidth / 2, 34, { align: 'center' });

    // Divider
    doc.setDrawColor(226, 232, 240); // Slate 200
    doc.setLineWidth(0.5);
    doc.line(14, 42, pageWidth - 14, 42);

    // Title & Receipt Info
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59); // Slate 800
    doc.text('PARKING RECEIPT', 14, 55);

    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Receipt No: RCT-${session.id}`, 14, 62);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 68);

    // Session Details Table
    const detailsBody = [
      ['Vehicle Number:', session.vehicleNumber],
      ['Vehicle Type:', this.titleCase(session.vehicleType)],
      ['Assigned Slot:', session.assignedSlot],
    ];

    if (session.driverName) {
      detailsBody.push(['Driver Name:', session.driverName]);
    }
    if (session.phoneNumber) {
      detailsBody.push(['Phone Number:', session.phoneNumber]);
    }
    if (session.licenseNumber) {
      detailsBody.push(['DL Number:', session.licenseNumber]);
    }

    detailsBody.push(
      ['Entry Time:', new Date(session.entryTime).toLocaleString()],
      ['Exit Time:', session.exitTime ? new Date(session.exitTime).toLocaleString() : 'N/A'],
      ['Total Duration:', this.formatDuration(session.duration)]
    );

    if (session.expectedDuration) {
      detailsBody.push(['Expected Duration:', this.formatDuration(session.expectedDuration)]);
    }

    autoTable(doc, {
      startY: 75,
      body: detailsBody,
      theme: 'plain',
      styles: { fontSize: 11, cellPadding: 4, textColor: [51, 65, 85] },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { cellWidth: 'auto' } },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Payment Details Table
    const fee = session.fee || 0;
    const fine = session.fine || 0;
    const total = fee + fine;

    autoTable(doc, {
      startY: finalY,
      head: [['Description', 'Amount']],
      body: [
        ['Parking Base Fee', `INR ${fee.toFixed(2)}`],
        ['Overtime Fine', `INR ${fine.toFixed(2)}`],
      ],
      foot: [['Total Paid', `INR ${total.toFixed(2)}`]],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
      footStyles: { fillColor: [241, 245, 249], textColor: [15, 23, 42], fontStyle: 'bold' },
      styles: { fontSize: 11, cellPadding: 6 },
      columnStyles: { 1: { halign: 'right' } },
    });

    // Footer section
    const footerY = (doc as any).lastAutoTable.finalY + 30;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text('Thank you for parking with ParkFlow!', pageWidth / 2, footerY, { align: 'center' });
    doc.setFontSize(9);
    doc.text('This is a computer-generated receipt and does not require a physical signature.', pageWidth / 2, footerY + 6, { align: 'center' });

    // Save PDF
    doc.save(`Receipt_${session.vehicleNumber}_${session.id}.pdf`);
  }

  private titleCase(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private formatDuration(minutes: number | null | undefined): string {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} minutes`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h} hrs ${m} mins`;
  }
}
