import React, { useState } from 'react';
import { useEffect } from 'react';
import { Loader, Card, FormField } from '../components';

const RenderCards = ({data, title}) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />)
  }

  return (
    <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>
      {title}
    </h2>
  );
}

const Home = () => {

  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);

  const [searchText, setSearchText] = useState('')
  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch('http://localhost:8080/api/v1/post', {
          method: "GET",
          headers: {
            'Content-type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(result.data);
          setAllPosts(result.data.reverse())
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false)
      }
    }

    fetchPosts();
  }, []);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchedResults = allPosts.filter((post) => post.name.toLowerCase().includes(searchText.toLowerCase()) || 
          post.prompt.toLowerCase().includes(searchText.toLowerCase()));

        setSearchedResults(searchedResults);
      }, 500)
    )
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='font-extrabold text-[#222328] text-[32px]'>La vitrine de la communauté</h1>
        <p className='mt-2 text-[#666e75] text-[14px] max-w[500px]'>
        Parcourez une collection d'images imaginatives et visuellement époustouflantes générées par DALL-E AI
        </p>
      </div>

      <div className='mt-10'>
        <FormField
          type='search'
          labelName='Rechercher un article'
          name='text'
          value={searchText}
          placeholder='Retrouvez les sympa articles générés grâce à OpenAI'
          handleChange={handleSearchChange}
        />
      </div>

      <div className='mt-8'>
        {loading? 
        (
          <div className='flex justify-center items-center'>
            <Loader/>
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className='font-medium text-[#666e75] text-xl mb-3'>
                Affichage des résultats pour <span className='text-[#222328]'>{searchText}</span>
              </h2>
            )}
            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
              {searchText? (
                <RenderCards
                  data={searchedResults}
                  title="Aucun résultat de recherche trouvé"
                />
              ): (
                <RenderCards
                  data={allPosts}
                  title="Aucun article trouvé"
                />
              )}
            </div>
          </>
        )
      }
      </div>
    </section>
  )
}

export default Home