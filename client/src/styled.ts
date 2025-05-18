import styled from "styled-components";
import { Tooltip } from 'react-bootstrap';

export const AppContainer = styled.div`
    padding: 20px 80px;
`

export const NavContainer = styled.div`
    padding: 20px 0px;
`

export const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

export const UserImg = styled.img`
    width: 24px;
    height: 24px;
    border-radius: 30px;
    margin-right: 10px;
`

export const StyledTooltip = styled(Tooltip)`
  &.tooltip { 
    & > .tooltip-inner {
      background-color: #fff;
      color: black;
      border: 1px solid #aaa;
      max-width: unset !important;
    }
    opacity: 1 !important;
  }
`;