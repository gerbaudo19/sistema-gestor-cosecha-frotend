import { useState } from 'react';
import { FormInput } from './FormInput';
import type { CreateRecordDto, RecordEntry } from '../services/RecordsService';

interface RecordFormProps {
  record?: RecordEntry;
  onSubmit: (data: CreateRecordDto) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const RecordForm = ({
  record,
  onSubmit,
  onCancel,
  loading = false,
}: RecordFormProps) => {
  const [formData, setFormData] = useState<CreateRecordDto>(() => ({
    date: record ? record.date.split('T')[0] : '',
    kilograms: record ? record.kilograms : 0,
    bolsonNumber: record?.bolsonNumber,
    loteNumber: record?.loteNumber ?? '',
    truckPlate: record?.truckPlate ?? '',
    truckDriver: record?.truckDriver ?? '',
    tolvero: record?.tolvero ?? '',
    controller: record?.controller ?? '',
    cereal: record?.cereal ?? '',
  }));

  const [error, setError] = useState('');

  const handleChange = (field: keyof CreateRecordDto, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.date || formData.kilograms <= 0) {
      setError('Fecha y kilogramos son requeridos');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar registro');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="record-form">
      <div className="form-grid-2">
        <FormInput
          label="Fecha"
          type="date"
          value={formData.date}
          onChange={value => handleChange('date', value)}
          disabled={loading}
        />

        <FormInput
          label="Kilogramos"
          type="number"
          value={formData.kilograms.toString()}
          onChange={value => handleChange('kilograms', value ? Number(value) : 0)}
          placeholder="0"
          disabled={loading}
        />
      </div>

      <div className="form-grid-2">
        <FormInput
          label="Número de bolsón"
          type="number"
          value={formData.bolsonNumber?.toString() || ''}
          onChange={value =>
            handleChange('bolsonNumber', value ? Number(value) : undefined)
          }
          placeholder="Opcional"
          disabled={loading}
        />

        <FormInput
          label="Número de lote"
          type="text"
          value={formData.loteNumber || ''}
          onChange={value => handleChange('loteNumber', value)}
          placeholder="Opcional"
          disabled={loading}
        />
      </div>

      <div className="form-grid-2">
        <FormInput
          label="Patente del camión"
          type="text"
          value={formData.truckPlate || ''}
          onChange={value => handleChange('truckPlate', value)}
          placeholder="AA123BB"
          disabled={loading}
        />

        <FormInput
          label="Chofer"
          type="text"
          value={formData.truckDriver || ''}
          onChange={value => handleChange('truckDriver', value)}
          placeholder="Nombre del chofer"
          disabled={loading}
        />
      </div>

      <div className="form-grid-2">
        <FormInput
          label="Operario de tolva"
          type="text"
          value={formData.tolvero || ''}
          onChange={value => handleChange('tolvero', value)}
          placeholder="Nombre"
          disabled={loading}
        />

        <FormInput
          label="Controlador"
          type="text"
          value={formData.controller || ''}
          onChange={value => handleChange('controller', value)}
          placeholder="Nombre"
          disabled={loading}
        />
      </div>

      <FormInput
        label="Tipo de cereal"
        type="text"
        value={formData.cereal || ''}
        onChange={value => handleChange('cereal', value)}
        placeholder="Maíz, Soja, etc."
        disabled={loading}
      />

      {error && <div className="form-error-box">{error}</div>}

      <div className="form-actions">
        <button type="submit" disabled={loading} className="form-submit-button">
          {loading ? 'Guardando...' : record ? 'Actualizar' : 'Crear'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="form-back-button"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
