// src/components/home/Btn.tsx
import { useContext } from 'react';
import styled from 'styled-components';
import { modalContext } from 'modules/contexts/modal';
import { pushModal } from 'modules/actions/modal';
import { transition } from 'lib/styles/styles';
import palette from 'lib/styles/palette';
import InfoModal from 'containers/modal/Info';


const Btn = () => {
  const { dispatch: modalDispatch } = useContext(modalContext);

  const modalOn = () => {
    modalDispatch(
      pushModal('INFO', InfoModal, {
        title: "Simple"
      })
    );
  };

  return <StyledButton onClick={modalOn}>Simple</StyledButton>;
};

const StyledButton = styled.button`
  position: relative;
  width: 80px;
  font-size: 14px;
  line-height: 24px;
  background-color: transparent;
  border: 1.8px solid white;
  border-radius: 2rem;
  margin: 1rem 0.5rem 0.5rem 5vw;
  font-weight: 600;
  text-align: center;
  color: #fefefe;
  transition: 0.2s ${transition};
  
  &:hover {
    background-color: ${palette.blue4};
    border: 1.8px solid ${palette.blue4};
  }
`;

export default Btn;