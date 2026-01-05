import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Search } from 'lucide-react';
import { RecordForm } from '../components/RecordForm';
import { RecordsList } from '../components/RecordsList';
import { FormInput } from '../components/FormInput';
import {
  listRecordsByLot,
  listRecordsByLotAndDay,
  searchRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  type RecordEntry,
  type CreateRecordDto,
  type SearchFilters,
} from '../services/RecordsService';
import { clearLotToken } from '../services/AuthService';

type ViewMode = 'list' | 'search' | 'byDay' | 'form';

export const OperarioDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<RecordEntry | undefined>();
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [dayFilter, setDayFilter] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listRecordsByLot();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadByDay = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listRecordsByLotAndDay(dayFilter);
      setRecords(data);
      setViewMode('byDay');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar órdenes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await searchRecords(searchFilters);
      setRecords(data);
      setViewMode('search');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en búsqueda');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedRecord(undefined);
    setViewMode('form');
  };

  const handleEditClick = (record: RecordEntry) => {
    setSelectedRecord(record);
    setViewMode('form');
  };

  const handleFormSubmit = async (data: CreateRecordDto) => {
    setLoading(true);
    setError('');
    try {
      if (selectedRecord?._id) {
        await updateRecord(selectedRecord._id, data);
      } else {
        await createRecord(data);
      }
      await loadRecords();
      setViewMode('list');
      setSelectedRecord(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar registro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await deleteRecord(id);
      await loadRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar orden');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearLotToken();
    navigate('/lote/acceso');
  };

  return (
    <div className="operario-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Panel de Operario</h1>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            Salir
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-box">{error}</div>}

        {viewMode === 'form' ? (
          <section className="dashboard-section">
            <h2>{selectedRecord ? 'Editar Orden' : 'Crear Nueva Orden'}</h2>
            <RecordForm
              record={selectedRecord}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setViewMode('list');
                setSelectedRecord(undefined);
              }}
              loading={loading}
            />
          </section>
        ) : (
          <>
            <section className="dashboard-section">
              <h2>Órdenes</h2>

              <div className="tabs-container">
                <button
                  className={`tab-button ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => {
                    loadRecords();
                    setViewMode('list');
                  }}
                >
                  Todas
                </button>
                <button
                  className={`tab-button ${viewMode === 'byDay' ? 'active' : ''}`}
                  onClick={() => setViewMode('byDay')}
                >
                  Por Día
                </button>
                <button
                  className={`tab-button ${viewMode === 'search' ? 'active' : ''}`}
                  onClick={() => setViewMode('search')}
                >
                  Buscar
                </button>
              </div>

              {viewMode === 'byDay' && (
                <div className="filter-section">
                  <FormInput
                    label="Seleccionar fecha"
                    type="date"
                    value={dayFilter}
                    onChange={setDayFilter}
                    disabled={loading}
                  />
                  <button
                    onClick={handleLoadByDay}
                    disabled={loading}
                    className="filter-button"
                  >
                    {loading ? 'Cargando...' : 'Filtrar'}
                  </button>
                </div>
              )}

              {viewMode === 'search' && (
                <div className="filter-section">
                  <div className="search-grid">
                    <FormInput
                      label="Número de orden"
                      type="number"
                      value={searchFilters.orderNumber?.toString() || ''}
                      onChange={(value) =>
                        setSearchFilters(prev => ({
                          ...prev,
                          orderNumber: value ? Number(value) : undefined,
                        }))
                      }
                      placeholder="Opcional"
                      disabled={loading}
                    />

                    <FormInput
                      label="Patente"
                      type="text"
                      value={searchFilters.truckPlate || ''}
                      onChange={(value) =>
                        setSearchFilters(prev => ({
                          ...prev,
                          truckPlate: value,
                        }))
                      }
                      placeholder="AA123BB"
                      disabled={loading}
                    />

                    <FormInput
                      label="Chofer"
                      type="text"
                      value={searchFilters.truckDriver || ''}
                      onChange={(value) =>
                        setSearchFilters(prev => ({
                          ...prev,
                          truckDriver: value,
                        }))
                      }
                      placeholder="Nombre"
                      disabled={loading}
                    />

                    <FormInput
                      label="Cereal"
                      type="text"
                      value={searchFilters.cereal || ''}
                      onChange={(value) =>
                        setSearchFilters(prev => ({
                          ...prev,
                          cereal: value,
                        }))
                      }
                      placeholder="Tipo"
                      disabled={loading}
                    />
                  </div>

                  <div className="date-range-filter">
                    <FormInput
                      label="Desde"
                      type="date"
                      value={searchFilters.dateFrom || ''}
                      onChange={(value) =>
                        setSearchFilters(prev => ({
                          ...prev,
                          dateFrom: value,
                        }))
                      }
                      disabled={loading}
                    />

                    <FormInput
                      label="Hasta"
                      type="date"
                      value={searchFilters.dateTo || ''}
                      onChange={(value) =>
                        setSearchFilters(prev => ({
                          ...prev,
                          dateTo: value,
                        }))
                      }
                      disabled={loading}
                    />
                  </div>

                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="filter-button search-button"
                  >
                    <Search size={16} />
                    {loading ? 'Buscando...' : 'Buscar'}
                  </button>
                </div>
              )}

              <RecordsList
                records={records}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                loading={loading}
              />
            </section>

            <button onClick={handleCreateClick} className="create-button">
              <Plus size={20} />
              Nueva Orden
            </button>
          </>
        )}
      </main>
    </div>
  );
};
