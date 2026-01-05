import type { RecordEntry } from '../services/RecordsService';
import { Edit2, Trash2 } from 'lucide-react';

interface RecordsListProps {
  records: RecordEntry[];
  onEdit: (record: RecordEntry) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export const RecordsList = ({ records, onEdit, onDelete, loading = false }: RecordsListProps) => {
  if (records.length === 0) {
    return (
      <div className="records-empty">
        <p>No hay órdenes registradas</p>
      </div>
    );
  }

  return (
    <div className="records-container">
      <div className="records-table-wrapper">
        <table className="records-table">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Fecha</th>
              <th>Kg</th>
              <th>Cereal</th>
              <th>Chofer</th>
              <th>Patente</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td className="order-number">#{record.orderNumber}</td>
                <td>{record.date.slice(0, 10)}</td>
                <td>{record.kilograms.toLocaleString('es-AR')}</td>
                <td>{record.cereal || '-'}</td>
                <td>{record.truckDriver || '-'}</td>
                <td className="plate">{record.truckPlate || '-'}</td>
                <td className="actions">
                  <button
                    onClick={() => onEdit(record)}
                    disabled={loading}
                    className="action-button edit-button"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar orden #${record.orderNumber}?`)) {
                        onDelete(record._id!);
                      }
                    }}
                    disabled={loading}
                    className="action-button delete-button"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="records-info">
        <p>{records.length} orden{records.length !== 1 ? 'es' : ''} registrada{records.length !== 1 ? 's' : ''}</p>
        <p className="total-kg">
          Total: {records.reduce((sum, r) => sum + r.kilograms, 0).toLocaleString('es-AR')} kg
        </p>
      </div>
    </div>
  );
};
