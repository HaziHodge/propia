import { jsPDF } from 'jspdf'

export function generateContractPdf(contract) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pageW = 210
  const margin = 20
  const contentW = pageW - margin * 2
  let y = 20

  const formatCLP = (amount) =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency', currency: 'CLP',
      minimumFractionDigits: 0
    }).format(amount)

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-CL', {
      day: 'numeric', month: 'long', year: 'numeric'
    })
  }

  const addLine = (text, size=10, bold=false,
    align='left', color=[30,30,46]) => {
    doc.setFontSize(size)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    const x = align === 'center' ? pageW/2 : margin
    doc.text(text, x, y, { align })
    y += size * 0.5 + 2
  }

  const addSpacer = (h=6) => { y += h }

  const addDivider = () => {
    doc.setDrawColor(200, 200, 210)
    doc.setLineWidth(0.3)
    doc.line(margin, y, pageW - margin, y)
    addSpacer(4)
  }

  const addSection = (title) => {
    addSpacer(4)
    doc.setFillColor(27, 79, 114)
    doc.rect(margin, y-4, contentW, 8, 'F')
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text(title, margin + 4, y + 1)
    y += 8
    addSpacer(4)
  }

  const checkNewPage = () => {
    if (y > 260) {
      doc.addPage()
      y = 20
    }
  }

  // ── HEADER ──
  doc.setFillColor(27, 79, 114)
  doc.rect(0, 0, pageW, 28, 'F')
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(249, 156, 18)
  doc.text('PagoRenta', margin, 13)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(255, 255, 255)
  doc.text('Plataforma de Arriendos Digitales · Chile',
    margin, 21)
  doc.setFontSize(10)
  doc.setTextColor(255, 255, 255)
  doc.text('CONTRATO DE ARRENDAMIENTO',
    pageW - margin, 13, { align: 'right' })
  doc.setFontSize(8)
  doc.text('Documento Digital · Ley 19.799',
    pageW - margin, 21, { align: 'right' })
  y = 38

  // ── CONTRACT ID ──
  addLine(`Contrato N° ${contract.id.toString().slice(-8).toUpperCase()}`,
    9, false, 'left', [100,100,120])
  addLine(`Generado el ${formatDate(new Date().toISOString())}`,
    9, false, 'left', [100,100,120])
  addDivider()

  // ── SECTION 1: PARTES ──
  addSection('1. IDENTIFICACIÓN DE LAS PARTES')

  addLine('ARRENDADOR (Propietario)', 10, true,
    'left', [27,79,114])
  addSpacer(2)
  addLine(`Nombre: ${contract.owner_name || 'Propietario PagoRenta'}`)
  addLine(`Email: ${contract.owner_email || 'propietario@pagorenta.cl'}`)
  addSpacer(4)

  addLine('ARRENDATARIO', 10, true, 'left', [27,79,114])
  addSpacer(2)
  addLine(`Nombre: ${contract.tenant_name || '—'}`)
  addLine(`Email: ${contract.tenant_email || '—'}`)
  if (contract.tenant_phone)
    addLine(`Teléfono: ${contract.tenant_phone}`)
  if (contract.tenant_rut)
    addLine(`RUT: ${contract.tenant_rut}`)

  // ── SECTION 2: PROPIEDAD ──
  checkNewPage()
  addSection('2. OBJETO DEL CONTRATO')
  addLine('La propiedad objeto del presente contrato es:')
  addSpacer(2)
  addLine(`Dirección: ${contract.property_address ||
    contract.address || '—'}`, 10, true)
  if (contract.commune)
    addLine(`Comuna: ${contract.commune}`)
  if (contract.region)
    addLine(`Región: ${contract.region}`)
  if (contract.property_type)
    addLine(`Tipo: ${contract.property_type}`)

  // ── SECTION 3: CONDICIONES ──
  checkNewPage()
  addSection('3. CONDICIONES ECONÓMICAS')
  addSpacer(2)

  const conditions = [
    ['Renta mensual:', formatCLP(contract.rent_amount || 0)],
    ['Día de pago:', `Día ${contract.payment_day || 5} de cada mes`],
    ['Garantía:', formatCLP(contract.deposit_amount || 0)],
    ['Meses de garantía:', `${contract.deposit_months || 1} mes(es)`],
  ]

  conditions.forEach(([label, value]) => {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(30, 30, 46)
    doc.text(label, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(27, 79, 114)
    doc.text(value, margin + 60, y)
    y += 7
  })

  // ── SECTION 4: VIGENCIA ──
  checkNewPage()
  addSection('4. VIGENCIA')
  addLine(`Fecha de inicio: ${formatDate(contract.start_date)}`)
  addLine(`Fecha de término: ${formatDate(contract.end_date)}`)
  if (contract.start_date && contract.end_date) {
    const start = new Date(contract.start_date)
    const end = new Date(contract.end_date)
    const months = Math.round(
      (end - start) / (1000 * 60 * 60 * 24 * 30)
    )
    addLine(`Duración total: ${months} meses`)
  }

  // ── SECTION 5: CLAUSULAS ──
  checkNewPage()
  addSection('5. OBLIGACIONES DEL ARRENDATARIO')
  const obligaciones = [
    'Pagar puntualmente la renta en la fecha convenida.',
    'Mantener la propiedad en buen estado de conservación.',
    'No ceder ni subarrendar sin autorización escrita del arrendador.',
    'Permitir el acceso al arrendador para inspecciones con aviso previo.',
    'Restituir la propiedad en las mismas condiciones al término del contrato.',
    'Pagar los servicios básicos (agua, luz, gas) a su nombre.',
  ]
  obligaciones.forEach(o => {
    checkNewPage()
    const lines = doc.splitTextToSize(`• ${o}`, contentW)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 80)
    doc.text(lines, margin, y)
    y += lines.length * 5 + 2
  })

  checkNewPage()
  addSection('6. OBLIGACIONES DEL ARRENDADOR')
  const obArrendador = [
    'Entregar la propiedad en condiciones habitables.',
    'Respetar el plazo de vigencia del contrato.',
    'Realizar reparaciones mayores que no sean responsabilidad del arrendatario.',
    'No perturbará la tranquilidad y uso de la propiedad.',
  ]
  obArrendador.forEach(o => {
    checkNewPage()
    const lines = doc.splitTextToSize(`• ${o}`, contentW)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(60, 60, 80)
    doc.text(lines, margin, y)
    y += lines.length * 5 + 2
  })

  // ── SECTION 7: TERMINO ──
  checkNewPage()
  addSection('7. TÉRMINO ANTICIPADO')
  const terminoText = 'Cualquiera de las partes podrá poner término ' +
    'anticipado al contrato con un aviso mínimo de 30 días, ' +
    'mediante comunicación escrita o digital. El incumplimiento ' +
    'de las obligaciones por parte del arrendatario faculta al ' +
    'arrendador para solicitar el desahucio conforme a la ' +
    'Ley 18.101 de arrendamiento de bienes raíces urbanos.'
  const terminoLines = doc.splitTextToSize(terminoText, contentW)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(60, 60, 80)
  doc.text(terminoLines, margin, y)
  y += terminoLines.length * 5 + 4

  // ── SIGNATURES ──
  checkNewPage()
  addSection('8. FIRMAS')
  addSpacer(8)

  const signY = y
  // Arrendador
  doc.setDrawColor(27, 79, 114)
  doc.setLineWidth(0.5)
  doc.line(margin, signY + 20, margin + 75, signY + 20)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(27, 79, 114)
  doc.text('ARRENDADOR', margin, signY + 26)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 100)
  doc.text(contract.owner_name || 'Propietario',
    margin, signY + 32)
  if (contract.owner_signed_at) {
    doc.setFontSize(8)
    doc.text(`Firmado: ${formatDate(contract.owner_signed_at)}`,
      margin, signY + 38)
  }

  // Arrendatario
  const col2 = margin + 95
  doc.line(col2, signY + 20, col2 + 75, signY + 20)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(27, 79, 114)
  doc.text('ARRENDATARIO', col2, signY + 26)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 100)
  doc.text(contract.tenant_name || '—', col2, signY + 32)
  if (contract.tenant_signed_at) {
    doc.setFontSize(8)
    doc.text(`Firmado: ${formatDate(contract.tenant_signed_at)}`,
      col2, signY + 38)
  } else {
    doc.setFontSize(8)
    doc.setTextColor(200, 100, 50)
    doc.text('Pendiente de firma', col2, signY + 38)
  }

  y = signY + 55

  // ── FOOTER ──
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFillColor(245, 247, 250)
    doc.rect(0, 285, pageW, 12, 'F')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 170)
    doc.text('PagoRenta.cl · Plataforma de Arriendos Digitales · Chile',
      margin, 291)
    doc.text(`Página ${i} de ${totalPages}`,
      pageW - margin, 291, { align: 'right' })
    doc.text('Documento generado bajo Ley 19.799 de documentos electrónicos',
      pageW / 2, 294, { align: 'center' })
  }

  // ── DOWNLOAD ──
  const fileName = `Contrato_${
    (contract.tenant_name || 'arrendatario')
      .replace(/\s+/g, '_')
  }_${
    (contract.property_address || 'propiedad')
      .replace(/\s+/g, '_').slice(0, 20)
  }.pdf`

  doc.save(fileName)
}
