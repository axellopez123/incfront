import React from 'react';
import { X, Printer, Download } from 'lucide-react';

const IncidenciaVisualizer = ({ incidencia, student, onClose, onDownload }) => {
  if (!incidencia) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const numeralsLeve = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const numeralsGrave = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const numeralsMuyGrave = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

  const renderCheckboxes = (numerals, values, other) => {
    return (
      <div className="faction-container">
        <div className="numerals-grid">
          {numerals.map((num) => (
            <div key={num} className="checkbox-item">
              <div className={`circle ${values?.includes(num) ? 'checked' : ''}`}></div>
              <span className="numeral-label">{num}.</span>
            </div>
          ))}
          <div className="checkbox-item other-item">
            <div className={`circle ${other ? 'checked' : ''}`}></div>
            <span className="numeral-label">Otro:</span>
            <span className="other-text">{other || '__________________________________________________'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="visualizer-container">
        <div className="visualizer-header">
          <button className="icon-btn close-btn" onClick={onClose} title="Cerrar">
            <X size={24} />
          </button>
          <div className="action-buttons">
            <button className="btn btn-secondary" onClick={() => window.print()}>
              <Printer size={18} /> Imprimir
            </button>
            <button className="btn btn-primary" onClick={() => onDownload(incidencia.id)}>
              <Download size={18} /> Descargar Word
            </button>
          </div>
        </div>

        <div className="paper-printable" id="printable-area">
          {/* Header Section */}
          <div className="document-header">
            <div className="logo-placeholder">
              <img src="/logo_escuela.png" alt="Logo" onError={(e) => e.target.style.display = 'none'} />
              <div className="logo-text">LOGO</div>
            </div>
            <div className="header-titles">
              <h3>Escuela Primaria URBANA 868 "INSTITUTO CABAÑAS"</h3>
              <h1>INCIDENCIA ESCOLAR</h1>
            </div>
            <div className="header-right">
              <span className="edu-label">Educación</span>
            </div>
          </div>

          {/* Student Info */}
          <div className="info-grid">
            <div className="info-item">
              <label>Nombre del alumno:</label>
              <span className="value">{student?.name || '_________________________________'}</span>
            </div>
            <div className="info-item right">
              <label>Incidencia No.</label>
              <span className="value">#{incidencia.id}</span>
            </div>
            <div className="info-item">
              <label>Fecha:</label>
              <span className="value">{formatDate(incidencia.date)}</span>
            </div>
            <div className="info-item right">
              <label>Grado/Grupo:</label>
              <span className="value">{student?.grade} / {student?.group}</span>
            </div>
          </div>

          <p className="legal-text">
            Con base en el Reglamento de Conducta para las Escuelas de Educación Básica del Estado de Jalisco, se le informa que el alumno incurrió en una falta de indisciplina:
          </p>

          {/* Article 13 - Leve */}
          <div className="article-section">
            <h4>ARTÍCULO 13. ACTO LEVE DE INDISCIPLINA</h4>
            {renderCheckboxes(numeralsLeve, incidencia.leve_faction, incidencia.leve_other)}
          </div>

          {/* Article 14 - Grave */}
          <div className="article-section">
            <h4>ARTÍCULO 14. ACTO GRAVE DE INDISCIPLINA</h4>
            {renderCheckboxes(numeralsGrave, incidencia.grave_faction, incidencia.grave_other)}
          </div>

          {/* Article 15 - Muy Grave */}
          <div className="article-section">
            <h4>ARTÍCULO 15. ACTO MUY GRAVE DE INDISCIPLINA</h4>
            {renderCheckboxes(numeralsMuyGrave, incidencia.muy_grave_faction, incidencia.muy_grave_other)}
          </div>

          {/* Situation Description */}
          <div className="form-section">
            <h4 className="centered">Descripción breve de la situación</h4>
            <div className="text-box lines">
              {incidencia.description || '\n\n\n'}
            </div>
          </div>

          {/* Disciplinary Measure */}
          <div className="form-section">
            <p className="legal-text small">
              Por lo que estará sujeto (a) a la siguiente medida disciplinaria indicada en el Reglamento de Conducta para las Escuelas de Educación Básica del Estado de Jalisco, artículo 17 según la falta cometida:
            </p>
            <div className="text-box lines">
              {incidencia.disciplinary || '\n\n'}
            </div>
          </div>

          {/* Agreements */}
          <div className="form-section">
            <h4 className="centered">Acuerdos y compromisos</h4>
            <div className="text-box lines">
              {incidencia.acuerdos_compromisos || '\n\n'}
            </div>
          </div>

          <p className="legal-text xsmall">
            Si es necesario la autoridad escolar o el Comité de Convivencia y Disciplina Escolar, según la falta cometida, valorará estas circunstancias y determinará la medida disciplinaria que considere más adecuada, dentro del parámetro establecido en el artículo 17 del presente.
          </p>

          {/* Signatures */}
          <div className="signature-area">
            <h4 className="centered">NOMBRE Y FIRMA</h4>
            <div className="signature-grid">
              <div className="sig-item">
                <div className="sig-line"></div>
                <label>ÁREA QUE RESPONDE DE HOGAR CABAÑAS</label>
              </div>
              <div className="sig-item">
                <div className="sig-line"></div>
                <label>DOCENTE</label>
              </div>
              <div className="sig-item">
                <div className="sig-line"></div>
                <label>DIRECTIVO</label>
              </div>
              <div className="sig-item">
                <div className="sig-line"></div>
                <label>OTRO</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: flex-start;
          z-index: 2000;
          overflow-y: auto;
          padding: 2rem;
        }

        .visualizer-container {
          width: 100%;
          max-width: 900px;
          position: relative;
        }

        .visualizer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          color: white;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .paper-printable {
          background: white;
          color: #333;
          padding: 3rem;
          border-radius: 4px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          font-family: 'Inter', 'Segoe UI', serif;
          min-height: 1050px;
          position: relative;
        }

        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #000;
          padding-bottom: 1rem;
          margin-bottom: 1.5rem;
        }

        .logo-placeholder {
          width: 80px;
          height: 80px;
          border: 1px dashed #ccc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          color: #999;
        }

        .header-titles {
          text-align: center;
          flex: 1;
        }

        .header-titles h3 {
          font-size: 0.9rem;
          margin: 0;
          text-transform: uppercase;
        }

        .header-titles h1 {
          font-size: 1.8rem;
          margin: 0.5rem 0 0 0;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .edu-label {
          font-weight: bold;
          font-size: 1.1rem;
          color: #555;
        }

        .info-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .info-item {
          display: flex;
          gap: 0.5rem;
          align-items: baseline;
          border-bottom: 1px solid #eee;
          padding: 0.3rem 0;
        }

        .info-item label {
          font-weight: bold;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .info-item .value {
          font-size: 1rem;
          flex: 1;
        }

        .legal-text {
          font-size: 0.85rem;
          line-height: 1.4;
          margin-bottom: 1rem;
        }

        .legal-text.small { font-size: 0.75rem; }
        .legal-text.xsmall { font-size: 0.65rem; color: #666; font-style: italic; }

        .article-section {
          margin-bottom: 1.2rem;
        }

        .article-section h4 {
          font-size: 0.85rem;
          margin-bottom: 0.6rem;
          background: #f5f5f5;
          padding: 0.3rem 0.5rem;
          border-radius: 3px;
        }

        .numerals-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          padding: 0 0.5rem;
        }

        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .circle {
          width: 16px;
          height: 16px;
          border: 1.5px solid #000;
          border-radius: 50%;
          position: relative;
        }

        .circle.checked::after {
          content: '✓';
          position: absolute;
          top: -4px;
          left: 1px;
          font-size: 14px;
          font-weight: bold;
          color: #000;
        }

        .numeral-label {
          font-size: 0.85rem;
          font-weight: bold;
        }

        .other-item {
          width: 100%;
          margin-top: 0.3rem;
        }

        .other-text {
          font-style: italic;
          border-bottom: 1px solid #333;
          flex: 1;
          padding-left: 0.5rem;
          min-height: 1.2rem;
        }

        .form-section {
          margin-top: 1.5rem;
        }

        .centered {
          text-align: center;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .text-box {
          border: 1px solid #ccc;
          padding: 1rem;
          min-height: 80px;
          font-size: 0.95rem;
          line-height: 1.6;
          white-space: pre-wrap;
          background-image: linear-gradient(#eee 1px, transparent 1px);
          background-size: 100% 1.6rem;
        }

        .signature-area {
          margin-top: 3rem;
        }

        .signature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-top: 2rem;
        }

        .sig-item {
          text-align: center;
        }

        .sig-line {
          border-top: 1px solid #000;
          margin-bottom: 0.5rem;
        }

        .sig-item label {
          font-size: 0.6rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        @media print {
          body * { visibility: hidden; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 0;
            margin: 0;
            box-shadow: none;
            border: none;
          }
          .modal-overlay {
            position: absolute;
            background: white;
            padding: 0;
            margin: 0;
            overflow: visible;
            display: block;
          }
          .visualizer-header { display: none; }
          .signature-area { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
};

export default IncidenciaVisualizer;
