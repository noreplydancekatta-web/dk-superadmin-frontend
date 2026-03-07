import React, { useState, useEffect } from 'react';
import API from '../axios'; // ✅ Secure API with JWT
import DemographicModal from '../components/DemographicModal';
import '../styles/Demographics.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Demographics = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [modalTitle, setModalTitle] = useState('');
  const [currentTable, setCurrentTable] = useState('');
  const [currentIndex, setCurrentIndex] = useState(null);
  const [initialValue, setInitialValue] = useState('');

  const [danceStyles, setDanceStyles] = useState([]);
  const [levels, setLevels] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [danceRes, levelRes, countryRes, stateRes, cityRes] = await Promise.all([
        API.get('/api/demographics/dancestyles'),
        API.get('/api/demographics/levels'),
        API.get('/api/demographics/countries'),
        API.get('/api/demographics/states'),
        API.get('/api/demographics/cities')
      ]);
      setDanceStyles(danceRes.data);
      setLevels(levelRes.data);
      setCountries(countryRes.data);
      setStates(stateRes.data);
      setCities(cityRes.data);
    } catch (error) {
      console.error('Error fetching demographics:', error);
    }
  };

  const openModal = (mode, title, table, index = null, value = '') => {
    setModalMode(mode);
    setModalTitle(title);
    setCurrentTable(table);
    setCurrentIndex(index);
    setInitialValue(value);
    setModalOpen(true);
  };

  const getEndpoint = (table) => {
    switch (table) {
      case 'dance': return 'dancestyles';
      case 'level': return 'levels';
      case 'country': return 'countries';
      case 'state': return 'states';
      case 'city': return 'cities';
      default: return '';
    }
  };

  const handleSave = async (value) => {
    try {
      const endpoint = getEndpoint(currentTable);

      if (modalMode === 'add') {
        if (currentTable === 'dance' && value instanceof FormData) {
          await API.post(`/api/demographics/${endpoint}`, value, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else if (currentTable === 'state' || currentTable === 'city') {
          await API.post(`/api/demographics/${endpoint}`, value);
        } else {
          await API.post(`/api/demographics/${endpoint}`, { name: value });
        }
      } else if (modalMode === 'edit') {
        const idMap = {
          dance: danceStyles,
          level: levels,
          country: countries,
          state: states,
          city: cities
        };
        const id = idMap[currentTable][currentIndex]?._id;

        if (currentTable === 'dance' && value instanceof FormData) {
          await API.put(`/api/demographics/${endpoint}/${id}`, value, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          if (typeof value === 'string') {
            await API.put(`/api/demographics/${endpoint}/${id}`, { name: value });
          } else {
            await API.put(`/api/demographics/${endpoint}/${id}`, value);
          }
        }
      }

      fetchAllData();
      setModalOpen(false);
    } catch (error) {
      console.error('Error saving demographic:', error);
    }
  };

  const handleDelete = async (table, value) => {
    try {
      const endpoint = getEndpoint(table);
      const id = (() => {
        switch (table) {
          case 'dance': return danceStyles.find(item => item.name === value)?._id;
          case 'country': return countries.find(item => item.name === value)?._id;
          case 'state': return states.find(item => item.name === value)?._id;
          case 'city': return cities.find(item => item.name === value)?._id;
          default: return null;
        }
      })();

      if (table === 'dance' && value === 'Hip-Hop') {
        alert('Cannot delete. Dance Style is linked to batches.');
        return;
      }

      await API.delete(`/api/demographics/${endpoint}/${id}`);
      fetchAllData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const renderTable = (title, data, tableKey, isObject = false, hasParent = false) => (
    <>
      <h3 className="demo-title">{title}</h3>
      <div className="demo-table-wrapper">
        <table className="demo-table">
          <thead>
            <tr>
              {tableKey === 'dance' && <th>Image</th>}
              <th>{title}</th>
              {hasParent && <th>Belongs To</th>}
              <th className="actions-header" style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={item._id}>
                {tableKey === 'dance' && (
                  <td>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        style={{
                          width: '30px',
                          height: '30px',
                          objectFit: 'cover',
                          borderRadius: '6px'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '30px',
                        height: '30px',
                        background: '#ddd',
                        borderRadius: '6px'
                      }} />
                    )}
                  </td>
                )}
                <td>{item.name}</td>
                {hasParent && (
                  <td>{tableKey === 'state' ? item.country : item.state}</td>
                )}
                <td className="actions-cell">
                  <button
                    onClick={() => openModal('edit', title, tableKey, idx, item)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  {tableKey !== 'level' && (
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(tableKey, item.name)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tableKey !== 'level' && (
        <button
          onClick={() => openModal('add', title, tableKey)}
          className="add-btn"
        >
          + Add {title}
        </button>
      )}
    </>
  );

  return (
    <div className="demographics-page">
      <h2>Demographics</h2>
      {renderTable('Dance Styles', danceStyles, 'dance')}
      {renderTable('Levels', levels, 'level')}
      {renderTable('Countries', countries, 'country')}
      {renderTable('States', states, 'state', true, true)}
      {renderTable('Cities', cities, 'city', true, true)}

      <DemographicModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        mode={modalMode}
        title={modalTitle}
        initialValue={initialValue}
        countries={countries}
        states={states}
      />
    </div>
  );
};

export default Demographics;
