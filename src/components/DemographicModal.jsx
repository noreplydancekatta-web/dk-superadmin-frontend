import React, { useState, useEffect } from 'react';
import '../styles/DemographicModal.css';

const DemographicModal = ({
  isOpen,
  onClose,
  onSave,
  mode,
  title,
  initialValue,
  countries = [],
  states = [],
}) => {
  const [value, setValue] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');

  useEffect(() => {
    if (mode === 'edit' && initialValue) {
      setValue(initialValue.name || '');
      if (initialValue.imageUrl) {
        setPreviewUrl(import.meta.env.VITE_BACKEND_URL + initialValue.imageUrl);
      }
      if (title === 'States') {
        setSelectedCountry(initialValue.country || '');
      }
      if (title === 'Cities') {
        setSelectedState(initialValue.state || '');
      }
    } else {
      setValue('');
      setImageFile(null);
      setPreviewUrl('');
      setSelectedCountry('');
      setSelectedState('');
    }
  }, [mode, initialValue, title]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (value.trim() === '') return;

    if (title === 'Dance Styles') {
      const formData = new FormData();
      formData.append('name', value);
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (mode === 'edit' && initialValue?.imageUrl) {
        formData.append('imageUrl', initialValue.imageUrl); // preserve if not reuploaded
      }
      onSave(formData);
    } else if (title === 'States') {
      if (!selectedCountry) {
        alert('Please select a country.');
        return;
      }
      onSave({ name: value, country: selectedCountry });
    } else if (title === 'Cities') {
      if (!selectedState) {
        alert('Please select a state.');
        return;
      }
      onSave({ name: value, state: selectedState });
    } else {
      onSave(value);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === 'edit' ? `Edit ${title}` : `Add ${title}`}</h2>

        <input
          type="text"
          placeholder={`Enter ${title}`}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        {title === 'Dance Styles' && (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="image-url-input"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: '100px',
                  height: '100px',
                  objectFit: 'cover',
                  marginTop: '10px',
                  borderRadius: '8px',
                }}
              />
            )}
          </>
        )}

        {title === 'States' && (
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="modal-select"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {title === 'Cities' && (
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="modal-select"
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s._id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        )}

        <div className="modal-actions">
          <button onClick={handleSave} className="save-btn">
            Save
          </button>
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemographicModal;
