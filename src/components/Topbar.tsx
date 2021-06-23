import styled from "@emotion/styled";
import { TicketOptionType } from '../interface/commonInterface';
import Select, { StylesConfig } from 'react-select'
import {ticketOptionsXBT, ticketOptionsETH} from '../constant/constant'

interface TopbarProps {
  options: boolean;
  value: TicketOptionType;
  onChange: (selected: any) => void
}

const TopBarWrapper = styled.div`
  height: 64px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 10px 1px;
  background-color: #111827;
  border-radius: 5px;
  position: relative;
`;

const Title = styled.p`
  color: white;
  font-weight: 500;
  margin-left: 20px;
  text-align: center;
  font-weight: bold;
`;

const SelectWrapper = styled.div`
  position: absolute;
  right: 80px;
  z-index: 100;
  font-weight: 500;
`;

const ticketSelectStyles: StylesConfig<TicketOptionType, false> = {
  control: (provided) => ({
    ...provided,
    width: 140,
    background: "#374151",
    borderRadius: 5,
    border: 0,
    boxShadow: 'none',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'white'
  }),
  indicatorSeparator: (provided) => ({ ...provided, display: "none" }),
};

const TopBar: React.FC<TopbarProps> = ({ options, value, onChange }) => {
  return (
    <TopBarWrapper>
      <Title>Order Book</Title>
      <SelectWrapper>
        <Select
          styles={ticketSelectStyles}
          options={options === true ? ticketOptionsXBT : ticketOptionsETH}
          isSearchable={false}
          value={value}
          onChange={onChange}
        />
      </SelectWrapper>
    </TopBarWrapper>
  );
}

export default TopBar;
