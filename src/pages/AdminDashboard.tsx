'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Plus,
  Search,
  History,
  Package,
  Users,
  FileSpreadsheet,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { FormInput } from '../components/FormInput';
import { clearAdminToken } from '../services/AuthService';
import {
  listLots,
  createLot,
  updateLot,
  deleteLot,
  //restoreLot,
  setActiveLot,
  type Lot,
  type CreateLotDto,
  type UpdateLotDto,
  type LotsSearchParams,
} from '../services/LotsService';
import { createUser, type CreateUserDto } from '../services/UsersService';
import { getAuditHistoryByLot, type AuditEntry } from '../services/AuditService';
import { exportLotToExcel } from '../services/ExportService';

type AdminView = 'lots' | 'audit' | 'users' | 'lotForm';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<AdminView>('lots');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Lots state
  const [lots, setLots] = useState<Lot[]>([]);
  const [lotsTotal, setLotsTotal] = useState(0);
  const [lotsPage, setLotsPage] = useState(1);
  const [lotsLimit] = useState(10);
  const [lotsFilters, setLotsFilters] = useState<LotsSearchParams>({
    showDeleted: false,
  });
  const [selectedLot, setSelectedLot] = useState<Lot | undefined>();

  // Lot form state
  const [lotForm, setLotForm] = useState<CreateLotDto>({
    code: '',
    name: '',
    cereal: '',
  });

  // Audit state
  const [auditLotId, setAuditLotId] = useState('');
  const [auditHistory, setAuditHistory] = useState<AuditEntry[]>([]);

  // User form state
  const [userForm, setUserForm] = useState<CreateUserDto>({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (activeView === 'lots') {
      loadLots();
    }
  }, [activeView, lotsPage, lotsFilters]);

  const loadLots = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await listLots({
        ...lotsFilters,
        page: lotsPage,
        limit: lotsLimit,
      });
      setLots(response.data);
      setLotsTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar lotes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createLot(lotForm);
      setSuccess('Lote creado correctamente');
      setLotForm({ code: '', name: '', cereal: '' });
      setActiveView('lots');
      await loadLots();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear lote');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLot) return;
    setLoading(true);
    setError('');
    try {
      const updateData: UpdateLotDto = {};
      if (lotForm.code !== selectedLot.code) updateData.code = lotForm.code;
      if (lotForm.name !== selectedLot.name) updateData.name = lotForm.name;
      if (lotForm.cereal !== selectedLot.cereal) updateData.cereal = lotForm.cereal;

      await updateLot(selectedLot._id, updateData);
      setSuccess('Lote actualizado correctamente');
      setSelectedLot(undefined);
      setLotForm({ code: '', name: '', cereal: '' });
      setActiveView('lots');
      await loadLots();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar lote');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLot = async (lot: Lot) => {
    if (!confirm(`¿Desactivar el lote "${lot.name}"?`)) return;
    setLoading(true);
    setError('');
    try {
      await deleteLot(lot._id);
      setSuccess('Lote desactivado correctamente');
      await loadLots();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desactivar lote');
    } finally {
      setLoading(false);
    }
  };

  /*const handleRestoreLot = async (lot: Lot) => {
    setLoading(true);
    setError('');
    try {
      await restoreLot(lot._id);
      setSuccess('Lote restaurado correctamente');
      await loadLots();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al restaurar lote');
    } finally {
      setLoading(false);
    }
  };*/

  const handleSetActiveLot = async (lot: Lot) => {
    if (!confirm(`¿Activar el lote "${lot.name}" como lote actual?`)) return;
    setLoading(true);
    setError('');
    try {
      await setActiveLot(lot.code);
      setSuccess(`Lote "${lot.name}" activado correctamente`);
      await loadLots();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al activar lote');
    } finally {
      setLoading(false);
    }
  };

  const handleExportLot = async (lot: Lot) => {
    setLoading(true);
    setError('');
    try {
      await exportLotToExcel(lot._id, lot.code);
      setSuccess(`Archivo Excel exportado para lote "${lot.name}"`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al exportar');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAudit = async () => {
    if (!auditLotId.trim()) {
      setError('Ingrese el ID del lote');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const history = await getAuditHistoryByLot(auditLotId);
      setAuditHistory(history);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar auditoría');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.email || !userForm.password) {
      setError('Email y contraseña son requeridos');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createUser(userForm);
      setSuccess('Usuario creado correctamente');
      setUserForm({ email: '', password: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleEditLot = (lot: Lot) => {
    setSelectedLot(lot);
    setLotForm({
      code: lot.code,
      name: lot.name,
      cereal: lot.cereal,
    });
    setActiveView('lotForm');
  };

  const handleNewLot = () => {
    setSelectedLot(undefined);
    setLotForm({ code: '', name: '', cereal: '' });
    setActiveView('lotForm');
  };

  const handleLogout = () => {
    clearAdminToken();
    navigate('/admin/login');
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const totalPages = Math.ceil(lotsTotal / lotsLimit);

  return (
    <div className="operario-dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1>Panel de Administración</h1>
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        {/* Navigation Tabs */}
        <div className="admin-nav">
          <button
            className={`admin-nav-button ${activeView === 'lots' || activeView === 'lotForm' ? 'active' : ''}`}
            onClick={() => {
              clearMessages();
              setActiveView('lots');
            }}
          >
            <Package size={18} />
            Lotes
          </button>
          <button
            className={`admin-nav-button ${activeView === 'audit' ? 'active' : ''}`}
            onClick={() => {
              clearMessages();
              setActiveView('audit');
            }}
          >
            <History size={18} />
            Auditoría
          </button>
          <button
            className={`admin-nav-button ${activeView === 'users' ? 'active' : ''}`}
            onClick={() => {
              clearMessages();
              setActiveView('users');
            }}
          >
            <Users size={18} />
            Usuarios
          </button>
        </div>

        {/* Lots View */}
        {activeView === 'lots' && (
          <section className="dashboard-section">
            <div className="section-header">
              <h2>Gestión de Lotes</h2>
              <button onClick={handleNewLot} className="primary-action-button">
                <Plus size={18} />
                Nuevo Lote
              </button>
            </div>

            {/* Filters */}
            <div className="filter-section">
              <div className="search-grid">
                <FormInput
                  label="Código"
                  type="text"
                  value={lotsFilters.code || ''}
                  onChange={(value) =>
                    setLotsFilters((prev) => ({ ...prev, code: value }))
                  }
                  placeholder="Filtrar por código"
                  disabled={loading}
                />
                <FormInput
                  label="Nombre"
                  type="text"
                  value={lotsFilters.name || ''}
                  onChange={(value) =>
                    setLotsFilters((prev) => ({ ...prev, name: value }))
                  }
                  placeholder="Filtrar por nombre"
                  disabled={loading}
                />
                <FormInput
                  label="Cereal"
                  type="text"
                  value={lotsFilters.cereal || ''}
                  onChange={(value) =>
                    setLotsFilters((prev) => ({ ...prev, cereal: value }))
                  }
                  placeholder="Filtrar por cereal"
                  disabled={loading}
                />
              </div>
              <div className="filter-actions">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={lotsFilters.showDeleted}
                    onChange={(e) =>
                      setLotsFilters((prev) => ({
                        ...prev,
                        showDeleted: e.target.checked,
                      }))
                    }
                  />
                  Mostrar eliminados
                </label>
                <button
                  onClick={() => {
                    setLotsPage(1);
                    loadLots();
                  }}
                  disabled={loading}
                  className="filter-button"
                >
                  <Search size={16} />
                  Buscar
                </button>
              </div>
            </div>

            {/* Lots Table */}
            {lots.length === 0 ? (
              <div className="records-empty">
                <p>No hay lotes registrados</p>
              </div>
            ) : (
              <>
                <div className="records-table-wrapper">
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Cereal</th>
                        <th>Estado</th>
                        <th>Activo</th>
                        <th>Creado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lots.map((lot) => (
                        <tr key={lot._id}>
                          <td className="order-number">{lot.code}</td>
                          <td>{lot.name}</td>
                          <td>{lot.cereal}</td>

                          {/* Estado texto */}
                          <td>
                            {lot.active ? (
                              <span className="status-badge active">Activo</span>
                            ) : (
                              <span className="status-badge inactive">Inactivo</span>
                            )}
                          </td>

                          {/* Estado icono */}
                          <td>
                            {lot.active ? (
                              <CheckCircle size={18} className="status-icon active" />
                            ) : (
                              <XCircle size={18} className="status-icon inactive" />
                            )}
                          </td>

                          <td>{new Date(lot.createdAt).toLocaleDateString('es-AR')}</td>

                          <td className="actions">
                            <button
                              onClick={() => handleEditLot(lot)}
                              disabled={loading}
                              className="action-button edit-button"
                              title="Editar"
                            >
                              <Edit2 size={16} />
                            </button>

                            {/* Desactivar */}
                            {lot.active ? (
                              <button
                                onClick={() => handleDeleteLot(lot)}
                                disabled={loading}
                                className="action-button delete-button"
                                title="Desactivar"
                              >
                                <Trash2 size={16} />
                              </button>
                            ) : (
                              /* Activar */
                              <button
                                onClick={() => handleSetActiveLot(lot)}
                                disabled={loading}
                                className="action-button activate-button"
                                title="Activar lote"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}

                            <button
                              onClick={() => handleExportLot(lot)}
                              disabled={loading}
                              className="action-button export-button"
                              title="Exportar Excel"
                            >
                              <FileSpreadsheet size={16} />
                            </button>

                            <button
                              onClick={() => {
                                setAuditLotId(lot._id);
                                setActiveView('audit');
                                setTimeout(() => handleLoadAudit(), 100);
                              }}
                              disabled={loading}
                              className="action-button history-button"
                              title="Ver historial"
                            >
                              <History size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button
                    onClick={() => setLotsPage((p) => Math.max(1, p - 1))}
                    disabled={lotsPage === 1 || loading}
                    className="pagination-button"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="pagination-info">
                    Página {lotsPage} de {totalPages} ({lotsTotal} lotes)
                  </span>
                  <button
                    onClick={() => setLotsPage((p) => Math.min(totalPages, p + 1))}
                    disabled={lotsPage >= totalPages || loading}
                    className="pagination-button"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            )}
          </section>
        )}

        {/* Lot Form View */}
        {activeView === 'lotForm' && (
          <section className="dashboard-section">
            <h2>{selectedLot ? 'Editar Lote' : 'Crear Nuevo Lote'}</h2>
            <form
              onSubmit={selectedLot ? handleUpdateLot : handleCreateLot}
              className="record-form"
            >
              <div className="form-grid-2">
                <FormInput
                  label="Código"
                  type="text"
                  value={lotForm.code}
                  onChange={(value) =>
                    setLotForm((prev) => ({ ...prev, code: value }))
                  }
                  placeholder="Ej: LOT001"
                  disabled={loading}
                />
                <FormInput
                  label="Nombre"
                  type="text"
                  value={lotForm.name}
                  onChange={(value) =>
                    setLotForm((prev) => ({ ...prev, name: value }))
                  }
                  placeholder="Nombre del lote"
                  disabled={loading}
                />
              </div>
              <FormInput
                label="Cereal"
                type="text"
                value={lotForm.cereal}
                onChange={(value) =>
                  setLotForm((prev) => ({ ...prev, cereal: value }))
                }
                placeholder="Maíz, Soja, Trigo, etc."
                disabled={loading}
              />
              <div className="form-actions">
                <button type="submit" disabled={loading} className="form-submit-button">
                  {loading
                    ? 'Guardando...'
                    : selectedLot
                      ? 'Actualizar Lote'
                      : 'Crear Lote'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedLot(undefined);
                    setLotForm({ code: '', name: '', cereal: '' });
                    setActiveView('lots');
                  }}
                  disabled={loading}
                  className="form-back-button"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Audit View */}
        {activeView === 'audit' && (
          <section className="dashboard-section">
            <h2>Historial de Auditoría</h2>
            <div className="filter-section">
              <div className="search-grid">
                <FormInput
                  label="ID del Lote"
                  type="text"
                  value={auditLotId}
                  onChange={setAuditLotId}
                  placeholder="Ingrese el ID del lote"
                  disabled={loading}
                />
              </div>
              <button
                onClick={handleLoadAudit}
                disabled={loading || !auditLotId.trim()}
                className="filter-button"
              >
                <Search size={16} />
                {loading ? 'Cargando...' : 'Buscar Historial'}
              </button>
            </div>

            {auditHistory.length > 0 && (
              <div className="records-table-wrapper">
                <table className="records-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Acción</th>
                      <th>Tipo</th>
                      <th>ID Entidad</th>
                      <th>Cambios</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditHistory.map((entry) => (
                      <tr key={entry._id}>
                        <td>
                          {new Date(entry.createdAt).toLocaleString('es-AR')}
                        </td>
                        <td>
                          <span className={`audit-action ${entry.action.toLowerCase()}`}>
                            {entry.action}
                          </span>
                        </td>
                        <td>{entry.entityType}</td>
                        <td className="order-number">{entry.entityId}</td>
                        <td>
                          {entry.changes ? (
                            <pre className="changes-preview">
                              {JSON.stringify(entry.changes, null, 2)}
                            </pre>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {auditHistory.length === 0 && auditLotId && !loading && (
              <div className="records-empty">
                <p>No hay registros de auditoría para este lote</p>
              </div>
            )}
          </section>
        )}

        {/* Users View */}
        {activeView === 'users' && (
          <section className="dashboard-section">
            <h2>Crear Nuevo Usuario Administrador</h2>
            <form onSubmit={handleCreateUser} className="record-form">
              <FormInput
                label="Email"
                type="email"
                value={userForm.email}
                onChange={(value) =>
                  setUserForm((prev) => ({ ...prev, email: value }))
                }
                placeholder="admin@ejemplo.com"
                disabled={loading}
              />
              <FormInput
                label="Contraseña"
                type="password"
                value={userForm.password}
                onChange={(value) =>
                  setUserForm((prev) => ({ ...prev, password: value }))
                }
                placeholder="Contraseña segura"
                disabled={loading}
              />
              <div className="form-actions">
                <button type="submit" disabled={loading} className="form-submit-button">
                  {loading ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};
