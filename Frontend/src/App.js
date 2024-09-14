import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import api from './api'

const App = () => {
  const [file, setFile] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    const formData = new FormData();
    formData.append('file', file);
    formData.append('openai_api_key', apiKey);

    try {
      const response = await api.post('/process-pdf/', formData);
      const resumeData = response.data;

      navigate('/resume', { state: { resumeData } });
    } catch (error) {
      console.error('Error processing the file:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className='navbar navbar-dark bg-primary'>
        <div className='container-fluid'>
          <a className='navbar-brand' href='/'>
            Web Resume Generator
          </a>
        </div>
      </nav>

      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div className='mb-3 mt-3'>
            <label htmlFor='apikey' className='form-label'>
              OpenAI API Key
            </label>
            <input type='text' className='form-control' id='apikey' name='apikey' onChange={(e) => setApiKey(e.target.value)} value={apiKey}/>
          </div>
          <div className='mb-3 mt-3'>
            <label htmlFor='resume' className='form-label'>
              LinkedIn Profile PDF
            </label>
            <input type="file" className='form-control' id='resume' name='resume' onChange={handleFileChange} />
          </div>
          <button type="submit">Upload and Process</button>
        </form>
        {loading && (
          <div className='d-flex justify-content-center mt-3'>
            <div className='spinner-border text-primary' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )

}

export default App;
