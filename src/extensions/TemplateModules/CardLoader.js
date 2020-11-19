import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CardStyle } from './styles';

const LoaderCard = styled(CardStyle)`
  display: flex;
  align-items: center;
  justify-content: center;

  padding-left: 40%;
`;

function CardLoader() {
  const [text, setText] = useState('Loading ');

  useEffect(() => {
    const interval = () => {
      setText((oldText) => {
        if (oldText.length > 10) {
          return 'Loading ';
        }

        return `${oldText}.`;
      });
    };

    const intervalRef = setInterval(interval, 300);

    return () => clearInterval(intervalRef);
  });

  return <LoaderCard title={text} />;
}

export default CardLoader;
