import React from 'react';

const Characteristics = ({characteristics}) => {
  return (
    <div>
      {
        characteristics.info.map((e, i) => (
          <div key={e} style={{backgroundColor: i % 2 === 0 ? "lightgray" : "transparent", padding: 10}}>
            <strong>{e[0]}</strong>:    {Array.isArray(characteristics.phone[e[1]]) ? characteristics.phone[e[1]].join("x") : characteristics.phone[e[1]]}
          </div>
        ))
      }
    </div>
  );
};

export default Characteristics;