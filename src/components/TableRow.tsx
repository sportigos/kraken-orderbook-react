import styled from "@emotion/styled";

interface TableRowProps {
  tbltype?: string;
  header?: boolean;
  value?: {total: number | string, size: number | string, price: number | string, percent: number};
  celltype?: string;
}

interface VisualizeBarProps extends TableRowProps {
  percent?: number;
}

const TblRowWrapper = styled.div<TableRowProps>`
  font-weight: bold;
  line-height: 150%;
  position: relative;
  display: ${(p) => p.header === true && p.tbltype === "bid" ? "none" : "block"};
  @media (min-width: 1024px) {
    display: block;
  }
`;

const VisualizeBar = styled.div<VisualizeBarProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  :after {
    content: '';
    position: absolute;
    background: ${(p) => p.header === true ? "#00000000" : p.tbltype === "bid" ? "#3e212c" : "#103839"};
    top: 0;
    bottom: 0;
    right: 0;
    @media (min-width: 1024px) {
      right: ${(p) => p.tbltype === "bid" ? "0" : "auto"};
      left: ${(p) => p.tbltype === "bid" ? "auto" : "0"};
    }
    width: ${(p) => `${p.percent}%`};
  }
`;

const TblRow = styled.div<TableRowProps>`
  display: flex;
  flex-direction: row-reverse;
  @media (min-width: 1024px) {
    flex-direction: ${(p) => p.tbltype === "bid" ? "row" : "row-reverse"};
  }
  padding: ${(p) => p.header === true ? "12px 60px" : "8px 60px"}; 
`;

const TblCell = styled.div<TableRowProps>`
  color: ${(p) => p.header === true ? "#6d7482" : p.celltype !== "price" ? "white" : p.tbltype === "bid" ? "#d33e41" : "#0e9d71"};
  @media (min-width: 1024px) {
    color: ${(p) => p.header === true ? "#6d7482" : p.celltype === "price" ? "#0e9d71" : "white"};
  }
  flex: 1;
  z-index: 10;
  text-align: right;
  line-height: 150%;
  letter-spacing: 1px;
`;

const TableRow: React.FC<TableRowProps> = ({ tbltype, header, value }) => {

  function numberWithCommas(x?: number | string) {
    return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <TblRowWrapper tbltype={tbltype} header={header}>
      <VisualizeBar tbltype={tbltype} header={header} percent={value?.percent}></VisualizeBar>
      <TblRow tbltype={tbltype} header={header}>
        <TblCell
          tbltype={tbltype}
          header={header}
          celltype="total">
          {numberWithCommas(value?.total)}
        </TblCell>
        <TblCell
          tbltype={tbltype}
          header={header}
          celltype="size">
          {numberWithCommas(value?.size)}
        </TblCell>
        <TblCell
          tbltype={tbltype}
          header={header}
          celltype="price">
          {numberWithCommas(value?.price)}
        </TblCell>
      </TblRow>
    </TblRowWrapper>
  );
}

export default TableRow;
