import {useEffect, useState} from 'react'

const usePageDataLoad = (fetchingData, time, ...dependencies) => {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const fetching = () => {
    fetchingData()
      .then(requiredData => {
        setData(requiredData)
        setError(null)
        setLoading(false)
      })
      .catch((requiredError) => {
        setError({
          status: requiredError?.response?.status,
          message: requiredError?.response?.statusText || requiredError.message,
          config: requiredError?.config
        })
        setData(null)
        setLoading(false)
      })
  }
  
  useEffect(() => {
    setLoading(true)

    if (time) {
      const timer = setTimeout(() => {
        fetching()
      }, time);

      return () => clearTimeout(timer)
    }
    else {
      fetching()
    }
    
  }, [...dependencies])
  
  return [data, setData, loading, error]
}

export default usePageDataLoad;