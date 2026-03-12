import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './config';

function App() {
  const [health, setHealth] = useState('Checking...');
  const [formData, setFormData] = useState({ nama_siswa: '', nisn: '', jurusan: '', perusahaan_tujuan: '' });
  const [message, setMessage] = useState('');

  // Mengecek apakah ALB dan EC2 Backend berjalan (Target Group Health Check)
  useEffect(() => {
    axios.get(`${API_URL}/health`)
      .then(res => setHealth(res.data.status))
      .catch(err => setHealth('Disconnected / 502 Bad Gateway'));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('Menyimpan data ke lks-db-master...');
    try {
      const response = await axios.post(`${API_URL}/api/register`, formData);
      if (response.data.success) {
        setMessage('✅ Pendaftaran Berhasil! Notifikasi SNS telah dikirim.');
        setFormData({ nama_siswa: '', nisn: '', jurusan: '', perusahaan_tujuan: '' });
      }
    } catch (error) {
      setMessage('❌ Gagal menyimpan data. Cek koneksi RDS dan ALB Anda.');
    }
  };

  return (
    <div className="container">
      <h1>🎓 SMK BISA Hub</h1>
      
      <div style={{ padding: '10px', background: health === 'Healthy' ? '#d4edda' : '#f8d7da', borderRadius: '5px', marginBottom: '20px' }}>
        <strong>Backend Status:</strong> {health}
        <br/>
        <small>Endpoint: {API_URL}</small>
      </div>

      <h3>Formulir Magang Industri</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nama Lengkap:</label><br/>
          <input type="text" name="nama_siswa" value={formData.nama_siswa} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>NISN:</label><br/>
          <input type="text" name="nisn" value={formData.nisn} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Jurusan:</label><br/>
          <input type="text" name="jurusan" value={formData.jurusan} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Perusahaan Tujuan:</label><br/>
          <input type="text" name="perusahaan_tujuan" value={formData.perusahaan_tujuan} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', background: '#FF9900', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Daftar Magang
        </button>
      </form>
      
      {message && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{message}</p>}
    </div>
  );
}

export default App;
