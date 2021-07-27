import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { getSeveralPhones } from '../http/phoneAPI';

const Compare = () => {

  const [items, setItems] = useState([])

  const storedId = useSelector(state => state.compare.items)

  useEffect(() => {
    getSeveralPhones(storedId)
      .then(data => setItems(data))
  }, [])

  return (
    <section className="section">
      <h1 className="title">Compare</h1>
      <div>
        {
          items.length ?
          (
            <div>
              {
                items.map(el => el.phone_id)
              }
            </div>
          )
          :
          <h2>Add Compare Items</h2>
        }
      </div>
    </section>
  );
};

export default Compare;