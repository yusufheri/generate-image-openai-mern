import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';


const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setFrom] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo)
    {
      setLoading(true);

      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify(form)
        });

        await response.json();
        navigate('/')
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter a prompt and generate an image')
    }
    
  }

  const handleChange = (e) => {
    setFrom({...form, [e.target.name] : e.target.value})
  }

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setFrom({...form, prompt: randomPrompt})
  }

  const generateImage= async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch('http://localhost:8080/api/v1/dalle', {
          method: 'POST',
          headers: {
            'Content-type' : 'application/json',
          }, 
          body: JSON.stringify({ prompt: form.prompt }),
        })

        const data = await response.json();

        setFrom({...form, photo: `data:image/jpeg;base64,${data.photo}`});
      } catch (error) {
        alert(error);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert('Please enter a prompt');
    }
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>La vitrine de la communauté</h1>
        <p className='mt-2 text-[#666e75] text-[14px] max-w[500px]'>
        Parcourez une collection d'images imaginatives et visuellement époustouflantes générées par DALL-E AI
        </p>
      </div>
      
      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            labelName="Your name"
            text= "text"
            name="name"
            placeholder="Yheri Kapa."
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Prompt"
            text= "text"
            name="prompt"
            placeholder="The long-lost Star Wars 1990 Japanese Anime"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
           <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
            focus:ring-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
                {form.photo ? (
                    <img 
                    src={form.photo} 
                    alt={form.prompt}
                    className='w-full h-full object-contain' />
                ):(
                    <img 
                        src={preview} 
                        alt="preview"
                        className='w-9/12 h-9/12 object-contain opacity-40' />
                )}

                {generatingImg && (
                  <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg'>
                    <Loader/>
                  </div>
                )}
            </div>            
        </div>

        <div className='mt-5 flex gap-5'>
          <button
            type='button'
            onClick={generateImage}
            className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
              {generatingImg ? 'Generating...': 'Générer une image'}
          </button>
        </div>

        <div className='mt-10'>
          <p className='mt-2 text-[#666e75] text-[14px]'>
          Une fois que vous avez créé l'image que vous voulez, vous pouvez la partager avec d'autres membres de la communauté
          </p>
          <button 
            type='submit'px
            className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'>
             {loading? 'Sharing...': 'Share with the community'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePost